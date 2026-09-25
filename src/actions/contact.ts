"use server";

import { headers } from "next/headers";
import crypto from "node:crypto";
import { inquirySchema, toFieldErrors, type FormState } from "@/lib/validation";
import { tryCreateSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const MIN_FILL_TIME_MS = 2000;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Hashed rather than stored raw: enough for abuse triage, not a privacy liability. */
function hashIp(ip: string) {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 16) ?? "inovexa";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not configured — the honeypot is the only gate.

  try {
    const body = new FormData();
    body.append("secret", secret);
    body.append("response", token);
    if (ip) body.append("remoteip", ip);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, cache: "no-store" },
    );
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // A verification outage should not silently drop real leads.
    return true;
  }
}

export async function submitInquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    company: readString(formData, "company"),
    phone: readString(formData, "phone"),
    projectType: readString(formData, "projectType"),
    budgetRange: readString(formData, "budgetRange"),
    timeline: readString(formData, "timeline"),
    description: readString(formData, "description"),
    referralSource: readString(formData, "referralSource"),
    honeypot: readString(formData, "website"),
    renderedAt: readString(formData, "renderedAt") || undefined,
  };

  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
      values: { ...raw, honeypot: "" },
    };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "";

  // Gate 1 — honeypot.
  if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
    return { status: "success", message: "Thank you — we'll be in touch shortly." };
  }

  // Gate 2 — a form completed faster than a human can read it.
  if (parsed.data.renderedAt && Date.now() - parsed.data.renderedAt < MIN_FILL_TIME_MS) {
    return {
      status: "error",
      message: "That was submitted a little too quickly. Please try again.",
      values: { ...raw, honeypot: "" },
    };
  }

  // Gate 3 — optional CAPTCHA.
  const token = readString(formData, "cf-turnstile-response");
  if (!(await verifyTurnstile(token, ip))) {
    return {
      status: "error",
      message: "We could not verify that submission. Please try again.",
      values: { ...raw, honeypot: "" },
    };
  }

  const admin = tryCreateSupabaseAdminClient();

  if (!admin) {
    // Inquiries are never written with the anon key: the table has no public
    // policy by design. Without the service-role key the honest thing to do is
    // fail loudly and give the visitor a working alternative.
    console.error(
      "[inovexa:contact] SUPABASE_SERVICE_ROLE_KEY is not configured; inquiry could not be stored.",
    );
    return {
      status: "error",
      message: isSupabaseConfigured
        ? "Our form service is not fully configured yet. Please email us directly and we will respond."
        : "Our form service is not configured yet. Please email us directly and we will respond.",
      values: { ...raw, honeypot: "" },
    };
  }

  const { error } = await admin.from("contact_inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company || null,
    phone: parsed.data.phone || null,
    project_type: parsed.data.projectType || null,
    budget_range: parsed.data.budgetRange || null,
    timeline: parsed.data.timeline || null,
    description: parsed.data.description,
    referral_source: parsed.data.referralSource || null,
    status: "new",
    ip_hash: ip ? hashIp(ip) : null,
    user_agent: requestHeaders.get("user-agent")?.slice(0, 400) ?? null,
  });

  if (error) {
    console.error("[inovexa:contact] insert failed", error);
    return {
      status: "error",
      message: "Something went wrong saving your message. Please email us directly.",
      values: { ...raw, honeypot: "" },
    };
  }

  return { status: "success", message: "Thank you — we'll be in touch shortly." };
}
