const { chromium, devices } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

async function loginAndNavigate(page) {
  console.log('Logging in...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3000/dashboard');
  console.log('Logged in successfully.');

  console.log('Navigating to applications...');
  await page.goto('http://localhost:3000/dashboard/applications');
  
  await page.waitForSelector('table', { timeout: 10000 });
  
  const firstApp = await page.$('a[href^="/dashboard/applications/"]');
  if (!firstApp) {
    throw new Error('No applications found. User needs to create one and upload PDFs first.');
  }
  
  await firstApp.click();
  console.log('Opened application detail.');
}

async function runTest() {
  console.log('Starting extraction test...');
  
  const outDir = path.join(process.cwd(), '..', '.claude', 'extraction-test');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await loginAndNavigate(page);

    // 3. Switch to Extraction tab
    await page.waitForSelector('button:has-text("extraction")');
    await page.click('button:has-text("extraction")');
    
    // Check if there are documents
    const hasDocs = await page.$('button:has-text("Run Extraction")');
    if (!hasDocs) {
      console.log('Checking if extraction is already completed...');
      const reRun = await page.$('button:has-text("Re-run All")');
      if (!reRun) {
         throw new Error('Cannot find Run Extraction or Re-run All button. Are there documents uploaded?');
      }
    }

    // 4. Take empty/initial screenshot
    console.log('Taking initial screenshot...');
    await page.screenshot({ path: path.join(outDir, 'extraction-tab-empty.png') });

    // 5. Click Run Extraction
    console.log('Starting extraction...');
    const runBtn = await page.$('button:has-text("Run Extraction")') || await page.$('button:has-text("Re-run All")');
    await runBtn.click();

    // 6. Take processing screenshot
    await page.waitForTimeout(1000); // Wait for state to change to processing
    console.log('Taking processing screenshot...');
    await page.screenshot({ path: path.join(outDir, 'extraction-tab-processing.png') });

    // 7. Wait for completion (up to 60 seconds)
    console.log('Waiting for extraction to complete (this may take a while)...');
    
    // We wait for the spinner to disappear from the Run button
    // or wait for "Completed" badges to appear
    let isCompleted = false;
    for (let i = 0; i < 60; i++) {
      const isProcessing = await page.evaluate(() => {
        return document.body.innerText.includes('Extracting data with Claude') || 
               document.body.innerText.includes('Processing');
      });
      
      if (!isProcessing) {
        // Double check if we see completed
        const hasCompleted = await page.evaluate(() => document.body.innerText.includes('Completed') || document.body.innerText.includes('Total cost:'));
        if (hasCompleted) {
          isCompleted = true;
          break;
        }
      }
      await page.waitForTimeout(1000);
    }
    
    if (isCompleted) {
      console.log('Extraction completed successfully!');
    } else {
      console.log('Extraction timed out or failed. Check screenshots.');
    }

    // 8. Take completed screenshot
    console.log('Taking completed screenshot...');
    await page.screenshot({ path: path.join(outDir, 'extraction-tab-completed.png'), fullPage: true });

    // Check if we have a bank statement summary and screenshot it specifically
    const bankSummary = await page.$('.bank-statement-summary'); // Add this class to summary component if needed, or just screenshot whole page
    if (bankSummary) {
      await bankSummary.screenshot({ path: path.join(outDir, 'bank-statement-summary.png') });
    } else {
      await page.screenshot({ path: path.join(outDir, 'bank-statement-summary.png') });
    }

    // 9. Mobile screenshot
    console.log('Testing mobile view...');
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13']
    });
    const mobilePage = await mobileContext.newPage();
    
    // Copy cookies to mobile context to stay logged in
    const cookies = await context.cookies();
    await mobileContext.addCookies(cookies);
    
    await mobilePage.goto(page.url());
    await mobilePage.waitForSelector('button:has-text("extraction")');
    await mobilePage.click('button:has-text("extraction")');
    await mobilePage.waitForTimeout(2000); // let it render
    
    console.log('Taking mobile screenshot...');
    await mobilePage.screenshot({ path: path.join(outDir, 'mobile-375.png'), fullPage: true });

    console.log('Test complete!');

  } catch (err) {
    console.error('Test failed:', err);
    await page.screenshot({ path: path.join(outDir, 'error-state.png') });
  } finally {
    await browser.close();
  }
}

runTest().catch(console.error);
