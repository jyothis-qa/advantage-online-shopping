// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  retries: 0,
  reporter: 'html',

  // Force using only Chromium
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false, // Set to true to hide the browser
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry'
      },
    }
  ]
});
