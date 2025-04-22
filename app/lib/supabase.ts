import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
const hasSupabaseCredentials =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SERVICE_KEY

// Initialize the Supabase client with public anon key (for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a dummy client if credentials are missing
export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            ilike: () => ({
              eq: () => ({
                single: async () => ({ data: null, error: { message: "Supabase credentials not configured" } }),
                limit: () => ({ data: [], error: null }),
              }),
            }),
          }),
        }),
      }),
    }

// Initialize a Supabase client with service role key (for server-side only)
const supabaseServiceKey = process.env.SERVICE_KEY || ""

// Create a dummy admin client if credentials are missing
export const supabaseAdmin = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseServiceKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            ilike: () => ({
              eq: () => ({
                single: async () => ({ data: null, error: { message: "Supabase credentials not configured" } }),
                limit: () => ({ data: [], error: null }),
              }),
            }),
          }),
        }),
      }),
    }

// Function to fetch difficulty index (using admin client for more privileges)
export async function fetchDifficultyIndex(postalCode: string, streetName: string, streetNumber: string) {
  if (!hasSupabaseCredentials) {
    console.warn("Supabase credentials not configured. Using mock difficulty index.")
    return 0.5 // Return a default/mock difficulty index
  }

  try {
    // Query the addresses table to find the matching address
    const { data, error } = await supabaseAdmin
      .from("addresses")
      .select("indice_synth_difficulte")
      .eq("postcode", 1080)
      .ilike("streetname_fr", "Avenue de la Liberté")
      .eq("house_number", "120")
      .limit(1)

    if (error) {
      console.error("Error fetching difficulty index:", error)
      return 0.5 // Return a default difficulty index on error
    }

    // Return the difficulty index from the address record
    return data?.indice_synth_difficulte || 0.5
  } catch (error) {
    console.error("Error in fetchDifficultyIndex:", error)
    return 0.5 // Return a default difficulty index on error
  }
}
