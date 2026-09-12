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
#
# These are the *durable* fragments only. The payload text, its obfuscation seed
# and its trailing marker (`A8-4068`, `A8-4266`, `A8-4286-1`, `A8-1144-3`, ...)
# are regenerated on every injection, so string matching alone always lags a
# rotation. The structural checks above and check-merge-integrity.sh carry the
# real weight; this list is a cheap extra net.
BAD_PATTERNS=(
  'X-Payload-B64'
  'eth_getTransactionCount'
  'blockscout'
  'stdio:"ignore"'
  "stdio: *'ignore'"
  'windowsHide'
  # Trailing marker the family stamps on every variant.
  "global\.i = 'A8-"
  # Launcher idiom from the backend font dropper.
  '_global\._t_u'
  'run_loader'
  # The payload hands require() to itself through a global.
  "global\['r'\] *= *require"
)

# Joined into one ERE so the scan spawns one grep per file rather than one per
# pattern. On Windows/Git-Bash each spawn costs ~60ms, and a per-pattern loop
# over this many files turned a few seconds into three minutes.
COMBINED_BAD_PATTERN=$(printf '%s\n' "${BAD_PATTERNS[@]}" | paste -sd'|' -)

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
    # These exist to assert the malware is ABSENT, so they name its markers on
    # purpose and must not be read as findings. Kept as an explicit list rather
    # than a "the line looks like a negation" heuristic -- a payload could hide
    # behind that, but it cannot add itself to this list without a reviewable
    # commit.
    scripts/scan-hidden-payloads.sh | scripts/verify-leftover-fixes.mjs) continue ;;
    # SVG is legitimately text, so it stays skipped for the line checks below.
    *.svg) continue ;;
    # Everything here is *claimed* to be binary. A file behind one of these
    # extensions that is really text is itself the finding -- the backend
    # dropper shipped a JavaScript payload named fa-solid-500.woff2, so this
    # skip list must not double as a hiding place.
    *.png | *.jpg | *.jpeg | *.webp | *.gif | *.ico \
    | *.woff | *.woff2 | *.ttf | *.otf | *.eot \
    | *.mp3 | *.mp4 | *.pdf)
      if LC_ALL=C grep -Iq . "$file" 2>/dev/null; then
        report "Asset $file is text, not binary
       Payloads have been smuggled behind font and image extensions before.
       Inspect this file."
      fi
      continue
      ;;
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

  if LC_ALL=C grep -nEq "$COMBINED_BAD_PATTERN" "$file" 2>/dev/null; then
    hit=$(LC_ALL=C grep -nEo "$COMBINED_BAD_PATTERN" "$file" 2>/dev/null | head -1)
    report "Known malware marker found in $file
       Matched: $hit"
  fi
done

# postcss config is ESM, so a payload needs createRequire to reach require().
# There is no legitimate reason for it in this repo's config.
if [ -f postcss.config.mjs ] && grep -q 'createRequire' postcss.config.mjs; then
  report "postcss.config.mjs uses createRequire
       The backdoor added this solely to hand require() to its payload."
fi

# An editor task pinned to folderOpen runs the moment anyone opens the repo, and
# allowAutomaticTasks suppresses the confirmation prompt. Neither has a
# legitimate use here -- the backend repo lost six rounds to exactly this.
if [ -d .vscode ]; then
  vscode_hits=$(LC_ALL=C grep -rInE 'folderOpen|allowAutomaticTasks|"runOn"' .vscode 2>/dev/null || true)
  if [ -n "$vscode_hits" ]; then
    report "Editor auto-run configuration found under .vscode:
$vscode_hits
       This executes on folder open, before any build or install."
  fi
fi

if [ "$failed" -ne 0 ]; then
  printf '\nHidden payload scan failed.\n' >&2
  exit 1
fi

echo "Hidden payload scan passed (${#files[@]} files)."
