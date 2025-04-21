"use server"

import { supabaseAdmin } from "../lib/supabase"

export interface AddressResult {
  id: string
  postcode: string
  streetname_fr: string
  house_number: string
  indice_synth_difficulte: number
}

export interface SearchAddressesResult {
  success: boolean
  data: AddressResult[]
  error: string | null
  code: string
}

export async function searchAddresses(query: string): Promise<SearchAddressesResult> {
  if (!query || query.length < 3) {
    return {
      success: true,
      data: [],
      error: null,
      code: "SUCCESS",
    }
  }

  try {
    // Split the query to search for postal code and street name separately
    const parts = query.trim().split(/\s+/)
    let postalCodeQuery = ""
    let streetQuery = ""

    // Check if the first part looks like a postal code (4 digits)
    if (parts[0] && /^\d{4}$/.test(parts[0])) {
      postalCodeQuery = parts[0]
      streetQuery = parts.slice(1).join(" ")
    } else {
      streetQuery = query
    }

    let supabaseQuery = supabaseAdmin
      .from("addresses")
      .select("id, postcode, streetname_fr, house_number, indice_synth_difficulte")
      .limit(30)

    // Add filters based on the parsed query
    if (postalCodeQuery) {
      supabaseQuery = supabaseQuery.eq("postcode", postalCodeQuery)
    }

    if (streetQuery) {
      supabaseQuery = supabaseQuery.ilike("streetname_fr", `%${streetQuery}%`)
    }

    const { data, error } = await supabaseQuery

    if (error) {
      console.error("Error searching addresses:", error)
      return {
        success: false,
        data: [],
        error: `Erreur de recherche: ${error.message || "Erreur inconnue"}`,
        code: "DATABASE_ERROR",
      }
    }

    return {
      success: true,
      data: data as AddressResult[],
      error: null,
      code: "SUCCESS",
    }
  } catch (error: any) {
    console.error("Error in searchAddresses:", error)
    return {
      success: false,
      data: [],
      error: `Erreur système: ${error.message || "Une erreur inattendue s'est produite"}`,
      code: "SYSTEM_ERROR",
    }
  }
}
