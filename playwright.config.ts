import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for User Journey Screenshot Testing
 *
 * This config sets up tests to capture screenshots of all user journeys
 * for UX analysis and improvement suggestions.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // Run sequentially to avoid conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for consistency
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "on", // Always take screenshots
    video: "retain-on-failure",
  },

  // Test projects for different viewports (mobile & desktop)
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Web server configuration - use dev server temporarily
  // Commented out to use existing dev server on port 3002
  // webServer: {
  //   command: "yarn dev",
  //   url: "http://localhost:3002",
  //   reuseExistingServer: true,
  //   timeout: 120 * 1000,
  // },
});
