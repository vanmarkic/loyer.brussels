import { createClient } from "@supabase/supabase-js";

// Check if Supabase environment variables are available
const hasSupabaseCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.NEXT_PUBLIC_SERVICE_KEY;

// Initialize the Supabase client with public anon key (for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a dummy client if credentials are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize a Supabase client with service role key (for server-side only)
const supabaseServiceKey = process.env.NEXT_PUBLIC_SERVICE_KEY as string;

// Create a dummy admin client if credentials are missing
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
