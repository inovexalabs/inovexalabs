import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Session-bound Supabase client for the admin area, login and Server Actions.
 * Queries run as the signed-in user, so RLS (is_admin()) decides access.
 * Never use it on public pages: reading cookies makes them render per request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Server Components cannot write cookies. Middleware refreshes the
          // session on every admin request, so this write is not needed there.
        }
      },
    },
  });
}
