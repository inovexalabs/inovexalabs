import "server-only";
import { cache } from "react";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import type { Tables } from "@/types/database";

export type SiteSettings = Omit<Tables<"site_settings">, "id" | "updated_at">;

/** One social link, as stored in site_settings.social_links. */
const socialLinkSchema = z.string().url().startsWith("https://");

export type SocialLinks = Partial<Record<string, string>>;

/**
 * Social links as a plain object of known keys → https URLs. Anything that
 * does not match is dropped instead of rendered.
 */
export function parseSocialLinks(value: unknown): SocialLinks {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const links: SocialLinks = {};
  for (const [key, raw] of Object.entries(value)) {
    const parsed = socialLinkSchema.safeParse(raw);
    if (parsed.success) links[key] = parsed.data;
  }
  return links;
}

/** The singleton settings row. Deduplicated per request (metadata + page share one call). */
export const getSiteSettings = cache(async (): Promise<QueryResult<SiteSettings>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.settings] });

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "site_name, hero_headline, hero_subheadline, hero_primary_cta_label, hero_primary_cta_href, hero_secondary_cta_label, hero_secondary_cta_href, seo_title, seo_description, studio_statement, contact_email, contact_phone, contact_address, social_links, footer_text, og_image_path, logo_path, favicon_path, analytics_id, final_cta_title, final_cta_description, final_cta_label, final_cta_href",
    )
    .eq("id", true)
    .maybeSingle();

  if (error) {
    return queryFailure("getSiteSettings", error.message, "Site content could not be loaded.");
  }

  if (!data) {
    return queryFailure(
      "getSiteSettings",
      "The site_settings row is missing. Apply the site_settings migration.",
      "Site content has not been set up yet.",
    );
  }

  return { data, error: null };
});
