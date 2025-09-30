import { test, expect } from "@playwright/test";

/**
 * E2E Test: Property Size Hold-Repeat Functionality
 *
 * This test verifies that the size control on the property details step
 * correctly increments/decrements when the + and - buttons are held down,
 * using the useHoldRepeat hook with pointer events.
 */

// Helper function to navigate to property details step
async function navigateToPropertyDetailsStep(page: any) {
  // Navigate to property type step
  await page.goto("/fr/calculateur/bruxelles/step/property-type");
  await page.waitForLoadState("networkidle");

  // Select Appartement
  const apartment = page.locator("text=Appartement").first();
  await expect(apartment).toBeVisible({ timeout: 10000 });
  await apartment.click();
  await page.waitForTimeout(1000);

  // Navigate to property details step
  await page.goto("/fr/calculateur/bruxelles/step/property-details");
  await page.waitForLoadState("networkidle");

  // Verify we're on the property details step
  const sizeInput = page.locator("#size");
  await expect(sizeInput).toBeVisible({ timeout: 10000 });
}

test.describe("Property Size Hold-Repeat Functionality", () => {
  test("should increment size when + button is held down", async ({ page }) => {
    console.log("📍 Test: Hold + button to increment size");

    // Navigate to property details step
    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");

    // Set initial value
    await sizeInput.fill("10");
    await page.waitForTimeout(300);

    // Get initial size value
    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const startSize = await getSize();
    console.log(`   ✓ Initial size: ${startSize}`);

    // Find the + button using aria-label
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });
    await expect(plusBtn).toBeVisible();
    await expect(plusBtn).toBeEnabled();

    // Simulate hold on + button
    console.log("   📍 Holding + button for 600ms...");
    await plusBtn.dispatchEvent("pointerdown");
    await page.waitForTimeout(600);
    await plusBtn.dispatchEvent("pointerup");

    // Check final size
    const finalSize = await getSize();
    console.log(`   ✓ Final size: ${finalSize}`);

    // Assert size increased by at least 3 (tolerant threshold)
    expect(finalSize).toBeGreaterThanOrEqual(startSize + 3);
    console.log(
      `   ✅ Size increased by ${finalSize - startSize} (expected ≥3)`,
    );
  });

  test("should decrement size when - button is held down", async ({ page }) => {
    console.log("📍 Test: Hold - button to decrement size");

    // Navigate to property details step
    await navigateToPropertyDetailsStep(page);

    const sizeInput = page.locator("#size");

    // Set initial value (high enough to allow decrement)
    await sizeInput.fill("15");
    await page.waitForTimeout(300);

    // Get initial size value
    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const startSize = await getSize();
    console.log(`   ✓ Initial size: ${startSize}`);

    // Find the - button using aria-label
    const minusBtn = page.getByRole("button", {
      name: /diminuer la superficie/i,
    });
    await expect(minusBtn).toBeVisible();
    await expect(minusBtn).toBeEnabled();

    // Simulate hold on - button
    console.log("   📍 Holding - button for 600ms...");
    await minusBtn.dispatchEvent("pointerdown");
    await page.waitForTimeout(600);
    await minusBtn.dispatchEvent("pointerup");

    // Check final size
    const finalSize = await getSize();
    console.log(`   ✓ Final size: ${finalSize}`);

    // Assert size decreased by at least 3 (tolerant threshold)
    expect(finalSize).toBeLessThanOrEqual(startSize - 3);
    // Assert size never goes below 1 (minimum constraint)
    expect(finalSize).toBeGreaterThanOrEqual(1);
    console.log(
      `   ✅ Size decreased by ${startSize - finalSize} (expected ≥3, min=1)`,
    );
  });

  test("should respect minimum size constraint of 1", async ({ page }) => {
    console.log("📍 Test: Minimum size constraint");

    // Navigate to property details step
    await navigateToPropertyDetailsStep(page);

    // Verify we're on the property details step
    const sizeInput = page.locator("#size");
    await expect(sizeInput).toBeVisible({ timeout: 10000 });

    // Set initial value to 2 (close to minimum)
    await sizeInput.fill("2");
    await page.waitForTimeout(300);

    // Get initial size value
    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const startSize = await getSize();
    console.log(`   ✓ Initial size: ${startSize}`);

    // Find the - button using aria-label
    const minusBtn = page.getByRole("button", {
      name: /diminuer la superficie/i,
    });
    await expect(minusBtn).toBeVisible();
    await expect(minusBtn).toBeEnabled();

    // Simulate hold on - button (should stop at 1)
    console.log("   📍 Holding - button for 600ms (should stop at 1)...");
    await minusBtn.dispatchEvent("pointerdown");
    await page.waitForTimeout(600);
    await minusBtn.dispatchEvent("pointerup");

    // Check final size
    const finalSize = await getSize();
    console.log(`   ✓ Final size: ${finalSize}`);

    // Assert size is at minimum of 1
    expect(finalSize).toBe(1);
    console.log(`   ✅ Size correctly stopped at minimum value of 1`);
  });

  test("should handle rapid pointer events without issues", async ({
    page,
  }) => {
    console.log("📍 Test: Rapid pointer events");

    // Navigate to property details step
    await navigateToPropertyDetailsStep(page);

    // Verify we're on the property details step
    const sizeInput = page.locator("#size");
    await expect(sizeInput).toBeVisible({ timeout: 10000 });

    // Set initial value
    await sizeInput.fill("10");
    await page.waitForTimeout(300);

    // Get initial size value
    const getSize = async () => Number((await sizeInput.inputValue()) || "0");
    const startSize = await getSize();
    console.log(`   ✓ Initial size: ${startSize}`);

    // Find buttons
    const plusBtn = page.getByRole("button", {
      name: /augmenter la superficie/i,
    });
    const minusBtn = page.getByRole("button", {
      name: /diminuer la superficie/i,
    });

    // Test rapid pointer events
    console.log("   📍 Testing rapid pointer events...");

    // Rapid increment
    await plusBtn.dispatchEvent("pointerdown");
    await page.waitForTimeout(200);
    await plusBtn.dispatchEvent("pointerup");
    await page.waitForTimeout(100);

    // Rapid decrement
    await minusBtn.dispatchEvent("pointerdown");
    await page.waitForTimeout(200);
    await minusBtn.dispatchEvent("pointerup");
    await page.waitForTimeout(100);

    // Another rapid increment
    await plusBtn.dispatchEvent("pointerdown");
    await page.waitForTimeout(200);
    await plusBtn.dispatchEvent("pointerup");

    // Check final size
    const finalSize = await getSize();
    console.log(`   ✓ Final size: ${finalSize}`);

    // Should have some change (either up or down)
    expect(finalSize).not.toBe(startSize);
    console.log(`   ✅ Rapid pointer events handled correctly`);
  });
});
