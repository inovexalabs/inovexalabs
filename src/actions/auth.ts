"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureAllowlisted } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AuthState } from "@/lib/admin/form-state";

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run the migrations.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { status: "error", message: "Enter both your email address and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    // Deliberately vague: never reveal whether an address exists.
    return { status: "error", message: "Those credentials were not accepted." };
  }

  // Promote the user if an operator named them in ADMIN_ALLOWED_EMAILS.
  const promotion = await ensureAllowlisted(data.user.email ?? email, data.user.id);

  if (!promotion.promoted) {
    const { data: allowlisted } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!allowlisted) {
      redirect("/admin/login?error=not_authorised");
    }
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function sendMagicLink(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase is not configured." };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { status: "error", message: "Enter your email address first." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/admin`,
    },
  });

  if (error) {
    return { status: "error", message: "Could not send the link. Try a password instead." };
  }

  return {
    status: "magic_link_sent",
    message: `If ${email} has an account, a sign-in link is on its way.`,
  };
}
