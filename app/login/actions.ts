"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { safeAdminRedirect, signInSchema } from "@/lib/validations/auth";

/** Email/password sign-in. Redirects to the requested admin page on success. */
export async function signIn(values: unknown, next: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) return actionError("Check the highlighted fields.", toFieldErrors(parsed.error));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "invalid_credentials" || error.status === 400) {
      return actionError("Email or password is incorrect.");
    }
    if (error.status === 429) return actionError("Too many attempts. Wait a minute, then try again.");
    console.error("[signIn]", error.status, error.message);
    return actionError("Sign-in is unavailable right now. Try again in a moment.");
  }

  redirect(safeAdminRedirect(next));
}
