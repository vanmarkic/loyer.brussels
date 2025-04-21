"use server"

import { supabaseAdmin } from "../lib/supabase"

export interface AddressResult {
  id: string
  postal_code: string
  street_name: string
  street_number: string
  difficulty_index: number
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
      .select("id, postal_code, street_name, street_number, difficulty_index")
      .limit(10)

    // Add filters based on the parsed query
    if (postalCodeQuery) {
      supabaseQuery = supabaseQuery.eq("postal_code", postalCodeQuery)
    }

    if (streetQuery) {
      supabaseQuery = supabaseQuery.ilike("street_name", `%${streetQuery}%`)
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
