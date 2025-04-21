"use server"

import { supabaseAdmin } from "../lib/supabase"

export async function fetchDifficultyIndexAction(postalCode: string, streetName: string, streetNumber: string) {
  try {
    // Query the addresses table to find the matching address
    const { data, error } = await supabaseAdmin
      .from("addresses")
      .select("difficulty_index")
      .eq("postal_code", postalCode)
      .ilike("street_name", `%${streetName}%`)
      .eq("street_number", streetNumber)
      .single()

    console.log(data, error) 

    if (error) {
      console.error("Error fetching difficulty index:", error)
      return { success: false, error: "Indice de difficulté non trouvé", data: null }
    }

    return {
      success: true,
      data: data?.difficulty_index || 0,
      error: null,
    }
  } catch (error) {
    console.error("Error in fetchDifficultyIndexAction:", error)
    return {
      success: false,
      error: "Une erreur s'est produite lors de la récupération de l'indice de difficulté",
      data: null,
    }
  }
}
