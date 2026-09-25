"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let cached: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser client for the admin sign-in flow and client-side uploads.
 * Only ever holds the anon key — the service-role key must never arrive here.
 * All real authorisation is enforced by RLS and the admin allowlist.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  cached ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
