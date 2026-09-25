import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import {
  getBlogPosts,
  getExperiments,
  getProducts,
  getProjects,
  getServices,
} from "@/lib/queries/content";

/**
 * The sitemap is generated from published records, so a page exists here if and
 * only if it is genuinely live. Unpublished, draft and future-dated content is
 * never advertised, which keeps crawlers from discovering noindex duplicates.
 */

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/work", priority: 0.8, changeFrequency: "monthly" },
  { path: "/lab", priority: 0.8, changeFrequency: "weekly" },
  { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, products, projects, experiments, posts] = await Promise.all([
    getServices(),
    getProducts(),
    getProjects(),
    getExperiments(),
    getBlogPosts(),
  ]);

  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Entities carry their own canonical URL when one is set in the admin panel;
  // an off-site canonical means we must not list our own copy.
  const isSelfCanonical = (canonical: string | null | undefined) =>
    !canonical || canonical.includes(absoluteUrl("").replace(/^https?:\/\//, ""));

  for (const service of services) {
    if (!isSelfCanonical(service.canonical_url)) continue;
    entries.push({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: new Date(service.updated_at ?? service.published_at ?? now),
      changeFrequency: "monthly",
      priority: service.featured ? 0.85 : 0.75,
    });
  }

  for (const product of products) {
    if (!isSelfCanonical(product.canonical_url)) continue;
    entries.push({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: new Date(product.updated_at ?? product.published_at ?? now),
      changeFrequency: product.status === "live" ? "weekly" : "monthly",
      priority: product.featured ? 0.85 : 0.7,
    });
  }

  for (const project of projects) {
    if (!isSelfCanonical(project.canonical_url)) continue;
    entries.push({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: new Date(project.updated_at ?? project.published_at ?? now),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  for (const experiment of experiments) {
    if (!isSelfCanonical(experiment.canonical_url)) continue;
    entries.push({
      url: absoluteUrl(`/lab/${experiment.slug}`),
      lastModified: new Date(experiment.updated_at ?? experiment.published_at ?? now),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const post of posts) {
    if (!isSelfCanonical(post.canonical_url)) continue;
    entries.push({
      url: absoluteUrl(`/insights/${post.slug}`),
      lastModified: new Date(post.updated_at ?? post.published_at ?? now),
      changeFrequency: "monthly",
      priority: post.is_pillar ? 0.8 : 0.65,
    });
  }

  // De-duplicate defensively: a misconfigured slug should not produce two URLs.
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
