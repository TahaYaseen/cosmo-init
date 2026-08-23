import { test, expect } from '@playwright/test';

/**
 * UC-002 AC2 (sad path) — deleted/unpublished/unknown product ID.
 */
test('shows "no longer available" with a Home link for a nonexistent product', async ({ page }) => {
  await page.goto('/products/00000000-0000-0000-0000-000000000000');
  await expect(page.getByText('This product is no longer available')).toBeVisible();
  const backLink = page.getByRole('link', { name: 'Back to Home' });
  await expect(backLink).toHaveAttribute('href', '/');
  await backLink.click();
  await expect(page).toHaveURL('/');
});
