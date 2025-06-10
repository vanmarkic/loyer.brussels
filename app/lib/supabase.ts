import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Check if Supabase environment variables are available
const hasSupabaseCredentials =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.NEXT_PUBLIC_SERVICE_KEY;

// Initialize the Supabase client with public anon key (for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase credentials are missing. The Supabase client will run in mock mode."
  );
  // Provide an empty object typed as SupabaseClient to avoid runtime errors when
  // imported in environments without credentials. Repository methods check for
  // credentials before using the client, so this placeholder will never be
  // invoked.
  supabase = {} as SupabaseClient;
}

export { supabase };

// Initialize a Supabase client with service role key (for server-side only)
const supabaseServiceKey = process.env.NEXT_PUBLIC_SERVICE_KEY;

let supabaseAdmin: SupabaseClient;
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  supabaseAdmin = {} as SupabaseClient;
}

export { supabaseAdmin };
