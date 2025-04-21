"use server"

import { supabaseAdmin } from "../lib/supabase"

export async function fetchDifficultyIndexAction(postalCode: string, streetName: string, streetNumber: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("difficulty_indices")
      .select("index")
      .eq("postal_code", postalCode)
      .ilike("street_name", `%${streetName}%`)
      .eq("street_number", streetNumber)
      .single()

    if (error) {
      console.error("Error fetching difficulty index:", error)
      return { success: false, error: "Indice de difficulté non trouvé", data: null }
    }

    return {
      success: true,
      data: data?.index || 0,
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
