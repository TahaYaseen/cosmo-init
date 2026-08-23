import { test, expect } from '@playwright/test';

/**
 * UC-002 AC3 (sad path) — backend unreachable while viewing a Detail page.
 * See e2e/home/s1a-backend-unreachable.spec.ts for the simulation approach
 * (server-side Local API failure, not client-side network interception).
 */
test('shows a graceful error message on backend failure', async ({ page }) => {
  await page.goto('/products/any-id');
  await expect(
    page.getByText(
      "We're having trouble loading this product right now, please check back shortly",
    ),
  ).toBeVisible();
});
