#!/usr/bin/env bash
#
# Deploys the Versa Capital prototype to versa.codesurmesure.ca.
#
# The VPS already runs nginx and hosts other vhosts, so this only ever touches
# its own vhost file, its own systemd unit, and /var/www/versa-capital.
#
# All privileged work happens in deploy/remote-install.sh, which is elevated
# exactly once. That way a login whose sudo needs a password still works.
#
# Usage:
#   VPS_SSH_USER=ubuntu ./deploy/deploy.sh
#   VPS_SSH_USER=ubuntu VPS_SSH_KEY=~/.ssh/id_ed25519 ./deploy/deploy.sh
#   VPS_SSH_USER=ubuntu VPS_SUDO_PASSWORD='...' ./deploy/deploy.sh
#
# Environment:
#   VPS_SSH_USER       login user on the VPS (required)
#   VPS_HOST           target host (default 158.69.1.173)
#   VPS_SSH_KEY        private key to authenticate with
#   VPS_SSH_PASSWORD   password auth instead of a key (needs sshpass locally)
#   VPS_SUDO_PASSWORD  password for remote sudo (defaults to VPS_SSH_PASSWORD)
#   SKIP_BUILD=1       reuse the existing .next build
#   DEBUG=1            trace every command
#
set -euo pipefail
[[ "${DEBUG:-0}" == "1" ]] && set -x

VPS_HOST="${VPS_HOST:-158.69.1.173}"
DOMAIN="versa.codesurmesure.ca"

if [[ -z "${VPS_SSH_USER:-}" ]]; then
  cat >&2 <<'USAGE'
error: VPS_SSH_USER is not set.

  VPS_SSH_USER=<user> ./deploy/deploy.sh

Add VPS_SSH_KEY=<path> if that user needs a specific key, and
VPS_SUDO_PASSWORD=<password> if its sudo asks for one.
USAGE
  exit 1
fi

TARGET="${VPS_SSH_USER}@${VPS_HOST}"
SUDO_PASSWORD="${VPS_SUDO_PASSWORD:-${VPS_SSH_PASSWORD:-}}"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
[[ -n "${VPS_SSH_KEY:-}" ]] && SSH_OPTS+=(-i "${VPS_SSH_KEY}" -o IdentitiesOnly=yes)

SSH_WRAP=()
if [[ -n "${VPS_SSH_PASSWORD:-}" ]]; then
  if ! command -v sshpass >/dev/null; then
    cat >&2 <<'MSG'
error: VPS_SSH_PASSWORD is set but sshpass is not installed.
       macOS:  brew install hudochenkov/sshpass/sshpass
       Debian: sudo apt-get install sshpass
       Or use VPS_SSH_KEY instead.
MSG
    exit 1
  fi
  SSH_WRAP=(sshpass -p "${VPS_SSH_PASSWORD}")
  SSH_OPTS+=(-o PubkeyAuthentication=no -o PreferredAuthentications=password)
fi

ssh_run() { "${SSH_WRAP[@]}" ssh "${SSH_OPTS[@]}" "${TARGET}" "$@"; }
scp_up() { "${SSH_WRAP[@]}" scp "${SSH_OPTS[@]}" "$@" "${TARGET}:/tmp/"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

# --- preflight --------------------------------------------------------------
echo "==> Connecting to ${TARGET}"
if ! ssh_run true; then
  cat >&2 <<MSG

error: cannot log in to ${TARGET}.
       Check VPS_SSH_USER, and supply VPS_SSH_KEY or VPS_SSH_PASSWORD.
       To see what the server offers:
         ssh -v ${TARGET}
MSG
  exit 1
fi
echo "    login ok"

# Work out how to elevate: passwordless sudo, sudo with a password, or root.
if [[ "$(ssh_run 'id -u' | tr -d '\r')" == "0" ]]; then
  ELEVATE="direct root"
elif ssh_run "sudo -n true" 2>/dev/null; then
  ELEVATE="passwordless sudo"
elif [[ -n "${SUDO_PASSWORD}" ]]; then
  if printf '%s\n' "${SUDO_PASSWORD}" | ssh_run "sudo -S -p '' true" 2>/dev/null; then
    ELEVATE="sudo with password"
  else
    echo "error: VPS_SUDO_PASSWORD was rejected by sudo on ${VPS_HOST}." >&2
    exit 1
  fi
else
  cat >&2 <<MSG

error: ${VPS_SSH_USER} cannot sudo without a password, and none was given.
       Installing a systemd unit and an nginx vhost needs root.
       Either:
         VPS_SUDO_PASSWORD='<password>' VPS_SSH_USER=${VPS_SSH_USER} ./deploy/deploy.sh
       or run as a user with passwordless sudo.
MSG
  exit 1
fi
echo "    elevation: ${ELEVATE}"

# --- build ------------------------------------------------------------------
if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "==> Building"
  npm ci
  npm run build
else
  echo "==> Skipping build (SKIP_BUILD=1)"
fi

if [[ ! -d .next/standalone ]]; then
  echo "error: .next/standalone missing. Is output:'standalone' set in next.config.ts?" >&2
  exit 1
fi

# --- package ----------------------------------------------------------------
echo "==> Packaging release"
STAGE="$(mktemp -d)"
TARBALL="$(mktemp -t versa-release.XXXXXX)"
trap 'rm -rf "${STAGE}" "${TARBALL}"' EXIT

# The standalone output ships its own minimal node_modules; static assets and
# public files have to be layered in beside it.
cp -a .next/standalone/. "${STAGE}/"
mkdir -p "${STAGE}/.next"
cp -a .next/static "${STAGE}/.next/static"
cp -a public "${STAGE}/public"
tar -C "${STAGE}" -czf "${TARBALL}" .
echo "    $(du -h "${TARBALL}" | cut -f1) release"

# --- upload -----------------------------------------------------------------
echo "==> Uploading"
scp_up "${TARBALL}" >/dev/null
ssh_run "mv /tmp/$(basename "${TARBALL}") /tmp/versa-release.tar.gz"
scp_up deploy/remote-install.sh deploy/versa-capital.service deploy/nginx-versa.conf >/dev/null
echo "    sent release and install script"

# --- install ----------------------------------------------------------------
echo "==> Installing on ${VPS_HOST}"
case "${ELEVATE}" in
  "direct root")
    ssh_run "bash /tmp/remote-install.sh"
    ;;
  "passwordless sudo")
    ssh_run "sudo -n bash /tmp/remote-install.sh"
    ;;
  "sudo with password")
    # Password goes over ssh stdin, so it never appears in the remote argv.
    printf '%s\n' "${SUDO_PASSWORD}" | ssh_run "sudo -S -p '' bash /tmp/remote-install.sh"
    ;;
esac

# --- verify from outside ----------------------------------------------------
echo "==> Checking the public hostname"
public="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://${DOMAIN}/fr" || true)"
if [[ "${public}" == "200" ]]; then
  echo "    http://${DOMAIN}/fr is live"
else
  echo "    warning: http://${DOMAIN}/fr returned '${public:-no response}'"
  echo "    The app is healthy on the box, so check DNS and that port 80 is open."
fi

cat <<MSG

==> Deployed: http://${DOMAIN}/

    Add TLS with:
      ssh ${TARGET} "sudo certbot --nginx -d ${DOMAIN}"
MSG
