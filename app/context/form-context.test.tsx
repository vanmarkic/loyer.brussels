import { describe, it, expect } from "vitest";
import { type FormState } from "./form-context"; // Keep FormState import
import { calculateRent, type CalculateRentInput } from "../lib/rent-calculator"; // Import calculateRent and its input type
import type { EnergyClass, PropertyType, PropertyState } from "../data/types"; // Import necessary types

describe("calculateRent", () => {
  const createMockState = (overrides: Partial<FormState> = {}): FormState => {
    const defaultState: FormState = {
      step: 1,
      postalCode: 0,
      streetName: "",
      streetNumber: "",
      propertyType: "",
      size: 0,
      bedrooms: 1,
      bathrooms: 1,
      numberOfGarages: 0,
      energyClass: "",
      difficultyIndex: null,
      medianRent: null,
      minRent: null,
      maxRent: null,
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

  it("should calculate rent based on the provided Schaerbeek example", () => {
    const state = createMockState({
      propertyType: "apartment",
      bedrooms: 1,
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

      postalCode: 1030,
      streetName: "Rue Kessels",
      streetNumber: "18",
    });

    // Create the specific input object for the calculateRent function
    const calculationInput: CalculateRentInput = {
      difficultyIndex: state.difficultyIndex,
      size: state.size,
      propertyState: state.propertyState,
      propertyType: state.propertyType,
      bedrooms: state.bedrooms,
      hasCentralHeating: state.hasCentralHeating,
      hasThermalRegulation: state.hasThermalRegulation,
      hasSecondBathroom: state.hasSecondBathroom,
      hasRecreationalSpaces: state.hasRecreationalSpaces,
      hasStorageSpaces: state.hasStorageSpaces,
      numberOfGarages: state.numberOfGarages,
      energyClass: state.energyClass,
    };

    const result = calculateRent(calculationInput); // Pass the correct input object
    console.log("Result:", result);

    console.log("Calculated Rent:", result.medianRent); // Expected: ~1440 based on calculation
    console.log("Calculated Min Rent:", result.minRent); // Expected: ~1155 (80% of calculated)
    console.log("Calculated Max Rent:", result.maxRent); // Expected: ~1732 (120% of calculated)
    console.log("Provided Median Rent:", 1180.9);

    expect(result.medianRent).toBe(1180.9); // Compare against helper
  });
}); // End of describe block
