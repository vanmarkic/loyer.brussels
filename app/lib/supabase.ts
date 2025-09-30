import { createClient } from "@supabase/supabase-js";

// Check if Supabase environment variables are available
export const hasSupabaseCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.NEXT_PUBLIC_SERVICE_KEY;

// Initialize the Supabase client with public anon key (for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Create client (will work with placeholder values but won't make actual requests)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize a Supabase client with service role key (for server-side only)
const supabaseServiceKey = process.env.NEXT_PUBLIC_SERVICE_KEY || "placeholder-service-key";

// Create admin client (will work with placeholder values but won't make actual requests)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
