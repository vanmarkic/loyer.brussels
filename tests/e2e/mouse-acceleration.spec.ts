import { test, expect } from "@playwright/test";

/**
 * E2E Test: Mouse Down Acceleration for Property Size
 *
 * This test specifically verifies mouse-down acceleration behavior
 * for the property size controls, testing the 3-phase acceleration:
 * Phase 1: 0-500ms at 150ms intervals
 * Phase 2: 500-1500ms at 100ms intervals
 * Phase 3: 1500ms+ at 50ms intervals
 */

// Helper function to navigate to property details step
async function navigateToPropertyDetailsStep(page: any) {
  console.log("   📍 Starting navigation to property details...");

  // Navigate directly to property details step
  await page.goto("/fr/calculateur/bruxelles/step/property-details");
  await page.waitForLoadState("networkidle");
  console.log("   ✓ Navigated to property details URL");

  // Wait for React components to render and state to sync
  // The step page has a useEffect that syncs currentStep with URL
  await page.waitForTimeout(2000);

  // Wait specifically for the PropertyDetailsStep to render by looking for its unique content
  // Since the component only renders when state.currentStep === 2, we need to wait for that sync

  try {
    // Wait for the size input to appear (indicates PropertyDetailsStep is rendered)
    await page.waitForSelector("#size", { timeout: 15000 });
    console.log("   ✓ Size input found via waitForSelector");
  } catch (error) {
    console.log("   ⚠ Size input not found, trying alternative approach...");

    // Log current page state for debugging
    const pageTitle = await page.title();
    const url = page.url();
    console.log(`   Debug: Page title="${pageTitle}", URL="${url}"`);

    // Check if we can find the step title that should be on property details
    const stepTitleSelectors = [
      'text="Détails du bien"',
      'text="sizeLabel"', // Translation key
      'text*="superficie"',
      '[data-testid="property-details-step"]',
    ];

    let foundStep = false;
    for (const selector of stepTitleSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        console.log(`   ✓ Found step content with selector: ${selector}`);
        foundStep = true;
        break;
      }
    }

    if (!foundStep) {
      // Try to trigger the step sync by reloading
      console.log("   🔄 Attempting page reload to trigger step sync...");
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000);

      // Try one more time
      await page.waitForSelector("#size", { timeout: 10000 });
    }
  }

  // Final verification
  const sizeInput = page.locator("#size");
  await expect(sizeInput).toBeVisible({ timeout: 5000 });
  console.log(
    "   ✓ PropertyDetailsStep successfully loaded with size input visible",
  );
}

test.describe("Mouse Down Acceleration Tests", () => {
  test("should increase sqm by more than 2 after 1s mouse hold", async ({ page }) => {
    await navigateToPropertyDetailsStep(page);
    const sizeInput = page.locator("#size");
    const plusBtn = page.getByRole("button", { name: /augmenter la superficie/i });
    await expect(sizeInput).toBeVisible({ timeout: 10000 });
    await expect(sizeInput).toBeEnabled({ timeout: 10000 });
    await page.waitForTimeout(200);
    const startValue = Number(await sizeInput.inputValue() || "0");
    await plusBtn.dispatchEvent("mousedown");
    await page.waitForTimeout(1000);
    await plusBtn.dispatchEvent("mouseup");
    const endValue = Number(await sizeInput.inputValue() || "0");
    expect(endValue - startValue).toBeGreaterThan(2);
    console.log(`   ✅ sqm increased from ${startValue} to ${endValue} after 1s hold`);
  });
  test.beforeEach(async ({ page }) => {
    // Enable slow motion for better observation (optional)
    // await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should demonstrate 3-phase acceleration with mouse events", async ({
    page,
  }) => {
    console.log(
      "📍 Test: 3-Phase Mouse Down Acceleration with UI Value Changes",
    );

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const m2Display = page.locator("text=m²").first(); // The m² unit display
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });

    // Set initial value and verify it's displayed
    await page.waitForTimeout(300);

    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const getDisplayedValue = async () => {
      const inputValue = await sizeInput.inputValue();
      console.log(`      UI shows: ${inputValue}m²`);
      return Number(inputValue || "0");
    };

    const startSize = await getDisplayedValue();
    console.log(`   ✓ Initial displayed size: ${startSize}m²`);

    // Verify the m² unit is visible
    await expect(m2Display).toBeVisible();

    // Test Phase 1: 0-500ms (should be ~3-4 increments at 150ms)
    console.log("   📍 Phase 1: Testing 0-500ms acceleration...");
    await plusBtn.dispatchEvent("mousedown");

    // Take snapshots during acceleration to verify UI updates
    await page.waitForTimeout(150);
    const snapshot1 = await getDisplayedValue();
    await page.waitForTimeout(150);
    const snapshot2 = await getDisplayedValue();
    await page.waitForTimeout(200); // Total 500ms

    const phase1Size = await getDisplayedValue();
    const phase1Increments = phase1Size - startSize;
    console.log(
      `   ✓ Phase 1 (500ms): ${phase1Increments} increments displayed`,
    );
    console.log(
      `      Snapshots: ${startSize} → ${snapshot1} → ${snapshot2} → ${phase1Size}m²`,
    );

    // Verify UI was actually updating during Phase 1
    expect(snapshot1).toBeGreaterThan(startSize);
    expect(snapshot2).toBeGreaterThan(snapshot1);
    expect(phase1Size).toBeGreaterThan(snapshot2);

    // Continue to Phase 2: 500-1500ms (should get faster)
    console.log("   📍 Phase 2: Testing 500-1500ms acceleration...");
    await page.waitForTimeout(500);
    const mid2 = await getDisplayedValue();
    await page.waitForTimeout(500); // Additional 1000ms = 1500ms total

    const phase2Size = await getDisplayedValue();
    const phase2Increments = phase2Size - phase1Size;
    console.log(
      `   ✓ Phase 2 (1000ms): ${phase2Increments} increments displayed`,
    );
    console.log(`      Mid-phase: ${phase1Size} → ${mid2} → ${phase2Size}m²`);

    // Continue to Phase 3: 1500ms+ (should be fastest)
    console.log("   📍 Phase 3: Testing 1500ms+ acceleration...");
    await page.waitForTimeout(250);
    const mid3 = await getDisplayedValue();
    await page.waitForTimeout(250); // Additional 500ms = 2000ms total

    const phase3Size = await getDisplayedValue();
    const phase3Increments = phase3Size - phase2Size;
    console.log(
      `   ✓ Phase 3 (500ms): ${phase3Increments} increments displayed`,
    );
    console.log(`      Fast phase: ${phase2Size} → ${mid3} → ${phase3Size}m²`);

    await plusBtn.dispatchEvent("mouseup");

    const finalSize = await getDisplayedValue();
    const totalIncrements = finalSize - startSize;
    console.log(`   ✓ Final displayed value: ${finalSize}m²`);
    console.log(`   ✓ Total increments displayed: ${totalIncrements}`);

    // Verify the input field actually shows the final value
    const inputFieldValue = await sizeInput.inputValue();
    expect(inputFieldValue).toBe(finalSize.toString());

    // Verify acceleration phases in UI
    // Phase 1 (500ms at 150ms): ~3-4 increments
    expect(phase1Increments).toBeGreaterThanOrEqual(3);
    expect(phase1Increments).toBeLessThanOrEqual(5);

    // Phase 2 should be faster than Phase 1 (more increments per time)
    const phase1Rate = phase1Increments / 500; // increments per ms
    const phase2Rate = phase2Increments / 1000; // increments per ms
    expect(phase2Rate).toBeGreaterThan(phase1Rate);

    // Phase 3 should be fastest (more increments per time)
    const phase3Rate = phase3Increments / 500; // increments per ms
    expect(phase3Rate).toBeGreaterThan(phase2Rate);

    // Total should exceed fixed-interval behavior
    expect(totalIncrements).toBeGreaterThan(20);

    console.log(`   ✅ 3-Phase acceleration verified in UI:`);
    console.log(
      `      Phase 1 rate: ${phase1Rate.toFixed(4)} inc/ms displayed`,
    );
    console.log(
      `      Phase 2 rate: ${phase2Rate.toFixed(4)} inc/ms displayed`,
    );
    console.log(
      `      Phase 3 rate: ${phase3Rate.toFixed(4)} inc/ms displayed`,
    );
    console.log(
      `      User sees: ${startSize}m² → ${finalSize}m² (${totalIncrements} total)`,
    );
  });

  test("should handle rapid mouse down/up sequences", async ({ page }) => {
    console.log("📍 Test: Rapid mouse down/up sequences");

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });

    await page.waitForTimeout(300);

    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const startSize = await getSize();

    // Rapid sequence of short holds
    for (let i = 0; i < 3; i++) {
      console.log(`   📍 Rapid sequence ${i + 1}/3`);
      await plusBtn.dispatchEvent("mousedown");
      await page.waitForTimeout(100); // Short hold
      await plusBtn.dispatchEvent("mouseup");
      await page.waitForTimeout(50); // Brief pause
    }

    const finalSize = await getSize();
    const totalIncrements = finalSize - startSize;
    console.log(
      `   ✓ Total increments from rapid sequence: ${totalIncrements}`,
    );

    // Should have at least 3 increments (one per sequence)
    expect(totalIncrements).toBeGreaterThanOrEqual(3);
    console.log(`   ✅ Rapid sequences handled correctly`);
  });

  test("should stop acceleration immediately on mouse up", async ({ page }) => {
    console.log("📍 Test: Immediate stop on mouse up");

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });

    await page.waitForTimeout(300);

    const getSize = async () => Number((await sizeInput.inputValue()) || "0");

    // Start accelerated increment
    await plusBtn.dispatchEvent("mousedown");
    await page.waitForTimeout(1800); // Get to Phase 3 (fast)

    const sizeBeforeStop = await getSize();
    console.log(`   ✓ Size before mouseup: ${sizeBeforeStop}`);

    // Stop the acceleration
    await plusBtn.dispatchEvent("mouseup");

    // Wait a bit and verify no more increments
    await page.waitForTimeout(200);
    const sizeAfterStop = await getSize();
    console.log(`   ✓ Size after mouseup: ${sizeAfterStop}`);

    // Should not have incremented after mouseup
    expect(sizeAfterStop).toBe(sizeBeforeStop);
    console.log(`   ✅ Acceleration stopped immediately on mouseup`);
  });

  test("should handle mouse leave during acceleration", async ({ page }) => {
    console.log("📍 Test: Mouse leave during acceleration");

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });

    await page.waitForTimeout(300);

    const getSize = async () => Number((await sizeInput.inputValue()) || "0");

    // Start accelerated increment
    await plusBtn.dispatchEvent("mousedown");
    await page.waitForTimeout(800); // Let it accelerate

    const sizeBeforeLeave = await getSize();
    console.log(`   ✓ Size before mouse leave: ${sizeBeforeLeave}`);

    // Simulate mouse leave
    await plusBtn.dispatchEvent("mouseleave");

    // Wait and verify it stopped
    await page.waitForTimeout(300);
    const sizeAfterLeave = await getSize();
    console.log(`   ✓ Size after mouse leave: ${sizeAfterLeave}`);

    // Should not have incremented after mouse leave
    expect(sizeAfterLeave).toBe(sizeBeforeLeave);
    console.log(`   ✅ Acceleration stopped on mouse leave`);
  });

  test("should demonstrate decrement acceleration with mouse events", async ({
    page,
  }) => {
    console.log("📍 Test: Mouse Down Decrement Acceleration");

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const minusBtn = page.getByRole("button", {
      name: /diminuer la superficie/i,
    });

    // Set high initial value for decrement testing
    await page.waitForTimeout(300);

    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const startSize = await getSize();
    console.log(`   ✓ Initial size: ${startSize}`);

    // Hold mouse down for 2000ms to test full acceleration
    console.log("   📍 Holding mouse down for 2000ms...");
    await minusBtn.dispatchEvent("mousedown");
    await page.waitForTimeout(2000);
    await minusBtn.dispatchEvent("mouseup");

    const finalSize = await getSize();
    const totalDecrements = startSize - finalSize;
    console.log(`   ✓ Final size: ${finalSize}`);
    console.log(`   ✓ Total decrements: ${totalDecrements}`);

    // Should have significant decrements due to acceleration
    expect(totalDecrements).toBeGreaterThan(20);

    // Should respect minimum constraint
    expect(finalSize).toBeGreaterThanOrEqual(1);

    console.log(
      `   ✅ Decrement acceleration verified: ${totalDecrements} decrements`,
    );
  });

  test("should maintain consistent acceleration across multiple holds", async ({
    page,
  }) => {
    console.log("📍 Test: Consistent acceleration across multiple holds");

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });

    await page.waitForTimeout(300);

    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const results = [];

    // Test 3 identical hold sequences
    for (let i = 0; i < 3; i++) {
      const startSize = await getSize();
      console.log(`   📍 Hold sequence ${i + 1}/3, starting at: ${startSize}`);

      await plusBtn.dispatchEvent("mousedown");
      await page.waitForTimeout(1000); // 1 second hold
      await plusBtn.dispatchEvent("mouseup");

      const endSize = await getSize();
      const increments = endSize - startSize;
      results.push(increments);

      console.log(`   ✓ Sequence ${i + 1}: ${increments} increments`);

      // Brief pause between sequences
      await page.waitForTimeout(200);
    }

    // Results should be reasonably consistent
    const avgIncrements = results.reduce((a, b) => a + b, 0) / results.length;
    const maxDeviation = Math.max(
      ...results.map((r) => Math.abs(r - avgIncrements)),
    );

    console.log(`   ✓ Average increments: ${avgIncrements.toFixed(1)}`);
    console.log(`   ✓ Max deviation: ${maxDeviation.toFixed(1)}`);

    // Deviation should be reasonable (within 20% of average)
    expect(maxDeviation).toBeLessThanOrEqual(avgIncrements * 0.2);

    console.log(`   ✅ Acceleration consistency verified`);
  });

  test("should strictly verify sqm increases at every interval during mouse hold", async ({ page }) => {
    console.log("📍 Test: Strict mouse hold increments");

    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");
    const plusBtn = page.getByRole("button", { name: /augmenter la superficie/i });

    // Set initial value
    await page.waitForTimeout(300);

    const getDisplayedValue = async () => Number(await sizeInput.inputValue() || "0");
    const startValue = await getDisplayedValue();
    console.log(`   ✓ Starting value: ${startValue}m²`);

    // Hold mouse and sample every 100ms for 1.5s
    await plusBtn.dispatchEvent("mousedown");
    let previousValue = startValue;
    let strictlyIncreasing = true;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(100);
      const currentValue = await getDisplayedValue();
      if (currentValue <= previousValue) {
        strictlyIncreasing = false;
        console.log(`   ❌ Value did not increase at interval ${i}: ${previousValue} → ${currentValue}`);
        break;
      }
      previousValue = currentValue;
    }
    await plusBtn.dispatchEvent("mouseup");

    // Final assertion
    expect(strictlyIncreasing).toBe(true);
    console.log("   ✅ Value increased at every interval during mouse hold");
  });
});
