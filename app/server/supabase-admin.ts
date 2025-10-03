import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only Supabase admin client
// This module should only be imported in server actions and API routes

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Check if credentials are available
export const hasSupabaseAdminCredentials = !!supabaseUrl && !!supabaseServiceKey;

// Use placeholder values if credentials are missing (for test environments)
const effectiveUrl = supabaseUrl || "https://placeholder.supabase.co";
const effectiveKey = supabaseServiceKey || "placeholder-service-key";

export const supabaseAdmin = createClient(effectiveUrl, effectiveKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
