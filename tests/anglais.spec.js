import { test, expect } from '@playwright/test';
import { ORIGIN, pagesLangues } from '../src/pages-langues.mjs';

const pdf = {
  name: 'cv-marie.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n% candidature\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n'),
};

test('chaque page annonce sa langue et son équivalent', async ({ page }) => {
  for (const pageInfo of pagesLangues) {
    const res = await page.request.get(pageInfo.path);
    expect(res.ok(), pageInfo.path).toBe(true);
    const html = await res.text();
    expect(html, pageInfo.path).not.toMatch(/href="[^"]*undefined|>undefined</);
    const frPath = pageInfo.lang === 'fr' ? pageInfo.path : pageInfo.pair;
    const enPath = pageInfo.lang === 'en' ? pageInfo.path : pageInfo.pair;
    expect(html, pageInfo.path).toContain(`hreflang="fr-CA" href="${ORIGIN}${frPath}"`);
    expect(html, pageInfo.path).toContain(`hreflang="en-CA" href="${ORIGIN}${enPath}"`);
    expect(html, pageInfo.path).toContain(`hreflang="x-default" href="${ORIGIN}${frPath}"`);
    expect(html, pageInfo.path).not.toMatch(/forms\.zohopublic/i);

    await page.goto(`${pageInfo.path}?static`);
    await page.waitForFunction(() => window.__ready === true);
    await expect(page).toHaveTitle(pageInfo.title);
    await expect(page.locator('html')).toHaveAttribute('lang', pageInfo.lang === 'en' ? 'en-CA' : 'fr-CA');
    const lang = page.locator('header .lang');
    await expect(lang.locator('a[hreflang="fr-CA"]')).toHaveAttribute('href', frPath);
    await expect(lang.locator('a[hreflang="en-CA"]')).toHaveAttribute('href', enPath);
    const courant = pageInfo.lang === 'fr' ? 'a[hreflang="fr-CA"]' : 'a[hreflang="en-CA"]';
    await expect(lang.locator(courant)).toHaveAttribute('aria-current', 'page');

    const faq = page.locator('script[type="application/ld+json"]');
    if (await faq.count()) {
      const data = JSON.parse(await faq.textContent());
      expect(data['@type'], pageInfo.path).toBe('FAQPage');
      const questions = (await page.locator('.faq__q').allTextContents()).map((t) => t.trim());
      const answers = (await page.locator('.faq__a').allTextContents()).map((t) => t.trim());
      expect(questions, pageInfo.path).toHaveLength(6);
      expect(data.mainEntity.map((item) => item.name)).toEqual(questions);
      expect(data.mainEntity.map((item) => item.acceptedAnswer.text)).toEqual(answers);
    }

    const fit = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
    expect(fit, pageInfo.path).toBe(true);
  }
});

test('la page carrières anglaise ouvre bientôt, sans URL inventée', async ({ page }) => {
  await page.goto('/en/careers/');
  await page.waitForFunction(() => window.__ready === true && document.querySelector('[data-recrutement]')?.dataset.script === 'pret');
  await expect(page.locator('[data-recrutement]')).toHaveAttribute('data-endpoint', 'ferme');
  await expect(page.locator('.consent__text a')).toHaveAttribute('href', 'https://versacapital.ca/politique-de-confidentialite/');
  await expect(page.locator('select')).toHaveCount(0);
  await page.locator('input[name="Prenom"]').fill('Marie');
  await page.locator('input[name="Nom"]').fill('Tremblay');
  await page.locator('input[name="Courriel"]').fill('marie.tremblay@example.com');
  await page.locator('input[name="CV"]').setInputFiles(pdf);
  await page.locator('#consentement').check();
  await page.getByRole('button', { name: 'Submit my application' }).click();
  await expect(page.locator('[data-status]')).toHaveText('Applications will open shortly.');
});
