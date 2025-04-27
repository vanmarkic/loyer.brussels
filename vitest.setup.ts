import { config } from "dotenv";
import "@testing-library/jest-dom/vitest"; // Import Jest DOM matchers for Vitest

// Load environment variables from .env.local
config({ path: ".env.local" });
