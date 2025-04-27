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
  },
});
