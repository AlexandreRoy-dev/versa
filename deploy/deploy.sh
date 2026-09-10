#!/usr/bin/env bash
#
# Deploys the Versa Capital prototype to versa.codesurmesure.ca.
#
# The VPS already runs nginx and hosts other vhosts, so this script only ever
# touches its own vhost file, its own systemd unit, and /var/www/versa-capital.
#
# Usage:
#   VPS_SSH_USER=ubuntu ./deploy/deploy.sh
#
# Environment:
#   VPS_SSH_USER   login user on the VPS (required, needs sudo)
#   VPS_HOST       target host        (default 158.69.1.173)
#   VPS_SSH_KEY    path to a private key (optional; falls back to the agent)
#   SKIP_BUILD=1   reuse an existing .next build
#
set -euo pipefail

VPS_HOST="${VPS_HOST:-158.69.1.173}"
DOMAIN="versa.codesurmesure.ca"
REMOTE_DIR="/var/www/versa-capital"
APP_PORT=43127

if [[ -z "${VPS_SSH_USER:-}" ]]; then
  echo "error: set VPS_SSH_USER (the login user on ${VPS_HOST})" >&2
  exit 1
fi

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
if [[ -n "${VPS_SSH_KEY:-}" ]]; then
  SSH_OPTS+=(-i "${VPS_SSH_KEY}")
fi

TARGET="${VPS_SSH_USER}@${VPS_HOST}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

echo "==> Building"
if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  npm ci
  npm run build
fi

if [[ ! -d .next/standalone ]]; then
  echo "error: .next/standalone missing. Is output:'standalone' set in next.config.ts?" >&2
  exit 1
fi

echo "==> Assembling release"
STAGE="$(mktemp -d)"
trap 'rm -rf "${STAGE}"' EXIT

# The standalone output carries its own minimal node_modules; static assets and
# public files have to be layered in beside it.
cp -a .next/standalone/. "${STAGE}/"
mkdir -p "${STAGE}/.next"
cp -a .next/static "${STAGE}/.next/static"
cp -a public "${STAGE}/public"

echo "==> Uploading to ${TARGET}:${REMOTE_DIR}"
ssh "${SSH_OPTS[@]}" "${TARGET}" "sudo mkdir -p ${REMOTE_DIR} && sudo chown -R \$(id -un):\$(id -gn) ${REMOTE_DIR}"
rsync -az --delete \
  -e "ssh ${SSH_OPTS[*]}" \
  "${STAGE}/" "${TARGET}:${REMOTE_DIR}/"

echo "==> Installing service and vhost"
scp "${SSH_OPTS[@]}" \
  deploy/versa-capital.service deploy/nginx-versa.conf \
  "${TARGET}:/tmp/"

ssh "${SSH_OPTS[@]}" "${TARGET}" bash -s <<REMOTE
set -euo pipefail

sudo mv /tmp/versa-capital.service /etc/systemd/system/versa-capital.service

sudo systemctl daemon-reload
sudo systemctl enable --now versa-capital
sudo systemctl restart versa-capital

# certbot rewrites the vhost in place to add TLS, so once it has run, don't
# clobber its work on a redeploy.
if sudo grep -q "listen 443" /etc/nginx/sites-available/${DOMAIN} 2>/dev/null; then
  echo "vhost already has TLS, leaving it alone"
  sudo rm -f /tmp/nginx-versa.conf
else
  sudo mv /tmp/nginx-versa.conf /etc/nginx/sites-available/${DOMAIN}
  sudo ln -sfn /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}
fi

# This box already serves other sites. If our vhost does not parse, pull it
# back out and leave nginx running on the config it had.
if ! sudo nginx -t; then
  echo "nginx rejected the new vhost, rolling it back" >&2
  sudo rm -f /etc/nginx/sites-enabled/${DOMAIN}
  sudo nginx -t
  exit 1
fi
sudo systemctl reload nginx

echo "--- service status ---"
sudo systemctl is-active versa-capital
REMOTE

echo "==> Waiting for the app to answer"
healthy=0
for attempt in $(seq 1 10); do
  code="$(ssh "${SSH_OPTS[@]}" "${TARGET}" \
    "curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:${APP_PORT}/fr" || true)"
  if [[ "${code}" == "200" ]]; then
    echo "    app responding locally on ${APP_PORT}"
    healthy=1
    break
  fi
  echo "    attempt ${attempt}: got '${code:-no response}', retrying"
  sleep 3
done

if [[ "${healthy}" != "1" ]]; then
  echo "error: app never returned 200 on ${APP_PORT}. Recent logs:" >&2
  ssh "${SSH_OPTS[@]}" "${TARGET}" "sudo journalctl -u versa-capital -n 40 --no-pager" >&2 || true
  exit 1
fi

echo
echo "==> Deployed. Next step, once you are happy with HTTP:"
echo "    ssh ${TARGET} \"sudo certbot --nginx -d ${DOMAIN}\""
echo
echo "    http://${DOMAIN}/"
