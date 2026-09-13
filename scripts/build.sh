#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$ROOT/dist/output"
OUTPUT_RESOURCE="$ROOT/dist/output_resource"
OUTPUT_STATIC="$ROOT/dist/output_static"

export CLIENT_BASE_PATH="${MIAODA_APP_ID:+/app/$MIAODA_APP_ID}"
export ASSETS_CDN_PATH="${MIAODA_RESOURCE_CDN_PREFIX:-/}"
export STATIC_ASSETS_BASE_URL="${MIAODA_STATIC_CDN_PREFIX}"
export NODE_ENV="${NODE_ENV:-production}"

rm -rf "$ROOT/dist"

npx vite build --outDir "$ROOT/dist/client" --emptyOutDir

mkdir -p "$OUTPUT"
if [ -d "$ROOT/public" ]; then
  cp -R "$ROOT/public/." "$OUTPUT/"
fi
find "$ROOT/dist/client" -maxdepth 1 \( -name '*.html' -o -name 'routes.json' \) -exec cp {} "$OUTPUT/" \;

if [ -d "$ROOT/dist/client/assets" ]; then
  mkdir -p "$OUTPUT_RESOURCE"
  cp -r "$ROOT/dist/client/assets" "$OUTPUT_RESOURCE/"
fi

if [ -d "$ROOT/shared/static" ]; then
  mkdir -p "$OUTPUT_STATIC"
  rsync -a --exclude='*.ts' --exclude='*.tsx' --exclude='*.js' --exclude='*.jsx' "$ROOT/shared/static/" "$OUTPUT_STATIC/"
fi

if [ -d "$ROOT/shared/capabilities" ]; then
  mkdir -p "$ROOT/dist/output_capabilities"
  cp -r "$ROOT/shared/capabilities/." "$ROOT/dist/output_capabilities/"
fi

rm -rf "$ROOT/dist/client"

echo "Build complete"
echo "  HTML         → dist/output/"
[ -d "$OUTPUT_RESOURCE" ] && echo "  Resource     → dist/output_resource/" || true
[ -d "$OUTPUT_STATIC" ] && echo "  Static       → dist/output_static/" || true
[ -d "$ROOT/dist/output_capabilities" ] && echo "  Capabilities → dist/output_capabilities/" || true
