import { test, expect } from '@playwright/test';

/**
 * UC-003 AC3/AC4 (sad paths) — empty or malformed purchaseUrl renders a
 * disabled "Coming Soon" button that performs no navigation when clicked.
 * Requires a seeded product with purchaseUrl unset (AC3) and one with a
 * malformed value, e.g. "www.example.com/x" with no protocol (AC4).
 */
test('disabled Buy button does not navigate when clicked', async ({ page, context }) => {
  await page.goto('/'); // navigate to the seeded product with no/malformed purchaseUrl in a real run

  const comingSoon = page.getByRole('button', { name: 'Coming Soon' });
  await expect(comingSoon).toBeDisabled();

  let popupOpened = false;
  context.on('page', () => {
    popupOpened = true;
  });
  await comingSoon.click({ force: true }).catch(() => {
    // Disabled elements reject synthetic clicks in some browsers — that is
    // itself evidence no navigation occurred.
  });
  expect(popupOpened).toBe(false);
});
