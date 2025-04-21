import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to fetch difficulty index
export async function fetchDifficultyIndex(postalCode: string, streetName: string, streetNumber: string) {
  try {
    const { data, error } = await supabase
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
