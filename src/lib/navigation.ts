import { getNavigation } from "@/lib/queries/content";
import { primaryNav } from "@/config/site";
import type { NavigationItem } from "@/types/content";

/**
 * Header navigation with the structural baseline as a fallback, shared by the
 * header and the 404 page so a database outage never leaves the site unnavigable.
 */
export async function getNavFallback(): Promise<NavigationItem[]> {
  const nav = await getNavigation("header");
  if (nav.length > 0) return nav;

  return primaryNav.map((item, index) => ({
    id: `fallback-${index}`,
    location: "header" as const,
    parent_id: null,
    description: null,
    display_order: index,
    published: true,
    ...item,
  }));
}
