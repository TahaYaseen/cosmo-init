import { test, expect } from '@playwright/test';

/** UC-003 AC2 — Buy on the Home Featured Spotlight redirects the same way as AC1. */
test('Buy on Home Featured Spotlight opens exact purchaseUrl in a new tab', async ({
  page,
  context,
}) => {
  await page.goto('/#featured-spotlight');

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Shop This Formula' }).click(),
  ]);

  expect(popup.url()).not.toBe('about:blank');
  await expect(page).toHaveURL(/\/$/);
});
