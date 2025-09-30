import { test, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Comprehensive User Journey Screenshot Test Suite
 *
 * This test suite captures screenshots of all potential user journeys
 * across the loyer.brussels application for UX analysis and improvements.
 *
 * Journeys Covered:
 * 1. Homepage → Calculator Entry
 * 2. Region Selection Flow
 * 3. Tenant Calculator Journey (Complete)
 * 4. Landlord Journey
 * 5. Wuune Information Pages
 * 6. Campaign Pages
 * 7. Contact Form
 */

// Helper function to create screenshot directory
function ensureScreenshotDir(device: string) {
  const dir = path.join(process.cwd(), "test-results", "screenshots", device);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Helper function to take annotated screenshot
async function takeScreenshot(page: Page, name: string, device: string) {
  const dir = ensureScreenshotDir(device);
  const filepath = path.join(dir, `${name}.png`);
  await page.screenshot({
    path: filepath,
    fullPage: true,
    animations: "disabled",
  });
  console.log(`✓ Screenshot saved: ${name} (${device})`);
}

test.describe("Homepage & Navigation", () => {
  test("01-homepage-initial", async ({ page, browserName }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "01-homepage-initial", browserName);
  });

  test("02-homepage-mobile-menu", async ({ page, browserName }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Try to open mobile menu if visible
    const menuButton = page.getByRole("button", { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, "02-homepage-mobile-menu-open", browserName);
    }
  });

  test("03-language-switcher", async ({ page, browserName }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Capture each language variant
    await takeScreenshot(page, "03a-homepage-french", browserName);

    await page.goto("/nl");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "03b-homepage-dutch", browserName);

    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "03c-homepage-english", browserName);
  });
});

test.describe("Calculator Entry Flow", () => {
  test("04-region-selection", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "04-region-selection-page", browserName);
  });

  test("05-region-info-brussels", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur");
    await page.waitForLoadState("networkidle");

    // Click Brussels region
    await page.click("text=Bruxelles");
    await page.waitForTimeout(500);
    await takeScreenshot(page, "05-brussels-region-info", browserName);
  });

  test("06-region-info-wallonie", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur");
    await page.waitForLoadState("networkidle");

    // Click Wallonie region
    await page.click("text=Wallonie");
    await page.waitForTimeout(500);
    await takeScreenshot(page, "06-wallonie-region-info", browserName);
  });

  test("07-region-info-flandres", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur");
    await page.waitForLoadState("networkidle");

    // Click Flandres region
    await page.click("text=Flandres");
    await page.waitForTimeout(500);
    await takeScreenshot(page, "07-flandres-region-info", browserName);
  });
});

test.describe("Tenant Calculator Journey - Complete Flow", () => {
  test("08-housing-type-filter", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "08-housing-type-filter", browserName);
  });

  test("09-user-type-selection", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");

    // Select private market housing
    const privateMarket = page.locator("text=Marché privé").first();
    if (await privateMarket.isVisible()) {
      await privateMarket.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, "09-user-type-consent-screen", browserName);
    }
  });

  test("10-calculator-step1-property-type", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");

    // Navigate through filters to reach calculator
    try {
      const privateMarket = page.locator("text=Marché privé").first();
      if (await privateMarket.isVisible()) {
        await privateMarket.click();
        await page.waitForTimeout(500);
      }

      const locataire = page.locator("text=Locataire").first();
      if (await locataire.isVisible()) {
        await locataire.click();
        await page.waitForTimeout(1000);
        await takeScreenshot(page, "10-calculator-step1-property-type", browserName);
      }
    } catch (error) {
      console.log("Could not navigate to property type step:", error);
    }
  });

  test("11-calculator-step2-property-details", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");

    try {
      // Navigate through to step 2
      await page.click("text=Marché privé");
      await page.waitForTimeout(500);
      await page.click("text=Locataire");
      await page.waitForTimeout(1000);

      // Select apartment to proceed to step 2
      const apartment = page.locator("text=Appartement").first();
      if (await apartment.isVisible()) {
        await apartment.click();
        await page.waitForTimeout(1000);
        await takeScreenshot(page, "11-calculator-step2-property-details", browserName);
      }
    } catch (error) {
      console.log("Could not reach property details step:", error);
    }
  });
});

test.describe("Landlord Journey", () => {
  test("16-landlord-welcome-page", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles/bailleur");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "16-landlord-welcome-page", browserName);
  });

  test("17-landlord-tools-section", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles/bailleur");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "17-landlord-tools-section", browserName);
  });

  test("18-landlord-diagnostic-result", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles/bailleur");
    await page.waitForLoadState("networkidle");

    // Click diagnostic button if exists
    const diagnosticButton = page.locator('button:has-text("diagnostic")').first();
    if (await diagnosticButton.isVisible()) {
      await diagnosticButton.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, "18-landlord-diagnostic-result", browserName);
    }
  });
});

test.describe("Wuune Information Pages", () => {
  test("19-wuune-about-page", async ({ page, browserName }) => {
    await page.goto("/fr/wuune");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "19-wuune-about-hero", browserName);

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "19-wuune-about-mission", browserName);

    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "19-wuune-about-values", browserName);
  });

  test("20-campaign-page", async ({ page, browserName }) => {
    await page.goto("/fr/campagne");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "20-campaign-hero", browserName);

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "20-campaign-problems", browserName);

    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "20-campaign-objectives", browserName);
  });
});

test.describe("Contact & Conversion Flows", () => {
  test("21-contact-page-initial", async ({ page, browserName }) => {
    await page.goto("/fr/contact");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "21-contact-page-hero", browserName);
  });

  test("22-contact-form", async ({ page, browserName }) => {
    await page.goto("/fr/contact");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "22-contact-form-section", browserName);
  });

  test("23-contact-join-wuune-prefilled", async ({ page, browserName }) => {
    await page.goto("/fr/contact?join=true&situation=abusive");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await takeScreenshot(page, "23-contact-wuune-join-prefilled", browserName);
  });

  test("24-contact-form-validation", async ({ page, browserName }) => {
    await page.goto("/fr/contact");
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, "24-contact-form-validation-errors", browserName);
    }
  });
});

test.describe("Responsive Design Comparison", () => {
  test("25-responsive-homepage", async ({ page, browserName }) => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/fr");
      await page.waitForLoadState("networkidle");
      await takeScreenshot(page, `25-homepage-${viewport.name}`, browserName);
    }
  });

  test("26-responsive-calculator", async ({ page, browserName }) => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/fr/calculateur/bruxelles");
      await page.waitForLoadState("networkidle");
      await takeScreenshot(page, `26-calculator-${viewport.name}`, browserName);
    }
  });
});

test.describe("Error States & Edge Cases", () => {
  test("27-404-page", async ({ page, browserName }) => {
    await page.goto("/fr/this-page-does-not-exist");
    await page.waitForLoadState("networkidle");
    await takeScreenshot(page, "27-404-error-page", browserName);
  });

  test("28-housing-type-rejection", async ({ page, browserName }) => {
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");

    // Try to select AIS housing
    const aisOption = page.locator("text=AIS").first();
    if (await aisOption.isVisible()) {
      await aisOption.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, "28-housing-type-ais-rejection", browserName);
    }
  });
});
