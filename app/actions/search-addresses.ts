"use server"; // Mark as server action, as it interacts with the repository

import { addressRepository } from "@/app/data/repositories"; // Import the repository instance
import { AddressResult, SearchServiceResponse } from "@/app/data/types"; // Import shared types

/**
 * Server action to search for addresses using the configured address repository.
 * This acts as a thin wrapper around the repository's search method.
 *
 * @param query - The search query string.
 * @returns A promise resolving to a SearchServiceResponse containing an array of AddressResult or an error.
 */
export async function searchAddresses(
  query: string
): Promise<SearchServiceResponse<AddressResult[]>> {
  // Basic validation can remain here or be moved entirely to the repository
  if (!query || query.length < 3) {
    return {
      success: true,
      data: [],
      error: null,
      code: "SUCCESS", // Or potentially "INSUFFICIENT_QUERY" if preferred
    };
  }

  try {
    // Delegate the actual search logic to the repository
    const result = await addressRepository.search(query);
    return result;
  } catch (error: any) {
    // Catch unexpected errors during repository interaction
    console.error("Error in searchAddresses action calling repository:", error);
    return {
      success: false,
      data: null,
      error: `Erreur système inattendue: ${error.message || "Erreur inconnue"}`,
      code: "SYSTEM_ERROR", // Generic system error for action-level failures
    };
  }
}
