import { test, expect } from '@playwright/test';
import { carteConnexe, liensParPage } from '../src/liens-connexes.mjs';

test('une clé absente du catalogue des pages connexes est refusée', () => {
  expect(() => carteConnexe('page-inconnue')).toThrow(/absente du catalogue/);
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
