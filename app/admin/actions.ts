"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/utils/action-result";

export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[signOut]", error.message);
    return actionError("You couldn't be signed out. Try again.");
  }

  redirect("/login");
}
