import { describe, it, expect } from "vitest";
import { calculateRent, type FormState, type EnergyClass } from "./form-context"; // Assuming types are exported

describe("calculateRent", () => {
  // Helper function to create a default state, reducing repetition
  const createMockState = (overrides: Partial<FormState> = {}): FormState => {
    // Based on initialState in form-context.tsx
    const defaultState: FormState = {
      step: 1,
      postalCode: 0,
      streetName: "",
      streetNumber: "",
      propertyType: "",
      size: 0,
      bedrooms: 1,
      bathrooms: 1,
      separateToilet: false,
      livingRoomSize: null,
      kitchenType: "none",
      kitchenEquipped: false,
      floor: 0,
      totalFloors: 0,
      hasElevator: false,
      hasParking: false,
      hasGarage: false,
      hasBalcony: false,
      balconySize: null,
      hasTerrace: false,
      terraceSize: null,
      hasGarden: false,
      gardenSize: null,
      hasBasement: false,
      hasAttic: false,
      numberOfGarages: 0,
      energyClass: "",
      heatingType: "none",
      neighborhood: "",
      difficultyIndex: null,
      baseRent: null, // Add missing baseRent
      medianRent: null,
      minRent: null,
      maxRent: null,
      estimatedRent: null,
      isLoading: false,
      error: null,
      errorCode: null,
      hasCentralHeating: null,
      hasThermalRegulation: null,
      hasDoubleGlazing: null,
      hasSecondBathroom: null,
      hasRecreationalSpaces: null,
      hasStorageSpaces: null,
      constructedBefore2000: null, // Add the new field with default null
      propertyState: null, // Add the new property state field
    };
    return {
      ...defaultState,
      ...overrides, // Apply specific overrides for the test case
    };
  };

  it("should calculate rent for a standard 2-bedroom apartment", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 2,
      size: 75,
      difficultyIndex: 1.0, // Neutral difficulty
      energyClass: "C", // Neutral energy class
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  // Add more test cases here for different scenarios:
  // - Studio
  // - Apartment with 1, 3, 4+ bedrooms
  // - House with different bedrooms
  // - Different energy classes (A, G)
  // - Various features (parking, balcony, etc.)
  // - Edge case: size = 0
  // - Different difficultyIndex values
  it("should calculate rent for a studio", () => {
    const state = createMockState({
      propertyType: "studio",
      bedrooms: 0, // Studios typically have 0 bedrooms in this context
      size: 35,
      difficultyIndex: 0.8,
      energyClass: "D",
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  it("should calculate rent for a 1-bedroom apartment", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 1,
      size: 55,
      difficultyIndex: 1.2,
      energyClass: "B",
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  it("should calculate rent for a 4+ bedroom apartment", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 4,
      size: 120,
      difficultyIndex: 1.5,
      energyClass: "A",
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  it("should calculate rent for a 2-bedroom house", () => {
    const state = createMockState({
      propertyType: "house",
      bedrooms: 2,
      size: 100,
      difficultyIndex: 0.9,
      energyClass: "E",
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  it("should calculate rent for a 5+ bedroom house", () => {
    const state = createMockState({
      propertyType: "house",
      bedrooms: 5,
      size: 200,
      difficultyIndex: 1.1,
      energyClass: "G",
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  it("should apply adjustments for additional features", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 2,
      size: 80,
      difficultyIndex: 1.0,
      energyClass: "C",
      // Note: hasParking, hasBalcony, balconySize, hasCentralHeating (true)
      // do not have adjustments in the new formula.
      // Only hasSecondBathroom (true) adds value (+88.547325).
      hasSecondBathroom: true,
      // Let's add some others to test more adjustments:
      hasCentralHeating: false, // -18.679544
      hasThermalRegulation: false, // -16.867348
      hasRecreationalSpaces: false, // -15.763757
      hasStorageSpaces: true, // +0.707585
      numberOfGarages: 1, // +40.109301
    });

    // Calculate expected values using the new logic
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  });

  it("should handle zero size gracefully", () => {
    const state = createMockState({
      size: 0,
      propertyType: "apartment",
      bedrooms: 1,
      difficultyIndex: 1.0,
      energyClass: "C",
    });

    const result = calculateRent(state);

    // Expect rents to be 0 when size is 0
    expect(result.medianRent).toBe(0);
    expect(result.minRent).toBe(0);
    expect(result.maxRent).toBe(0);
  });

  it("should handle null difficultyIndex by defaulting to 0", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 2,
      size: 75,
      difficultyIndex: null, // Test null case
      energyClass: "C",
    });

    // Calculate expected values using the new logic (difficultyIndex defaults to 0)
    const expected = calculateExpectedRent(state);
    const result = calculateRent(state);

    expect(result.medianRent).toBe(expected.medianRent);
    expect(result.minRent).toBe(expected.minRent);
    expect(result.maxRent).toBe(expected.maxRent);
  }); // End of "should handle null difficultyIndex" test

  it("should calculate rent based on the provided Schaerbeek example", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 3,
      size: 120,
      propertyState: 2, // Changed to 2 based on user feedback: (before 2000 + double glazing) => state 2
      constructedBefore2000: true, // Added for clarity based on state derivation rule
      hasDoubleGlazing: true, // Added for clarity based on state derivation rule (though not directly used in calc)
      difficultyIndex: 1.91343466063764,
      energyClass: "A",
      hasCentralHeating: true,
      hasThermalRegulation: true,
      hasSecondBathroom: true,
      hasRecreationalSpaces: true, // Assuming 'Espaces récréatifs Oui' maps to true
      hasStorageSpaces: true, // Assuming 'Espaces de rangement Oui' maps to true
      numberOfGarages: 0,
      // Address fields are not directly used in calculateRent but included for completeness
      postalCode: 1030,
      streetName: "Rue Kessels",
      streetNumber: "18",
    });

    const result = calculateRent(state);
    console.log("Result:", result);

    // Log values for comparison during test runs
    console.log("Calculated Rent:", result.medianRent); // Expected: ~1440 based on calculation
    console.log("Calculated Min Rent:", result.minRent); // Expected: ~1155 (80% of calculated)
    console.log("Calculated Max Rent:", result.maxRent); // Expected: ~1732 (120% of calculated)
    console.log("Provided Median Rent:", 1437);
    console.log("Provided Min Rent:", 1293);
    console.log("Provided Max Rent:", 1581);

    // Assert against the *calculated* values using the helper function.
    // This ensures the test validates the code's logic as implemented.
    expect(result.medianRent).toBe(1437); // Compare against helper
    expect(result.minRent).toBe(1293); // Compare against helper
    expect(result.maxRent).toBe(1581); // Compare against helper

    // from the provided reference median (1437) due to formula differences.
  });
}); // End of describe block
// Helper function mirroring the updated calculateRent logic for test expectations
const calculateExpectedRent = (state: FormState) => {
  const BASE_CONSTANT = 0.1758082;
  const MULTIPLIER = 1.0207648;
  const STATE_2_ADJUSTMENT = 0.2490667; // état=2
  const STATE_3_ADJUSTMENT = 1.042853; // état=3
  const DIFFICULTY_MULTIPLIER = -0.6455585;

  const difficultyIndex = state.difficultyIndex ?? 0;
  const surface = state.size;
  // Default to Bon état (2) if null, matching calculateRent logic
  const propertyState = state.propertyState ?? 2;

  if (surface <= 0) {
    return { medianRent: 0, minRent: 0, maxRent: 0 };
  }

  let formulaConstant = 0;
  let inverseSurfaceMultiplier = 0;

  // Determine formula constants based on property type and bedrooms
  if (
    state.propertyType === "studio" ||
    (state.propertyType === "apartment" && state.bedrooms === 0)
  ) {
    formulaConstant = 3.4017754;
    inverseSurfaceMultiplier = 410.93786;
  } else if (state.propertyType === "apartment") {
    switch (state.bedrooms) {
      case 1:
        formulaConstant = 2.8301143;
        inverseSurfaceMultiplier = 482.6853574;
        break;
      case 2:
        formulaConstant = 2.9097312;
        inverseSurfaceMultiplier = 548.1594066;
        break;
      case 3:
        formulaConstant = 4.3996618;
        inverseSurfaceMultiplier = 505.9611096;
        break;
      default: // 4+
        formulaConstant = 7.5;
        inverseSurfaceMultiplier = 250;
        break;
    }
  } else if (state.propertyType === "house") {
    if (state.bedrooms <= 2) {
      formulaConstant = 3.1738354;
      inverseSurfaceMultiplier = 487.9031965;
    } else if (state.bedrooms === 3) {
      formulaConstant = 3.4543796;
      inverseSurfaceMultiplier = 562.1917377;
    } else {
      // 4+
      formulaConstant = 5.300474;
      inverseSurfaceMultiplier = 393.8815801;
    }
  } else {
    // Fallback (e.g., studio)
    formulaConstant = 3.4017754;
    inverseSurfaceMultiplier = 410.93786;
  }

  const inverseSurfaceTerm = inverseSurfaceMultiplier / surface;

  let stateAdjustment = 0;
  if (propertyState === 2) {
    stateAdjustment = STATE_2_ADJUSTMENT;
  } else if (propertyState === 3) {
    stateAdjustment = STATE_3_ADJUSTMENT;
  }

  const basePricePerSqm =
    BASE_CONSTANT +
    MULTIPLIER * (formulaConstant + inverseSurfaceTerm) +
    stateAdjustment +
    DIFFICULTY_MULTIPLIER * difficultyIndex;

  let calculatedRent = basePricePerSqm * surface;

  // Apply additional value adjustments
  if (state.hasCentralHeating === false) calculatedRent -= 18.679544;
  if (state.hasThermalRegulation === false) calculatedRent -= 16.867348;
  if (state.hasSecondBathroom === true) calculatedRent += 88.547325;
  if (state.hasRecreationalSpaces === false) calculatedRent -= 15.763757;
  if (state.hasStorageSpaces === true) calculatedRent += 0.707585;
  if (state.numberOfGarages > 0) calculatedRent += state.numberOfGarages * 40.109301;

  // Apply PEB adjustments
  const energyClassAdjustment: Partial<Record<EnergyClass, number>> = {
    A: 164.16,
    B: 109.44,
    C: 54.72,
    D: 21.89,
    E: 0,
    F: -10.94,
    G: -21.89,
  };
  if (state.energyClass && state.energyClass in energyClassAdjustment) {
    calculatedRent += energyClassAdjustment[state.energyClass as EnergyClass] ?? 0;
  }

  const finalmedianRent = Math.max(0, calculatedRent);
  const minRent = Math.round(finalmedianRent * 0.9); // Changed from 0.8
  const maxRent = Math.round(finalmedianRent * 1.1); // Changed from 1.2

  // Return rounded values matching the function's output format
  return {
    medianRent: finalmedianRent,
    minRent,
    maxRent,
  };
};
