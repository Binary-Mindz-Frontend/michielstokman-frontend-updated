#!/usr/bin/env bash
#
# Detects code hidden in otherwise innocent-looking files.
#
# postcss.config.mjs was backdoored three times by appending a payload to the last
# line after a long run of tabs, so the file looked seven lines long in an editor and
# in most diffs. `next build` and `next dev` evaluate that file, which gave the
# attacker code execution on every developer machine and in CI.
#
# Run with no arguments to scan every tracked file, or pass specific paths.

set -uo pipefail

# Line length that no formatted source file in this repo comes close to.
# The known payload was a single 7613-character line; the longest legitimate line is
# a Tailwind class list around 840 characters.
MAX_LINE_LENGTH=1200

# Content, then a long whitespace run, then more content on the same line. This is the
# hiding trick itself; Prettier never produces it.
HIDDEN_TAIL_PATTERN='[^[:space:]][[:space:]]{30,}[^[:space:]]'

# Substrings from the payloads seen in this repo and the backend one.
BAD_PATTERNS=(
  'X-Payload-B64'
  'eth_getTransactionCount'
  'blockscout'
  'stdio:"ignore"'
  "stdio: *'ignore'"
  'windowsHide'
)

failed=0

report() {
  printf '\n%s\n' "$1" >&2
  failed=1
}

# Built without mapfile so the hook also runs on the bash 3.2 that ships with macOS.
files=()
if [ "$#" -gt 0 ]; then
  files=("$@")
else
  while IFS= read -r tracked; do
    files+=("$tracked")
  done < <(git ls-files)
fi

for file in "${files[@]}"; do
  [ -f "$file" ] || continue

  case "$file" in
    pnpm-lock.yaml | package-lock.json | *.min.js | *.min.css) continue ;;
    *.svg | *.png | *.jpg | *.jpeg | *.webp | *.gif | *.ico) continue ;;
    *.woff | *.woff2 | *.ttf | *.eot | *.mp3 | *.mp4 | *.pdf) continue ;;
    scripts/scan-hidden-payloads.sh) continue ;;
  esac

  # Skip anything that is not text.
  if ! LC_ALL=C grep -Iq . "$file" 2>/dev/null; then
    continue
  fi

  long_line=$(awk -v limit="$MAX_LINE_LENGTH" \
    'length($0) > limit { print NR": "length($0)" chars"; exit }' "$file")
  if [ -n "$long_line" ]; then
    report "Suspiciously long line in $file -> $long_line
       Formatted source never needs this. Check for an appended payload."
  fi

  # Markdown tables legitimately pad cells with long whitespace runs.
  case "$file" in
    *.md | *.mdx) ;;
    *)
      if LC_ALL=C grep -nEq "$HIDDEN_TAIL_PATTERN" "$file" 2>/dev/null; then
        line=$(LC_ALL=C grep -nE "$HIDDEN_TAIL_PATTERN" "$file" | head -1 | cut -d: -f1)
        report "Content hidden after a long whitespace run in $file (line $line)
       This is how the postcss backdoor stayed invisible in the editor."
      fi
      ;;
  esac

  for pattern in "${BAD_PATTERNS[@]}"; do
    if LC_ALL=C grep -nEq "$pattern" "$file" 2>/dev/null; then
      report "Known malware marker '$pattern' found in $file"
    fi
  done
done

# postcss config is ESM, so a payload needs createRequire to reach require().
# There is no legitimate reason for it in this repo's config.
if [ -f postcss.config.mjs ] && grep -q 'createRequire' postcss.config.mjs; then
  report "postcss.config.mjs uses createRequire
       The backdoor added this solely to hand require() to its payload."
fi

if [ "$failed" -ne 0 ]; then
  printf '\nHidden payload scan failed.\n' >&2
  exit 1
fi

echo "Hidden payload scan passed (${#files[@]} files)."
