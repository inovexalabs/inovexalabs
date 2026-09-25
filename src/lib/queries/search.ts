import { getPublicClient } from "@/lib/supabase/public";
import { reportQueryError } from "@/lib/supabase/config";
import {
  fallbackExperiments,
  fallbackPosts,
  fallbackProducts,
  fallbackServices,
} from "@/content/fallback";
import type { SearchHit } from "@/types/content";

const KIND_ROUTES: Record<SearchHit["kind"], string> = {
  product: "/products",
  project: "/work",
  service: "/services",
  insight: "/insights",
  experiment: "/lab",
};

export function searchHref(hit: Pick<SearchHit, "kind" | "slug">) {
  return `${KIND_ROUTES[hit.kind]}/${hit.slug}`;
}

export const SEARCH_KIND_META: Record<SearchHit["kind"], { label: string }> = {
  product: { label: "Product" },
  project: { label: "Client work" },
  service: { label: "Service" },
  insight: { label: "Insight" },
  experiment: { label: "Experiment" },
};

/** Escapes a user string for use inside a PostgREST `or` filter. */
function escapeFilter(input: string) {
  return input.replace(/[%,()\\]/g, " ").replace(/\s+/g, " ").trim();
}

export async function searchSite(rawQuery: string, limit = 40): Promise<SearchHit[]> {
  const query = escapeFilter(rawQuery);
  if (query.length < 2) return [];
  const pattern = `%${query}%`;

  const db = getPublicClient();

  if (!db) {
    // Local search over the editorial baseline.
    const needle = query.toLowerCase();
    const pools: { kind: SearchHit["kind"]; rows: { slug: string; title: string; subtitle: string | null; published_at: string | null; haystack: string }[] }[] = [
      {
        kind: "product",
        rows: fallbackProducts.map((p) => ({
          slug: p.slug,
          title: p.name,
          subtitle: p.tagline,
          published_at: p.published_at,
          haystack: [p.name, p.tagline, p.short_description, p.technologies.join(" ")].join(" "),
        })),
      },
      {
        kind: "service",
        rows: fallbackServices.map((s) => ({
          slug: s.slug,
          title: s.title,
          subtitle: s.tagline,
          published_at: s.published_at,
          haystack: [s.title, s.tagline, s.summary].join(" "),
        })),
      },
      {
        kind: "experiment",
        rows: fallbackExperiments.map((e) => ({
          slug: e.slug,
          title: e.title,
          subtitle: e.summary,
          published_at: e.published_at,
          haystack: [e.title, e.summary, e.hypothesis, e.technologies.join(" ")].join(" "),
        })),
      },
      {
        kind: "insight",
        rows: fallbackPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          subtitle: p.excerpt,
          published_at: p.published_at,
          haystack: [p.title, p.excerpt, p.content].join(" "),
        })),
      },
    ];

    return pools
      .flatMap((pool) =>
        pool.rows
          .filter((r) => r.haystack.toLowerCase().includes(needle))
          .map((r) => ({
            kind: pool.kind,
            slug: r.slug,
            title: r.title,
            subtitle: r.subtitle,
            keywords: null,
            published_at: r.published_at,
          })),
      )
      .slice(0, limit);
  }

  const { data, error } = await db
    .from("search_index")
    .select("*")
    .or(
      [
        `title.ilike.${pattern}`,
        `subtitle.ilike.${pattern}`,
        `keywords.ilike.${pattern}`,
        `slug.ilike.${pattern}`,
      ].join(","),
    )
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    reportQueryError("searchSite", error);
    return [];
  }

  return (data ?? []) as SearchHit[];
}
