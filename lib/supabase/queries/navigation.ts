import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { PRIMARY_NAV, ROUTES } from "@/lib/constants/routes";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import type { Enums } from "@/types/database";

export interface NavLink {
  label: string;
  href: string;
}

/**
 * Fallback header links, used when the navigation table has no published rows
 * (fresh install, outage). The Solutions entry opens the services menu, so it
 * is marked exactly like the built-in list.
 */
const FALLBACK_HEADER: NavLink[] = PRIMARY_NAV.map(({ label, href }) => ({ label, href }));

const FALLBACK_FOOTER: NavLink[] = [
  { label: "Services", href: ROUTES.services },
  { label: "Projects", href: ROUTES.projects },
  { label: "Innovation Lab", href: ROUTES.innovation },
  { label: "About", href: ROUTES.about },
  { label: "Blog", href: ROUTES.blog },
  { label: "Contact", href: ROUTES.contact },
];

/** Published navigation rows for one location (header or footer). */
export const getNavigationItems = cache(
  async (location: Enums<"nav_location">): Promise<QueryResult<NavLink[]>> => {
    const supabase = createPublicClient({ tags: [CACHE_TAGS.navigation] });

    const { data, error } = await supabase
      .from("navigation_items")
      .select("label, href")
      .eq("location", location)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true });

    if (error) {
      return queryFailure("getNavigationItems", error.message, "Navigation could not be loaded.");
    }

    // No published rows: fall back to the built-in route list so the site is
    // never left without navigation.
    if (!data || data.length === 0) {
      return { data: location === "header" ? FALLBACK_HEADER : FALLBACK_FOOTER, error: null };
    }

    return { data, error: null };
  },
);
