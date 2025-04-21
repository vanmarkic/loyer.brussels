import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client with public anon key (for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize a Supabase client with service role key (for server-side only)
const supabaseServiceKey = process.env.SERVICE_KEY || ""

console.log(supabaseUrl)
console.log(supabaseAnonKey)
console.log(supabaseServiceKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Function to fetch difficulty index (using admin client for more privileges)
export async function fetchDifficultyIndex(postalCode: string, streetName: string, streetNumber: string) {
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
      return null
    }

    // Return the difficulty index from the address record
    return data?.difficulty_index || null
  } catch (error) {
    console.error("Error in fetchDifficultyIndex:", error)
    return null
  }
}
