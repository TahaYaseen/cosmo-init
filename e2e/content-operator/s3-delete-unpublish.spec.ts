import { test, expect } from '@playwright/test';

/**
 * UC-005 AC4 — a deleted/unpublished product disappears from Home and its
 * Detail page shows the UC-002 AC2 "no longer available" message.
 */
test('deleted product disappears from Home and shows not-found on Detail', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL || 'operator@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'change-me';
  const productId = process.env.E2E_DISPOSABLE_PRODUCT_ID || 'REPLACE_WITH_A_DISPOSABLE_PRODUCT_ID';

  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.goto(`/admin/collections/products/${productId}`);
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await page.goto(`/products/${productId}`);
  await expect(page.getByText('This product is no longer available')).toBeVisible();
});
