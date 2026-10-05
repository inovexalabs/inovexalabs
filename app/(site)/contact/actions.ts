"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

/** Reference shown to the visitor and used in admin, e.g. "INX-7F3K2Q". */
function referenceId(): string {
  const raw = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `INX-${raw}`;
}

/**
 * Naive per-IP throttle: one submission every 15 seconds. In-memory by
 * design — it stops accidental double-submits and scripted floods without
 * adding infrastructure, and the database constraints still apply either way.
 */
const THROTTLE_MS = 15_000;
const lastSubmission = new Map<string, number>();

async function isThrottled(): Promise<boolean> {
  const store = await headers();
  const ip = store.get("x-forwarded-for")?.split(",")[0]?.trim() || store.get("x-real-ip") || "unknown";
  const now = Date.now();
  const previous = lastSubmission.get(ip);

  // Keep the map bounded so it cannot grow without limit.
  if (lastSubmission.size > 1000) {
    for (const [key, timestamp] of lastSubmission) {
      if (now - timestamp > THROTTLE_MS) lastSubmission.delete(key);
    }
  }

  if (previous && now - previous < THROTTLE_MS) return true;
  lastSubmission.set(ip, now);
  return false;
}

function leadRow(values: ContactFormValues, reference: string) {
  return {
    reference_id: reference,
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    company: values.company || null,
    project_type: values.project_type,
    budget: values.budget,
    timeline: values.timeline,
    services: values.services,
    description: values.description,
    source: values.source,
  };
}

/**
 * Public project intake. Runs server-side only: the payload is parsed again
 * here (the browser copy is never trusted), the spam trap is checked, and the
 * lead is written with the visitor's own anon session — no service-role key
 * is involved, and RLS allows nothing but this insert.
 */
export async function submitContactForm(input: ContactFormValues): Promise<ActionResult<{ reference: string }>> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Some fields need attention. Check the highlighted fields and try again.", toFieldErrors(parsed.error));
  }
  const values = parsed.data;

  // Honeypot: hidden from real visitors, tempting for bots.
  if (values.website) return actionError("Your submission was rejected. Please try again.");

  if (await isThrottled()) {
    return actionError("You just sent a message. Wait a moment before sending another one.");
  }

  const supabase = await createClient();
  let reference = referenceId();
  let { error } = await supabase.from("contact_leads").insert(leadRow(values, reference));

  // Reference collision (astronomically unlikely): retry once with a new code.
  if (error?.code === "23505") {
    reference = referenceId();
    ({ error } = await supabase.from("contact_leads").insert(leadRow(values, reference)));
  }

  if (error) {
    console.error("[submitContactForm]", error.code, error.message);
    if (error.code === "42501") {
      return actionError("Submissions are temporarily disabled. Email us directly and we will get back to you.");
    }
    return actionError("Your message could not be sent. Please try again in a moment, or email us directly.");
  }

  return { ok: true, data: { reference }, message: "" };
}
