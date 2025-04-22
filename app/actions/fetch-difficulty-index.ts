"use server"

import { supabaseAdmin, supabase } from "../lib/supabase"

export async function fetchDifficultyIndexAction(postalCode: string, streetName: string, streetNumber: string) {
  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SERVICE_KEY
  console.log('hasSupabaseCredentials', hasSupabaseCredentials)
  if (!hasSupabaseCredentials) {
    console.warn("Supabase credentials not configured. Using mock difficulty index.")
    // Return a mock success response with a default difficulty index
    return {
      success: true,
      data: 0.5, // Default difficulty index
      error: null,
      code: "SUCCESS",
    }
  }

  try {
    // Query the addresses table to find the matching address
    const { data, error } = await supabase
      .from("addresses")
      .select('*')
      .eq("postcode", parseFloat(postalCode))
      .eq('streetname_fr', 'Avenue de la Liberté')
      .eq("house_number", String(streetNumber))
      .limit(1)



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
      data: data.indice_synth_difficulte,
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
