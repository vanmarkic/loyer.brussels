# E2E Screenshot Testing & UX Analysis

This directory contains end-to-end tests using Playwright to capture screenshots of all user journeys for UX analysis.

## Purpose

The screenshot tests serve multiple purposes:

1. **Visual Documentation** - Capture the current state of all user flows
2. **UX Analysis** - Identify UI/UX issues across different devices
3. **Regression Prevention** - Detect unintended visual changes
4. **Accessibility Review** - Analyze layouts for accessibility issues
5. **Stakeholder Communication** - Share visual progress with non-technical team members

## Test Structure

### User Journeys Covered

1. **Homepage & Navigation**

   - Initial homepage view
   - Mobile menu interactions
   - Language switching

2. **Region Selection Flow**

   - Region selection page
   - Brussels/Wallonie/Flandres region info modals

3. **Tenant Calculator Journey**

   - Housing type filtering
   - User type selection and consent
   - All 6 calculator steps (property type, details, features, energy, address, results)

4. **Landlord Journey**

   - Landlord welcome page
   - Tools and resources section
   - Diagnostic tool interaction

5. **Wuune Information Pages**

   - About Wuune page (hero, mission, values)
   - Campaign page (hero, problems, objectives)

6. **Contact & Conversion**

   - Contact page
   - Form validation states
   - Pre-filled Wuune join flow

7. **Responsive Design**

   - Mobile (375x667)
   - Tablet (768x1024)
   - Desktop (1920x1080)

8. **Error States**
   - 404 pages
   - Housing type rejections

## Quick Start

### Installation

```bash
# Install Playwright and browsers
yarn add -D @playwright/test
npx playwright install
```

### Running Tests

```bash
# Start dev server in one terminal
yarn dev

# Run tests in another terminal
yarn test:e2e                    # Run all tests
yarn test:e2e:ui                 # Interactive UI mode (recommended for debugging)
yarn test:screenshots            # Desktop + mobile only
yarn test:report                 # View HTML report after tests
```

### Test Output

**Screenshots Location:**

```
test-results/screenshots/
├── desktop-chromium/
│   ├── 01-homepage-initial.png
│   ├── 02-homepage-mobile-menu-open.png
│   └── ...
├── mobile-safari/
│   ├── 01-homepage-initial.png
│   └── ...
└── tablet/
    └── ...
```

**HTML Report:**

- Location: `playwright-report/index.html`
- View with: `yarn test:report`

## UX Analysis Process

### 1. Run Tests & Capture Screenshots

```bash
yarn dev                         # Start app
yarn test:screenshots            # Capture all screenshots
```

### 2. Review Screenshots

Open screenshots in `test-results/screenshots/` and compare:

- Desktop vs Mobile vs Tablet layouts
- Visual consistency across steps
- Form validation states
- Error handling
- Responsive design breakpoints

### 3. Document Issues

Refer to `UX_SCREENSHOT_ANALYSIS.md` for:

- Categorized issues by journey
- Priority levels (P0-P2)
- Specific recommendations
- Implementation estimates

### 4. Implement Fixes

Follow the priority matrix in the analysis document:

- **P0 (Critical):** UI consistency, data redundancy, session persistence
- **P1 (High):** Progress indicators, form validation, mobile UX
- **P2 (Medium):** Social proof, content optimization, enhancements

### 5. Re-run & Compare

After fixes:

```bash
yarn test:screenshots            # Capture new state
```

Compare before/after screenshots to verify improvements.

## Key UX Issues to Look For

When reviewing screenshots, pay special attention to:

### Critical Issues (P0)

- ❌ **Visual inconsistency** between steps
- ❌ **Data re-entry** across forms
- ❌ **Session loss** on refresh
- ❌ **Touch target sizes** < 44px on mobile

### High Priority Issues (P1)

- ⚠️ **Missing progress indicators**
- ⚠️ **Poor form validation** feedback
- ⚠️ **Excessive scrolling** on mobile
- ⚠️ **Unclear next steps**

### Medium Priority Issues (P2)

- 🟡 **Lack of social proof**
- 🟡 **Suboptimal autocomplete** UX
- 🟡 **Missing micro-interactions**
- 🟡 **Content hierarchy** issues

## Test Configuration

See `playwright.config.ts` for:

- Device configurations
- Viewport sizes
- Screenshot settings
- Server configuration
- Retry policies

## Continuous Integration

To run in CI:

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: yarn install
      - run: npx playwright install --with-deps
      - run: yarn build
      - run: yarn test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-screenshots
          path: test-results/screenshots/
```

## Tips for Writing New Tests

### Best Practices

1. **Use descriptive test names**

   ```typescript
   test('homepage-hero-section', async ({ page }) => { ... });
   ```

2. **Wait for content to load**

   ```typescript
   await page.waitForLoadState("networkidle");
   ```

3. **Take full-page screenshots**

   ```typescript
   await page.screenshot({ fullPage: true });
   ```

4. **Disable animations for consistency**

   ```typescript
   await page.screenshot({ animations: "disabled" });
   ```

5. **Handle dynamic content**
   ```typescript
   if (await element.isVisible()) {
     await element.click();
   }
   ```

### Common Patterns

**Scrolling and capturing sections:**

```typescript
test("long-page-sections", async ({ page }) => {
  await page.goto("/page");

  // Top section
  await takeScreenshot(page, "section-1", browserName);

  // Middle section
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  await takeScreenshot(page, "section-2", browserName);

  // Bottom section
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(500);
  await takeScreenshot(page, "section-3", browserName);
});
```

**Testing responsive layouts:**

```typescript
test("responsive-view", async ({ page }) => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/page");
    await takeScreenshot(page, `page-${viewport.name}`, browserName);
  }
});
```

**Testing form states:**

```typescript
test("form-validation", async ({ page }) => {
  await page.goto("/contact");

  // Empty state
  await takeScreenshot(page, "form-empty", browserName);

  // Error state
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
  await takeScreenshot(page, "form-errors", browserName);

  // Filled state
  await page.fill('input[name="name"]', "John Doe");
  await page.fill('input[name="email"]', "john@example.com");
  await takeScreenshot(page, "form-filled", browserName);
});
```

## Troubleshooting

### Tests hanging or timing out

```bash
# Increase timeout
yarn test:e2e --timeout=60000

# Run in headed mode to see what's happening
yarn test:e2e --headed
```

### Server not starting

```bash
# Make sure dev server isn't already running
# Kill existing processes on port 3000
lsof -ti:3000 | xargs kill -9

# Then run tests
yarn test:e2e
```

### Screenshots not being saved

Check:

1. Directory permissions for `test-results/`
2. Disk space availability
3. Screenshot function is being called correctly

### Browser installation issues

```bash
# Reinstall browsers
npx playwright install --force

# Install system dependencies (Linux)
npx playwright install-deps
```

## Related Documentation

- **UX Analysis:** See `UX_SCREENSHOT_ANALYSIS.md` for detailed findings
- **Improvement Plan:** See `UX_IMPROVEMENT_PLAN.md` for implementation roadmap
- **Playwright Docs:** https://playwright.dev/docs/intro

## Contributing

When adding new tests:

1. Follow the existing naming convention: `##-descriptive-name`
2. Add tests to appropriate describe block
3. Update this README with new journeys covered
4. Update `UX_SCREENSHOT_ANALYSIS.md` with findings
5. Ensure tests are device-agnostic (work on all viewports)

---

**Last Updated:** September 30, 2025  
**Maintained By:** Development Team
