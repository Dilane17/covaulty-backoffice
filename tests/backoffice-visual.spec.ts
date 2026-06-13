import { test, expect, Page } from '@playwright/test';

/**
 * Covaulty Backoffice Visual Regression Tests
 * 
 * These tests capture screenshots of all major backoffice screens
 * to detect UI inconsistencies and regressions.
 */

// Test credentials (mock for development)
const TEST_USER = {
  email: process.env.TEST_EMAIL || 'test@covaulty.bj',
  password: process.env.TEST_PASSWORD || 'password123',
};

// Routes to test (hash-based routing for this SPA)
const ROUTES = [
  { hash: '#dashboard', name: 'dashboard', waitFor: '.grid-kpi-6' },
  { hash: '#agents', name: 'agents', waitFor: '.tbl' },
  { hash: '#transactions', name: 'transactions', waitFor: '.tbl' },
  { hash: '#liquidite', name: 'liquidite', waitFor: '.finance-band' },
  { hash: '#rapports', name: 'rapports', waitFor: '.card' },
  { hash: '#parametres', name: 'parametres', waitFor: '.card' },
];

/**
 * Helper: Perform login
 */
async function performLogin(page: Page): Promise<void> {
  // Navigate to login page
  await page.goto('/#login');
  
  // Wait for login form to be visible
  await page.waitForSelector('.login-form', { state: 'visible', timeout: 10000 });
  
  // Fill login credentials
  await page.fill('.login-form input[type="email"]', TEST_USER.email);
  await page.fill('.login-form input[type="password"]', TEST_USER.password);
  
  // Click login button and wait for navigation
  await Promise.all([
    page.click('.login-form button[type="submit"]'),
    page.waitForURL(/#dashboard/, { timeout: 10000 }),
  ]);
  
  // Wait for dashboard content to be fully loaded
  await page.waitForSelector('.grid-kpi-6', { state: 'visible' });
  
  // Additional wait for fonts and animations to settle
  await page.waitForTimeout(1500);
}

/**
 * Helper: Navigate to a hash route and wait for content
 */
async function navigateToRoute(page: Page, route: { hash: string; name: string; waitFor: string }): Promise<void> {
  // Navigate to the route
  await page.goto(`/${route.hash}`);
  
  // Wait for the route-specific content
  await page.waitForSelector(route.waitFor, { state: 'visible', timeout: 10000 });
  
  // Wait for all images to load
  await page.waitForFunction(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).every(img => img.complete);
  });
  
  // Wait for animations to complete
  await page.waitForTimeout(1000);
}

/**
 * Helper: Take full page screenshot with descriptive name
 */
async function captureScreenshot(page: Page, name: string): Promise<void> {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: 'disabled',
  });
}

test.describe('Backoffice Visual Regression', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set default viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Inject CSS to disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    });
  });
  
  test('Login screen', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForSelector('.login-form', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    await captureScreenshot(page, '01-login');
  });
  
  test('Dashboard screen', async ({ page }) => {
    await performLogin(page);
    await captureScreenshot(page, '02-dashboard');
  });
  
  test('Agents screen', async ({ page }) => {
    await performLogin(page);
    await navigateToRoute(page, ROUTES[1]); // #agents
    await captureScreenshot(page, '03-agents');
  });
  
  test('Transactions screen', async ({ page }) => {
    await performLogin(page);
    await navigateToRoute(page, ROUTES[2]); // #transactions
    await captureScreenshot(page, '04-transactions');
  });
  
  test('Liquidite screen', async ({ page }) => {
    await performLogin(page);
    await navigateToRoute(page, ROUTES[3]); // #liquidite
    await captureScreenshot(page, '05-liquidite');
  });
  
  test('Rapports screen', async ({ page }) => {
    await performLogin(page);
    await navigateToRoute(page, ROUTES[4]); // #rapports
    await captureScreenshot(page, '06-rapports');
  });
  
  test('Parametres screen', async ({ page }) => {
    await performLogin(page);
    await navigateToRoute(page, ROUTES[5]); // #parametres
    await captureScreenshot(page, '07-parametres');
  });
  
  test('Sidebar navigation - all items visible', async ({ page }) => {
    await performLogin(page);
    
    // Click on sidebar to expand if needed and verify all navigation items
    const sidebar = await page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    
    await captureScreenshot(page, '08-sidebar-navigation');
  });
  
});
