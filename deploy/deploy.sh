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
sudo mv /tmp/nginx-versa.conf /etc/nginx/sites-available/${DOMAIN}
sudo ln -sfn /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}

sudo systemctl daemon-reload
sudo systemctl enable --now versa-capital
sudo systemctl restart versa-capital

# Only reload nginx if the whole config still parses, so a mistake here cannot
# take down the other sites already on this box.
sudo nginx -t
sudo systemctl reload nginx

echo "--- service status ---"
sudo systemctl is-active versa-capital
REMOTE

echo "==> Waiting for the app to answer"
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  code="\$(ssh "${SSH_OPTS[@]}" "${TARGET}" "curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:${APP_PORT}/fr" || true)"
  if [[ "\${code}" == "200" ]]; then
    echo "    app responding locally on ${APP_PORT}"
    break
  fi
  echo "    attempt \${attempt}: got '\${code}', retrying"
  sleep 3
done

echo
echo "==> Deployed. Next step, once you are happy with HTTP:"
echo "    ssh ${TARGET} \"sudo certbot --nginx -d ${DOMAIN}\""
echo
echo "    http://${DOMAIN}/"
