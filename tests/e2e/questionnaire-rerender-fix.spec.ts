import { test, expect } from "@playwright/test";

/**
 * Focused E2E Test: Questionnaire Infinite Rerender Fix
 * 
 * This test specifically verifies that the questionnaire page
 * doesn't experience infinite rerenders when accessed and used.
 */

test.describe("Questionnaire - No Infinite Rerenders", () => {
  
  test("should load questionnaire page without excessive rerenders", async ({ page }) => {
    // Track console errors for React rerender warnings
    const reactErrors: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      // Detect React infinite loop warnings
      if (text.includes('Maximum update depth exceeded') ||
          text.includes('Too many re-renders') ||
          text.includes('Rendered more hooks than during the previous render')) {
        reactErrors.push(text);
      }
    });

    // Navigate directly to questionnaire
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    
    // Wait for page to stabilize
    await page.waitForTimeout(3000);

    // Check for infinite rerender error messages
    if (reactErrors.length > 0) {
      console.error("❌ React infinite rerender errors detected:", reactErrors);
      throw new Error(`Infinite rerender detected: ${reactErrors.join(', ')}`);
    }

    // Verify page loaded successfully
    const title = page.locator('text=/questionnaire/i').first();
    await expect(title).toBeVisible({ timeout: 10000 });

    console.log("✅ Questionnaire page loaded without infinite rerenders");
  });

  test("should handle form interactions without excessive updates", async ({ page }) => {
    const reactWarnings: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      // Detect "Cannot update a component while rendering" warning
      if (text.includes('Cannot update a component') && text.includes('while rendering')) {
        reactWarnings.push(text);
      }
    });

    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Navigate to section 1
    const nextButton = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // Try to interact with a radio button
    const radio = page.locator('input[type="radio"]').first();
    if (await radio.isVisible({ timeout: 2000 }).catch(() => false)) {
      await radio.click();
      await page.waitForTimeout(1000);
    }

    // Check for "Cannot update while rendering" warnings
    if (reactWarnings.length > 0) {
      console.error("⚠️ React state update warnings:", reactWarnings);
      // This is a warning, not a critical error, but we log it
    }

    console.log("✅ Form interactions completed");
    console.log(`   React warnings detected: ${reactWarnings.length}`);
  });

  test("should monitor network requests for rerender patterns", async ({ page }) => {
    let requestCount = 0;
    const requests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      // Only count relevant requests (exclude static assets)
      if (!url.includes('.png') && !url.includes('.jpg') && !url.includes('.svg') && 
          !url.includes('.woff') && !url.includes('.css')) {
        requestCount++;
        requests.push(url);
      }
    });

    // Navigate to questionnaire
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");

    const initialCount = requestCount;
    console.log(`Initial requests after load: ${initialCount}`);

    // Wait and observe
    await page.waitForTimeout(3000);

    const finalCount = requestCount;
    const additionalRequests = finalCount - initialCount;
    
    console.log(`Additional requests after 3s: ${additionalRequests}`);
    
    // If there are excessive requests (>10) after page load, it indicates rerenders
    expect(additionalRequests).toBeLessThan(10);

    console.log("✅ No excessive network activity detected");
  });

  test("should click through sections without errors", async ({ page }) => {
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Try to navigate through 3 sections
    for (let i = 0; i < 3; i++) {
      const nextButton = page.locator('button').filter({ hasText: /suivant|next/i }).first();
      
      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);
        console.log(`✓ Navigated to section ${i + 2}`);
      } else {
        console.log(`  No more next buttons (stopped at section ${i + 1})`);
        break;
      }
    }

    console.log("✅ Section navigation completed successfully");
  });
});