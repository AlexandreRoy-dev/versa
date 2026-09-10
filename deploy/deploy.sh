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
#   VPS_SSH_PASSWORD  password auth instead of a key (needs sshpass installed)
#   SKIP_BUILD=1   reuse an existing .next build
#
set -euo pipefail

VPS_HOST="${VPS_HOST:-158.69.1.173}"
DOMAIN="versa.codesurmesure.ca"
REMOTE_DIR="/var/www/versa-capital"
APP_PORT=43127
NODE_MAJOR=22

if [[ -z "${VPS_SSH_USER:-}" ]]; then
  echo "error: set VPS_SSH_USER (the login user on ${VPS_HOST})" >&2
  exit 1
fi

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
if [[ -n "${VPS_SSH_KEY:-}" ]]; then
  SSH_OPTS+=(-i "${VPS_SSH_KEY}" -o IdentitiesOnly=yes)
fi

# Password auth needs sshpass; keys are the better path but this keeps a
# password-only box usable.
SSH_WRAP=()
if [[ -n "${VPS_SSH_PASSWORD:-}" ]]; then
  if ! command -v sshpass >/dev/null; then
    echo "error: VPS_SSH_PASSWORD is set but sshpass is not installed" >&2
    echo "       install it (apt-get install sshpass) or use VPS_SSH_KEY instead" >&2
    exit 1
  fi
  SSH_WRAP=(sshpass -p "${VPS_SSH_PASSWORD}")
  SSH_OPTS+=(-o PubkeyAuthentication=no -o PreferredAuthentications=password)
fi

TARGET="${VPS_SSH_USER}@${VPS_HOST}"

ssh_run() { "${SSH_WRAP[@]}" ssh "${SSH_OPTS[@]}" "${TARGET}" "$@"; }
scp_up() { "${SSH_WRAP[@]}" scp "${SSH_OPTS[@]}" "$@"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

echo "==> Checking the VPS"
if ! ssh_run true 2>/dev/null; then
  echo "error: cannot log in to ${TARGET}." >&2
  echo "       Check VPS_SSH_USER, and supply VPS_SSH_KEY or VPS_SSH_PASSWORD." >&2
  exit 1
fi

if ! ssh_run "sudo -n true" 2>/dev/null; then
  echo "error: ${VPS_SSH_USER} cannot run sudo without a password prompt." >&2
  echo "       This script installs a systemd unit and an nginx vhost, so it" >&2
  echo "       needs passwordless sudo (or run it as a user that has it)." >&2
  exit 1
fi

# Next 16 needs Node 20.9+. The box may have no Node, or one too old, so make
# sure a suitable runtime exists before shipping a build that depends on it.
NODE_BIN="$(ssh_run "command -v node || command -v nodejs || true" | tr -d '\r')"
NODE_OK=0
if [[ -n "${NODE_BIN}" ]]; then
  NODE_MAJOR_REMOTE="$(ssh_run "${NODE_BIN} -p 'process.versions.node.split(\".\")[0]'" | tr -d '\r')"
  if [[ "${NODE_MAJOR_REMOTE}" =~ ^[0-9]+$ ]] && (( NODE_MAJOR_REMOTE >= 20 )); then
    echo "    node ${NODE_MAJOR_REMOTE}.x at ${NODE_BIN}"
    NODE_OK=1
  else
    echo "    node at ${NODE_BIN} is v${NODE_MAJOR_REMOTE:-unknown}, too old for Next 16"
  fi
else
  echo "    no node on the box"
fi

if [[ "${NODE_OK}" != "1" ]]; then
  echo "==> Installing Node ${NODE_MAJOR} via NodeSource"
  ssh_run "set -e
    curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | sudo -E bash -
    sudo apt-get install -y nodejs"
  NODE_BIN="$(ssh_run "command -v node" | tr -d '\r')"
  if [[ -z "${NODE_BIN}" ]]; then
    echo "error: Node install did not produce a node binary" >&2
    exit 1
  fi
  echo "    installed at ${NODE_BIN}"
fi

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

# The unit file ships with a placeholder so the real interpreter path found
# above gets baked in, rather than assuming /usr/bin/node exists.
sed "s|__NODE_BIN__|${NODE_BIN}|" deploy/versa-capital.service \
  > "${STAGE}.service"

echo "==> Uploading to ${TARGET}:${REMOTE_DIR}"
ssh_run "sudo mkdir -p ${REMOTE_DIR} && sudo chown -R \$(id -un):\$(id -gn) ${REMOTE_DIR}"

# Streaming a tarball avoids depending on rsync being present on the box and
# sidesteps quoting the ssh options into rsync -e.
tar -C "${STAGE}" -czf - . \
  | ssh_run "rm -rf ${REMOTE_DIR:?}/* && tar -C ${REMOTE_DIR} -xzf -"

# The unit runs as www-data, which needs to write .next/cache for next/image.
ssh_run "sudo mkdir -p ${REMOTE_DIR}/.next/cache \
  && sudo chown -R www-data:www-data ${REMOTE_DIR}"

echo "==> Installing service and vhost"
scp_up "${STAGE}.service" "${TARGET}:/tmp/versa-capital.service"
scp_up deploy/nginx-versa.conf "${TARGET}:/tmp/nginx-versa.conf"
rm -f "${STAGE}.service"

ssh_run bash -s <<REMOTE
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
  code="$(ssh_run "curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:${APP_PORT}/fr" || true)"
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
  ssh_run "sudo journalctl -u versa-capital -n 40 --no-pager" >&2 || true
  exit 1
fi

echo "==> Checking the public hostname"
public="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "http://${DOMAIN}/fr" || true)"
if [[ "${public}" == "200" ]]; then
  echo "    http://${DOMAIN}/fr is serving"
else
  echo "    warning: http://${DOMAIN}/fr returned '${public:-no response}'."
  echo "    The app is healthy on the box, so check DNS and that port 80 is open."
fi

echo
echo "==> Deployed: http://${DOMAIN}/"
echo
echo "    To add TLS:"
echo "      ssh ${VPS_SSH_USER}@${VPS_HOST} \"sudo certbot --nginx -d ${DOMAIN}\""
