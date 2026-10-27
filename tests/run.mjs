import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startCollecteur } from './collecteur.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const previewUrl = 'http://127.0.0.1:5180/';
const banned = [/formspree/i, /netlify/i, /forms\.zohopublic\.com/i, /hooks\.zapier/i, /getform\.io/i];

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} a échoué (${code})`));
    });
  });
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (/\.(html|js|css)$/.test(name)) acc.push(path);
  }
  return acc;
}

function assertBuild(contains = []) {
  const files = walk(join(root, 'dist'));
  const blob = files.map((path) => readFileSync(path, 'utf8')).join('\n');
  for (const pattern of banned) {
    if (pattern.test(blob)) throw new Error(`Destination interdite dans dist : ${pattern}`);
  }
  for (const needle of contains) {
    if (!blob.includes(needle)) throw new Error(`Build sans ${needle}`);
  }
  return blob;
}

async function waitFor(url, wantUp) {
  const deadline = Date.now() + 30_000;
  let last = '';
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (wantUp && res.ok) return;
      last = String(res.status);
      if (!wantUp) last = 'encore ouvert';
    } catch (err) {
      if (!wantUp) return;
      last = err.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${url} ${wantUp ? 'injoignable' : 'encore ouvert'} (${last})`);
}

function startPreview() {
  return spawn('npm', ['run', 'preview'], { cwd: root, stdio: 'inherit', detached: true });
}

async function stopPreview(child) {
  if (!child?.pid) return;
  try { process.kill(-child.pid, 'SIGTERM'); } catch { /* déjà arrêté */ }
  await Promise.race([once(child, 'exit'), new Promise((resolve) => setTimeout(resolve, 5000))]);
  try { process.kill(-child.pid, 'SIGKILL'); } catch { /* déjà arrêté */ }
  await waitFor(previewUrl, false);
}

let preview;
let collecteur;

try {
  mkdirSync('/opt/cursor/artifacts', { recursive: true });
  await run('npx', ['playwright', 'install', 'chromium']);

  await run('npm', ['run', 'build'], { VITE_RECRUTEMENT_FORM_URL: '' });
  assertBuild();
  preview = startPreview();
  await waitFor(previewUrl, true);
  await run('npx', ['playwright', 'test', '--grep-invert', '@envoi']);
  await stopPreview(preview);
  preview = null;

  collecteur = await startCollecteur(5199);
  const cible = `${collecteur.url}/candidature`;
  await run('npm', ['run', 'build'], { VITE_RECRUTEMENT_FORM_URL: cible });
  assertBuild([cible]);
  preview = startPreview();
  await waitFor(previewUrl, true);
  await run('npx', ['playwright', 'test', '--grep', '@envoi'], { COLLECT_URL: collecteur.url });
} finally {
  if (preview) await stopPreview(preview);
  if (collecteur) await collecteur.close();
}
