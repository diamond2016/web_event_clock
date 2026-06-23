#!/usr/bin/env bash
set -euo pipefail

GEN="../node_modules/.bin/openapi-generator-cli"

OPENAPI_FILE="./v1/openapi.yaml"
CONFIG_FILE="./config-frontend.json"
OUTPUT_DIR="../src/api/client"
GENERATOR="typescript-axios"

echo "→ Pulizia directory di output"
rm -rf "${OUTPUT_DIR:?}"/* || true

echo "→ Generazione client TypeScript Axios"
$GEN generate \
  -i "${OPENAPI_FILE}" \
  -g "${GENERATOR}" \
  -o "${OUTPUT_DIR}" \
  -c "${CONFIG_FILE}"

echo "→ Generazione completata in ${OUTPUT_DIR}"


