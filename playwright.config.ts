import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E config (architecture.md §14, ADR-004).
 *
 * These specs require a running dev server (`pnpm dev`) backed by a real
 * (local or dev-project) Supabase Postgres instance with Payload migrated,
 * PLUS seed data matching the fixtures each spec describes (see each
 * spec file's header comment and README.md "Seeding test data for E2E").
 * They cannot run against an empty/unconfigured database.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
