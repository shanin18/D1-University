import { test, expect } from '@playwright/test';

test('mobile hero fits phone widths and marquee can pause', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 337, 390, 767]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const title = await page.locator('.hero h1').boundingBox();
    const card = await page.locator('.hero-event').boundingBox();
    expect(card.y).toBeGreaterThan(title.y + title.height);
    const brand = await page.locator('.hero-brand span').boundingBox();
    expect(brand.x + brand.width).toBeLessThanOrEqual(width);
  }
  const strip = page.getByRole('button', { name: 'Pause 4 more years marquee' });
  await strip.click();
  await expect(strip).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.years-track').evaluate(node => getComputedStyle(node).animationPlayState)).toBe('paused');
  await page.setViewportSize({ width: 337, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/mobile-hero.png' });
});

test('desktop hero keeps original sizes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.hero h1')).toHaveCSS('font-size', '64px');
  await expect(page.locator('.hero-brand span')).toHaveCSS('font-size', '142px');
  await expect(page.locator('.hero-top')).toHaveCSS('flex-direction', 'row');
  await expect(page.locator('.hero-content')).toHaveCSS('padding-top', '111px');
});
