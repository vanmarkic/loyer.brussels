// Unified data types for the entire calculator flow

// Property-related enums
export type PropertyType = "studio" | "apartment" | "house";
export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "";
export type PropertyState = "excellent" | "good" | "fair" | "poor";
export interface UserProfile {
  // Contact information
  email: string;
  phone: string;

  // Preferences
  joinNewsletter: boolean;
  joinAssembly: boolean;
}

export interface PropertyInformation {
  // Address
  postalCode: number;
  streetName: string;
  streetNumber: string;

  // Basic property info
  propertyType: PropertyType | "";
  size: number; // Living space in m²
  bedrooms: number;
  bathrooms: number;

  // Features
  numberOfGarages: number;
  energyClass: EnergyClass;
  constructedBefore2000: boolean | null;
  propertyState: PropertyState | null;

  // Amenities
  hasCentralHeating: boolean | null;
  hasThermalRegulation: boolean | null;
  hasDoubleGlazing: boolean | null;
  hasSecondBathroom: boolean | null;
  hasRecreationalSpaces: boolean | null;
  hasStorageSpaces: boolean | null;
}

export interface RentalInformation {
  // Current rent
  actualRent: string; // User's current rent

  // Lease details
  leaseType: string;
  leaseStartDate: string;
  rentIndexation: string;

  // Additional lease info
  boilerMaintenance: boolean;
  fireInsurance: boolean;
}

export interface HouseholdInformation {
  monthlyIncome: string;
  householdComposition: string;
  paymentDelays: string;
  evictionThreats: string;
  mediationAttempts: string;
}

export interface PropertyIssues {
  healthIssues: string[];
  majorDefects: string[];
  positiveAspects: string[];
  additionalComments: string;
}

export interface CalculationResults {
  difficultyIndex: number | null;
  medianRent: number | null;
  minRent: number | null;
  maxRent: number | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
}

// Unified global form state
export interface GlobalFormState {
  size: unknown;
  // Flow control
  currentStep: number;
  currentPage: "calculator" | "results" | "questionnaire";

  // User information
  userProfile: UserProfile;
  propertyInfo: PropertyInformation;
  rentalInfo: RentalInformation;
  householdInfo: HouseholdInformation;
  propertyIssues: PropertyIssues;
  calculationResults: CalculationResults;

  // Session management
  lastUpdated: number;
  sessionId: string;
}
