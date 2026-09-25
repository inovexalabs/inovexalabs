/**
 * Supabase configuration.
 *
 * The public site must remain renderable before Supabase is wired up (and in
 * preview environments where it is intentionally absent), so every data access
 * function checks `isSupabaseConfigured` and falls back to the editorial
 * baseline in `src/content`. Once the two public env vars are present, Supabase
 * becomes the single source of truth for all content.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/** Server-only. Never referenced from a Client Component. */
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const hasServiceRole = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

/**
 * Announces a swallowed read error instead of failing the render. Pages are
 * built to degrade into honest empty states; the admin panel surfaces details.
 */
export function reportQueryError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[inovexa:${scope}]`, error);
  }
}
