import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Clean execution settings
  fullyParallel: false, // Run tests sequentially
  workers: 1,           // One test at a time
  
  reporter: 'html',
  
  use: {
    baseURL: 'https://demoqa.com',
    
    // IMPORTANT: No storageState line here.
    // Every test starts with a fresh, empty browser.
    
    headless: false, // Browser pops up
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});