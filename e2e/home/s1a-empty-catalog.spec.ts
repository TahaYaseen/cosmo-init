import { test, expect } from '@playwright/test';

/**
 * UC-001 AC3 (sad path) — zero Published products.
 *
 * Requires: a Supabase project/branch with zero Published products (e.g. a
 * dedicated empty-catalog test database, or all products temporarily set
 * to Draft) — see README.md "Seeding test data for E2E".
 */
test('shows "No products available yet" when the catalog is empty', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('No products available yet')).toBeVisible();
  await expect(page.getByRole('list', { name: 'Product carousel' })).toHaveCount(0);
});
