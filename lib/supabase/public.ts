import "server-only";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_REVALIDATE_SECONDS, type CacheTag } from "@/lib/constants/cache";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

interface PublicClientOptions {
  /** Tags attached to every request so admin mutations can revalidate them. */
  tags: CacheTag[];
  revalidate?: number | false;
}

/**
 * Cookieless Supabase client for public pages. It never sees a user session,
 * so RLS only exposes published rows, and pages using it stay statically
 * cacheable (ISR) instead of rendering on every request.
 */
export function createPublicClient({ tags, revalidate = PUBLIC_REVALIDATE_SECONDS }: PublicClientOptions) {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate, tags } }),
    },
  });
}
