import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for Covaulty backoffice visual regression testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html', { open: 'on-failure', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot configuration */
    screenshot: 'only-on-failure',
    
    /* Viewport settings */
    viewport: { width: 1440, height: 900 },
    
    /* Test ID attribute for data-testid attributes */
    testIdAttribute: 'data-testid',
  },
  
  /* Visual comparison options */
  expect: {
    toHaveScreenshot: {
      /* Maximum pixel ratio difference */
      maxDiffPixelRatio: 0.02,
      /* Threshold for comparison */
      threshold: 0.2,
      /* Custom snapshot directory */
      pathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
    },
    /* Timeout for each test */
    timeout: 10000,
  },
  
  /* Snapshot directory for failed comparisons (diffs) */
  snapshotDir: 'tests/__snapshots__',
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on other browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  
  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  /* Output directory for test artifacts */
  outputDir: 'tests/error-snapshots/',
});
