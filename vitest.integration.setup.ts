import { config } from "dotenv";
import { vi } from "vitest";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Mock server-only package to allow integration tests to run
vi.mock("server-only", () => ({}));
