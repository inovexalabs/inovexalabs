import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, hasServiceRole } from "./config";

/**
 * SERVER ONLY.
 *
 * The service-role key bypasses Row Level Security, so this client may only be
 * imported from Server Actions and Route Handlers that have already
 * authenticated and authorised the caller. It must never be imported into a
 * Client Component — the key would be bundled into the browser payload.
 *
 * Used for exactly two things:
 *   1. Persisting contact inquiries (the anon role has no policy on that table).
 *   2. Admin storage uploads and operations RLS cannot express.
 */
export function createSupabaseAdminClient() {
  if (!hasServiceRole) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. This operation requires the service-role key.",
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { "X-Client-Info": "inovexa-labs/admin" },
    },
  });
}

/** Non-throwing variant for code paths that must degrade gracefully. */
export function tryCreateSupabaseAdminClient() {
  if (!hasServiceRole) return null;
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}
