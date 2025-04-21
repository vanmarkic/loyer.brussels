import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client with public anon key (for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize a Supabase client with service role key (for server-side only)
const supabaseServiceKey = process.env.SERVICE_KEY || ""

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Function to fetch difficulty index (using admin client for more privileges)
export async function fetchDifficultyIndex(postalCode: string, streetName: string, streetNumber: string) {
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
      return null
    }

    return data?.index || null
  } catch (error) {
    console.error("Error in fetchDifficultyIndex:", error)
    return null
  }
}
