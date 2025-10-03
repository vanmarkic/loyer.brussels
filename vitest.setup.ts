import { config } from "dotenv";
import "@testing-library/jest-dom/vitest"; // Import Jest DOM matchers for Vitest
import { vi } from "vitest";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Mock server-only package to allow integration tests to import server-side code
// This is safe because integration tests specify @vitest-environment node
vi.mock("server-only", () => ({}));
