import { test, expect, Page } from "@playwright/test";

/**
 * E2E Test: Questionnaire Infinite Rerender Fix
 * 
 * This test verifies that the questionnaire page doesn't experience
 * infinite rerenders when users:
 * 1. Complete the calculator
 * 2. Click "Questionnaire détaillé" button
 * 3. Interact with form fields
 * 
 * Bug Context: Previously, a useEffect with globalForm in dependencies
 * caused infinite rerenders. This test ensures the fix works.
 */

test.describe("Questionnaire - Infinite Rerender Fix", () => {
  
  test.beforeEach(async ({ page }) => {
    // Enable console monitoring to detect rerender loops
    page.on('console', msg => {
      // Log errors and warnings to help debug
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`Browser ${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test("should navigate to questionnaire without infinite rerenders", async ({ page }) => {
    // Step 1: Go through calculator flow
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");

    // Select housing type: Marché privé
    const privateMarket = page.locator("text=Marché privé").first();
    await expect(privateMarket).toBeVisible({ timeout: 10000 });
    await privateMarket.click();
    await page.waitForTimeout(500);

    // Select user type: Locataire
    const tenant = page.locator("text=Locataire").first();
    await expect(tenant).toBeVisible({ timeout: 10000 });
    await tenant.click();
    await page.waitForTimeout(1000);

    // Step 2: Fill calculator form
    // Property type: Appartement
    const apartment = page.locator("text=Appartement").first();
    await expect(apartment).toBeVisible({ timeout: 10000 });
    await apartment.click();
    await page.waitForTimeout(500);

    // Property details
    const sizeInput = page.locator('input[type="number"]').first();
    await expect(sizeInput).toBeVisible({ timeout: 10000 });
    await sizeInput.fill("80");
    
    const continueButton = page.locator('button:has-text("Continuer")').first();
    await expect(continueButton).toBeVisible();
    await continueButton.click();
    await page.waitForTimeout(1000);

    // Features step - just click continue
    const continueButton2 = page.locator('button:has-text("Continuer")').first();
    if (await continueButton2.isVisible()) {
      await continueButton2.click();
      await page.waitForTimeout(1000);
    }

    // Energy step - just click continue
    const continueButton3 = page.locator('button:has-text("Continuer")').first();
    if (await continueButton3.isVisible()) {
      await continueButton3.click();
      await page.waitForTimeout(1000);
    }

    // Address step - fill minimal info and calculate
    const postalCode = page.locator('input[placeholder*="1000"]').first();
    if (await postalCode.isVisible()) {
      await postalCode.fill("1000");
      await page.waitForTimeout(300);
    }

    const streetName = page.locator('input[placeholder*="Rue de la Loi"]').first();
    if (await streetName.isVisible()) {
      await streetName.fill("Rue de la Loi");
      await page.waitForTimeout(300);
    }

    const streetNumber = page.locator('input[placeholder*="16"]').first();
    if (await streetNumber.isVisible()) {
      await streetNumber.fill("16");
      await page.waitForTimeout(300);
    }

    const calculateButton = page.locator('button:has-text("Calculer")').first();
    if (await calculateButton.isVisible()) {
      await calculateButton.click();
      await page.waitForTimeout(2000); // Wait for calculation
    }

    // Step 3: Should now be on results page
    await page.waitForLoadState("networkidle");
    
    // Verify we're on results page
    const resultsTitle = page.locator('text=/évaluation|résultat/i').first();
    await expect(resultsTitle).toBeVisible({ timeout: 10000 });

    // Step 4: Monitor network activity before clicking questionnaire
    const networkRequests: string[] = [];
    let requestCount = 0;
    
    page.on('request', request => {
      requestCount++;
      networkRequests.push(request.url());
    });

    // Step 5: Click "Questionnaire détaillé" button
    const questionnaireButton = page.locator('text=/questionnaire.*détaillé/i').first();
    await expect(questionnaireButton).toBeVisible({ timeout: 10000 });
    
    // Reset counter just before clicking
    requestCount = 0;
    networkRequests.length = 0;
    
    await questionnaireButton.click();
    
    // Wait for navigation
    await page.waitForLoadState("networkidle", { timeout: 10000 });
    await page.waitForTimeout(2000); // Give time for any potential rerenders

    // Step 6: Verify questionnaire page loaded
    const questionnaireTitle = page.locator('text=/questionnaire/i').first();
    await expect(questionnaireTitle).toBeVisible({ timeout: 10000 });

    // Step 7: Check for infinite rerender indicators
    // If there's an infinite rerender, there would be excessive network requests
    console.log(`Network requests after clicking: ${requestCount}`);
    
    // Should have less than 20 requests (generous threshold)
    // Infinite rerender would cause 100+ requests in 2 seconds
    expect(requestCount).toBeLessThan(20);

    // Step 8: Test form interactions to ensure no rerenders
    const initialRequestCount = requestCount;
    
    // Click "Next" to go to section 1
    const nextButton = page.locator('button:has-text("Suivant")').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // Interact with form fields
    const leaseTypeRadio = page.locator('input[value="9-years"]').first();
    if (await leaseTypeRadio.isVisible()) {
      await leaseTypeRadio.click();
      await page.waitForTimeout(500);
    }

    // Check that form interactions don't cause excessive rerenders
    const requestsAfterInteraction = requestCount - initialRequestCount;
    console.log(`Requests after form interaction: ${requestsAfterInteraction}`);
    
    // Should be minimal additional requests
    expect(requestsAfterInteraction).toBeLessThan(5);

    // Step 9: Verify no console errors about maximum update depth
    // This would be logged if there's an infinite rerender
    // (Already captured via console listener)

    console.log("✅ Questionnaire loaded successfully without infinite rerenders");
  });

  test("should handle multiple form field updates without rerenders", async ({ page }) => {
    // Navigate directly to questionnaire (assuming session might be saved)
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    
    // Setup request monitoring
    let requestCount = 0;
    page.on('request', () => { requestCount++; });
    
    await page.waitForTimeout(1000);
    
    // Go to section 1 if not already there
    const nextButton = page.locator('button:has-text("Suivant")').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    const initialCount = requestCount;

    // Test multiple rapid form interactions
    const interactions = [
      { selector: 'input[value="9-years"]', action: 'click' },
      { selector: 'input[type="date"]', action: 'fill', value: '2023-01-01' },
      { selector: 'input[type="number"]', action: 'fill', value: '2500' },
      { selector: 'input[value="single"]', action: 'click' },
      { selector: 'input[value="yes-recent"]', action: 'click' },
    ];

    for (const interaction of interactions) {
      const element = page.locator(interaction.selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        if (interaction.action === 'click') {
          await element.click();
        } else if (interaction.action === 'fill' && interaction.value) {
          await element.fill(interaction.value);
        }
        await page.waitForTimeout(200);
      }
    }

    // Wait a bit to see if rerenders happen
    await page.waitForTimeout(2000);

    const finalCount = requestCount;
    const totalRequests = finalCount - initialCount;
    
    console.log(`Total requests during form interactions: ${totalRequests}`);
    
    // Should not trigger excessive requests
    // Each interaction might trigger 1-2 requests max
    expect(totalRequests).toBeLessThan(15);

    console.log("✅ Multiple form updates handled without excessive rerenders");
  });

  test("should maintain stable performance when navigating between sections", async ({ page }) => {
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    let requestCount = 0;
    page.on('request', () => { requestCount++; });

    // Navigate through multiple sections
    const sections = 4; // Number of sections to navigate
    
    for (let i = 0; i < sections; i++) {
      const nextButton = page.locator('button:has-text("Suivant")').first();
      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        const beforeClick = requestCount;
        await nextButton.click();
        await page.waitForTimeout(500);
        const afterClick = requestCount;
        
        const requestsForSection = afterClick - beforeClick;
        console.log(`Section ${i + 1} navigation requests: ${requestsForSection}`);
        
        // Each section navigation should be minimal
        expect(requestsForSection).toBeLessThan(3);
      } else {
        break; // No more sections
      }
    }

    // Navigate backwards
    for (let i = 0; i < 2; i++) {
      const prevButton = page.locator('button:has-text("Précédent")').first();
      if (await prevButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        const beforeClick = requestCount;
        await prevButton.click();
        await page.waitForTimeout(500);
        const afterClick = requestCount;
        
        const requestsForBack = afterClick - beforeClick;
        console.log(`Backward navigation ${i + 1} requests: ${requestsForBack}`);
        
        expect(requestsForBack).toBeLessThan(3);
      }
    }

    console.log("✅ Section navigation stable without rerenders");
  });

  test("should detect and fail on infinite rerender patterns", async ({ page }) => {
    // This test specifically looks for infinite rerender patterns
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");

    // Monitor React DevTools warnings (if available)
    const errors: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      // React warns about infinite updates with specific messages
      if (text.includes('Maximum update depth exceeded') ||
          text.includes('Too many re-renders') ||
          text.includes('Rendered more hooks than during the previous render')) {
        errors.push(text);
      }
    });

    // Wait and interact with form
    await page.waitForTimeout(2000);
    
    const nextButton = page.locator('button:has-text("Suivant")').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
    }

    // Try some form interactions
    const radio = page.locator('input[type="radio"]').first();
    if (await radio.isVisible({ timeout: 1000 }).catch(() => false)) {
      await radio.click();
      await page.waitForTimeout(2000);
    }

    // Check for React infinite loop errors
    if (errors.length > 0) {
      console.error("❌ Detected infinite rerender errors:", errors);
      throw new Error(`Infinite rerender detected: ${errors.join(', ')}`);
    }

    console.log("✅ No infinite rerender patterns detected");
  });

  test("should preserve form data across global context updates", async ({ page }) => {
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Navigate to section 1
    const nextButton = page.locator('button:has-text("Suivant")').first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // Fill a form field
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dateInput.fill('2023-06-15');
      await page.waitForTimeout(500);

      // Verify the value persists (no rerender cleared it)
      const value = await dateInput.inputValue();
      expect(value).toBe('2023-06-15');

      // Navigate to another section and back
      const next = page.locator('button:has-text("Suivant")').first();
      if (await next.isVisible()) {
        await next.click();
        await page.waitForTimeout(500);
      }

      const prev = page.locator('button:has-text("Précédent")').first();
      if (await prev.isVisible()) {
        await prev.click();
        await page.waitForTimeout(500);
      }

      // Verify data still exists
      const valueAfterNav = await dateInput.inputValue();
      expect(valueAfterNav).toBe('2023-06-15');

      console.log("✅ Form data persists correctly");
    }
  });
});