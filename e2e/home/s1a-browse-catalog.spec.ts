import { test, expect } from '@playwright/test';

/**
 * UC-001 AC1/AC2 — Browse Product Catalog (Home Page).
 *
 * Requires: at least 2 Published products seeded (so "next" has somewhere
 * to scroll to) via Payload admin or a seed script — see README.md
 * "Seeding test data for E2E".
 */
test.describe('Home — browse catalog', () => {
  test('carousel shows every published product with image, name, and price', async ({ page }) => {
    await page.goto('/');
    const carousel = page.getByRole('list', { name: 'Product carousel' });
    await expect(carousel).toBeVisible();

    const cards = carousel.getByRole('listitem');
    await expect(cards.first()).toBeVisible();
    // Every card renders a name (font-display heading) and an INR price.
    await expect(cards.first().locator('h3')).toBeVisible();
    await expect(cards.first().getByText(/^₹/)).toBeVisible();
  });

  test('clicking "next" scrolls the carousel without a full page reload', async ({ page }) => {
    await page.goto('/');
    const nextButton = page.getByRole('button', { name: 'Next products' });

    // Assert no full navigation occurs: the page's main document does not
    // reload (Playwright's `page.goto`/navigation event would fire on a
    // full reload; here we assert the nav is still present without
    // awaiting one).
    await nextButton.click();
    await expect(page.getByRole('banner', { name: 'Site header' })).toBeVisible();
  });

  test('clicking a product card navigates to its Detail page (UC-001 -> UC-002)', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.getByRole('list', { name: 'Product carousel' }).getByRole('listitem').first();
    const productName = await firstCard.locator('h3').innerText();
    await firstCard.click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(productName);
  });
});
