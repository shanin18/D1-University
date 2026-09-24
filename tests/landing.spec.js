import { test, expect } from '@playwright/test';

test('responsive layout, accordions, infinite carousel, and inquiry', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Experiences' }).click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  }
  const faq = page.getByRole('button', { name: 'Who are these experiences for?' });
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: 'What is D1 University?' })).toHaveAttribute('aria-expanded', 'false');
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'false');
  const carousel = page.getByRole('region', { name: 'Community testimonials' });
  await carousel.scrollIntoViewIfNeeded();
  for (let i = 0; i < 7; i++) {
    await page.getByRole('button', { name: 'Next testimonial', exact: true }).click();
    await expect(page.getByRole('button', { name: `Go to testimonial ${(i + 1) % 6 + 1}` })).toHaveAttribute('aria-current', 'true');
  }
  await page.getByRole('button', { name: 'Get event updates', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Your name').fill('Test Athlete');
  await dialog.getByLabel('Email address').fill('athlete@example.com');
  await dialog.getByRole('button', { name: 'Prepare inquiry' }).click();
  await expect(dialog.getByLabel('Prepared inquiry')).toHaveValue(/Test Athlete/);
  await dialog.getByRole('button', { name: 'Close inquiry' }).click();
  await expect(dialog).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('reduced motion shows final counters and stops marquee animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByText('Athletes connected', { exact: true }).scrollIntoViewIfNeeded();
  await expect(page.locator('[aria-hidden="true"]').filter({ hasText: /^2,500\+$/ })).toBeVisible();
  expect(await page.locator('.marquee-track').evaluate(node => getComputedStyle(node).animationName)).toBe('none');
});
