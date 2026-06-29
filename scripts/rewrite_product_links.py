#!/usr/bin/env python3
"""
Rewrite relative /docs/products/... links to their techdocs.akamai.com targets.

The products/ directory was removed from this repository. The product pages now
live on techdocs.akamai.com, reached via redirects configured outside of this
repo. Because this Hugo site is served from https://www.linode.com/docs, a
relative link like

    [Link title](/docs/products/section/page)

has the absolute URL https://www.linode.com/docs/products/section/page, which
301-redirects to the corresponding techdocs.akamai.com page. This script:

  1. Scans docs/**/*.md for relative markdown links to /docs/products/...
  2. Resolves each unique page path by following redirects from www.linode.com
     to its final techdocs.akamai.com URL (results are cached on disk).
  3. Re-appends the original #fragment (if any) to the resolved URL.
  4. Replaces the relative link with the resolved absolute URL, but only when
     the path successfully resolves to techdocs.akamai.com. Links that 404 or
     stay on linode.com are left untouched and listed in the report.

Usage:
    # Dry run (default): resolve + report, write nothing
    python3 scripts/rewrite_product_links.py

    # Apply the changes to disk
    python3 scripts/rewrite_product_links.py --apply

    # Limit to a subdirectory or refresh the resolution cache
    python3 scripts/rewrite_product_links.py --root docs/guides
    python3 scripts/rewrite_product_links.py --refresh-cache
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DOCS_ROOT = REPO_ROOT / "docs"
CACHE_FILE = Path(__file__).resolve().parent / ".product_link_cache.json"

SITE_ORIGIN = "https://www.linode.com"
EXPECTED_HOST = "techdocs.akamai.com"

# Matches the URL inside a relative markdown inline link: ](/docs/products/...)
# - Group 1 is the full link target (path + optional ?query + optional #fragment).
# - [^)\s] stops the match at the closing paren, whitespace (e.g. a link title),
#   so only the bare URL is captured.
# - Because we require the literal "](" immediately before "/docs/products", we
#   never match absolute links (](https://www.linode.com/docs/products/...)) or
#   external links (](https://aiven.io/docs/products/...)).
LINK_RE = re.compile(r"\]\((/docs/products/[^)\s]*)\)")

REQUEST_TIMEOUT = 30
MAX_WORKERS = 16
USER_AGENT = "linode-docs-product-link-rewriter/1.0"


# --------------------------------------------------------------------------- #
# Link resolution
# --------------------------------------------------------------------------- #

def split_target(target: str) -> tuple[str, str]:
    """Split a link target into (page_path, fragment).

    The fragment (everything from the first '#') is preserved verbatim so it can
    be re-appended to the resolved URL. A query string, if present, stays with
    the page_path so it is sent when resolving the redirect.
    """
    if "#" in target:
        path, fragment = target.split("#", 1)
        return path, "#" + fragment
    return target, ""


def resolve_path(session: requests.Session, page_path: str) -> tuple[str, str | None]:
    """Resolve a single /docs/products/... page path to its final URL.

    Returns (page_path, resolved_url) where resolved_url is None if the path did
    not redirect to techdocs.akamai.com (404, error, or stayed on linode.com).
    """
    url = SITE_ORIGIN + page_path
    try:
        resp = session.head(url, allow_redirects=True, timeout=REQUEST_TIMEOUT)
        # Some endpoints mishandle HEAD; retry with GET if it looks wrong.
        if resp.status_code >= 400 or EXPECTED_HOST not in resp.url:
            resp = session.get(url, allow_redirects=True, timeout=REQUEST_TIMEOUT)
    except requests.RequestException as exc:
        print(f"  ! request failed for {page_path}: {exc}", file=sys.stderr)
        return page_path, None

    final = resp.url
    if resp.status_code < 400 and EXPECTED_HOST in final:
        return page_path, final
    return page_path, None


def load_cache() -> dict[str, str | None]:
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text())
        except json.JSONDecodeError:
            return {}
    return {}


def save_cache(cache: dict[str, str | None]) -> None:
    CACHE_FILE.write_text(json.dumps(cache, indent=2, sort_keys=True))


def resolve_all(page_paths: set[str], refresh: bool) -> dict[str, str | None]:
    """Resolve all unique page paths, using the on-disk cache when possible."""
    cache = {} if refresh else load_cache()
    todo = sorted(p for p in page_paths if p not in cache)

    if todo:
        print(f"Resolving {len(todo)} unique page path(s) "
              f"({len(page_paths) - len(todo)} already cached)...")
        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT})
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
            futures = {pool.submit(resolve_path, session, p): p for p in todo}
            done = 0
            for fut in as_completed(futures):
                page_path, resolved = fut.result()
                cache[page_path] = resolved
                done += 1
                status = resolved if resolved else "UNRESOLVED"
                print(f"  [{done}/{len(todo)}] {page_path} -> {status}")
        save_cache(cache)
    else:
        print("All page paths already resolved from cache.")

    return cache


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--root", default=str(DEFAULT_DOCS_ROOT),
                        help="Directory to scan for markdown files (default: docs/).")
    parser.add_argument("--apply", action="store_true",
                        help="Write changes to disk. Without this flag, runs a dry run.")
    parser.add_argument("--refresh-cache", action="store_true",
                        help="Ignore the cached resolutions and re-fetch every path.")
    args = parser.parse_args()

    root = Path(args.root)
    md_files = sorted(root.rglob("*.md"))
    print(f"Scanning {len(md_files)} markdown file(s) under {root}...\n")

    # First pass: collect every occurrence and the set of unique page paths.
    # file_targets: path -> list of (full_target, page_path, fragment)
    file_targets: dict[Path, list[tuple[str, str, str]]] = {}
    unique_paths: set[str] = set()
    total_occurrences = 0

    for md in md_files:
        text = md.read_text(encoding="utf-8")
        matches = LINK_RE.findall(text)
        if not matches:
            continue
        entries = []
        for full_target in matches:
            page_path, fragment = split_target(full_target)
            entries.append((full_target, page_path, fragment))
            unique_paths.add(page_path)
            total_occurrences += 1
        file_targets[md] = entries

    print(f"Found {total_occurrences} relative product link occurrence(s) "
          f"across {len(file_targets)} file(s).")
    print(f"{len(unique_paths)} unique page path(s) to resolve.\n")

    # Resolve every unique page path.
    resolved = resolve_all(unique_paths, refresh=args.refresh_cache)

    # Second pass: rewrite files (or report).
    replaced_total = 0
    skipped_total = 0
    files_changed = 0
    unresolved_paths = sorted(p for p in unique_paths if not resolved.get(p))

    for md, entries in file_targets.items():
        text = md.read_text(encoding="utf-8")
        new_text = text
        file_replaced = 0

        for full_target, page_path, fragment in entries:
            target_url = resolved.get(page_path)
            if not target_url:
                skipped_total += 1
                continue
            new_link = target_url + fragment
            old = f"]({full_target})"
            new = f"]({new_link})"
            occurrences = new_text.count(old)
            if occurrences:
                new_text = new_text.replace(old, new)
                file_replaced += occurrences

        if file_replaced and new_text != text:
            replaced_total += file_replaced
            files_changed += 1
            if args.apply:
                md.write_text(new_text, encoding="utf-8")

    # ----------------------------------------------------------------------- #
    # Report
    # ----------------------------------------------------------------------- #
    mode = "APPLIED" if args.apply else "DRY RUN (no files written)"
    print("\n" + "=" * 70)
    print(f"Summary [{mode}]")
    print("=" * 70)
    print(f"  Files {'changed' if args.apply else 'that would change'}: {files_changed}")
    print(f"  Links {'rewritten' if args.apply else 'to rewrite'}:      {replaced_total}")
    print(f"  Occurrences skipped (unresolved):  {skipped_total}")
    if unresolved_paths:
        print(f"\n  {len(unresolved_paths)} unresolved page path(s) "
              f"(left untouched — check manually):")
        for p in unresolved_paths:
            print(f"    - {p}")
    if not args.apply:
        print("\nRe-run with --apply to write these changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
