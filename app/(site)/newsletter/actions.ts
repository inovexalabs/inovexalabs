"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { newsletterFormSchema, type NewsletterFormValues } from "@/lib/validations/contact";

const THROTTLE_MS = 30_000;
const lastSubmission = new Map<string, number>();

async function isThrottled(): Promise<boolean> {
  const store = await headers();
  const ip = store.get("x-forwarded-for")?.split(",")[0]?.trim() || store.get("x-real-ip") || "unknown";
  const now = Date.now();
  const previous = lastSubmission.get(ip);
  if (lastSubmission.size > 500) lastSubmission.clear();
  if (previous && now - previous < THROTTLE_MS) return true;
  lastSubmission.set(ip, now);
  return false;
}

/**
 * Newsletter signup. Anyone may subscribe (anon insert policy); duplicates
 * are treated as success so the form never reveals who is already listed.
 * No emails are sent until an email provider is configured for the project.
 */
export async function subscribeNewsletter(input: NewsletterFormValues): Promise<ActionResult<{ subscribed: boolean }>> {
  const parsed = newsletterFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Check the email address and try again.", toFieldErrors(parsed.error));
  }
  if (parsed.data.website) return actionError("Your submission was rejected. Please try again.");
  if (await isThrottled()) return actionError("Please wait a moment before subscribing again.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.data.email.toLowerCase(), status: "active", source: "site" },
      { onConflict: "email", ignoreDuplicates: true },
    )
    .select("id")
    .maybeSingle();

  if (error) {
    // A conflicting duplicate row with a different status: reactivate it instead.
    if (error.code === "23505") {
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ status: "active" })
        .eq("email", parsed.data.email.toLowerCase());
      if (!updateError) return { ok: true, data: { subscribed: true }, message: "" };
    }

    console.error("[subscribeNewsletter]", error.code, error.message);
    return actionError("Subscribing failed. Please try again in a moment.");
  }

  return { ok: true, data: { subscribed: true }, message: "" };
}
