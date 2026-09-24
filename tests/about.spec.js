import { test, expect } from '@playwright/test';

test('mobile about section supports swiping without page overflow', async ({ page }) => {
  await page.goto('/');
  for (const width of [320, 390, 767]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator('#about').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const cards = page.locator('.program-grid');
    expect(await cards.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
    await cards.evaluate(node => { node.scrollLeft = node.scrollWidth; });
    await expect.poll(() => cards.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
    const stats = await page.locator('.about-stats > div').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
    expect(new Set(stats).size).toBe(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/mobile-about.png' });
});
