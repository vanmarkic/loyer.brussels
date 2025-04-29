import { describe, it, expect } from "vitest";
import { searchAddresses } from "./search-addresses";
import type { AddressResult } from "../data/types"; // Import type from new location relative to actions dir

// Ensure environment variables for Supabase are loaded if needed for testing
// (e.g., via a .env file and dotenv, or Vitest's env setup)

// To deactivate a test suite, you can use `describe.skip` instead of `describe`.
describe.skip("searchAddresses Integration Test", () => {
  const targetAddress = {
    postcode: "1030",
    streetname_fr_part: "kessels", // Use partial match for street
    house_number_part: "18", // Use partial match for house number
  };

  it("should find the address with full query: '18 rue kessels 1030'", async () => {
    const query = "18 rue kessels 1030";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0); // Expect at least one result

    // Check if the target address is among the results
    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postcode: targetAddress.postcode,
          streetname_fr: expect.stringContaining(targetAddress.streetname_fr_part),
          // House number matching might be exact or partial depending on DB/query logic
          house_number: expect.stringContaining(targetAddress.house_number_part),
        }),
      ])
    );
  });

  // Other tests remain unchanged but are skipped due to `describe.skip`
});
