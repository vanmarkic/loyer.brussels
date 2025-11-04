import type {
  CalculatorState,
  PropertyType,
  EnergyRating,
  PropertyFeatures,
  RentCalculationResult,
  RentComparison,
} from '@/types/calculator';

// Brussels difficulty index by postal code (simplified example)
// In production, this would come from a database or API
const DIFFICULTY_INDEX_MAP: Record<string, number> = {
  '1000': 1.15, // Brussels Center
  '1020': 1.05, // Laeken
  '1030': 1.08, // Schaerbeek
  '1040': 1.12, // Etterbeek
  '1050': 1.18, // Ixelles
  '1060': 1.10, // Saint-Gilles
  '1070': 1.06, // Anderlecht
  '1080': 1.11, // Molenbeek
  '1081': 1.09, // Koekelberg
  '1082': 1.07, // Berchem-Sainte-Agathe
  '1083': 1.08, // Ganshoren
  '1090': 1.09, // Jette
  '1120': 1.06, // Neder-Over-Heembeek
  '1130': 1.10, // Haren
  '1140': 1.12, // Evere
  '1150': 1.14, // Woluwe-Saint-Pierre
  '1160': 1.12, // Auderghem
  '1170': 1.13, // Watermael-Boitsfort
  '1180': 1.15, // Uccle
  '1190': 1.11, // Forest
  '1200': 1.13, // Woluwe-Saint-Lambert
  '1210': 1.09, // Saint-Josse-ten-Noode
};

// Base rent per m² by property type
const BASE_RENT_PER_SQM: Record<PropertyType, number> = {
  'studio': 18,
  'apartment-1': 16,
  'apartment-2': 15,
  'apartment-3': 14.5,
  'apartment-4+': 14,
  'house': 13,
};

// Energy rating adjustments (multiplier)
const ENERGY_ADJUSTMENTS: Record<EnergyRating, number> = {
  'A': 1.15,
  'B': 1.10,
  'C': 1.05,
  'D': 1.00,
  'E': 0.95,
  'F': 0.90,
  'G': 0.85,
  'unknown': 1.00,
};

// Feature value additions (monthly €)
const FEATURE_VALUES = {
  centralHeating: 50,
  thermalRegulation: 20,
  doubleGlazing: 30,
  secondBathroom: 80,
  recreationalSpaces: 40,
  storageSpaces: 25,
  buildingBefore2000: -30, // Negative for older buildings
  garagePerUnit: 60,
};

export function calculateReferenceRent(state: CalculatorState): RentCalculationResult | null {
  // Validate required fields
  if (
    !state.propertyType ||
    !state.propertyDetails ||
    !state.address?.postalCode
  ) {
    return null;
  }

  const { propertyType, propertyDetails, features, energyRating, address } = state;
  const { livingSpace, bedrooms, bathrooms } = propertyDetails;

  // Get difficulty index
  const difficultyIndex = DIFFICULTY_INDEX_MAP[address.postalCode] || 1.0;

  // Calculate base rent
  const baseRentPerSqm = BASE_RENT_PER_SQM[propertyType];
  let baseRent = baseRentPerSqm * livingSpace;

  // Apply difficulty index
  baseRent *= difficultyIndex;

  // Apply energy rating
  const energyMultiplier = ENERGY_ADJUSTMENTS[energyRating || 'unknown'];
  baseRent *= energyMultiplier;

  // Add feature values
  let featureAdditions = 0;
  if (features) {
    if (features.centralHeating) featureAdditions += FEATURE_VALUES.centralHeating;
    if (features.thermalRegulation) featureAdditions += FEATURE_VALUES.thermalRegulation;
    if (features.doubleGlazing) featureAdditions += FEATURE_VALUES.doubleGlazing;
    if (features.secondBathroom) featureAdditions += FEATURE_VALUES.secondBathroom;
    if (features.recreationalSpaces) featureAdditions += FEATURE_VALUES.recreationalSpaces;
    if (features.storageSpaces) featureAdditions += FEATURE_VALUES.storageSpaces;
    if (features.buildingBefore2000) featureAdditions += FEATURE_VALUES.buildingBefore2000;
    featureAdditions += features.garages * FEATURE_VALUES.garagePerUnit;
  }

  // Calculate median rent
  const medianRent = Math.round(baseRent + featureAdditions);

  // Calculate min/max (90% and 110% of median)
  const minimumRent = Math.round(medianRent * 0.9);
  const maximumRent = Math.round(medianRent * 1.1);

  return {
    minimumRent,
    medianRent,
    maximumRent,
    difficultyIndex,
    calculatedAt: new Date(),
  };
}

export function compareRent(
  userRent: number,
  calculationResult: RentCalculationResult
): RentComparison {
  const { medianRent, maximumRent } = calculationResult;
  const difference = userRent - medianRent;
  const percentageDifference = ((difference / medianRent) * 100);

  let status: RentComparison['status'];

  if (userRent > maximumRent * 1.2) {
    // More than 20% over maximum
    status = 'abusive';
  } else if (userRent > medianRent * 1.05) {
    // More than 5% over median
    status = 'high';
  } else if (userRent < medianRent * 0.95) {
    // More than 5% under median
    status = 'below';
  } else {
    status = 'fair';
  }

  return {
    userRent,
    medianRent,
    difference,
    percentageDifference,
    status,
  };
}

export function formatRentRange(result: RentCalculationResult): string {
  return `€${result.minimumRent} - €${result.maximumRent}`;
}
