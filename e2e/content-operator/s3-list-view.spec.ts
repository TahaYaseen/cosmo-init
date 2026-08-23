import { test, expect } from '@playwright/test';

/** UC-005 AC2 — admin list view shows all products (Draft + Published) with key fields. */
test('admin list view shows all products with key fields', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL || 'operator@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'change-me';

  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.goto('/admin/collections/products');
  await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Sku' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
});
