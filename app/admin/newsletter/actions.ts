"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/utils/action-result";
import { uuidSchema } from "@/lib/validations/common";

const NOT_ALLOWED = "Your account doesn't have permission to manage subscribers.";

const statusSchema = z.enum(["active", "unsubscribed"]);

/** Reactivate or unsubscribe a subscriber. */
export async function setSubscriberStatus(id: string, input: unknown): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("That subscriber could not be found.");

  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return actionError("That change is not valid.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: parsed.data })
    .eq("id", id)
    .select("id, email")
    .maybeSingle();

  if (error) {
    console.error("[setSubscriberStatus]", error.code, error.message);
    return actionError("The change could not be saved. Try again in a moment.");
  }
  if (!data) return actionError("This subscriber no longer exists.");

  revalidatePath("/admin/newsletter", "page");
  const label = parsed.data === "active" ? "re-activated" : "unsubscribed";
  return { ok: true, data: null, message: `${data.email} ${label}.` };
}

/** Permanently remove a subscriber. */
export async function deleteSubscriber(id: string): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("That subscriber could not be found.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id)
    .select("id, email")
    .maybeSingle();

  if (error) {
    console.error("[deleteSubscriber]", error.code, error.message);
    return actionError("The subscriber could not be removed. Try again in a moment.");
  }
  if (!data) return actionError("This subscriber was already removed.");

  revalidatePath("/admin/newsletter", "page");
  return { ok: true, data: null, message: `${data.email} was removed.` };
}
