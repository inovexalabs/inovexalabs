import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { tryCreateSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { User } from "@supabase/supabase-js";

/**
 * Admin authorisation is enforced in two independent places:
 *
 *   1. `middleware.ts` bounces unauthenticated traffic away from /admin.
 *   2. Row Level Security on every content table allows writes only when
 *      `public.is_admin()` is true, which consults the `admin_users` allowlist.
 *
 * This module adds the application-level check that turns "signed in" into
 * "signed in *and* on the allowlist", so the dashboard never renders for a
 * user whose writes would be rejected anyway.
 */

export interface AdminContext {
  user: User;
  email: string;
  isAdmin: boolean;
}

export async function getAdminContext(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: allowlist, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    email: user.email ?? "",
    isAdmin: !error && Boolean(allowlist),
  };
}

/** Redirects to the login screen unless the caller is an allowlisted admin. */
export async function requireAdmin(): Promise<AdminContext> {
  const context = await getAdminContext();

  if (!context) {
    redirect("/admin/login");
  }
  if (!context.isAdmin) {
    redirect("/admin/login?error=not_authorised");
  }
  return context;
}

/**
 * Bootstrap step.
 *
 * If `ADMIN_ALLOWED_EMAILS` contains the signed-in address and that user is not
 * yet on the allowlist, add them. This is deliberately gated on an environment
 * variable, so the only accounts that can self-promote are ones an operator
 * explicitly named. Without the variable, promotion is a manual SQL step.
 */
export async function ensureAllowlisted(email: string, userId: string) {
  const allowed = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) return { promoted: false, reason: "no_allowlist_configured" as const };
  if (!allowed.includes(email.trim().toLowerCase())) {
    return { promoted: false, reason: "email_not_allowed" as const };
  }

  const admin = tryCreateSupabaseAdminClient();
  if (!admin) return { promoted: false, reason: "service_role_missing" as const };

  const { error } = await admin
    .from("admin_users")
    .upsert({ user_id: userId, email }, { onConflict: "user_id" });

  if (error) return { promoted: false, reason: "write_failed" as const };
  return { promoted: true, reason: "promoted" as const };
}
