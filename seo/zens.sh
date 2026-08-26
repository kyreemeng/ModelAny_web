#!/usr/bin/env bash
# Load project .env + certifi CA, then run zens-ink.
# Usage: ./seo/zens.sh keyword_research "compare AI models"
#        ./seo/zens.sh kd "chatgpt vs gemini"
#        ./seo/zens.sh keyword_volume "compare AI models" --country us --lang en-US
#        ./seo/zens.sh setup_gsc
#        ./seo/zens.sh search_performance

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Fix macOS Python SSL for Google Suggest / HTTPS APIs
export SSL_CERT_FILE="${SSL_CERT_FILE:-$(python3 -c 'import certifi; print(certifi.where())')}"

if [[ ! -f "$ROOT/.env" ]]; then
  echo "No .env found. Creating from .env.example …" >&2
  cp "$ROOT/.env.example" "$ROOT/.env"
  echo "Edit $ROOT/.env and paste your keys, then re-run." >&2
  exit 1
fi

# Export KEY=value lines (skip comments / blanks)
set -a
# shellcheck disable=SC1091
source <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$ROOT/.env" | sed 's/\r$//')
set +a

if ! command -v zens-ink >/dev/null 2>&1; then
  echo "zens-ink not found. Install: pip install zens-ink" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  exec zens-ink --help
fi

# Non-interactive GSC finish: ./seo/zens.sh setup_gsc 'http://localhost:8484/?code=...'
if [[ "${1:-}" == "setup_gsc" && -n "${2:-}" ]]; then
  printf '%s\n' "$2" | exec zens-ink setup_gsc
fi

exec zens-ink "$@"
