// Calculator Types
export type HousingType = 'private' | 'ais' | 'social';

export type PropertyType =
  | 'studio'
  | 'apartment-1'
  | 'apartment-2'
  | 'apartment-3'
  | 'apartment-4+'
  | 'house';

export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'unknown';

export interface PropertyFeatures {
  centralHeating: boolean;
  thermalRegulation: boolean;
  doubleGlazing: boolean;
  secondBathroom: boolean;
  recreationalSpaces: boolean;
  storageSpaces: boolean;
  buildingBefore2000: boolean;
  garages: number;
}

export interface PropertyDetails {
  livingSpace: number; // square meters
  bedrooms: number;
  bathrooms: number;
}

export interface Address {
  postalCode: string;
  streetName?: string;
  buildingNumber?: string;
}

export interface CalculatorState {
  // Step 1
  housingType?: HousingType;

  // Step 2
  propertyType?: PropertyType;

  // Step 3
  propertyDetails?: PropertyDetails;

  // Step 4
  features?: PropertyFeatures;

  // Step 5
  energyRating?: EnergyRating;

  // Step 6
  address?: Address;

  // Step 7 - User input
  currentRent?: number;

  // Metadata
  currentStep: number;
  completedSteps: number[];
}

export interface RentCalculationResult {
  minimumRent: number;
  medianRent: number;
  maximumRent: number;
  difficultyIndex?: number;
  calculatedAt: Date;
}

export interface RentComparison {
  userRent: number;
  medianRent: number;
  difference: number;
  percentageDifference: number;
  status: 'abusive' | 'high' | 'fair' | 'below';
}

// Questionnaire Types
export type LeaseType = '9-year' | '3-year' | '1-year' | 'short-term' | 'other';
export type HouseholdType = 'single' | 'couple' | 'family' | 'shared' | 'other';
export type RentIndexation = 'recent' | 'old' | 'never' | 'unknown';

export interface PersonalSituation {
  leaseType?: LeaseType;
  leaseStartDate?: string;
  monthlyIncome?: number;
  householdType?: HouseholdType;
  rentIndexation?: RentIndexation;
  boilerMaintenance: boolean;
  fireInsurance: boolean;
}

export interface HousingProblems {
  healthIssues: string[];
  majorDefects: string[];
  otherIssues?: string;
}

export interface PositiveAspects {
  aspects: string[];
  additionalComments?: string;
}

export interface QuestionnaireState {
  calculatorData?: CalculatorState;
  calculationResult?: RentCalculationResult;
  personalSituation?: PersonalSituation;
  housingProblems?: HousingProblems;
  positiveAspects?: PositiveAspects;
  email?: string;
  phone?: string;
}

// Contact Form Types
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  wantsMembership: boolean;
  wantsNewsletter: boolean;
  wantsAssemblyInvites: boolean;
}
