"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { createClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/utils/action-result";

/**
 * First-party page-view counter, exactly what the cookie policy describes:
 * path, referrer and a one-way hash — never a cookie and never a profile.
 *
 * Nothing is recorded until the operator sets an analytics ID in
 * /admin/settings; without one this action is a no-op. Telemetry must never
 * break the page, so unexpected failures are logged server-side and reported
 * to the (silent) client rather than thrown.
 */

const pageviewSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1, "Path is required.")
    .max(300, "Path is too long.")
    .regex(/^\/[^\s]*$/, "Path is not a valid site path.")
    .refine((path) => !path.startsWith("/admin") && !path.startsWith("/api"), {
      message: "Only public pages are counted.",
    }),
  referrer: z
    .string()
    .trim()
    .max(500, "Referrer is too long.")
    .regex(/^(https?:\/\/\S*)?$/, "Referrer is not a valid URL.")
    .optional()
    .transform((value) => (value ? value : null)),
});

/** Best-effort per-instance throttle: one hit per path+client every 10s. */
const recentHits = new Map<string, number>();
const THROTTLE_MS = 10_000;
const MAX_TRACKED_PATHS = 2_000;

export async function recordPageview(input: unknown): Promise<ActionResult> {
  const parsed = pageviewSchema.safeParse(input);
  if (!parsed.success) return actionError("That page view was not valid.");

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = requestHeaders.get("user-agent") ?? "unknown";

  // Settings decide whether counting is on at all (public read, ISR-cached).
  const { data: settings } = await getSiteSettings();
  const property = settings?.analytics_id ?? null;
  if (!property) return { ok: true, data: null, message: "Analytics disabled." };

  const now = Date.now();
  const key = `${ip}|${parsed.data.path}`;
  if ((recentHits.get(key) ?? 0) > now - THROTTLE_MS) {
    return { ok: true, data: null, message: "Throttled." };
  }
  if (recentHits.size >= MAX_TRACKED_PATHS) recentHits.clear();
  recentHits.set(key, now);

  const visitorHash = createHash("sha256")
    .update(`${property}|${ip}|${userAgent}`)
    .digest("hex")
    .slice(0, 40);

  const supabase = await createClient();
  const { error } = await supabase.from("analytics_events").insert({
    path: parsed.data.path,
    referrer: parsed.data.referrer,
    property,
    visitor_hash: visitorHash,
  });

  if (error) {
    console.error("[recordPageview]", error.code, error.message);
    return actionError("The view could not be recorded.");
  }

  return { ok: true, data: null, message: "Recorded." };
}
