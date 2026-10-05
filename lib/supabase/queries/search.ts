import "server-only";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { ROUTES } from "@/lib/constants/routes";
import { createPublicClient } from "@/lib/supabase/public";
import { ilikeTerm } from "@/lib/supabase/queries/filter";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { labStageLabel } from "@/lib/constants/innovation";

export type SearchCategory = "services" | "projects" | "innovation" | "blog";

export interface SearchHit {
  category: SearchCategory;
  title: string;
  description: string;
  href: string;
}

export interface SearchResults {
  hits: SearchHit[];
  counts: Record<SearchCategory, number>;
}

const HITS_PER_CATEGORY = 4;

const EMPTY_COUNTS: Record<SearchCategory, number> = {
  services: 0,
  projects: 0,
  innovation: 0,
  blog: 0,
};

/**
 * Global site search across services, projects, experiments and articles.
 * Runs on the server and returns a handful of ranked-by-order results per
 * category — the whole content table never reaches the browser.
 */
export async function searchSite(term: string): Promise<QueryResult<SearchResults>> {
  const pattern = ilikeTerm(term);
  if (!pattern) return { data: { hits: [], counts: { ...EMPTY_COUNTS } }, error: null };

  const supabase = createPublicClient({ tags: [CACHE_TAGS.services, CACHE_TAGS.projects, CACHE_TAGS.innovation, CACHE_TAGS.blog] });
  const limit = HITS_PER_CATEGORY;

  const [services, projects, innovation, posts] = await Promise.all([
    supabase
      .from("services")
      .select("slug, title, summary")
      .eq("status", "published")
      .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
      .order("sort_order", { ascending: true })
      .limit(limit),
    supabase
      .from("projects")
      .select("slug, title, short_description")
      .eq("status", "published")
      .or(`title.ilike.${pattern},short_description.ilike.${pattern}`)
      .order("sort_order", { ascending: true })
      .limit(limit),
    supabase
      .from("innovation_projects")
      .select("slug, title, description, stage")
      .eq("status", "published")
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .order("sort_order", { ascending: true })
      .limit(limit),
    supabase
      .from("blog_posts")
      .select("slug, title, excerpt")
      .eq("status", "published")
      .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit),
  ]);

  const failure = services.error ?? projects.error ?? innovation.error ?? posts.error;
  if (failure) return queryFailure("searchSite", failure.message, "Search is unavailable right now.");

  const hits: SearchHit[] = [
    ...(services.data ?? []).map((row) => ({
      category: "services" as const,
      title: row.title,
      description: row.summary,
      href: ROUTES.service(row.slug),
    })),
    ...(projects.data ?? []).map((row) => ({
      category: "projects" as const,
      title: row.title,
      description: row.short_description,
      href: ROUTES.project(row.slug),
    })),
    ...(innovation.data ?? []).map((row) => ({
      category: "innovation" as const,
      title: row.title,
      description: `${labStageLabel(row.stage)} · ${row.description}`,
      href: ROUTES.innovationItem(row.slug),
    })),
    ...(posts.data ?? []).map((row) => ({
      category: "blog" as const,
      title: row.title,
      description: row.excerpt,
      href: ROUTES.blogPost(row.slug),
    })),
  ];

  const counts: Record<SearchCategory, number> = {
    services: services.data?.length ?? 0,
    projects: projects.data?.length ?? 0,
    innovation: innovation.data?.length ?? 0,
    blog: posts.data?.length ?? 0,
  };

  return { data: { hits, counts }, error: null };
}
