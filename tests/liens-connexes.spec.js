import { test, expect } from '@playwright/test';
import { carteConnexe, liensParPage } from '../src/liens-connexes.mjs';

test('une clé absente du catalogue des pages connexes est refusée', () => {
  expect(() => carteConnexe('page-inconnue')).toThrow(/absente du catalogue/);
});

test('les flèches des services connexes sont alignées à 1280 px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'ordi', 'mesure à 1280 px');
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const slug of ['financement-machinerie-lourde', 'fonds-de-roulement']) {
    await page.goto(`/${slug}/?static`);
    await page.waitForFunction(() => window.__ready === true);
    const rows = await page.locator('.related .svc__arrow').evaluateAll((arrows) => {
      const groups = [];
      for (const arrow of arrows) {
        const card = arrow.closest('.rel').getBoundingClientRect();
        const box = arrow.getBoundingClientRect();
        const group = groups.find((item) => Math.abs(item.top - card.top) <= 2);
        if (group) group.bottoms.push(box.bottom);
        else groups.push({ top: card.top, bottoms: [box.bottom] });
      }
      return groups.map((item) => item.bottoms);
    });
    expect(rows.length, slug).toBeGreaterThan(0);
    expect(rows[0].length, slug).toBeGreaterThan(1);
    for (const bottoms of rows) {
      const ecart = Math.max(...bottoms) - Math.min(...bottoms);
      expect(ecart, slug).toBeLessThanOrEqual(2);
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
