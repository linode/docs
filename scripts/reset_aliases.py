#!/usr/bin/env python3
"""Reset the `aliases` frontmatter property to an empty list.

Walks every markdown file under the docs directory and, for any file whose
YAML frontmatter defines `aliases`, replaces the value with `[]`. Files
without an `aliases` property are left untouched.

Usage:
    python3 scripts/reset_aliases.py [--dry-run] [--path docs]
"""

import argparse
import os
import re
import sys

ALIASES_RE = re.compile(r"^aliases:.*$")
FENCE = "---"


def reset_file(path, dry_run):
    """Rewrite `path` with an emptied aliases list. Returns True if changed."""
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()

    # Frontmatter must be the first thing in the file.
    if not lines or lines[0].rstrip("\n") != FENCE:
        return False

    changed = False
    for i in range(1, len(lines)):
        stripped = lines[i].rstrip("\n")
        if stripped == FENCE:
            break
        if ALIASES_RE.match(stripped) and stripped != "aliases: []":
            lines[i] = "aliases: []\n"
            changed = True
    else:
        # No closing fence found: not valid frontmatter, leave the file alone.
        return False

    if changed and not dry_run:
        with open(path, "w", encoding="utf-8") as f:
            f.writelines(lines)

    return changed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--path", default="docs", help="directory to walk (default: docs)")
    parser.add_argument("--dry-run", action="store_true", help="report files without modifying them")
    args = parser.parse_args()

    if not os.path.isdir(args.path):
        sys.exit("No such directory: {}".format(args.path))

    count = 0
    for root, _, files in os.walk(args.path):
        for name in files:
            if not name.endswith(".md"):
                continue
            full = os.path.join(root, name)
            if reset_file(full, args.dry_run):
                count += 1
                print(full)

    print("\n{} file(s) {}.".format(count, "would be updated" if args.dry_run else "updated"))


if __name__ == "__main__":
    main()
