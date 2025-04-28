import { AddressResult, SearchServiceResponse } from "../types";

/**
 * Defines the contract for interacting with address data.
 */
export interface IAddressRepository {
  /**
   * Searches for addresses based on a query string.
   * @param query - The search query string (e.g., "16 Rue de la Loi 1000").
   * @returns A promise resolving to a SearchServiceResponse containing an array of AddressResult or an error.
   */
  search(query: string): Promise<SearchServiceResponse<AddressResult[]>>;

  /**
   * Fetches the difficulty index for a specific address.
   * @param postalCode - The postal code.
   * @param streetName - The name of the street.
   * @param streetNumber - The house number.
   * @returns A promise resolving to a SearchServiceResponse containing the difficulty index (number) or an error.
   */
  fetchDifficultyIndex(
    postalCode: number,
    streetName: string,
    streetNumber: string
  ): Promise<SearchServiceResponse<number>>;
}
