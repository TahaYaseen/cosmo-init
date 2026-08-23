import { test, expect } from '@playwright/test';

/**
 * UC-005 AC5 (sad path) — Payload's built-in required-field validation
 * blocks a save missing a required field and surfaces a visible error.
 */
test('admin UI shows validation error for missing required field', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL || 'operator@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'change-me';

  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.goto('/admin/collections/products/create');
  // Deliberately leave "Name" (required) blank, fill everything else.
  await page.getByLabel('Sku').fill(`E2E-INVALID-${Date.now()}`);
  await page.getByLabel('Price').fill('100');
  await page.getByLabel('Description').fill('Missing required Name field.');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText(/this field is required/i)).toBeVisible();
});
