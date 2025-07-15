import { test, expect } from '@playwright/test';

test('Stock2coat inventory dashboard loads correctly', async ({ page }) => {
  // Navigate to the inventory page
  await page.goto('/inventory');

  // Assert the main heading is visible
  await expect(page.locator('h1')).toContainText('Stock2Coat Poeder Inventaris');

  // Take a screenshot for verification
  await page.screenshot({ path: 'inventory-dashboard.png', fullPage: true });
});

test('Dark sidebar with logo is displayed', async ({ page }) => {
  await page.goto('/');

  // Check if the Stock2coat logo is visible
  await expect(page.locator('img[alt="Stock2Coat"]')).toBeVisible();

  // Verify dark sidebar background
  const sidebar = page.locator('.bg-slate-900').first();
  await expect(sidebar).toBeVisible();

  // Take a screenshot of the full dashboard
  await page.screenshot({ path: 'dashboard-with-logo.png', fullPage: true });
});

test('Inventory table displays items correctly', async ({ page }) => {
  await page.goto('/inventory');

  // Wait for the table to load
  await page.waitForSelector('table');

  // Check if inventory items are displayed
  const rowCount = await page.locator('table tbody tr').count();
  expect(rowCount).toBeGreaterThan(0);

  // Verify RAL codes are displayed
  await expect(page.locator('table')).toContainText('1000');
  await expect(page.locator('table')).toContainText('2000');

  // Check status badges
  await expect(page.locator('.bg-red-100')).toBeVisible(); // LAAG status
  await expect(page.locator('.bg-green-100')).toBeVisible(); // OK status
});

test('Navigation works correctly', async ({ page }) => {
  await page.goto('/');

  // Click on Voorraad navigation
  await page.click('text=Voorraad');

  // Verify we're on the inventory page
  await expect(page).toHaveURL('/inventory');
  await expect(page.locator('h1')).toContainText('Stock2Coat Poeder Inventaris');

  // Click on Dashboard navigation
  await page.click('text=Dashboard');

  // Verify we're back on the dashboard
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toContainText('Welkom bij Stock2coat');
});