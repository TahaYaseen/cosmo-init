import { test, expect } from '@playwright/test';

/**
 * UC-002 AC1 — View Product Detail (fully-populated product).
 * Requires: a Published product with every optional field set — see
 * README.md "Seeding test data for E2E" (e.g. seed product GL-01).
 */
test('detail page shows all populated fields', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('list', { name: 'Product carousel' }).getByRole('listitem').first().click();

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText(/^₹/)).toBeVisible();
  await expect(page.getByText('Technical Specifications')).toBeVisible();
});
