const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  // Navigate to login
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  // We need to login. We can mock it or use an existing login if auth allows,
  // Or since we just want visual screenshots, maybe the dashboard is not protected in this exact test, or we can use the bypass if any.
  // Actually, we can just click "Sign In" if it's the dev server, we can fill dummy credentials.
  await page.goto('http://localhost:3000/signup');
  await page.waitForSelector('input[type="email"]');
  const userEmail = `test_${Date.now()}@example.com`;
  await page.fill('input[type="email"]', userEmail);
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => console.log('Timeout waiting for redirect. Still on', page.url()));
  
  // Fallback to manual navigation if signup didn't auto-redirect
  if (!page.url().includes('/dashboard')) {
      await page.goto('http://localhost:3000/dashboard');
  }
  
  await page.waitForTimeout(2000); // Let animations/data load
  
  const outDir = path.join(__dirname, '../.claude/dashboard-polish');
  
  // 1. Overview Dark
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-overview.png') });
  
  // 2. Applications Dark
  await page.goto('http://localhost:3000/dashboard/applications');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-applications.png') });
  
  // 3. New Application Dark
  await page.goto('http://localhost:3000/dashboard/applications/new');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-new.png') });
  
  // 4. Memos Dark
  await page.goto('http://localhost:3000/dashboard/memos');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-memos.png') });
  
  // 5. Settings Dark
  await page.goto('http://localhost:3000/dashboard/settings');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark-settings.png') });
  
  // 6. Toggle theme and take Light overview
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(1000);
  
  // Click the theme toggle button (aria-label="Toggle theme")
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: path.join(outDir, 'dashboard-light-overview.png') });
  
  await browser.close();
  console.log('Screenshots generated successfully.');
})();
