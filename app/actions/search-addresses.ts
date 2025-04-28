"use client";

import { supabase, supabaseAdmin } from "../lib/supabase";

export interface AddressResult {
  id: string;
  postcode: string;
  streetname_fr: string;
  house_number: string;
  indice_synth_difficulte: number;
}

export interface SearchAddressesResult {
  success: boolean;
  data: AddressResult[];
  error: string | null;
  code: string;
}

export async function searchAddresses(query: string): Promise<SearchAddressesResult> {
  if (!query || query.length < 3) {
    return {
      success: true,
      data: [],
      error: null,
      code: "SUCCESS",
    };
  }

  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SERVICE_KEY;

  if (!hasSupabaseCredentials) {
    console.warn("Supabase credentials not configured. Using mock address data.");
    // Return mock address data for testing
    return {
      success: true,
      data: [
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
      ],
      error: null,
      code: "SUCCESS",
    };
  }

  try {
    // Split the query to search for postal code and street name separately
    // --- Improved Address Parsing Logic ---

    const cleanedQuery = query.trim();
    let postalCode: string | null = null;
    let houseNumber: string | null = null;
    let streetQuery: string = "";

    // Regex to find a 4-digit Brussels postal code (starts with '1')
    const postalCodeRegex = /\b(1\d{3})\b/;
    // Regex to find potential house numbers (digits possibly followed by letters)
    const houseNumberRegex = /\b(\d+[a-zA-Z]*)\b/g; // Global flag to find all

    // 1. Extract Postal Code
    const postalCodeMatch = cleanedQuery.match(postalCodeRegex);
    if (postalCodeMatch) {
      postalCode = postalCodeMatch[1];
    }

    // 2. Extract Potential House Numbers (excluding the postal code if found)
    const potentialHouseNumbers = [...cleanedQuery.matchAll(houseNumberRegex)]
      .map((m) => m[1])
      .filter((num) => num !== postalCode); // Don't treat postcode as house number

    // Assume the first number found (that's not a postcode) is the house number.
    // This is a heuristic and might need refinement based on common address formats.
    if (potentialHouseNumbers.length > 0) {
      houseNumber = potentialHouseNumbers[0];
    }

    // 3. Determine Street Query
    // Remove postal code and house number from the query to get the street parts
    let remainingQuery = cleanedQuery;
    if (postalCode) {
      // Replace the specific postal code found to avoid accidental replacements elsewhere
      remainingQuery = remainingQuery.replace(postalCode, "");
    }
    if (houseNumber) {
      // Replace only the first occurrence assumed to be the house number
      // This avoids removing numbers if they are part of the street name itself
      remainingQuery = remainingQuery.replace(houseNumber, "");
    }
    // Clean up remaining string to form the street query
    streetQuery = remainingQuery.replace(/\s+/g, " ").trim();

    // --- Build and Execute Supabase Query ---

    // Check if we have both a valid Brussels postal code and a street query part
    if (!streetQuery) {
      // If postal code or street name is missing, return empty success result
      // as per the requirement to not query without both.
      return {
        success: true,
        data: [],
        error: null,
        code: "INSUFFICIENT_QUERY", // Indicate why no results were fetched
      };
    }

    // Proceed with query construction and execution only if both parts are present
    let supabaseQuery = supabase
      .from("addresses")
      .select("id, postcode, streetname_fr, house_number, indice_synth_difficulte")
      .limit(10); // Increased limit slightly for more options

    // Add mandatory filters
    if (postalCode) {
      supabaseQuery = supabaseQuery.eq("postcode", postalCode);
    }
    supabaseQuery = supabaseQuery.ilike("streetname_fr", `%${streetQuery}%`);

    // Add optional house number filter if found
    if (houseNumber) {
      // Use `ilike` for house number for flexibility (e.g., '12A', '12bis')
      // Adjust if exact match is strictly required and DB format is consistent.
      supabaseQuery = supabaseQuery.ilike("house_number", `${houseNumber}%`);
    }

    // Execute the query
    const { data, error } = await supabaseQuery;

    console.log("Supabase query result:", data, error);

    // Handle potential database errors
    if (error) {
      console.error("Error searching addresses:", error);
      return {
        success: false,
        data: [],
        error: `Erreur de recherche: ${error.message || "Erreur inconnue"}`,
        code: "DATABASE_ERROR",
      };
    }

    // Return successful result with data
    return {
      success: true,
      data: data || [], // Ensure data is always an array
      error: null,
      code: "SUCCESS",
    };
  } catch (error: any) {
    // Catch errors from parsing or unexpected issues
    console.error("Error in searchAddresses:", error);
    return {
      success: false,
      data: [],
      error: `Erreur système: ${error.message || "Une erreur inattendue s'est produite"}`,
      code: "SYSTEM_ERROR",
    };
  }
}
