import { fetchDifficultyIndexAction } from "./fetch-difficulty-index";

describe("fetchDifficultyIndex integration tests", () => {
  // Mock Supabase credentials check if needed for local testing without env vars
  // beforeEach(() => {
  //   process.env.NEXT_PUBLIC_SUPABASE_URL = 'mock_url';
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock_key';
  //   process.env.NEXT_PUBLIC_SERVICE_KEY = 'mock_service_key';
  // });
  // afterEach(() => {
  //   delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  //   delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  //   delete process.env.NEXT_PUBLIC_SERVICE_KEY;
  // });

  it("should return the correct difficulty index for a known address", async () => {
    const postalCode = 1030;
    const streetName = "rue kEssels"; // Testing case insensitivity
    const streetNumber = "18"; // Must be a string

    const expectedDifficultyIndex = 1.91343466063764;

    const result = await fetchDifficultyIndexAction(postalCode, streetName, streetNumber);

    // Check the structure of the successful response
    expect(result.success).toBe(true);
    expect(result.data).toEqual(expectedDifficultyIndex);
    expect(result.error).toBeNull();
    expect(result.code).toBe("SUCCESS");
  });

  it("should handle addresses not found gracefully", async () => {
    const postalCode = 9999;
    const streetName = "NonExistent Street";
    const streetNumber = "1"; // Must be a string

    const result = await fetchDifficultyIndexAction(postalCode, streetName, streetNumber);

    // Check the structure of the "not found" response
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toEqual(expect.any(String)); // Expect some error message
    expect(result.code).toBe("NOT_FOUND"); // Expecting the specific code from the function
  });

  // Add more test cases as needed, e.g., for invalid input types, edge cases, etc.
  // Consider testing the mock path if Supabase credentials are not set
  it("should return mock data if Supabase credentials are not configured", async () => {
    // Temporarily unset env vars for this test
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const originalServiceKey = process.env.NEXT_PUBLIC_SERVICE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SERVICE_KEY;

    const postalCode = 1000;
    const streetName = "Any Street";
    const streetNumber = "1";

    const result = await fetchDifficultyIndexAction(postalCode, streetName, streetNumber);

    expect(result.success).toBe(true);
    expect(result.data).toBe(0.5); // Default mock index
    expect(result.error).toBeNull();
    expect(result.code).toBe("SUCCESS");

    // Restore env vars
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnonKey;
    process.env.NEXT_PUBLIC_SERVICE_KEY = originalServiceKey;
  });
});
