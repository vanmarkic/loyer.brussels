import { supabase } from "@/app/lib/supabase";
import { IAddressRepository } from "../../interfaces/address";
import { AddressResult, SearchServiceResponse } from "../../types";
import { parseAddressQuery } from "@/app/lib/address/parse-query";

// Helper function to check for Supabase credentials (read-only queries only need anon key)
function hasSupabaseCredentials(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Mock data for testing when credentials are not available
const mockAddressData: AddressResult[] = [
  {
    id: "mock-1",
    postcode: "1000",
    streetname_fr: "Rue de la Loi",
    house_number: "16",
    indice_synth_difficulte: 0.5,
  },
  {
    id: "mock-2",
    postcode: "1050",
    streetname_fr: "Avenue Louise",
    house_number: "143",
    indice_synth_difficulte: 0.3,
  },
];

const mockDifficultyIndex = 0.5;

export class SupabaseAddressRepository implements IAddressRepository {
  async search(query: string): Promise<SearchServiceResponse<AddressResult[]>> {
    if (!query || query.length < 3) {
      return {
        success: true,
        data: [],
        error: null,
        code: "SUCCESS",
      };
    }

    if (!hasSupabaseCredentials()) {
      console.warn("Supabase credentials not configured. Using mock address data.");
      return {
        success: true,
        data: mockAddressData.filter((addr) =>
          `${addr.streetname_fr} ${addr.house_number} ${addr.postcode}`
            .toLowerCase()
            .includes(query.toLowerCase())
        ),
        error: null,
        code: "SUCCESS",
      };
    }

    try {
      // Parse the address query using the extracted utility
      const { postalCode, houseNumber, streetQuery } = parseAddressQuery(query);

      if (!streetQuery) {
        return {
          success: true,
          data: [],
          error: null,
          code: "INSUFFICIENT_QUERY",
        };
      }

      let supabaseQuery = supabase
        .from("addresses")
        .select("id, postcode, streetname_fr, house_number, indice_synth_difficulte")
        .limit(10);

      if (postalCode) {
        supabaseQuery = supabaseQuery.eq("postcode", postalCode);
      }
      supabaseQuery = supabaseQuery.ilike("streetname_fr", `%${streetQuery}%`);

      if (houseNumber) {
        supabaseQuery = supabaseQuery.ilike("house_number", `${houseNumber}%`);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Error searching addresses:", error);
        return {
          success: false,
          data: null, // Return null for data on error
          error: `Erreur de recherche: ${error.message || "Erreur inconnue"}`,
          code: "DATABASE_ERROR",
        };
      }

      return {
        success: true,
        data: data || [], // Ensure data is always an array
        error: null,
        code: "SUCCESS",
      };
    } catch (error: any) {
      console.error("Error in AddressRepository.search:", error);
      return {
        success: false,
        data: null,
        error: `Erreur système: ${
          error.message || "Une erreur inattendue s'est produite"
        }`,
        code: "SYSTEM_ERROR",
      };
    }
  }

  async fetchDifficultyIndex(
    postalCode: number,
    streetName: string,
    streetNumber: string
  ): Promise<SearchServiceResponse<number>> {
    if (!hasSupabaseCredentials()) {
      console.warn("Supabase credentials not configured. Using mock difficulty index.");
      return {
        success: true,
        data: mockDifficultyIndex,
        error: null,
        code: "SUCCESS",
      };
    }

    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("indice_synth_difficulte")
        .eq("postcode", postalCode)
        .ilike("streetname_fr", streetName)
        .eq("house_number", String(streetNumber))
        .limit(1); // Using limit(1) as maybeSingle() isn't directly available here

      if (error) {
        console.error("Error fetching difficulty index:", error);
        let errorCode: SearchServiceResponse<number>["code"] = "DATABASE_ERROR";
        let errorMessage = `Erreur de base de données: ${
          error.message || "Erreur inconnue"
        }`;

        // Supabase specific error codes might need adjustment based on actual API response
        if (error.code === "PGRST116") {
          // Example: Not found
          errorCode = "NOT_FOUND";
          errorMessage = `Adresse non trouvée: ${streetNumber} ${streetName}, ${postalCode}. Veuillez vérifier l'adresse ou essayer une autre adresse.`;
        } else if (error.code === "PGRST310") {
          // Example: Multiple results (though limit(1) should prevent this)
          errorCode = "MULTIPLE_RESULTS";
          errorMessage =
            "Plusieurs adresses correspondent à votre recherche. Veuillez préciser davantage.";
        }

        return {
          success: false,
          data: null,
          error: errorMessage,
          code: errorCode,
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          data: null,
          error: `Adresse non trouvée: ${streetNumber} ${streetName}, ${postalCode}. Veuillez vérifier l'adresse.`,
          code: "NOT_FOUND",
        };
      }

      // Ensure the expected property exists and attempt to parse it as a number
      if (
        data[0] &&
        data[0].indice_synth_difficulte !== undefined &&
        data[0].indice_synth_difficulte !== null
      ) {
        const difficultyIndexString = String(data[0].indice_synth_difficulte); // Ensure it's a string first
        const difficultyIndexNumber = parseFloat(difficultyIndexString);

        if (!isNaN(difficultyIndexNumber)) {
          // Successfully parsed as a number
          return {
            success: true,
            data: difficultyIndexNumber,
            error: null,
            code: "SUCCESS",
          };
        } else {
          // Value exists but couldn't be parsed as a number
          console.error(
            "Failed to parse indice_synth_difficulte as number:",
            data[0].indice_synth_difficulte
          );
          return {
            success: false,
            data: null,
            error: "Format de l'indice de difficulté invalide reçu.",
            code: "SYSTEM_ERROR",
          };
        }
      } else {
        // Handle case where data exists but doesn't have the expected property
        console.error(
          "Unexpected data structure or missing indice_synth_difficulte:",
          data[0]
        );
        return {
          success: false,
          data: null,
          error: "Données d'indice de difficulté invalides ou manquantes reçues.",
          code: "SYSTEM_ERROR",
        };
      }
    } catch (error: any) {
      console.error("Error in AddressRepository.fetchDifficultyIndex:", error);
      return {
        success: false,
        data: null,
        error: `Erreur système: ${
          error.message || "Une erreur inattendue s'est produite"
        }`,
        code: "SYSTEM_ERROR",
      };
    }
  }
}

// Export an instance of the repository
export const addressRepository = new SupabaseAddressRepository();
