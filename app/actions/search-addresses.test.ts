import { describe, it, expect } from "vitest";
import { searchAddresses, type AddressResult } from "./search-addresses"; // Assuming AddressResult is exported or defined

// Ensure environment variables for Supabase are loaded if needed for testing
// (e.g., via a .env file and dotenv, or Vitest's env setup)

describe("searchAddresses Integration Test", () => {
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

  it("should find the address with query parts reordered: 'rue kessels 18 1030'", async () => {
    const query = "rue kessels 18 1030";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postcode: targetAddress.postcode,
          streetname_fr: expect.stringContaining(targetAddress.streetname_fr_part),
          house_number: expect.stringContaining(targetAddress.house_number_part),
        }),
      ])
    );
  });

  it("should find the address with postcode and street name only: 'rue kessels 1030'", async () => {
    const query = "rue kessels 1030";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postcode: targetAddress.postcode,
          streetname_fr: expect.stringContaining(targetAddress.streetname_fr_part),
          // House number might be null or present depending on DB data for this specific address
        }),
      ])
    );
  });

  it("should find the address with postcode and partial street name: 'kessels 1030'", async () => {
    const query = "kessels 1030";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postcode: targetAddress.postcode,
          streetname_fr: expect.stringContaining(targetAddress.streetname_fr_part),
        }),
      ])
    );
  });

  it("should NOT query without a postcode: '18 rue kessels'", async () => {
    const query = "18 rue kessels";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true); // Function succeeds by design
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]); // No data returned
    expect(result.code).toBe("INSUFFICIENT_QUERY"); // Specific code indicating why
  });

  it("should NOT query without a street name: '18 1030'", async () => {
    const query = "18 1030";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
    expect(result.code).toBe("INSUFFICIENT_QUERY");
  });

  it("should NOT query with only postcode: '1030'", async () => {
    const query = "1030";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
    expect(result.code).toBe("INSUFFICIENT_QUERY");
  });

  it("should NOT query with only street name: 'rue kessels'", async () => {
    const query = "rue kessels";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
    expect(result.code).toBe("INSUFFICIENT_QUERY");
  });

  it("should NOT query with an empty string", async () => {
    const query = "";
    const result = await searchAddresses(query);

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
    expect(result.code).toBe("INSUFFICIENT_QUERY");
  });

  // Add more tests for edge cases if needed (e.g., non-Brussels postcodes, complex house numbers)
});
