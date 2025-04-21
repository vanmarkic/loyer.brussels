"use server"

import { supabaseAdmin } from "../lib/supabase"

export interface AddressResult {
  id: string
  postal_code: string
  street_name: string
  street_number: string
  difficulty_index: number
}

export async function searchAddresses(query: string): Promise<AddressResult[]> {
  if (!query || query.length < 3) {
    return []
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
      .from("difficulty_indices")
      .select("id, postal_code, street_name, street_number, index as difficulty_index")
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
      return []
    }

    return data as AddressResult[]
  } catch (error) {
    console.error("Error in searchAddresses:", error)
    return []
  }
}
