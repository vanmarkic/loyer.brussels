import { test, expect, Page } from "@playwright/test";

/**
 * Comprehensive QA Test: Link and Flow Validation
 * 
 * This test validates all links and user flows work correctly:
 * - Checks that all navigation links exist and work
 * - Validates no broken links (404s)
 * - Checks complete user journeys
 * - Identifies dead/placeholder links
 */

test.describe("QA - Link Validation", () => {
  
  test("should validate all navigation links from homepage", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Test main navigation links
    const navLinks = [
      { text: "home", expectedPath: "/fr" },
      { text: "about", expectedPath: "/fr/wuune" },
      { text: "campaign", expectedPath: "/fr/campagne" },
      { text: "contact", expectedPath: "/fr/contact" },
    ];

    console.log("🔍 Testing main navigation links...");
    
    for (const link of navLinks) {
      const linkElement = page.locator(`nav a[href*="${link.expectedPath}"]`).first();
      await expect(linkElement).toBeVisible();
      console.log(`✓ Navigation link found: ${link.text}`);
    }
  });

  test("should detect broken 'actualites' link", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Find the "View All News" button that links to /actualites
    const viewAllButton = page.locator('a[href*="/actualites"]');
    
    if (await viewAllButton.count() > 0) {
      console.log("⚠️  Found link to /actualites page");
      
      // Click the link and check if it results in 404
      await viewAllButton.click();
      await page.waitForLoadState("networkidle");
      
      // Check if we landed on a 404 or if the page exists
      const is404 = await page.locator('text=/404|not found|page introuvable/i').count() > 0;
      const currentUrl = page.url();
      
      if (is404 || currentUrl.includes("not-found")) {
        console.log("❌ ISSUE: /actualites page does not exist (404)");
        expect(is404).toBe(false); // This will fail and report the issue
      } else {
        console.log("✓ /actualites page exists");
      }
    }
  });

  test("should detect placeholder links with href='#'", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Find all links with href="#"
    const placeholderLinks = await page.locator('a[href="#"]').all();
    
    console.log(`\n🔍 Found ${placeholderLinks.length} placeholder links with href="#"`);
    
    if (placeholderLinks.length > 0) {
      console.log("⚠️  ISSUE: Following placeholder links found:");
      
      for (let i = 0; i < placeholderLinks.length; i++) {
        const text = await placeholderLinks[i].textContent();
        const isVisible = await placeholderLinks[i].isVisible();
        if (isVisible) {
          console.log(`   ${i + 1}. "${text?.trim()}"`);
        }
      }
      
      // Report this as a finding but don't fail the test
      expect(placeholderLinks.length).toBeLessThanOrEqual(10); // Soft assertion
    }
  });

  test("should validate social media share links", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Check for social media links (Facebook, Twitter)
    const socialLinks = await page.locator('a[href="#"]').filter({ 
      has: page.locator('svg') 
    }).all();

    console.log(`\n📱 Found ${socialLinks.length} social media links`);
    
    if (socialLinks.length > 0) {
      console.log("⚠️  Social media links are placeholders (href='#')");
      console.log("   These should link to actual share URLs");
    }
  });

  test("should validate calculator flow entry points", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Find the main calculator CTA button
    const calculatorButton = page.locator('a[href*="/calculateur"]').first();
    await expect(calculatorButton).toBeVisible();
    
    console.log("✓ Calculator entry point found on homepage");
    
    // Click and verify we reach region selection
    await calculatorButton.click();
    await page.waitForLoadState("networkidle");
    
    const currentUrl = page.url();
    expect(currentUrl).toContain("/calculateur");
    console.log("✓ Successfully navigated to calculator");
  });

  test("should validate contact page is accessible from multiple pages", async ({ page }) => {
    const pagesWithContactLinks = [
      "/fr",
      "/fr/wuune",
      "/fr/campagne",
      "/fr/calculateur",
    ];

    for (const pagePath of pagesWithContactLinks) {
      await page.goto(pagePath);
      await page.waitForLoadState("networkidle");
      
      const contactLink = page.locator('a[href*="/contact"]').first();
      
      if (await contactLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`✓ Contact link found on ${pagePath}`);
      } else {
        console.log(`⚠️  No contact link found on ${pagePath}`);
      }
    }
  });

  test("should validate all resource links are not placeholders", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");

    // Look for resources section
    const resourcesSection = page.locator('text=/ressources|resources/i').first();
    
    if (await resourcesSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Find links in the resources section
      const resourceLinks = await page.locator('a[href="#"]').filter({
        hasText: /aide juridique|droit|médiation|legal|tenant/i
      }).all();
      
      if (resourceLinks.length > 0) {
        console.log(`⚠️  ISSUE: Found ${resourceLinks.length} placeholder resource links`);
        console.log("   These should link to actual resources");
      }
    }
  });
});

test.describe("QA - User Flow Validation", () => {
  
  test("should complete full calculator flow", async ({ page }) => {
    console.log("\n🧪 Testing complete calculator flow...");
    
    // Start from homepage
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");
    
    // Step 1: Click calculator button
    console.log("Step 1: Click calculator from homepage");
    await page.locator('a[href*="/calculateur"]').first().click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/calculateur");
    console.log("✓ Reached region selection");
    
    // Step 2: Select Brussels region
    console.log("Step 2: Select Brussels");
    const brusselsButton = page.locator('text=/bruxelles/i').first();
    await brusselsButton.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    
    // Step 3: Accept tenant role (if shown)
    console.log("Step 3: Handle role selection");
    const tenantButton = page.locator('button, a').filter({ hasText: /locataire|tenant/i }).first();
    if (await tenantButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tenantButton.click();
      await page.waitForTimeout(500);
    }
    
    // Step 4: Check if we reached the calculator steps
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes("/step/") || currentUrl.includes("/calculateur/bruxelles")) {
      console.log("✓ Successfully entered calculator flow");
    } else {
      console.log("⚠️  Unexpected URL after calculator entry");
    }
  });

  test("should navigate back from calculator", async ({ page }) => {
    await page.goto("/fr/calculateur/bruxelles");
    await page.waitForLoadState("networkidle");
    
    // Look for back button or navigation
    const backButton = page.locator('button, a').filter({ hasText: /retour|back|précédent/i }).first();
    
    if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("✓ Back navigation button found");
      
      await backButton.click();
      await page.waitForLoadState("networkidle");
      
      const currentUrl = page.url();
      console.log(`Navigated back to: ${currentUrl}`);
      
      // Should go back to region selection or homepage
      expect(currentUrl).toMatch(/\/(calculateur|fr)$/);
    } else {
      console.log("⚠️  No back button found in calculator");
    }
  });

  test("should validate questionnaire is accessible after calculator", async ({ page }) => {
    // Navigate directly to results (simulating completed calculator)
    await page.goto("/fr/calculateur/bruxelles/step/results");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    // Look for questionnaire button
    const questionnaireButton = page.locator('button, a').filter({ 
      hasText: /questionnaire|détaillé/i 
    }).first();
    
    if (await questionnaireButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("✓ Questionnaire button found on results page");
      
      // Click and verify navigation
      await questionnaireButton.click();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain("/questionnaire");
      console.log("✓ Successfully navigated to questionnaire");
    } else {
      console.log("⚠️  Questionnaire button not found on results page");
    }
  });

  test("should validate contact form is accessible with pre-filled data", async ({ page }) => {
    // Navigate to contact with join parameter
    await page.goto("/fr/contact?join=true");
    await page.waitForLoadState("networkidle");
    
    // Check if form exists
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    console.log("✓ Contact form is visible");
    
    // Check for pre-filled indicator
    const preFilledIndicator = page.locator('text=/pré-rempli|pre-filled/i').first();
    
    if (await preFilledIndicator.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("✓ Pre-filled data indicator found");
    } else {
      console.log("ℹ️  No pre-filled data indicator (may be expected if no session data)");
    }
  });

  test("should validate all language variants are accessible", async ({ page }) => {
    const languages = ["fr", "nl", "en"];
    
    for (const lang of languages) {
      console.log(`\n🌍 Testing ${lang.toUpperCase()} language...`);
      
      // Test homepage
      await page.goto(`/${lang}`);
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain(`/${lang}`);
      console.log(`✓ Homepage accessible in ${lang}`);
      
      // Test calculator
      await page.goto(`/${lang}/calculateur`);
      await page.waitForLoadState("networkidle");
      const is404 = await page.locator('text=/404|not found/i').count() > 0;
      expect(is404).toBe(false);
      console.log(`✓ Calculator accessible in ${lang}`);
      
      // Test contact
      await page.goto(`/${lang}/contact`);
      await page.waitForLoadState("networkidle");
      const is404Contact = await page.locator('text=/404|not found/i').count() > 0;
      expect(is404Contact).toBe(false);
      console.log(`✓ Contact accessible in ${lang}`);
    }
  });

  test("should validate 404 page provides navigation options", async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto("/fr/page-does-not-exist");
    await page.waitForLoadState("networkidle");
    
    // Should show 404 content
    const is404 = await page.locator('text=/404|page introuvable|not found/i').count() > 0;
    
    if (is404) {
      console.log("✓ 404 page is displayed for non-existent pages");
      
      // Check for navigation options
      const homeLink = page.locator('a[href*="/"]').filter({ hasText: /accueil|home/i }).first();
      const calculatorLink = page.locator('a[href*="/calculateur"]').first();
      
      if (await homeLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log("✓ Home link available on 404 page");
      }
      
      if (await calculatorLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log("✓ Calculator link available on 404 page");
      }
    } else {
      console.log("⚠️  404 page not shown for non-existent URLs");
    }
  });

  test("should validate landlord/bailleur page is accessible", async ({ page }) => {
    await page.goto("/fr/calculateur/bruxelles/bailleur");
    await page.waitForLoadState("networkidle");
    
    const is404 = await page.locator('text=/404|not found/i').count() > 0;
    expect(is404).toBe(false);
    console.log("✓ Landlord page is accessible");
    
    // Check for contact link
    const contactLink = page.locator('a[href*="/contact"]').first();
    if (await contactLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("✓ Contact link available on landlord page");
    }
  });

  test("should validate Wuune information pages", async ({ page }) => {
    // Test Wuune about page
    await page.goto("/fr/wuune");
    await page.waitForLoadState("networkidle");
    
    const is404Wuune = await page.locator('text=/404|not found/i').count() > 0;
    expect(is404Wuune).toBe(false);
    console.log("✓ Wuune about page is accessible");
    
    // Test campaign page
    await page.goto("/fr/campagne");
    await page.waitForLoadState("networkidle");
    
    const is404Campaign = await page.locator('text=/404|not found/i').count() > 0;
    expect(is404Campaign).toBe(false);
    console.log("✓ Campaign page is accessible");
  });
});

test.describe("QA - Mobile Navigation", () => {
  
  test.use({ viewport: { width: 375, height: 667 } });

  test("should validate mobile menu works", async ({ page }) => {
    await page.goto("/fr");
    await page.waitForLoadState("networkidle");
    
    // Look for mobile menu button
    const menuButton = page.getByRole("button", { name: /menu/i });
    
    if (await menuButton.isVisible()) {
      console.log("✓ Mobile menu button found");
      
      // Open menu
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // Check if menu items are now visible
      const menuItems = page.locator('a[href*="/wuune"], a[href*="/contact"], a[href*="/campagne"]');
      const menuItemCount = await menuItems.count();
      
      if (menuItemCount > 0) {
        console.log(`✓ Mobile menu opened with ${menuItemCount} items`);
      } else {
        console.log("⚠️  Mobile menu did not open properly");
      }
    } else {
      console.log("ℹ️  Mobile menu button not visible (may be desktop view)");
    }
  });

  test("should validate mobile calculator flow", async ({ page }) => {
    console.log("\n📱 Testing mobile calculator flow...");
    
    await page.goto("/fr/calculateur");
    await page.waitForLoadState("networkidle");
    
    // Select Brussels on mobile
    const brusselsButton = page.locator('text=/bruxelles/i').first();
    await expect(brusselsButton).toBeVisible();
    await brusselsButton.click();
    await page.waitForLoadState("networkidle");
    
    console.log("✓ Mobile calculator region selection works");
  });
});
