import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const FERME = 'Le dépôt de candidatures sera ouvert sous peu.';
const MERCI = 'Merci. Nous avons bien reçu votre envoi.';
const COLLECT = process.env.COLLECT_URL || 'http://127.0.0.1:5199';
const MAX = 5 * 1024 * 1024;

const pdf = {
  name: 'cv-marie.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n% candidature\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n'),
};

async function openRecrutement(page) {
  await page.goto('/recrutement/');
  await page.waitForFunction(() => window.__ready === true && document.querySelector('[data-recrutement]')?.dataset.script === 'pret');
  await page.locator('[data-recrutement]').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForFunction(() => document.querySelector('[data-recrutement]').classList.contains('is-in'));
}

async function fillBase(page, { email = 'marie.tremblay@example.com', phone = '(514) 555-0134', poste = '', message = '' } = {}) {
  await page.locator('input[name="Prenom"]').fill('Marie');
  await page.locator('input[name="Nom"]').fill('Tremblay');
  await page.locator('input[name="Courriel"]').fill(email);
  if (phone) await page.locator('input[name="Telephone"]').fill(phone);
  if (poste) await page.locator('input[name="PosteVise"]').fill(poste);
  if (message) await page.locator('textarea[name="Message"]').fill(message);
}

async function submit(page) {
  await page.getByRole('button', { name: 'Envoyer ma candidature' }).click();
}

function trackPosts(page) {
  const posts = [];
  page.on('request', (req) => {
    if (req.method() === 'POST') posts.push(req.url());
  });
  return posts;
}

test('le menu mène à Recrutement', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__ready === true);
  const nav = page.getByRole('navigation', { name: 'Navigation principale' });
  await expect(nav.getByRole('link', { name: 'Recrutement' })).toHaveAttribute('href', '/recrutement/');
  await expect(page.locator('footer').getByRole('link', { name: 'Recrutement' })).toHaveAttribute('href', '/recrutement/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await nav.getByRole('link', { name: 'Recrutement' }).click();
  await expect(page).toHaveURL(/\/recrutement\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Recrutement' })).toBeVisible();
  const fit = await page.evaluate(() => {
    const hdr = document.querySelector('.hdr').getBoundingClientRect();
    const copy = document.querySelector('.hero__copy').getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      title: copy.top >= hdr.bottom - 2,
    };
  });
  expect(fit.overflow).toBe(true);
  expect(fit.title).toBe(true);
});

test('le pied de page des autres pages mène à Recrutement', async ({ page }) => {
  await page.goto('/financement-equipements/');
  await page.locator('footer').getByRole('link', { name: 'Recrutement' }).click();
  await expect(page).toHaveURL(/\/recrutement\/?$/);
});

test('capture de la page', async ({ page }, testInfo) => {
  await openRecrutement(page);
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(240, window.innerHeight * 0.8);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await wait(40);
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  mkdirSync('/opt/cursor/artifacts', { recursive: true });
  const file = testInfo.project.name === 'telephone' ? 'recrutement-telephone.png' : 'recrutement-ordi.png';
  await page.screenshot({ path: `/opt/cursor/artifacts/${file}`, fullPage: true });
});

test('la page propose une candidature spontanée, sans liste de postes', async ({ page }) => {
  await openRecrutement(page);
  await expect(page.locator('select')).toHaveCount(0);
  const poste = page.locator('input[name="PosteVise"]');
  await expect(poste).toHaveAttribute('type', 'text');
  await expect(poste).toHaveValue('');
  await expect(page.locator('#consentement')).not.toBeChecked();
  await expect(page.locator('.consent__text a')).toHaveAttribute('href', 'https://versacapital.ca/politique-de-confidentialite/');
  await expect(page.locator('[data-recrutement]')).toHaveAttribute('data-endpoint', 'ferme');
});

test('les champs requis sont signalés', async ({ page }) => {
  await openRecrutement(page);
  await submit(page);
  await expect(page.locator('[data-error="prenom"]')).toHaveText('Entrez votre prénom.');
  await expect(page.locator('[data-error="nom"]')).toHaveText('Entrez votre nom.');
  await expect(page.locator('[data-error="courriel"]')).toHaveText('Entrez votre courriel.');
  await expect(page.locator('[data-error="cv"]')).toHaveText('Joignez votre CV.');
  await expect(page.locator('[data-error="consentement"]')).toHaveText('Cochez la case pour consentir à la collecte de vos renseignements.');
  await expect(page.locator('[data-error="telephone"]')).toBeHidden();
  await expect(page.locator('[data-status]')).toBeHidden();
});

test('un courriel invalide et un téléphone hors format sont refusés', async ({ page }) => {
  await openRecrutement(page);
  await fillBase(page, { email: 'pas-un-courriel', phone: '12345' });
  await page.locator('input[name="CV"]').setInputFiles(pdf);
  await page.locator('#consentement').check();
  await submit(page);
  await expect(page.locator('[data-error="courriel"]')).toHaveText('Entrez un courriel valide.');
  await expect(page.locator('[data-error="telephone"]')).toHaveText('Entrez un numéro de téléphone nord-américain, par exemple 514 555-0134.');
  await expect(page.locator('[data-status]')).toBeHidden();
});

test('un mauvais type de fichier est refusé', async ({ page }) => {
  await openRecrutement(page);
  await fillBase(page);
  await page.locator('input[name="CV"]').setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('ceci nest pas un cv'),
  });
  await page.locator('#consentement').check();
  await submit(page);
  await expect(page.locator('[data-error="cv"]')).toHaveText('Le CV doit être un fichier PDF, DOC ou DOCX.');
  await expect(page.locator('[data-status]')).toBeHidden();
});

test('un fichier de plus de 5 Mo est refusé', async ({ page }) => {
  await openRecrutement(page);
  await fillBase(page);
  await page.locator('input[name="CV"]').setInputFiles({
    name: 'cv.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.alloc(MAX + 1, 0x25),
  });
  await page.locator('#consentement').check();
  await submit(page);
  await expect(page.locator('[data-error="cv"]')).toHaveText('Le CV doit faire 5 Mo ou moins.');
});

test('le consentement est obligatoire', async ({ page }) => {
  await openRecrutement(page);
  const posts = trackPosts(page);
  await fillBase(page);
  await page.locator('input[name="CV"]').setInputFiles(pdf);
  await expect(page.locator('#consentement')).not.toBeChecked();
  await submit(page);
  await expect(page.locator('[data-error="consentement"]')).toBeVisible();
  await expect(page.locator('[data-status]')).toBeHidden();
  await page.waitForTimeout(300);
  expect(posts).toEqual([]);
  await expect(page).toHaveURL(/\/recrutement\/?$/);
});

test('sans URL Zoho, le message neutre s’affiche et rien n’est envoyé', async ({ page }) => {
  await openRecrutement(page);
  const posts = trackPosts(page);
  await fillBase(page, { phone: '' });
  await page.locator('input[name="CV"]').setInputFiles(pdf);
  await page.locator('#consentement').check();
  await submit(page);
  await expect(page.locator('[data-status]')).toHaveText(FERME);
  await expect(page.locator('[data-error="telephone"]')).toBeHidden();
  await expect(page.locator('[data-error="cv"]')).toBeHidden();
  await page.waitForTimeout(300);
  expect(posts).toEqual([]);
  await expect(page).toHaveURL(/\/recrutement\/?$/);
});

test('un CV doc ou docx de taille valide passe la validation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'ordi', 'un seul viewport suffit pour les deux extensions');
  await openRecrutement(page);
  const files = [
    {
      name: 'cv.doc',
      mimeType: 'application/msword',
      buffer: Buffer.from('document'),
    },
    {
      name: 'cv.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: Buffer.from('PK\u0003\u0004'),
    },
  ];
  for (const file of files) {
    await fillBase(page, { phone: '514 555 0134' });
    await page.locator('input[name="CV"]').setInputFiles(file);
    await page.locator('#consentement').check();
    await submit(page);
    await expect(page.locator('[data-status]')).toHaveText(FERME);
    await expect(page.locator('[data-error="cv"]')).toBeHidden();
  }
});

test('un PDF de 5 Mo exactement n’est pas refusé pour la taille', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'ordi', 'fichier lourd, un seul viewport');
  await openRecrutement(page);
  await fillBase(page, { phone: '+1 514 555-0134' });
  await page.locator('input[name="CV"]').setInputFiles({
    name: 'cv.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.alloc(MAX, 0x25),
  });
  await page.locator('#consentement').check();
  await submit(page);
  await expect(page.locator('[data-error="cv"]')).toBeHidden();
  await expect(page.locator('[data-status]')).toHaveText(FERME);
});

test('le pot de miel bloque l’envoi', async ({ page }) => {
  await openRecrutement(page);
  const posts = trackPosts(page);
  await fillBase(page);
  await page.locator('input[name="CV"]').setInputFiles(pdf);
  await page.locator('#consentement').check();
  await page.locator('[data-honeypot]').evaluate((el, value) => { el.value = value; }, 'http://spam.test');
  await submit(page);
  await expect(page.locator('[data-status]')).toHaveText(MERCI);
  await expect(page.locator('[data-status]')).not.toHaveText(FERME);
  await page.waitForTimeout(300);
  expect(posts).toEqual([]);
});

test('les autres pages restent entières', async ({ page }) => {
  const paths = ['/', '/financement-equipements/', '/financement-corporatif-strategique/', '/recrutement/'];
  for (const path of paths) {
    const errors = [];
    const failed = [];
    const onConsole = (msg) => {
      if (msg.type() !== 'error') return;
      const text = `${msg.text()} ${msg.location()?.url || ''}`;
      if (/fonts\.(googleapis|gstatic)\.com/i.test(text)) return;
      errors.push(`${path} ${text}`);
    };
    const onPage = (err) => errors.push(`${path} ${err.message}`);
    const onResponse = (res) => {
      if (res.status() < 400) return;
      if (!res.url().startsWith('http://127.0.0.1:5180')) return;
      failed.push(`${path} ${res.status()} ${res.url()}`);
    };
    page.on('console', onConsole);
    page.on('pageerror', onPage);
    page.on('response', onResponse);
    await page.goto(path);
    await page.waitForFunction(() => window.__ready === true);
    const imgs = await page.evaluate(() => {
      const urls = new Set();
      for (const img of document.images) {
        if (img.src) urls.add(img.src);
        for (const part of (img.srcset || '').split(',')) {
          const src = part.trim().split(/\s+/)[0];
          if (src) urls.add(new URL(src, location.href).href);
        }
      }
      return [...urls];
    });
    const broken = [];
    for (const src of imgs) {
      const res = await page.request.get(src);
      if (res.status() >= 400) broken.push(`${path} ${res.status()} ${src}`);
    }
    page.off('console', onConsole);
    page.off('pageerror', onPage);
    page.off('response', onResponse);
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
    expect(broken).toEqual([]);
  }

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pour les projets');
  await expect(page.locator('#contact form')).toBeVisible();
  await page.goto('/financement-equipements/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Financement');
  await page.goto('/financement-corporatif-strategique/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Financement corporatif');
});

test('largeur intermédiaire sans débordement', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'ordi', 'viewport ordi');
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of ['/', '/recrutement/']) {
    await page.goto(path);
    await page.waitForFunction(() => window.__ready === true);
    const fit = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
    expect(fit, path).toBe(true);
  }
  const titleClear = await page.evaluate(() => {
    const hdr = document.querySelector('.hdr').getBoundingClientRect();
    const copy = document.querySelector('.hero__copy').getBoundingClientRect();
    return copy.top >= hdr.bottom - 2;
  });
  expect(titleClear).toBe(true);
});

test('envoi multipart vers le serveur local @envoi', async ({ page }, testInfo) => {
  await openRecrutement(page);
  await expect(page.locator('[data-recrutement]')).toHaveAttribute('data-endpoint', 'pret');
  const tag = testInfo.project.name;
  await fillBase(page, {
    phone: '1-514-555-0134',
    poste: 'Analyste',
    message: `Bonjour ${tag}`,
  });
  await page.locator('input[name="CV"]').setInputFiles(pdf);
  await page.locator('#consentement').check();
  await submit(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Candidature reçue (test local)');

  const res = await page.request.get(`${COLLECT}/dernier`);
  expect(res.ok()).toBe(true);
  const data = await res.json();
  expect(data.method).toBe('POST');
  expect(data.url).toBe('/candidature');
  expect(data.contentType).toContain('multipart/form-data');
  expect(data.fields.Prenom).toBe('Marie');
  expect(data.fields.Nom).toBe('Tremblay');
  expect(data.fields.Courriel).toBe('marie.tremblay@example.com');
  expect(data.fields.Telephone).toBe('1-514-555-0134');
  expect(data.fields.PosteVise).toBe('Analyste');
  expect(data.fields.Message).toBe(`Bonjour ${tag}`);
  expect(data.fields.ConsentementLoi25).toBe('ConsentementLoi25');
  expect(data.fields).not.toHaveProperty('champ_piege');
  expect(data.file.name).toBe('CV');
  expect(data.file.filename).toBe('cv-marie.pdf');
  expect(data.file.type).toContain('application/pdf');
  expect(data.file.base64).toBe(pdf.buffer.toString('base64'));
});
