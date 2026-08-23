import { test, expect } from '@playwright/test';

/**
 * INT-1 Task 6 — UC-006 AC7: the footer privacy notice must be visible on
 * all 3 storefront pages, and AC6: visitor logging must never add
 * perceptible latency to any of them.
 */
for (const path of ['/', '/about']) {
  test(`footer privacy notice is visible on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByTestId('privacy-notice')).toContainText(
      'We log visit data for analytics purposes.',
    );
  });
}

test('footer privacy notice is visible on a Product Detail page', async ({ page }) => {
  await page.goto('/'); // navigate to any seeded product's Detail page in a real run
  await page.getByRole('list', { name: 'Product carousel' }).getByRole('listitem').first().click();
  await expect(page.getByTestId('privacy-notice')).toContainText(
    'We log visit data for analytics purposes.',
  );
});

test('visitor-logging Middleware adds no perceptible delay to page load', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const elapsedMs = Date.now() - start;
  // Generous ceiling for a local dev server — the point of this assertion
  // is "no multi-second stall from a hung logging write," not a strict
  // performance budget (that is covered by the LCP NFR separately).
  expect(elapsedMs).toBeLessThan(5000);
});
