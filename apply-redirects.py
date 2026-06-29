#!/usr/bin/env python3
"""Replace relative links in the markdown library with their techdocs.akamai.com
replacements, as defined in cloud-techdocs-redirects.csv.

The CSV has two columns: the relative link to find, and the replacement link.
Links in the markdown appear as Markdown inline link targets, i.e. wrapped in
parentheses: ``(link)``. Matching on ``(link)`` keeps replacements exact and
avoids prefix collisions (e.g. ``/foo/`` vs ``/foo/bar/``).

Usage:
    python3 apply-redirects.py [--dry-run]
"""

import argparse
import csv
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
CSV_PATH = REPO_ROOT / "cloud-techdocs-redirects.csv"
DOCS_DIR = REPO_ROOT / "docs"


def load_redirects(csv_path):
    """Return a list of (old, new) link pairs from the CSV."""
    pairs = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            if not row or not row[0].strip():
                continue
            if len(row) < 2:
                print(f"Skipping malformed row: {row!r}", file=sys.stderr)
                continue
            old, new = row[0].strip(), row[1].strip()
            pairs.append((old, new))
    return pairs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report what would change without writing files.",
    )
    args = parser.parse_args()

    redirects = load_redirects(CSV_PATH)
    # Map the parenthesized link-target forms.
    replacements = [(f"({old})", f"({new})", old) for old, new in redirects]

    total_replacements = 0
    changed_files = 0

    for md_file in sorted(DOCS_DIR.rglob("*.md")):
        text = md_file.read_text(encoding="utf-8")
        original = text
        file_count = 0

        for old_token, new_token, old_link in replacements:
            n = text.count(old_token)
            if n:
                text = text.replace(old_token, new_token)
                file_count += n
                rel = md_file.relative_to(REPO_ROOT)
                print(f"  {rel}: {n}x  {old_link}")

        if text != original:
            changed_files += 1
            total_replacements += file_count
            if not args.dry_run:
                md_file.write_text(text, encoding="utf-8")

    action = "Would replace" if args.dry_run else "Replaced"
    print(
        f"\n{action} {total_replacements} link(s) across {changed_files} file(s)."
    )


if __name__ == "__main__":
    main()
