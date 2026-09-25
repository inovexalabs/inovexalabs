import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * A cookieless anon client.
 *
 * Public reads must be cacheable, and `unstable_cache` cannot wrap anything that
 * touches `cookies()`. Using this client instead of the session-aware one keeps
 * public content cacheable while still running as the `anon` role, so RLS
 * continues to guarantee that only published rows are ever returned.
 *
 * Admin-only reads use `createSupabaseServerClient()` and stay uncached.
 */
export function getPublicClient() {
  if (!isSupabaseConfigured) return null;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "X-Client-Info": "inovexa-labs/public" } },
  });
}
