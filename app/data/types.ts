/**
 * Represents the result of an address search.
 */
export interface AddressResult {
  id: string;
  postcode: string;
  streetname_fr: string;
  house_number: string;
  indice_synth_difficulte: number;
}

/**
 * Represents the user inputs captured by the form and stored in the database.
 */
export type UserInputs = {
  propertyType: string; // e.g., 'apartment', 'house'
  size: number; // in square meters
  bedrooms: number;
  bathrooms: number;
  energyClass: string; // e.g., 'A', 'B', 'C'
  hasCentralHeating: boolean;
  hasThermalRegulation: boolean;
  hasDoubleGlazing: boolean;
  hasSecondBathroom: boolean;
  hasRecreationalSpaces: boolean;
  hasStorageSpaces: boolean;
  streetNumber: string;
  streetName: string;
  postalCode: number;
  difficultyIndex: number | null;
  constructedBefore2000: boolean;
  propertyState: string; // e.g., 'new', 'good', 'renovate'
  numberOfGarages: number;
};

/**
 * Represents the data structure for creating a new rent record.
 */
export interface RentRecordInput {
  user_inputs: UserInputs;
  median_rent: number;
  created_at: string; // ISO date string
}

/**
 * Represents the data structure for updating an existing rent record.
 */
export interface RentRecordUpdate {
  actual_rent: number;
  email?: string;
  phone_number?: string;
}

/**
 * Represents the structure of the response from address search operations.
 * Includes success status, data, potential error message, and a status code.
 */
export interface SearchServiceResponse<T> {
  success: boolean;
  data: T | null; // Use null for single items or errors, array for lists
  error: string | null;
  code:
    | "SUCCESS"
    | "NOT_FOUND"
    | "DATABASE_ERROR"
    | "SYSTEM_ERROR"
    | "INSUFFICIENT_QUERY"
    | "MULTIPLE_RESULTS"
    | "UNKNOWN_ERROR";
}
