import { test, expect } from '@playwright/test';
import path from 'path';

test('capture screenshots', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Navigate to login
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  
  // Try to sign up to bypass
  await page.goto('http://localhost:3000/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000); // give it some time to compile
  await page.waitForSelector('input[type="email"]');
  const userEmail = `test_${Date.now()}@example.com`;
  await page.fill('input[type="email"]', userEmail);
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Wait for redirect
  await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => console.log('Timeout waiting for redirect.'));
  
  if (!page.url().includes('/dashboard')) {
      await page.goto('http://localhost:3000/dashboard');
  }
  
  await page.waitForTimeout(2000);
  
  const outDir = path.join(process.cwd(), '../.claude/dashboard-polish');
  
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-overview.png') });
  
  await page.goto('http://localhost:3000/dashboard/applications');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-applications.png') });
  
  await page.goto('http://localhost:3000/dashboard/applications/new');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-new.png') });
  
  await page.goto('http://localhost:3000/dashboard/memos');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-memos.png') });
  
  await page.goto('http://localhost:3000/dashboard/settings');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-settings.png') });
  
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(1000);
  
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: path.join(outDir, 'dashboard-light-overview.png') });
});
