#!/usr/bin/env bash
#
# Server side of the deploy. Runs as root on the VPS, so it never calls sudo
# itself; deploy.sh is responsible for elevating it exactly once.
#
# It can also be run by hand if the wrapper script is inconvenient:
#
#   scp deploy/remote-install.sh deploy/versa-capital.service \
#       deploy/nginx-versa.conf versa-release.tar.gz user@host:/tmp/
#   ssh user@host "sudo bash /tmp/remote-install.sh"
#
# Expects in /tmp: versa-release.tar.gz, versa-capital.service, nginx-versa.conf
#
set -euo pipefail

DOMAIN="${DOMAIN:-versa.codesurmesure.ca}"
APP_DIR="${APP_DIR:-/var/www/versa-capital}"
APP_PORT="${APP_PORT:-43127}"
NODE_MAJOR="${NODE_MAJOR:-22}"
SERVICE="versa-capital"

RELEASE=/tmp/versa-release.tar.gz
UNIT_SRC=/tmp/versa-capital.service
VHOST_SRC=/tmp/nginx-versa.conf

say() { echo "  [remote] $*"; }

if [[ $EUID -ne 0 ]]; then
  echo "error: remote-install.sh must run as root (use sudo)" >&2
  exit 1
fi

for f in "${RELEASE}" "${UNIT_SRC}" "${VHOST_SRC}"; do
  [[ -f "${f}" ]] || { echo "error: missing ${f}" >&2; exit 1; }
done

# --- Node runtime -----------------------------------------------------------
# Next 16 needs Node 20.9+. The box may have none, or one too old.
NODE_BIN="$(command -v node || command -v nodejs || true)"
node_major() { "$1" -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }

if [[ -z "${NODE_BIN}" ]] || (( $(node_major "${NODE_BIN}") < 20 )); then
  say "installing Node ${NODE_MAJOR} (found: ${NODE_BIN:-none})"
  export DEBIAN_FRONTEND=noninteractive
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
  NODE_BIN="$(command -v node)"
fi
say "using node $("${NODE_BIN}" --version) at ${NODE_BIN}"

# --- application files ------------------------------------------------------
say "unpacking release into ${APP_DIR}"
mkdir -p "${APP_DIR}"
find "${APP_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar -C "${APP_DIR}" -xzf "${RELEASE}"

# The service runs as www-data, and next/image caches optimised images under
# .next/cache, so that tree has to be writable by it.
mkdir -p "${APP_DIR}/.next/cache"
chown -R www-data:www-data "${APP_DIR}"

# --- systemd unit -----------------------------------------------------------
say "installing ${SERVICE}.service"
sed "s|__NODE_BIN__|${NODE_BIN}|" "${UNIT_SRC}" > "/etc/systemd/system/${SERVICE}.service"
systemctl daemon-reload
systemctl enable "${SERVICE}" >/dev/null 2>&1 || true
systemctl restart "${SERVICE}"

# --- nginx vhost ------------------------------------------------------------
AVAILABLE="/etc/nginx/sites-available/${DOMAIN}"
ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

if grep -q "listen 443" "${AVAILABLE}" 2>/dev/null; then
  say "vhost already carries TLS, leaving it as certbot wrote it"
else
  say "installing nginx vhost for ${DOMAIN}"
  HAD_VHOST=0
  [[ -e "${ENABLED}" ]] && HAD_VHOST=1
  cp "${VHOST_SRC}" "${AVAILABLE}"
  ln -sfn "${AVAILABLE}" "${ENABLED}"

  # This box serves other sites. If our vhost does not parse, take it back out
  # and leave nginx on the config it already had.
  if ! nginx -t 2>&1 | sed 's/^/    /'; then
    echo "error: nginx rejected the vhost, rolling back" >&2
    if [[ "${HAD_VHOST}" == "0" ]]; then rm -f "${ENABLED}"; fi
    nginx -t
    exit 1
  fi
fi

# Re-test before reloading. In the TLS branch above nothing was validated, and
# a pre-existing broken vhost would otherwise abort with no explanation.
if ! nginx -t 2>&1 | sed 's/^/    /'; then
  echo "error: nginx config does not parse, so it was not reloaded." >&2
  echo "       The app itself is updated and running on ${APP_PORT}." >&2
  echo "       Fix the config above, then: sudo nginx -t && sudo systemctl reload nginx" >&2
  exit 1
fi
systemctl reload nginx
say "nginx reloaded"

# --- health check -----------------------------------------------------------
# Match on the build id, not just a 200. If our unit failed to start while a
# stale process still holds the port, a plain status check would report success
# and quietly keep serving the old code.
BUILD_ID="$(cat "${APP_DIR}/.next/BUILD_ID" 2>/dev/null || true)"
say "waiting for build ${BUILD_ID:-unknown} on 127.0.0.1:${APP_PORT}"

healthy=0
code=""
for _ in $(seq 1 15); do
  body="$(curl -sS "http://127.0.0.1:${APP_PORT}/fr" 2>/dev/null || true)"
  code="$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:${APP_PORT}/fr" 2>/dev/null || true)"
  if [[ "${code}" == "200" ]]; then
    if [[ -z "${BUILD_ID}" ]] || [[ "${body}" == *"${BUILD_ID}"* ]]; then
      healthy=1
      break
    fi
    say "port ${APP_PORT} answers 200 but not from this build, waiting"
  fi
  sleep 2
done

if [[ "${healthy}" != "1" ]]; then
  if [[ "${code}" == "200" ]]; then
    echo "error: something on port ${APP_PORT} is answering, but it is not the" >&2
    echo "       build just deployed (${BUILD_ID}). A stale process is probably" >&2
    echo "       holding the port, so ${SERVICE} could not bind." >&2
  else
    echo "error: ${SERVICE} never answered 200 on ${APP_PORT}" >&2
  fi
  echo "--- systemctl status ---" >&2
  systemctl status "${SERVICE}" --no-pager -l >&2 || true
  echo "--- journal ---" >&2
  journalctl -u "${SERVICE}" -n 60 --no-pager >&2 || true
  echo "--- port holders ---" >&2
  (ss -lptn "sport = :${APP_PORT}" || true) >&2
  exit 1
fi

say "app healthy"

# Prove it also answers through nginx on the real hostname.
via_nginx="$(curl -sS -o /dev/null -w '%{http_code}' -H "Host: ${DOMAIN}" \
  "http://127.0.0.1/fr" || true)"
say "through nginx on ${DOMAIN}: ${via_nginx}"

rm -f "${RELEASE}" "${UNIT_SRC}" "${VHOST_SRC}"
say "done"
