from playwright.sync_api import sync_playwright
import time
import os

def take_screenshot(page, path):
    try:
        page.screenshot(path=path, timeout=5000)
    except Exception as e:
        print(f"Screenshot {path} failed: {e}")

def test_auth_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        
        print("1. Visiting landing page")
        page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded', timeout=120000)
        page.wait_for_timeout(2000)
        os.makedirs('screenshots', exist_ok=True)
        take_screenshot(page, 'screenshots/1-landing.png')
        
        print("2. Trying to access /dashboard while logged out")
        page.goto('http://127.0.0.1:3000/dashboard', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(2000)
        take_screenshot(page, 'screenshots/2-redirected-to-login.png')
        
        # Verify we are on login
        assert "/login" in page.url, f"Expected /login but got {page.url}"
        
        print("3. Navigating to signup")
        page.goto('http://127.0.0.1:3000/signup', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(2000)
        take_screenshot(page, 'screenshots/3-signup-page.png')
        
        print("4. Filling out signup form")
        email = f"test_{int(time.time())}@example.com"
        page.fill('input[name="fullName"]', 'Test Analyst')
        page.fill('input[name="bankName"]', 'Test Bank')
        page.fill('input[name="email"]', email)
        page.fill('input[name="password"]', 'Password123!')
        
        print("5. Submitting signup form")
        page.click('button[type="submit"]')
        page.wait_for_timeout(4000)
        take_screenshot(page, 'screenshots/4-signup-result.png')
        
        # Check if we got redirected to dashboard
        if "/dashboard" in page.url:
            print("Successfully redirected to dashboard!")
            
            print("6. Logging out")
            context.clear_cookies()
            print("Cookies cleared to simulate logout")
            
            print("7. Trying to access /dashboard again")
            page.goto('http://127.0.0.1:3000/dashboard', wait_until='domcontentloaded')
            page.wait_for_timeout(2000)
            take_screenshot(page, 'screenshots/5-redirected-to-login-again.png')
            assert "/login" in page.url, f"Expected /login but got {page.url}"
            
        else:
            print(f"Failed to redirect to dashboard. Current URL: {page.url}")
            
        browser.close()

if __name__ == "__main__":
    test_auth_flow()
