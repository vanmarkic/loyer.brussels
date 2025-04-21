"use server"

import { supabaseAdmin } from "../lib/supabase"

export async function fetchDifficultyIndexAction(postalCode: string, streetName: string, streetNumber: string) {
  try {
    // Query the addresses table to find the matching address
    const { data, error } = await supabaseAdmin
      .from("addresses")
      .select("difficulty_index")
      .eq("postcode", postalCode)
      .ilike("streetname_fr", `%${streetName}%`)
      .eq("house_number", streetNumber)
      .single()

    if (error) {
      console.error("Error fetching difficulty index:", error)

      // Return specific error messages based on the error code
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: `Adresse non trouvée: ${streetNumber} ${streetName}, ${postalCode}. Veuillez vérifier l'adresse ou essayer une autre adresse.`,
          data: null,
          code: "NOT_FOUND",
        }
      }

      if (error.code === "PGRST310") {
        return {
          success: false,
          error: "Plusieurs adresses correspondent à votre recherche. Veuillez préciser davantage.",
          data: null,
          code: "MULTIPLE_RESULTS",
        }
      }

      return {
        success: false,
        error: `Erreur de base de données: ${error.message || "Erreur inconnue"}`,
        data: null,
        code: "DATABASE_ERROR",
      }
    }

    if (!data) {
      return {
        success: false,
        error: `Adresse non trouvée: ${streetNumber} ${streetName}, ${postalCode}. Veuillez vérifier l'adresse.`,
        data: null,
        code: "NOT_FOUND",
      }
    }

    return {
      success: true,
      data: data.difficulty_index || 0,
      error: null,
      code: "SUCCESS",
    }
  } catch (error: any) {
    console.error("Error in fetchDifficultyIndexAction:", error)
    return {
      success: false,
      error: `Erreur système: ${error.message || "Une erreur inattendue s'est produite"}`,
      data: null,
      code: "SYSTEM_ERROR",
    }
  }
}
