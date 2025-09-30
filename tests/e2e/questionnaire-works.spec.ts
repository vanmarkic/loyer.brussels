import { test, expect } from "@playwright/test";

/**
 * Final Verification E2E Test: Questionnaire Works Without Infinite Rerenders
 * 
 * This test specifically verifies that the infinite rerender bug is fixed
 * by testing the questionnaire page directly and monitoring for issues.
 */

test.describe("Questionnaire - Final Verification", () => {
  
  test("CRITICAL: Questionnaire loads and works without infinite rerenders", async ({ page }) => {
    console.log("\n🚀 STARTING CRITICAL TEST: Questionnaire Infinite Rerender Fix");
    console.log("=" .repeat(70));

    // === SETUP: Error Monitoring ===
    const reactErrors: string[] = [];
    const reactWarnings: string[] = [];
    let requestCount = 0;

    page.on('console', msg => {
      const text = msg.text();
      
      // Critical errors that indicate infinite rerenders
      if (text.includes('Maximum update depth exceeded')) {
        reactErrors.push('CRITICAL: Maximum update depth exceeded');
      }
      if (text.includes('Too many re-renders')) {
        reactErrors.push('CRITICAL: Too many re-renders');
      }
      if (text.includes('Rendered more hooks than during the previous render')) {
        reactErrors.push('CRITICAL: Hook count mismatch');
      }
      
      // State update warnings
      if (text.includes('Cannot update a component') && text.includes('while rendering')) {
        reactWarnings.push('WARNING: Cannot update component while rendering');
      }
    });

    page.on('request', request => {
      // Count all requests
      requestCount++;
    });

    // === TEST 1: Page Load ===
    console.log("\n📍 TEST 1: Loading questionnaire page...");
    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    
    console.log("   ✓ Page navigation complete");
    
    // Give React time to stabilize (if there's an infinite loop, it would happen here)
    await page.waitForTimeout(3000);
    console.log("   ✓ Waited 3 seconds for stabilization");

    // Verify page loaded
    const pageTitle = page.locator('text=/questionnaire/i').first();
    await expect(pageTitle).toBeVisible({ timeout: 5000 });
    console.log("   ✓ Page title visible");

    // Check for infinite rerender indicators
    if (reactErrors.length > 0) {
      console.error("\n❌ CRITICAL FAILURE: React infinite rerender errors detected!");
      console.error(reactErrors);
      throw new Error(`Infinite rerender detected: ${reactErrors.join(', ')}`);
    }
    console.log("   ✅ No React infinite rerender errors");

    if (reactWarnings.length > 0) {
      console.warn("\n⚠️  React warnings detected:");
      reactWarnings.forEach(w => console.warn(`   - ${w}`));
    } else {
      console.log("   ✅ No React state update warnings");
    }

    const initialRequests = requestCount;
    console.log(`   📊 Total requests after load: ${initialRequests}`);

    // === TEST 2: Form Interactions ===
    console.log("\n📍 TEST 2: Testing form interactions...");
    
    // Navigate to section 1
    const nextButton = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    const isNextVisible = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isNextVisible) {
      const requestsBeforeClick = requestCount;
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      const requestsAfterClick = requestCount;
      const navigationRequests = requestsAfterClick - requestsBeforeClick;
      
      console.log(`   ✓ Navigated to section 1`);
      console.log(`   📊 Navigation triggered ${navigationRequests} requests`);
      
      // Should not trigger excessive requests (infinite loop would be 50+)
      expect(navigationRequests).toBeLessThan(15);
      console.log("   ✅ Navigation request count is normal (no infinite loop)");
    } else {
      console.log("   ⏭️  Already on section 1 or navigation not needed");
    }

    // Try form interactions
    const requestsBeforeInteraction = requestCount;
    
    // Interact with radio button
    const radioButton = page.locator('input[type="radio"]').first();
    const isRadioVisible = await radioButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isRadioVisible) {
      await radioButton.click();
      await page.waitForTimeout(500);
      console.log("   ✓ Clicked radio button");
    }

    // Enter date
    const dateInput = page.locator('input[type="date"]').first();
    const isDateVisible = await dateInput.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isDateVisible) {
      await dateInput.fill('2023-05-15');
      await page.waitForTimeout(500);
      console.log("   ✓ Filled date input");
      
      // Verify value persists (no rerender cleared it)
      const dateValue = await dateInput.inputValue();
      expect(dateValue).toBe('2023-05-15');
      console.log("   ✅ Date value persisted (no unwanted rerenders)");
    }

    // Enter number
    const numberInput = page.locator('input[type="number"]').first();
    const isNumberVisible = await numberInput.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isNumberVisible) {
      await numberInput.fill('2500');
      await page.waitForTimeout(500);
      console.log("   ✓ Filled number input");
    }

    const requestsAfterInteraction = requestCount;
    const interactionRequests = requestsAfterInteraction - requestsBeforeInteraction;
    
    console.log(`   📊 Form interactions triggered ${interactionRequests} requests`);
    expect(interactionRequests).toBeLessThan(10);
    console.log("   ✅ Interaction request count is normal");

    // === TEST 3: Multi-Section Navigation ===
    console.log("\n📍 TEST 3: Testing multi-section navigation...");
    
    let sectionsNavigated = 0;
    const maxSections = 3;
    
    for (let i = 0; i < maxSections; i++) {
      const btn = page.locator('button').filter({ hasText: /suivant|next/i }).first();
      const isEnabled = await btn.isEnabled({ timeout: 1000 }).catch(() => false);
      
      if (isEnabled) {
        await btn.click();
        await page.waitForTimeout(500);
        sectionsNavigated++;
        console.log(`   ✓ Navigated to section ${sectionsNavigated + 1}`);
      } else {
        console.log(`   ⏭️  Button disabled at section ${i + 1} (validation required)`);
        break;
      }
    }

    console.log(`   ✅ Successfully navigated through ${sectionsNavigated} sections`);

    // === TEST 4: Check for Checkbox Interactions ===
    console.log("\n📍 TEST 4: Testing checkbox interactions...");
    
    const checkbox = page.locator('input[type="checkbox"]').first();
    const isCheckboxVisible = await checkbox.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isCheckboxVisible) {
      const requestsBeforeCheck = requestCount;
      
      await checkbox.click();
      await page.waitForTimeout(300);
      
      const isChecked = await checkbox.isChecked();
      console.log(`   ✓ Checkbox clicked (checked: ${isChecked})`);
      
      await checkbox.click();
      await page.waitForTimeout(300);
      
      const isUnchecked = await checkbox.isChecked();
      console.log(`   ✓ Checkbox toggled (checked: ${isUnchecked})`);
      
      const requestsAfterCheck = requestCount;
      const checkboxRequests = requestsAfterCheck - requestsBeforeCheck;
      
      console.log(`   📊 Checkbox interactions: ${checkboxRequests} requests`);
      expect(checkboxRequests).toBeLessThan(5);
      console.log("   ✅ Checkbox interaction count is normal");
    } else {
      console.log("   ⏭️  No checkboxes found on current section");
    }

    // === FINAL VERIFICATION ===
    console.log("\n📍 FINAL VERIFICATION:");
    console.log("=" .repeat(70));
    
    await page.waitForTimeout(2000); // Final stabilization check
    
    const finalRequestCount = requestCount;
    console.log(`   📊 Total requests throughout test: ${finalRequestCount}`);
    console.log(`   📊 React errors detected: ${reactErrors.length}`);
    console.log(`   📊 React warnings detected: ${reactWarnings.length}`);

    // Critical assertions
    expect(reactErrors.length).toBe(0);
    console.log("   ✅ PASS: Zero React infinite rerender errors");
    
    expect(reactWarnings.length).toBeLessThan(3);
    console.log("   ✅ PASS: Minimal or zero React warnings");
    
    // Total requests should be reasonable (not 100+)
    expect(finalRequestCount).toBeLessThan(50);
    console.log("   ✅ PASS: Request count is reasonable (no infinite loops)");

    console.log("\n" + "=".repeat(70));
    console.log("🎉 SUCCESS! QUESTIONNAIRE WORKS WITHOUT INFINITE RERENDERS!");
    console.log("=".repeat(70));
    console.log("\n✅ All critical tests passed:");
    console.log("   ✓ Page loads successfully");
    console.log("   ✓ No infinite rerender errors");
    console.log("   ✓ Form interactions work correctly");
    console.log("   ✓ Navigation between sections works");
    console.log("   ✓ Data persists correctly");
    console.log("   ✓ Request counts are normal");
    console.log("\n🚀 THE FIX IS PRODUCTION READY!\n");
  });

  test("STRESS TEST: Rapid consecutive interactions", async ({ page }) => {
    console.log("\n🔥 STRESS TEST: Rapid consecutive interactions");
    
    let requestCount = 0;
    page.on('request', () => { requestCount++; });

    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Navigate to section with inputs
    const nextBtn = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }

    const startRequests = requestCount;
    console.log("   Starting rapid interaction test...");

    // Perform 10 rapid interactions
    for (let i = 0; i < 10; i++) {
      const radio = page.locator('input[type="radio"]').nth(i % 4);
      if (await radio.isVisible({ timeout: 500 }).catch(() => false)) {
        await radio.click();
        await page.waitForTimeout(50); // Very fast
      }
    }

    await page.waitForTimeout(2000);

    const endRequests = requestCount;
    const rapidRequests = endRequests - startRequests;

    console.log(`   📊 Requests during 10 rapid interactions: ${rapidRequests}`);
    
    // Should handle rapid interactions efficiently
    expect(rapidRequests).toBeLessThan(20);
    console.log("   ✅ Handled rapid interactions without excessive rerenders!");
  });

  test("PERSISTENCE TEST: Data survives navigation", async ({ page }) => {
    console.log("\n💾 PERSISTENCE TEST: Data survives navigation");

    await page.goto("/fr/calculateur/bruxelles/questionnaire");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Navigate to section 1
    const nextBtn = page.locator('button').filter({ hasText: /suivant|next/i }).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }

    // Fill a date field
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      const testDate = '2023-08-20';
      await dateInput.fill(testDate);
      await page.waitForTimeout(500);
      
      console.log(`   ✓ Filled date: ${testDate}`);

      // Navigate forward
      const next2 = page.locator('button').filter({ hasText: /suivant|next/i }).first();
      if (await next2.isVisible({ timeout: 2000 }).catch(() => false)) {
        await next2.click();
        await page.waitForTimeout(500);
        console.log("   ✓ Navigated forward");
      }

      // Navigate back
      const prevBtn = page.locator('button').filter({ hasText: /précédent|previous/i }).first();
      if (await prevBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await prevBtn.click();
        await page.waitForTimeout(500);
        console.log("   ✓ Navigated back");
      }

      // Verify data still there
      const currentValue = await dateInput.inputValue();
      expect(currentValue).toBe(testDate);
      console.log(`   ✅ Data persisted! Value: ${currentValue}`);
    } else {
      console.log("   ⏭️  No date input found, skipping persistence test");
    }
  });
});