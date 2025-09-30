import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"; // Use static import now

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Add the tsconfigPaths plugin
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"], // Ensure this path is correct relative to project root
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/tests/e2e/**", // Exclude Playwright tests
      "**/app/actions/__tests__/**", // Exclude integration tests that use server-only
    ],
  },
});
