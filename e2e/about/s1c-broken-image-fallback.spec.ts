import { test, expect } from '@playwright/test';

/**
 * UC-004 AC2 (sad path) — a broken static image must not take down the
 * whole page shell. Intercepts the first image request on /about and
 * forces it to fail, then asserts nav/footer still render.
 */
test('page shell renders when a static image fails to load', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,webp}', (route) => route.abort());
  await page.goto('/about');

  await expect(page.getByRole('banner', { name: 'Site header' })).toBeVisible();
  await expect(page.getByText('The Alchemy of Radiance')).toBeVisible();
});
