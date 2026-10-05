import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { TECH_CATEGORIES, TECH_CATEGORY_KEYS } from "@/lib/constants/tech";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";
import type { Enums } from "@/types/database";

export interface Technology {
  slug: string;
  name: string;
  category: Enums<"tech_category">;
  description: string | null;
  website: string | null;
  logo: { url: string; alt: string } | null;
}

export interface TechnologyGroup {
  category: Enums<"tech_category">;
  label: string;
  items: Technology[];
}

/**
 * Published technologies grouped by category, in category order. Listing a
 * technology is an admin action: nothing here is inferred from other content.
 */
export const getTechnologies = cache(async (): Promise<QueryResult<Technology[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.technologies] });

  const { data, error } = await supabase
    .from("technologies")
    .select("slug, name, category, description, website, logo_path, logo_alt, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return queryFailure("getTechnologies", error.message, "Our technology stack could not be loaded.");
  }

  return {
    data: (data ?? []).map((row) => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      description: row.description,
      website: row.website,
      logo: row.logo_path && row.logo_alt ? { url: mediaUrl(row.logo_path), alt: row.logo_alt } : null,
    })),
    error: null,
  };
});

/** The same list grouped for rendering, with empty categories dropped. */
export const getTechnologyGroups = cache(async (): Promise<QueryResult<TechnologyGroup[]>> => {
  const result = await getTechnologies();
  if (result.data === null) {
    return { data: null, error: result.error ?? "Our technology stack could not be loaded." };
  }

  const groups = TECH_CATEGORY_KEYS.map((category) => ({
    category,
    label: TECH_CATEGORIES[category],
    items: result.data.filter((technology) => technology.category === category),
  })).filter((group) => group.items.length > 0);

  return { data: groups, error: null };
});
