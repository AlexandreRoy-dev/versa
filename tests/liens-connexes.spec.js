import { test, expect } from '@playwright/test';
import { carteConnexe, liensParPage } from '../src/liens-connexes.mjs';

test('une clé absente du catalogue des pages connexes est refusée', () => {
  expect(() => carteConnexe('page-inconnue')).toThrow(/absente du catalogue/);
});

async function mesurerFleches(page, slug) {
  await page.goto(`/${slug}/?static`);
  await page.waitForFunction(() => window.__ready === true);
  return page.locator('.related .svc__arrow').evaluateAll((arrows) => {
    const groups = [];
    const gaps = [];
    for (const arrow of arrows) {
      const card = arrow.closest('.rel');
      const description = card.querySelector('.rel__meta') || card.querySelector('.rel__n');
      const cardBox = card.getBoundingClientRect();
      const arrowBox = arrow.getBoundingClientRect();
      const descBox = description.getBoundingClientRect();
      gaps.push(arrowBox.top - descBox.bottom);
      const group = groups.find((item) => Math.abs(item.top - cardBox.top) <= 2);
      if (group) group.bottoms.push(arrowBox.bottom);
      else groups.push({ top: cardBox.top, bottoms: [arrowBox.bottom] });
    }
    return { rows: groups.map((item) => item.bottoms), gaps };
  });
}

test('les flèches des services connexes sont alignées et écartées du texte', async ({ page }) => {
  for (const [width, rowsMin] of [[1280, 2], [390, 1]]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of ['financement-machinerie-lourde', 'fonds-de-roulement']) {
      const { rows, gaps } = await mesurerFleches(page, slug);
      expect(rows.length, `${slug} ${width}`).toBeGreaterThan(0);
      for (const bottoms of rows) {
        expect(bottoms.length, `${slug} ${width}`).toBeGreaterThanOrEqual(rowsMin);
        const ecart = Math.max(...bottoms) - Math.min(...bottoms);
        expect(ecart, `${slug} ${width}`).toBeLessThanOrEqual(2);
      }
      for (const gap of gaps) {
        expect(gap, `${slug} ${width}`).toBeGreaterThanOrEqual(16);
      }
    }
  }
});

test('les services connexes ont un titre, une description et un lien', async ({ page }) => {
  for (const [slug, cles] of Object.entries(liensParPage)) {
    await page.goto(`/${slug}/?static`);
    await page.waitForFunction(() => window.__ready === true);
    const links = page.locator('.related a.rel');
    await expect(links, slug).toHaveCount(cles.length);
    for (let i = 0; i < cles.length; i += 1) {
      const attendu = carteConnexe(cles[i]);
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      if (attendu.external) {
        expect(href, slug).toMatch(/^https:\/\/www\.versaequip\.ca\/(fr\/accueil\.htm)?$/);
      } else {
        expect(href, slug).toBe(attendu.href);
      }
      await expect(link.locator('.rel__k'), slug).toHaveText(attendu.kicker);
      await expect(link.locator('.rel__n'), slug).toHaveText(attendu.title);
      await expect(link.locator('.rel__meta'), slug).toHaveText(attendu.description);
      expect(await link.evaluate((el) => el.outerHTML), slug).not.toContain('undefined');
      if (attendu.href.startsWith('/')) {
        const res = await page.request.get(attendu.href);
        expect(res.ok(), `${slug} ${attendu.href}`).toBe(true);
      }
    }
  }
});
