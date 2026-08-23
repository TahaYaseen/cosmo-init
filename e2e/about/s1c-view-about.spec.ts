import { test, expect } from '@playwright/test';

/** UC-004 AC1 — About nav link loads the Brand/About page with all sections. */
test('About nav link loads Brand/About page with all sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).first().click();
  await expect(page).toHaveURL('/about');

  await expect(page.getByText('The Alchemy of Radiance')).toBeVisible();
  await expect(page.getByText('Rooted in Reverence')).toBeVisible();
  await expect(page.getByText('The Science of Efficacy')).toBeVisible();
});
