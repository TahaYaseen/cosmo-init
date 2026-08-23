import { test, expect } from '@playwright/test';

/**
 * UC-005 AC3 — editing purchaseUrl updates the Buy button's enabled/disabled
 * state on the live storefront on next load, with no rebuild.
 * Requires a seeded Published product; SEED_PRODUCT_ID identifies it.
 */
test('editing purchaseUrl updates Buy button state live', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL || 'operator@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'change-me';
  const productId = process.env.E2E_SEED_PRODUCT_ID || 'REPLACE_WITH_SEEDED_PRODUCT_ID';

  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.goto(`/admin/collections/products/${productId}`);
  await page.getByLabel('Purchase Url').fill('');
  await page.getByRole('button', { name: 'Save' }).click();

  await page.goto(`/products/${productId}`);
  await expect(page.getByRole('button', { name: 'Coming Soon' })).toBeVisible();

  await page.goto(`/admin/collections/products/${productId}`);
  await page.getByLabel('Purchase Url').fill('https://retailer.example.com/products/test');
  await page.getByRole('button', { name: 'Save' }).click();

  await page.goto(`/products/${productId}`);
  await expect(page.getByRole('link', { name: /shop this formula/i })).toHaveAttribute(
    'href',
    'https://retailer.example.com/products/test',
  );
});
