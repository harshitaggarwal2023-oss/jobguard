import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Server-side Supabase client (uses service role key — never expose to client)
export function getServerSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables not configured");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

// Client-side Supabase (public, read-only for public analyses)
export function getPublicSupabase() {
  if (!supabaseUrl) {
    throw new Error("Supabase URL not configured");
  }
  // For public client, we use the anon key which should be NEXT_PUBLIC_
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseServiceKey;
  return createClient(supabaseUrl, anonKey);
}
