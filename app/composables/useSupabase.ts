import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~~/shared/types/database";

// Single browser-side Supabase client. The site is statically generated, so
// auth only ever runs in the browser — never call this during SSR/prerender.
let client: SupabaseClient<Database> | null = null;

export function useSupabase(): SupabaseClient<Database> {
  if (client) return client;

  const { supabaseUrl, supabaseAnonKey } = useRuntimeConfig().public;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured: set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  client = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
  return client;
}
