import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getExperimentSlugs } from "@/lib/supabase/queries/innovation";
import { getPostSlugs } from "@/lib/supabase/queries/blog";
import { getProjectSlugs } from "@/lib/supabase/queries/projects";
import { getServiceSlugs } from "@/lib/supabase/queries/services";

const siteUrl = (path: string) => new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

/** Pages that always exist, in priority order. */
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/innovation", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/search", changeFrequency: "monthly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Sitemap for https://<site>/sitemap.xml.
 *
 * Published records are read with the cookieless client (RLS hides drafts).
 * If Supabase is unreachable the file still ships with every static route —
 * a sitemap that lists the core pages beats one that fails to render.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, experiments, posts] = await Promise.all([
    getServiceSlugs().catch(() => [] as string[]),
    getProjectSlugs().catch(() => [] as string[]),
    getExperimentSlugs().catch(() => [] as string[]),
    getPostSlugs().catch(() => [] as string[]),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: siteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...services.map((slug) => ({ url: siteUrl(`/services/${slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((slug) => ({ url: siteUrl(`/projects/${slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...experiments.map((slug) => ({ url: siteUrl(`/innovation/${slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((slug) => ({ url: siteUrl(`/blog/${slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
