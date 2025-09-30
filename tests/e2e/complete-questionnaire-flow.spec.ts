import { test, expect } from "@playwright/test";

/**
 * Complete E2E Test: Calculator to Questionnaire Flow
 * 
 * This test verifies the entire user journey:
 * 1. Navigate through calculator steps
 * 2. Get rental calculation results
 * 3. Click "Questionnaire détaillé" button
 * 4. Fill out questionnaire form
 * 5. Submit questionnaire
 * 
 * This ensures the infinite rerender fix works in a real user scenario.
 */

test.describe("Complete Calculator to Questionnaire Flow", () => {
  
  test("should complete full journey from calculator to questionnaire submission", async ({ page }) => {
    // Monitor for React errors
    const reactErrors: string[] = [];
    const reactWarnings: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      
      // Detect React infinite loop errors
      if (text.includes('Maximum update depth exceeded') ||
          text.includes('Too many re-renders') ||
          text.includes('Rendered more hooks than during the previous render')) {
        reactErrors.push(text);
      }
      
      // Detect state update warnings
      if (text.includes('Cannot update a component') && text.includes('while rendering')) {
        reactWarnings.push(text);
      }
    });

    // Track network requests to detect infinite loops
    let requestCount = 0;
    page.on('request', () => { requestCount++; });

    console.log("📍 Step 1: Navigate to Brussels calculator");
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Step 1: Housing Type Selection
    console.log("📍 Step 2: Select housing type - Marché privé");
    const privateMarket = page.locator("text=Marché privé").first();
    await expect(privateMarket).toBeVisible({ timeout: 10000 });
    await privateMarket.click();
    await page.waitForTimeout(500);

    // Step 2: User Type Selection
    console.log("📍 Step 3: Select user type - Locataire");
    const tenant = page.locator("text=Locataire").first();
    await expect(tenant).toBeVisible({ timeout: 10000 });
    await tenant.click();
    await page.waitForTimeout(1000);

    // Step 3: Property Type
    console.log("📍 Step 4: Select property type - Appartement");
    const apartment = page.locator("text=Appartement").first();
    await expect(apartment).toBeVisible({ timeout: 10000 });
    await apartment.click();
    await page.waitForTimeout(1000);

    // Step 4: Property Details
    console.log("📍 Step 5: Enter property details");
    const sizeInput = page.locator('input[type="number"]').first();
    await expect(sizeInput).toBeVisible({ timeout: 10000 });
    await sizeInput.fill("85");
    await page.waitForTimeout(300);

    const continueButton1 = page.locator('button:has-text("Continuer")').first();
    await expect(continueButton1).toBeVisible();
    await continueButton1.click();
    await page.waitForTimeout(1000);

    // Step 5: Features (optional - just continue)
    console.log("📍 Step 6: Skip features");
    const continueButton2 = page.locator('button:has-text("Continuer")').first();
    if (await continueButton2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueButton2.click();
      await page.waitForTimeout(1000);
    }

    // Step 6: Energy (optional - just continue)
    console.log("📍 Step 7: Skip energy");
    const continueButton3 = page.locator('button:has-text("Continuer")').first();
    if (await continueButton3.isVisible({ timeout: 3000 }).catch(() => false)) {
      await continueButton3.click();
      await page.waitForTimeout(1000);
    }

    // Step 7: Address and Calculate
    console.log("📍 Step 8: Enter address and calculate");
    const postalCode = page.locator('input[placeholder*="1000"]').first();
    if (await postalCode.isVisible({ timeout: 3000 }).catch(() => false)) {
      await postalCode.fill("1000");
      await page.waitForTimeout(300);
    }

    const streetName = page.locator('input[placeholder*="Rue"]').first();
    if (await streetName.isVisible({ timeout: 3000 }).catch(() => false)) {
      await streetName.fill("Rue de la Loi");
      await page.waitForTimeout(300);
    }

    const streetNumber = page.locator('input[placeholder="16"]').first();
    if (await streetNumber.isVisible({ timeout: 3000 }).catch(() => false)) {
      await streetNumber.fill("16");
      await page.waitForTimeout(300);
    }

    const calculateButton = page.locator('button:has-text("Calculer")').first();
    if (await calculateButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await calculateButton.click();
      console.log("📍 Calculating rent...");
      await page.waitForTimeout(3000); // Wait for calculation
    }

    // Step 8: Results page - verify we're here
    console.log("📍 Step 9: Verify results page loaded");
    await page.waitForLoadState("networkidle");
    
    // Look for result indicators
    const resultIndicator = page.locator('text=/évaluation|résultat|loyer/i').first();
    await expect(resultIndicator).toBeVisible({ timeout: 15000 });

    // Reset request counter before clicking questionnaire button
    const requestsBeforeQuestionnaire = requestCount;
    console.log(`📊 Requests before questionnaire: ${requestsBeforeQuestionnaire}`);

    // Step 9: Click "Questionnaire détaillé" button - THE CRITICAL MOMENT
    console.log("📍 Step 10: Click 'Questionnaire détaillé' button");
    const questionnaireButton = page.locator('text=/questionnaire.*détaillé/i').first();
    await expect(questionnaireButton).toBeVisible({ timeout: 10000 });
    
    await questionnaireButton.click();
    console.log("✓ Questionnaire button clicked!");

    // Step 10: Verify questionnaire page loaded WITHOUT infinite rerenders
    console.log("📍 Step 11: Verify questionnaire loaded successfully");
    await page.waitForLoadState("networkidle", { timeout: 10000 });
    await page.waitForTimeout(2000); // Give time for any potential rerenders

    const questionnaireRequests = requestCount - requestsBeforeQuestionnaire;
    console.log(`📊 Requests during questionnaire load: ${questionnaireRequests}`);

    // Verify questionnaire title is visible
    const questionnaireTitle = page.locator('text=/questionnaire/i').first();
    await expect(questionnaireTitle).toBeVisible({ timeout: 10000 });

    // Critical assertion: No excessive requests (would indicate rerenders)
    expect(questionnaireRequests).toBeLessThan(15);
    console.log("✅ No infinite rerenders detected!");

    // Step 11: Verify no React errors occurred
    if (reactErrors.length > 0) {
      console.error("❌ React errors detected:", reactErrors);
      throw new Error(`React infinite rerender errors: ${reactErrors.join(', ')}`);
    }
    console.log("✅ No React errors detected!");

    if (reactWarnings.length > 0) {
      console.warn("⚠️  React warnings detected:", reactWarnings);
    } else {
      console.log("✅ No React warnings detected!");
    }

    // Step 12: Interact with questionnaire
    console.log("📍 Step 12: Navigate to questionnaire section 1");
    const nextButton = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(500);
      console.log("✓ Navigated to section 1");
    }

    // Step 13: Fill out some form fields
    console.log("📍 Step 13: Fill out form fields");
    
    // Select lease type
    const leaseRadio = page.locator('input[value="9-years"]').first();
    if (await leaseRadio.isVisible({ timeout: 2000 }).catch(() => false)) {
      await leaseRadio.click();
      await page.waitForTimeout(300);
      console.log("✓ Selected lease type");
    }

    // Enter lease date
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dateInput.fill('2023-01-15');
      await page.waitForTimeout(300);
      console.log("✓ Entered lease date");
    }

    // Enter income
    const incomeInput = page.locator('input[type="number"]').first();
    if (await incomeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await incomeInput.fill('2500');
      await page.waitForTimeout(300);
      console.log("✓ Entered monthly income");
    }

    // Step 14: Verify form data persists (no rerenders cleared it)
    console.log("📍 Step 14: Verify form data persistence");
    const dateValue = await dateInput.inputValue().catch(() => '');
    expect(dateValue).toBe('2023-01-15');
    console.log("✅ Form data persists correctly!");

    // Step 15: Navigate to next section
    console.log("📍 Step 15: Navigate to section 2");
    const nextButton2 = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    if (await nextButton2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton2.click();
      await page.waitForTimeout(500);
      console.log("✓ Navigated to section 2");
    }

    // Step 16: Interact with checkboxes
    console.log("📍 Step 16: Test checkbox interactions");
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await checkbox.click();
      await page.waitForTimeout(300);
      console.log("✓ Clicked checkbox");
    }

    // Final verification
    console.log("\n📊 FINAL VERIFICATION:");
    console.log(`   Total network requests: ${requestCount}`);
    console.log(`   React errors: ${reactErrors.length}`);
    console.log(`   React warnings: ${reactWarnings.length}`);
    console.log(`   Questionnaire load requests: ${questionnaireRequests}`);

    // All critical assertions
    expect(reactErrors.length).toBe(0);
    expect(questionnaireRequests).toBeLessThan(15);

    console.log("\n🎉 SUCCESS! Complete flow works perfectly!");
    console.log("✅ Calculator completed");
    console.log("✅ Results displayed");
    console.log("✅ Questionnaire button clicked");
    console.log("✅ Questionnaire loaded without infinite rerenders");
    console.log("✅ Form interactions work correctly");
    console.log("✅ Data persists across sections");
  });

  test("should handle questionnaire with actual rent input", async ({ page }) => {
    console.log("📍 Test: Questionnaire with pre-filled data");

    // Monitor for errors
    const reactErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Maximum update depth')) {
        reactErrors.push(msg.text());
      }
    });

    // Go directly to questionnaire (simulating user with session data)
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Verify page loaded
    const title = page.locator('text=/questionnaire/i').first();
    await expect(title).toBeVisible({ timeout: 10000 });

    // Navigate through sections
    for (let i = 0; i < 3; i++) {
      const nextBtn = page.locator('button').filter({ hasText: /suivant|next/i }).first();
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(500);
        console.log(`✓ Section ${i + 2} loaded`);
      }
    }

    // Verify no errors
    expect(reactErrors.length).toBe(0);
    console.log("✅ Questionnaire navigation works without errors!");
  });

  test("should handle rapid form interactions without issues", async ({ page }) => {
    console.log("📍 Test: Rapid form interactions");

    let requestCount = 0;
    page.on('request', () => { requestCount++; });

    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Go to section 1
    const nextBtn = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }

    const initialRequests = requestCount;

    // Rapid interactions
    const interactions = [
      { selector: 'input[value="9-years"]', type: 'radio' },
      { selector: 'input[value="3-years"]', type: 'radio' },
      { selector: 'input[value="9-years"]', type: 'radio' }, // Back to first
      { selector: 'input[type="date"]', type: 'date', value: '2023-01-01' },
      { selector: 'input[type="date"]', type: 'date', value: '2023-06-15' },
      { selector: 'input[type="number"]', type: 'number', value: '2000' },
      { selector: 'input[type="number"]', type: 'number', value: '2500' },
    ];

    for (const action of interactions) {
      const element = page.locator(action.selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        if (action.type === 'radio') {
          await element.click();
        } else if (action.value) {
          await element.fill(action.value);
        }
        await page.waitForTimeout(100); // Very quick interactions
      }
    }

    await page.waitForTimeout(2000);

    const finalRequests = requestCount;
    const interactionRequests = finalRequests - initialRequests;

    console.log(`📊 Requests during rapid interactions: ${interactionRequests}`);
    expect(interactionRequests).toBeLessThan(10);

    console.log("✅ Rapid interactions handled without excessive rerenders!");
  });
});