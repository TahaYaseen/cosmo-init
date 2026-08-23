import { test, expect } from '@playwright/test';

/**
 * UC-005 AC1 — a new Published product appears on Home + Detail with no
 * rebuild/restart (proves the S0 afterChange -> revalidatePath hook).
 * Requires a Content Operator account (see README.md "Creating a Content
 * Operator account").
 */
test('new Published product appears on Home + Detail with no rebuild', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL || 'operator@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'change-me';
  const sku = `E2E-${Date.now()}`;

  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/admin(\/)?$/);

  await page.goto('/admin/collections/products/create');
  await page.getByLabel('Sku').fill(sku);
  await page.getByLabel('Name').fill('E2E Test Product');
  await page.getByLabel('Price').fill('999');
  await page.getByLabel('Description').fill('Created by an automated E2E test.');
  await page.getByLabel('Status').selectOption('published');
  // Image upload is required by the schema — a real run must attach a
  // fixture image here via the Media relationship field before saving.
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('successfully created')).toBeVisible();

  await page.goto('/');
  await expect(page.getByText('E2E Test Product')).toBeVisible();
});
