import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './config/url';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  // Run in parallel by default: each test gets its own isolated browser context,
  // and page objects always navigate fresh, so there's no shared state between tests.
  // Override with `npx playwright test --workers=1` locally if you need strict ordering.
  fullyParallel: false,
  workers: 1, // let Playwright pick a sensible worker count locally

  reporter: 'html',

  use: {
    baseURL: BASE_URL, // single source of truth, shared with config/url.ts

    // IMPORTANT: No storageState line here.
    // Every test starts with a fresh, empty browser.

    // Headed locally (handy while developing/debugging), always headless on CI
    // (CI runners have no display server, so headed mode would fail there).
    headless: isCI,
    navigationTimeout: 60_000, // 60s thay vì mặc định 30s
    actionTimeout: 15_000,
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  retries: isCI ? 2 : 0, 

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});