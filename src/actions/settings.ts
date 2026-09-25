"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { TAGS } from "@/lib/cache";
import { slugify } from "@/lib/utils";
import type { SettingsState } from "@/lib/admin/form-state";

/**
 * Saves site settings.
 *
 * Values are JSON blobs so the admin panel can evolve the shape of company
 * information, homepage copy and SEO defaults without a migration. Each value
 * is parsed server-side and rejected if it is not valid JSON — the public site
 * reads these with typed fallbacks, so a malformed value never breaks a render.
 */
export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireAdmin();

  const keys = formData.getAll("__keys").map(String);
  const errors: Record<string, string> = {};
  interface Update {
    key: string;
    value: unknown;
    group_name?: string;
    label?: string;
    isNew?: boolean;
  }
  const updates: Update[] = [];

  for (const key of keys) {
    const raw = formData.get(`value:${key}`);
    if (typeof raw !== "string") continue;

    const trimmed = raw.trim();
    if (!trimmed) continue;

    try {
      updates.push({ key, value: JSON.parse(trimmed) });
    } catch {
      errors[key] = "That is not valid JSON. Check for a missing comma or quote.";
    }
  }

  // Optional new key.
  const newKey = String(formData.get("new_key") ?? "").trim();
  const newGroup = String(formData.get("new_group") ?? "general").trim() || "general";
  const newLabel = String(formData.get("new_label") ?? "").trim();
  const newValue = String(formData.get("new_value") ?? "").trim();

  if (newKey || newLabel) {
    const normalised = slugify(newKey || newLabel).replace(/-/g, "_");
    if (!normalised) {
      errors.__new = "Give the setting a key or a label.";
    } else {
      try {
        updates.push({
          key: normalised,
          value: newValue ? JSON.parse(newValue) : {},
          group_name: newGroup,
          label: newLabel || normalised,
          isNew: true,
        });
      } catch {
        errors.__new = "The new setting's value is not valid JSON.";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Some values were not saved.", errors };
  }

  if (updates.length === 0) {
    return { status: "error", message: "Nothing to save." };
  }

  const supabase = await createSupabaseServerClient();

  const results = await Promise.all(
    updates.map((update) => {
      // Only send group_name/label for a new key; omitting them on an existing
      // key leaves the existing metadata untouched.
      const payload: Record<string, unknown> = {
        key: update.key,
        value: update.value,
      };
      if (update.isNew) {
        payload.group_name = update.group_name ?? "general";
        payload.label = update.label ?? update.key;
      }

      return supabase
        .from("site_settings")
        .upsert(payload, { onConflict: "key", ignoreDuplicates: false })
        .select("key")
        .single();
    }),
  );

  const failed = results.filter((result) => result.error);
  if (failed.length > 0) {
    console.error("[inovexa:admin:settings]", failed[0]?.error);
    return {
      status: "error",
      message: "The database rejected the save. Check the server log for details.",
    };
  }

  // Settings feed navigation, hero copy, company details and SEO defaults.
  revalidateTag(TAGS.settings);
  revalidateTag(TAGS.seo);
  revalidatePath("/", "layout");

  return { status: "success", message: `Saved ${updates.length} setting(s). The site is updated.` };
}
