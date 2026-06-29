#!/usr/bin/env bash
#
# move_assets_to_guides.sh
#
# Relocate every file under docs/assets/ into the guide folder(s) that link to
# it, and rewrite those links to point at the now-local file.
#
# For each asset (path relative to docs/assets/, including files in
# subdirectories such as scripts/ and roundcube/):
#
#   * Find every guide index.md that references it. A reference is any URL/path
#     token that ends in "assets/<relpath>" -- this catches every form seen in
#     the content, e.g.
#         /cloud/assets/543-init-deb.sh
#         http://www.linode.com/docs/assets/543-init-deb.sh
#         https://github.com/linode/docs/assets/scripts/website.py
#
#   * Exactly one referencing guide  -> git mv the asset into that guide folder.
#   * More than one referencing guide -> copy the asset into each guide folder
#                                         (git add each copy), then git rm the
#                                         original.
#   * Zero referencing guides         -> git mv the asset into
#                                         docs/assets/_unreferenced/ (structure
#                                         preserved) for later review.
#
#   * In each destination guide, every reference to the asset is rewritten to
#     the bare local filename (the basename), matching how guides already link
#     to their own bundled files (e.g. "[x](release-1.0.yaml)").
#
# The asset is placed in the guide folder under its basename. If a different
# file already occupies that name in the destination, the asset is skipped and
# reported (no overwrite).
#
# Usage:
#   scripts/move_assets_to_guides.sh [--dry-run]
#
# Run from anywhere; paths are resolved relative to the repo root. All git
# changes are staged but NOT committed -- review with `git status` / `git diff`
# before committing.

set -euo pipefail

# --- locate repo root --------------------------------------------------------
REPO_ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

ASSETS_DIR="docs/assets"
GUIDES_DIR="docs/guides"
UNREF_DIR="$ASSETS_DIR/_unreferenced"

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
  echo "*** DRY RUN -- no files will be changed ***"
fi

run() {
  # Echo and (unless dry-run) execute a command.
  echo "  + $*"
  if [[ "$DRY_RUN" -eq 0 ]]; then
    "$@"
  fi
}

# Rewrite, in $1 (an index.md), every URL token ending in "assets/<relpath>"
# so that it becomes just "<basename>". Uses Perl so filenames with regex
# metacharacters (dots, etc.) are handled literally, and a trailing boundary
# guard prevents matching a longer filename with the same prefix.
rewrite_links() {
  local file="$1" relpath="$2" basename="$3"
  echo "  ~ rewrite links in $file"
  if [[ "$DRY_RUN" -eq 0 ]]; then
    perl -0777 -pi -e '
      BEGIN { $rp = shift @ARGV; $bn = shift @ARGV; }
      s{ [^\s()\[\]"'"'"'<>`,]* assets/\Q$rp\E (?![A-Za-z0-9._/-]) }{$bn}gx;
    ' "$relpath" "$basename" "$file"
  fi
}

# --- collect asset list ------------------------------------------------------
mapfile -t ASSETS < <(cd "$ASSETS_DIR" && find . -type f \
  -not -path './_unreferenced/*' | sed 's|^\./||' | sort)

moved=0 copied=0 orphaned=0 skipped=0

for relpath in "${ASSETS[@]}"; do
  basename="$(basename "$relpath")"
  src="$ASSETS_DIR/$relpath"

  # Build a PCRE-escaped form of the relpath for the grep search.
  qrel="$(printf '%s' "$relpath" | perl -ne 'print quotemeta')"

  # Find referencing guides: token ending in assets/<relpath>, guarded so a
  # longer filename with the same prefix does not match.
  mapfile -t guides < <(grep -rlP --include=index.md \
    "assets/${qrel}(?![A-Za-z0-9._/-])" "$GUIDES_DIR" 2>/dev/null | sort)

  count=${#guides[@]}

  if [[ "$count" -eq 0 ]]; then
    # Orphan: move into the holding directory, preserving structure.
    dest="$UNREF_DIR/$relpath"
    echo "ORPHAN  $relpath -> $dest"
    run mkdir -p "$(dirname "$dest")"
    run git mv "$src" "$dest"
    orphaned=$((orphaned + 1))
    continue
  fi

  if [[ "$count" -eq 1 ]]; then
    guide_dir="$(dirname "${guides[0]}")"
    dest="$guide_dir/$basename"
    echo "MOVE    $relpath -> $dest"
    if [[ -e "$dest" ]]; then
      echo "  ! SKIP: destination already exists"
      skipped=$((skipped + 1))
      continue
    fi
    run git mv "$src" "$dest"
    rewrite_links "${guides[0]}" "$relpath" "$basename"
    moved=$((moved + 1))
    continue
  fi

  # count > 1: copy into each guide folder, then remove the original.
  echo "COPY    $relpath -> $count guides"
  any_skip=0
  for guide in "${guides[@]}"; do
    guide_dir="$(dirname "$guide")"
    dest="$guide_dir/$basename"
    echo "        -> $dest"
    if [[ -e "$dest" ]]; then
      echo "  ! SKIP copy: destination already exists"
      any_skip=1
      continue
    fi
    run cp "$src" "$dest"
    run git add "$dest"
    rewrite_links "$guide" "$relpath" "$basename"
  done
  if [[ "$any_skip" -eq 0 ]]; then
    run git rm -f "$src"
    copied=$((copied + 1))
  else
    echo "  ! keeping original $src because at least one copy was skipped"
    skipped=$((skipped + 1))
  fi
done

echo
echo "==================== summary ===================="
echo "moved (single guide) : $moved"
echo "copied (multi guide) : $copied"
echo "orphaned (no guide)  : $orphaned  -> $UNREF_DIR/"
echo "skipped (collision)  : $skipped"
echo "================================================="
[[ "$DRY_RUN" -eq 1 ]] && echo "(dry run -- nothing changed)"
echo "Review staged changes with: git status  /  git diff --staged"
