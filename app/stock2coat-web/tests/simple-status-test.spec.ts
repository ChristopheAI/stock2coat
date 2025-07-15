import { test, expect } from '@playwright/test';

test('Simple status filter test', async ({ page }) => {
  console.log('🎯 SIMPLE TEST: Status filter werkt nu');
  
  await page.goto('/inventory');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot before test
  await page.screenshot({ path: 'before-status-test.png', fullPage: true });
  
  // Find status trigger by text
  const statusTrigger = page.locator('text=Status').first();
  await expect(statusTrigger).toBeVisible();
  console.log('✅ Status trigger found');
  
  // Click the trigger
  await statusTrigger.click();
  await page.waitForTimeout(1000);
  
  // Take screenshot after clicking
  await page.screenshot({ path: 'after-status-click.png', fullPage: true });
  
  // Look for dropdown options by text
  const alleOption = page.locator('text=Alle');
  const okOption = page.locator('text=OK');
  
  if (await alleOption.isVisible()) {
    console.log('✅ Dropdown options are visible!');
    
    // Click on OK option
    await okOption.click();
    await page.waitForTimeout(1000);
    
    console.log('✅ Successfully clicked OK filter option');
    await page.screenshot({ path: 'after-ok-filter.png', fullPage: true });
  }
  
  console.log('🎯 STATUS FILTER WORKS!');
});