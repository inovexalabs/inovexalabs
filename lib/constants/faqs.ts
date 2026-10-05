import type { Enums } from "@/types/database";

/**
 * Where an FAQ appears. Keep in sync with the `faq_page` enum in
 * supabase/migrations/20261004121600_faq_items.sql.
 */
export const FAQ_PAGES: Record<Enums<"faq_page">, string> = {
  general: "General",
  services: "Services",
  projects: "Projects",
  innovation: "Innovation Lab",
  blog: "Blog",
  contact: "Contact",
};

export const FAQ_PAGE_KEYS = Object.keys(FAQ_PAGES) as Enums<"faq_page">[];
