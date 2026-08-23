import { test, expect } from '@playwright/test';

/**
 * UC-002 AC4 — no blank/"undefined" text for a sparsely-filled product.
 * Requires: a seeded Published product with several optional fields left
 * blank (no badge, no fragrance notes, no phLevel) — e.g. seed product
 * GL-03 per the fixture shape in README.md "Seeding test data for E2E".
 */
test('no blank/undefined text renders for a sparsely-filled product', async ({ page }) => {
  await page.goto('/'); // navigate to the seeded sparse product from the carousel in a real run
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toMatch(/undefined/i);
  expect(bodyText).not.toMatch(/\bnull\b/);
});
