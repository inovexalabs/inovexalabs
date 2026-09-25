import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Request-scoped Supabase client for Server Components, Server Actions and
 * Route Handlers. Sessions ride on cookies managed by `middleware.ts`, so an
 * authenticated admin is visible to RLS as `authenticated`.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. Middleware refreshes the
          // session instead, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Returns a read client, or `null` when Supabase is not configured. Every
 * public data function uses this so the site renders from the editorial
 * baseline before the database exists.
 */
export async function getReadClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseServerClient();
}
