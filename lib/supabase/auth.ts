import "server-only";
import type { User } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export type AdminRole = Enums<"admin_role">;

export interface AdminSession {
  user: User;
  role: AdminRole;
}

/** The verified signed-in user, or null. One Auth round-trip per request. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});

/**
 * Authorization, separate from authentication: a user is an admin only with
 * a row in admin_users. Returns null for anonymous users and non-admins.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_users").select("role").eq("user_id", user.id).maybeSingle();

  if (error) {
    console.error("[getAdminSession]", error.message);
    return null;
  }

  return data ? { user, role: data.role } : null;
});

/**
 * Guard for admin pages. Anonymous visitors are sent to sign in; signed-in
 * non-admins get a 404 (the admin layout shows them an explanation instead).
 */
export async function requireAdmin(nextPath = "/admin"): Promise<AdminSession> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const session = await getAdminSession();
  if (!session) notFound();

  return session;
}
