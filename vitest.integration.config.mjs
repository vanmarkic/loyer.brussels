import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Add the tsconfigPaths plugin for path resolution
  ],
  test: {
    globals: true,
    environment: "node", // Use node environment for server-side tests
    setupFiles: ["./vitest.integration.setup.ts"], // Load environment variables and mock server-only
    include: [
      "**/app/actions/__tests__/**/*.integration.test.ts", // Only integration tests
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
  },
});
