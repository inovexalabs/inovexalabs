import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureAllowlisted } from "@/lib/admin/auth";

/**
 * Exchanges a Supabase auth code for a session, then continues to the requested
 * admin route. Used by the magic-link flow.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/admin";
  const next = nextParam.startsWith("/admin") ? nextParam : "/admin";

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/admin/login?error=link_expired`);
  }

  await ensureAllowlisted(data.user.email ?? "", data.user.id);

  return NextResponse.redirect(`${origin}${next}`);
}
