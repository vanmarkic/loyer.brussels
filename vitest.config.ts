import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react"; // Needed if testing React components

export default defineConfig({
  plugins: [react()], // Add if you test React components
  test: {
    globals: true, // Optional: Use if you want Vitest globals like describe, it, expect
    environment: "jsdom", // Or 'node', depending on what your tests need
    setupFiles: ["./vitest.setup.ts"], // Point to the setup file
  },
});
