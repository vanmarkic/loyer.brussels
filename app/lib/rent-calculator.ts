import type { PropertyType, EnergyClass, PropertyState } from "../data/types";

/**
 * Defines the specific input data required for the rent calculation logic.
 * This isolates the calculation from the full UI form state.
 */
export interface CalculateRentInput {
  difficultyIndex: number | null;
  size: number;
  propertyState: PropertyState | null;
  propertyType: PropertyType | "";
  bedrooms: number;
  hasCentralHeating: boolean | null;
  hasThermalRegulation: boolean | null;
  hasSecondBathroom: boolean | null;
  hasRecreationalSpaces: boolean | null;
  hasStorageSpaces: boolean | null;
  numberOfGarages: number;
  energyClass: EnergyClass | "";
}

// The calculateRent function will be added here in the next step.

/**
 * Calculates the estimated median, minimum, and maximum rent based on property details.
 * Uses the methodology from loyers.brussels.
 *
 * @param inputData - The necessary input data conforming to CalculateRentInput.
 * @returns An object containing medianRent, minRent, and maxRent.
 */
export const calculateRent = (
  inputData: CalculateRentInput // Use the specific input type
): {
  medianRent: number;
  minRent: number;
  maxRent: number;
} => {
  // Constants from the official formulas
  const BASE_CONSTANT = 0.1758082;
  const MULTIPLIER = 1.0207648;
  const STATE_2_ADJUSTMENT = 0.2490667; // état=2
  const STATE_3_ADJUSTMENT = 1.042853; // état=3
  const DIFFICULTY_MULTIPLIER = -0.6455585;

  // Default to 0 if no difficulty index is available
  const difficultyIndex = inputData.difficultyIndex;
  const surface = inputData.size;
  const propertyState = inputData.propertyState ?? 2; // Default to Bon état (2) if not set

  if (surface <= 0) {
    // Avoid division by zero and nonsensical calculations
    return { medianRent: 0, minRent: 0, maxRent: 0 };
  }

  // Get the appropriate formula constants based on property type and number of bedrooms
  let formulaConstant = 0;
  let inverseSurfaceMultiplier = 0;

  if (
    inputData.propertyType === "studio" ||
    (inputData.propertyType === "apartment" && inputData.bedrooms === 0)
  ) {
    // Studio-Appartement 0 chambre
    formulaConstant = 3.4017754;
    inverseSurfaceMultiplier = 410.93786;
  } else if (inputData.propertyType === "apartment") {
    switch (inputData.bedrooms) {
      case 1:
        // Appartement 1 chambre
        formulaConstant = 2.8301143;
        inverseSurfaceMultiplier = 482.6853574;
        break;
      case 2:
        // Appartement 2 chambres
        formulaConstant = 2.9097312;
        inverseSurfaceMultiplier = 548.1594066;
        break;
      case 3:
        // Appartement 3 chambres
        formulaConstant = 4.3996618;
        inverseSurfaceMultiplier = 505.9611096;
        break;
      default: // 4 chambres et plus
        formulaConstant = 7.5;
        inverseSurfaceMultiplier = 250;
        break;
    }
  } else if (inputData.propertyType === "house") {
    if (inputData.bedrooms <= 2) {
      // Maison 1 ou 2 chambres
      formulaConstant = 3.1738354;
      inverseSurfaceMultiplier = 487.9031965;
    } else if (inputData.bedrooms === 3) {
      // Maison 3 chambres
      formulaConstant = 3.4543796;
      inverseSurfaceMultiplier = 562.1917377;
    } else {
      // 4 chambres ou plus
      formulaConstant = 5.300474;
      inverseSurfaceMultiplier = 393.8815801;
    }
  } else {
    // Fallback or handle other types if necessary
    // Using Studio/0 bed apartment as a default fallback for now
    formulaConstant = 3.4017754;
    inverseSurfaceMultiplier = 410.93786;
  }

  // Calculate the inverse surface term
  const inverseSurfaceTerm = inverseSurfaceMultiplier / surface;

  // Determine state adjustment based on propertyState
  let stateAdjustment = 0;
  if (propertyState === 2) {
    stateAdjustment = STATE_2_ADJUSTMENT;
  } else if (propertyState === 3) {
    stateAdjustment = STATE_3_ADJUSTMENT;
  }
  // No adjustment if propertyState is 1 (Mauvais état)

  // Calculate the base price per square meter using the core formula
  const basePricePerSqm =
    BASE_CONSTANT +
    MULTIPLIER * (formulaConstant + inverseSurfaceTerm) +
    stateAdjustment + // Use the determined state adjustment
    DIFFICULTY_MULTIPLIER * (difficultyIndex ?? 0); // Note: DIFFICULTY_MULTIPLIER is negative

  // Calculate the initial base rent
  let calculatedRent = basePricePerSqm * surface;

  // Apply additional value adjustments
  if (inputData.hasCentralHeating === false) calculatedRent -= 18.679544;
  if (inputData.hasThermalRegulation === false) calculatedRent -= 16.867348;
  if (inputData.hasSecondBathroom === true) calculatedRent += 88.547325;
  if (inputData.hasRecreationalSpaces === false) calculatedRent -= 15.763757;
  if (inputData.hasStorageSpaces === true) calculatedRent += 0.707585; // This seems very small, double-check if intended
  if (inputData.numberOfGarages > 0)
    calculatedRent += inputData.numberOfGarages * 40.109301;

  // Apply PEB (Energy Class) adjustments
  // Note: EnergyClass type is imported at the top of the file
  const energyClassAdjustment: Partial<Record<EnergyClass, number>> = {
    A: 164.16,
    B: 109.44,
    C: 54.72,
    D: 21.89,
    E: 0,
    F: -10.94,
    G: -21.89,
  };

  if (inputData.energyClass && inputData.energyClass in energyClassAdjustment) {
    calculatedRent += energyClassAdjustment[inputData.energyClass as EnergyClass] ?? 0;
  }

  const indexationRatio = 133.73000000000047 / 112.74000000000039;

  // Ensure rent is not negative
  const finalMedianRent = Math.max(0, calculatedRent) * indexationRatio;

  // Calculate min and max rent (±10% of the final median rent)

  // Return rounded values
  return {
    // Using finalMedianRent as base for simplicity, adjust if needed
    medianRent: parseFloat(finalMedianRent.toFixed(2)),
    minRent: parseFloat((finalMedianRent * 0.9).toFixed(2)),
    maxRent: parseFloat((finalMedianRent * 1.1).toFixed(2)),
  };
};
