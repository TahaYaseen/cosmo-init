import { test, expect } from '@playwright/test';

/**
 * UC-001 AC4 (sad path) — Payload/Postgres backend unreachable.
 *
 * Simulated by pointing DATABASE_URI at an unreachable host for this test
 * run (e.g. a separate `pnpm dev` process started with a deliberately
 * broken DATABASE_URI), rather than via network interception — the Local
 * API call happens server-side (React Server Component), so client-side
 * request mocking (page.route) cannot intercept it.
 */
test('shows a graceful error message instead of a blank/crashed page', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText(
      "We're having trouble loading our products right now, please check back shortly",
    ),
  ).toBeVisible();
  // The page shell (header/footer) must still render around the error.
  await expect(page.getByRole('banner', { name: 'Site header' })).toBeVisible();
});
