#!/bin/bash
# Build kalkal.alfredworkflow from source files
# Run from project root: bash alfred/build.sh

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$DIR")"
OUT="$ROOT/kalkal.alfredworkflow"

echo "Building kalkal Alfred Workflow…"

# Generate cal-engine.js (CJS module from hijri.js IIFE)
sed 's/^const Cal =/module.exports =/' "$ROOT/js/hijri.js" > "$DIR/cal-engine.js"

# Copy icon (use favicon if available, otherwise create placeholder)
if [ -f "$ROOT/favicon.svg" ]; then
  cp "$ROOT/favicon.svg" "$DIR/icon.png" 2>/dev/null || true
fi

# Package as .alfredworkflow (zip)
cd "$DIR"
rm -f "$OUT"
zip -j "$OUT" info.plist cal.js cal-engine.js icon.png 2>/dev/null || \
zip -j "$OUT" info.plist cal.js cal-engine.js

echo "Built: $OUT"
echo "Double-click to install in Alfred."
