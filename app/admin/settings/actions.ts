"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { getAdminSession } from "@/lib/supabase/auth";
import { removeImages, uploadImage, validateImageFile } from "@/lib/supabase/media";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { settingsFormSchema, type SettingsFormValues } from "@/lib/validations/settings";

const NOT_ALLOWED = "Your account doesn't have permission to change site settings.";
const OWNER_ONLY = "Only the site owner can change site settings. Ask the owner to make this change, or to make you an owner.";

const SOCIAL_KEYS = ["github", "linkedin", "twitter", "youtube", "instagram", "discord"] as const;
type SocialKey = (typeof SOCIAL_KEYS)[number];

const SOCIAL_FIELD: Record<SocialKey, keyof SettingsFormValues> = {
  github: "social_github",
  linkedin: "social_linkedin",
  twitter: "social_twitter",
  youtube: "social_youtube",
  instagram: "social_instagram",
  discord: "social_discord",
};

/** Flat form fields → the `social_links` jsonb map (empty links are dropped). */
function socialLinksFrom(values: SettingsFormValues): Record<string, string> {
  const links: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const url = values[SOCIAL_FIELD[key]];
    if (typeof url === "string" && url.trim()) links[key] = url.trim();
  }
  return links;
}

/** Brand images on the settings row, keyed by the form field that carries each file. */
const BRAND_IMAGES = [
  { field: "logo", column: "logo_path", label: "Logo" },
  { field: "favicon", column: "favicon_path", label: "Favicon" },
] as const;

type BrandColumn = (typeof BRAND_IMAGES)[number]["column"];

const imageActionSchema = z.enum(["keep", "remove", "replace"]).catch("keep");

/**
 * Save the singleton site_settings row. The row is owned by owners in RLS;
 * editors get a clear permission error instead of a silent failure.
 */
export async function saveSettings(formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return actionError(NOT_ALLOWED);
  // RLS lets only owners update this row. Without this check an editor's save
  // would update nothing and still look successful.
  if (session.role !== "owner") return actionError(OWNER_ONLY);

  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") {
    return actionError("The form could not be read. Reload the page and try again.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return actionError("The form could not be read. Reload the page and try again.");
  }

  const parsed = settingsFormSchema.safeParse(payload);
  if (!parsed.success) return actionError("Some fields need attention.", toFieldErrors(parsed.error));
  const v = parsed.data;

  const row = {
    site_name: v.site_name,
    studio_statement: v.studio_statement || null,
    hero_headline: v.hero_headline,
    hero_subheadline: v.hero_subheadline,
    hero_primary_cta_label: v.hero_primary_cta_label,
    hero_primary_cta_href: v.hero_primary_cta_href,
    hero_secondary_cta_label: v.hero_secondary_cta_label,
    hero_secondary_cta_href: v.hero_secondary_cta_href,
    final_cta_title: v.final_cta_title,
    final_cta_description: v.final_cta_description,
    final_cta_label: v.final_cta_label,
    final_cta_href: v.final_cta_href,
    contact_email: v.contact_email || null,
    contact_phone: v.contact_phone || null,
    contact_address: v.contact_address || null,
    footer_text: v.footer_text || null,
    analytics_id: v.analytics_id || null,
    seo_title: v.seo_title || null,
    seo_description: v.seo_description || null,
    social_links: socialLinksFrom(v),
  };

  // Brand images: validate every new file before uploading any of them.
  const changes = BRAND_IMAGES.map((image) => {
    const action = imageActionSchema.parse(formData.get(`${image.field}Action`));
    const file = formData.get(image.field);
    return { ...image, action, file: action === "replace" && file instanceof File && file.size > 0 ? file : null };
  });
  for (const change of changes) {
    if (change.action !== "replace") continue;
    const problem = change.file ? validateImageFile(change.file) : "Choose an image to upload.";
    if (problem) return actionError(`${change.label}: ${problem}`, { [change.field]: problem });
  }

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("site_settings")
    .select("logo_path, favicon_path")
    .eq("id", true)
    .maybeSingle();
  if (readError || !current) {
    console.error("[saveSettings] could not read current settings:", readError?.message ?? "row missing");
    return actionError("Settings could not be saved. Try again in a moment.");
  }

  const images: Partial<Record<BrandColumn, string | null>> = {};
  const uploaded: string[] = [];
  const replaced: string[] = [];
  for (const change of changes) {
    if (change.action === "keep") continue;
    if (change.action === "remove") {
      images[change.column] = null;
    } else if (change.file) {
      const upload = await uploadImage(supabase, "site", change.file);
      if ("error" in upload) {
        await removeImages(supabase, uploaded);
        return actionError(`${change.label}: ${upload.error}`, { [change.field]: upload.error });
      }
      uploaded.push(upload.path);
      images[change.column] = upload.path;
    }
    replaced.push(current[change.column] ?? "");
  }

  const { data: updated, error } = await supabase
    .from("site_settings")
    .update({ ...row, ...images })
    .eq("id", true)
    .select("id");

  if (!error && (!updated || updated.length === 0)) {
    await removeImages(supabase, uploaded);
    console.error("[saveSettings] update matched no rows: the user is not allowed to update site_settings.");
    return actionError(OWNER_ONLY);
  }

  if (error) {
    await removeImages(supabase, uploaded);
    if (error.code === "42501") return actionError(OWNER_ONLY);
    if (error.code === "23514") {
      console.error("[saveSettings] check constraint failed:", error.message);
      return actionError(
        "Some content is outside the allowed limits. Check the character counts, then try again.",
      );
    }
    console.error("[saveSettings]", error.code, error.message);
    return actionError("Settings could not be saved. Try again in a moment.");
  }

  await removeImages(supabase, replaced);
  revalidateTag(CACHE_TAGS.settings);
  revalidatePath("/", "layout");
  return { ok: true, data: null, message: "Settings saved. The site now uses the new copy." };
}
