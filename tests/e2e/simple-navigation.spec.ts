import { test, expect } from "@playwright/test";

/**
 * Simple Navigation Test
 * This test helps debug the navigation and element visibility issues
 */

test("should navigate to property details and find size input", async ({
  page,
}) => {
  console.log("📍 Starting simple navigation test");

  // Navigate directly to the main page first
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  console.log("✓ Loaded homepage");

  // Navigate to property type step
  await page.goto("/fr/calculateur/bruxelles/step/property-type");
  await page.waitForLoadState("networkidle");
  console.log("✓ Loaded property type step");

  // Take a screenshot to see what's on the page
  await page.screenshot({ path: "debug-property-type.png", fullPage: true });

  // Look for apartment option and click it
  const apartmentOption = page.locator("text=Appartement").first();

  if (await apartmentOption.isVisible()) {
    console.log("✓ Found apartment option");
    await apartmentOption.click();
    await page.waitForTimeout(1000);
    console.log("✓ Clicked apartment");
  } else {
    console.log("❌ Apartment option not found");
    // Try to find any clickable options
    const allOptions = await page.locator("button, [role=button]").all();
    console.log(`Found ${allOptions.length} clickable elements`);

    for (let i = 0; i < Math.min(allOptions.length, 5); i++) {
      const text = await allOptions[i].textContent();
      console.log(`  Option ${i}: "${text}"`);
    }
  }

  // Navigate to property details step
  await page.goto("/fr/calculateur/bruxelles/step/property-details");
  await page.waitForLoadState("networkidle");
  console.log("✓ Navigated to property details");

  // Take another screenshot
  await page.screenshot({ path: "debug-property-details.png", fullPage: true });

  // Look for the size input
  const sizeInput = page.locator("#size");
  const isVisible = await sizeInput.isVisible();
  console.log(`Size input visible: ${isVisible}`);

  if (!isVisible) {
    // Try alternative selectors
    const alternativeSelectors = [
      "input[type=number]",
      "[placeholder='75']",
      "#size",
      "input#size",
    ];

    for (const selector of alternativeSelectors) {
      const element = page.locator(selector);
      const visible = await element.isVisible().catch(() => false);
      console.log(`  Selector "${selector}": ${visible}`);
    }

    // Log page content for debugging
    const pageContent = await page.content();
    const hasForm = pageContent.includes("input");
    const hasSize = pageContent.includes("size");
    const hasM2 = pageContent.includes("m²");
    console.log(
      `Page content check - has input: ${hasForm}, has size: ${hasSize}, has m²: ${hasM2}`,
    );
  }

  // Try to find the plus/minus buttons
  const plusBtn = page.getByRole("button", {
    name: /augmenter la superficie/i,
  });
  const minusBtn = page.getByRole("button", {
    name: /diminuer la superficie/i,
  });

  const plusVisible = await plusBtn.isVisible().catch(() => false);
  const minusVisible = await minusBtn.isVisible().catch(() => false);

  console.log(`Plus button visible: ${plusVisible}`);
  console.log(`Minus button visible: ${minusVisible}`);

  // Look for any buttons on the page
  const allButtons = await page.locator("button").all();
  console.log(`Found ${allButtons.length} buttons on page`);

  for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
    const text = await allButtons[i].textContent();
    const ariaLabel = await allButtons[i].getAttribute("aria-label");
    console.log(`  Button ${i}: "${text}" (aria-label: "${ariaLabel}")`);
  }
});
