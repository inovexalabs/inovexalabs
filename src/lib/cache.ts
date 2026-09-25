import { unstable_cache } from "next/cache";

/**
 * Cache tags. Admin mutations revalidate by tag, so an edit in the dashboard
 * appears on the public site immediately without a redeploy — while reads stay
 * cached between requests so the site renders from a warm cache rather than
 * hitting Postgres on every visit.
 */
export const TAGS = {
  settings: "settings",
  services: "services",
  products: "products",
  projects: "projects",
  experiments: "experiments",
  blog: "blog",
  technologies: "technologies",
  team: "team",
  testimonials: "testimonials",
  seo: "seo",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];

/** Default freshness window. Mutations invalidate eagerly; this is the safety net. */
const DEFAULT_REVALIDATE = 600;

export function cachedRead<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  tags: CacheTag[],
  revalidate = DEFAULT_REVALIDATE,
) {
  return unstable_cache(fn, keyParts, { tags, revalidate });
}
