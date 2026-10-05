import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

const LOGIN_PATH = "/login";
const ADMIN_PATH = "/admin";

/**
 * Refreshes the Supabase session cookie and handles the authentication gate:
 * anonymous visitors to /admin go to /login; signed-in visitors to /login go
 * to /admin. Admin *authorization* (admin_users membership) is checked by the
 * admin layout, every admin page and every Server Action — and enforced by RLS.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // Validates the token with Supabase Auth (not just the cookie contents).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isAdminRoute = pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);

  if (!user && isAdminRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return redirectWithCookies(loginUrl, response);
  }

  if (user && pathname === LOGIN_PATH) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_PATH;
    adminUrl.search = "";
    return redirectWithCookies(adminUrl, response);
  }

  return response;
}

/** Redirects while keeping any refreshed auth cookies and no-cache headers. */
function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  return redirect;
}
