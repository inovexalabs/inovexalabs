/** Cache tags for public Supabase reads. Admin mutations call revalidateTag() with these. */
export const CACHE_TAGS = {
  services: "services",
  settings: "settings",
  capabilities: "capabilities",
  process: "process",
  projects: "projects",
  innovation: "innovation",
  technologies: "technologies",
  testimonials: "testimonials",
  team: "team",
  blog: "blog",
  faqs: "faqs",
  navigation: "navigation",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Fallback freshness for public content when no admin mutation has revalidated it. */
export const PUBLIC_REVALIDATE_SECONDS = 3600;
