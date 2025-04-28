"use server"; // Mark as server action

import { addressRepository } from "@/app/data/repositories"; // Import the repository instance
import { SearchServiceResponse } from "@/app/data/types"; // Import shared types

/**
 * Server action to fetch the difficulty index for a specific address
 * using the configured address repository.
 *
 * @param postalCode - The postal code.
 * @param streetName - The name of the street.
 * @param streetNumber - The house number.
 * @returns A promise resolving to a SearchServiceResponse containing the difficulty index (number) or an error.
 */
export async function fetchDifficultyIndexAction(
  postalCode: number,
  streetName: string,
  streetNumber: string
): Promise<SearchServiceResponse<number>> {
  // Basic validation could be added here if needed (e.g., check postal code range)

  try {
    // Delegate the actual fetching logic to the repository
    const result = await addressRepository.fetchDifficultyIndex(
      postalCode,
      streetName,
      streetNumber
    );
    return result;
  } catch (error: any) {
    // Catch unexpected errors during repository interaction
    console.error("Error in fetchDifficultyIndexAction calling repository:", error);
    return {
      success: false,
      data: null,
      error: `Erreur système inattendue: ${error.message || "Erreur inconnue"}`,
      code: "SYSTEM_ERROR",
    };
  }
}
