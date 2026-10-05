import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { exactTerm, ilikeTerm } from "@/lib/supabase/queries/filter";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";
import { parseList, toParagraphs } from "@/lib/validations/common";
import { galleryEntrySchema, metricSchema } from "@/lib/validations/project";

const SUMMARY_COLUMNS =
  "slug, title, short_description, category, technologies, featured, cover_image_path, cover_image_alt, sort_order";

interface SummaryRow {
  slug: string;
  title: string;
  short_description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  cover_image_path: string | null;
  cover_image_alt: string | null;
}

export interface ProjectSummary {
  slug: string;
  title: string;
  short_description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  image: { url: string; alt: string } | null;
}

export interface ProjectFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ProjectPage {
  items: ProjectSummary[];
  total: number;
  page: number;
  pageCount: number;
}

export const PROJECTS_PAGE_SIZE = 9;

/** Maps a summary row to the shape the cards render. */
function toSummary(row: SummaryRow): ProjectSummary {
  return {
    slug: row.slug,
    title: row.title,
    short_description: row.short_description,
    category: row.category,
    technologies: row.technologies,
    featured: row.featured,
    image:
      row.cover_image_path && row.cover_image_alt
        ? { url: mediaUrl(row.cover_image_path), alt: row.cover_image_alt }
        : null,
  };
}

/**
 * Published projects, filtered server-side (search, category, featured) and
 * paginated. Nothing is shipped to the browser that the visitor did not ask for.
 */
export const getProjects = cache(async (filters: ProjectFilters = {}): Promise<QueryResult<ProjectPage>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.projects] });
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const pageSize = Math.max(1, Math.min(24, Math.floor(filters.pageSize ?? PROJECTS_PAGE_SIZE)));
  const pattern = ilikeTerm(filters.search);
  const category = exactTerm(filters.category);

  let query = supabase.from("projects").select(SUMMARY_COLUMNS, { count: "exact" }).eq("status", "published");

  if (filters.featured) query = query.eq("featured", true);
  if (category) query = query.ilike("category", category);
  if (pattern) query = query.or(`title.ilike.${pattern},short_description.ilike.${pattern}`);

  const { data, error, count } = await query
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    return queryFailure("getProjects", error.message, "Projects could not be loaded.");
  }

  const total = count ?? 0;
  return {
    data: {
      items: (data ?? []).map(toSummary),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
    },
    error: null,
  };
});

/** Every published project category, for the filter chips. */
export const getProjectCategories = cache(async (): Promise<QueryResult<string[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.projects] });

  const { data, error } = await supabase
    .from("projects")
    .select("category")
    .eq("status", "published")
    .order("category", { ascending: true });

  if (error) {
    return queryFailure("getProjectCategories", error.message, "Categories could not be loaded.");
  }

  const unique = [...new Set((data ?? []).map((row) => row.category))].filter((value) => value.trim().length > 0);
  return { data: unique, error: null };
});

/** Featured projects for the homepage. */
export const getFeaturedProjects = cache(async (limit = 6): Promise<QueryResult<ProjectSummary[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.projects] });

  const { data, error } = await supabase
    .from("projects")
    .select(SUMMARY_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true })
    .limit(limit);

  if (error) {
    return queryFailure("getFeaturedProjects", error.message, "Projects could not be loaded.");
  }

  return { data: (data ?? []).map(toSummary), error: null };
});

export interface ProjectDetail extends ProjectSummary {
  description: string[];
  client_name: string | null;
  industry: string | null;
  challenge: string[] | null;
  solution: string[] | null;
  implementation: string[] | null;
  results: string[] | null;
  metrics: { metric: string; label: string; description: string }[];
  gallery: { url: string; alt: string }[];
  project_url: string | null;
  github_url: string | null;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
}

/** One published project with its lists validated. `data: null` with no error means "not found". */
export const getProjectBySlug = cache(async (slug: string): Promise<QueryResult<ProjectDetail | null>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.projects] });

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return queryFailure("getProjectBySlug", error.message, "This project could not be loaded.");
  }
  if (!data) return { data: null, error: null };

  const context = `projects/${data.slug}`;
  const gallery = parseList(galleryEntrySchema, data.gallery, `${context}.gallery`);

  return {
    data: {
      ...toSummary(data),
      description: data.description ? toParagraphs(data.description) : [],
      client_name: data.client_name,
      industry: data.industry,
      challenge: data.challenge ? toParagraphs(data.challenge) : null,
      solution: data.solution ? toParagraphs(data.solution) : null,
      implementation: data.implementation ? toParagraphs(data.implementation) : null,
      results: data.results ? toParagraphs(data.results) : null,
      metrics: parseList(metricSchema, data.metrics, `${context}.metrics`),
      gallery: gallery.flatMap((entry) =>
        entry.path ? [{ url: mediaUrl(entry.path), alt: entry.alt }] : [],
      ),
      project_url: data.project_url,
      github_url: data.github_url,
      seo: { title: data.seo_title, description: data.seo_description },
      updatedAt: data.updated_at,
    },
    error: null,
  };
});

/** Slugs to pre-render at build time. New projects render on first request. */
export async function getProjectSlugs(): Promise<string[]> {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.projects] });
  const { data } = await supabase.from("projects").select("slug").eq("status", "published");
  return data?.map((row) => row.slug) ?? [];
}

export interface ProjectResult {
  slug: string;
  title: string;
  metrics: { metric: string; label: string; description: string }[];
}

/**
 * Published projects that actually carry measured results. Projects without
 * metrics are skipped entirely: the site never shows a number nobody entered.
 */
export const getProjectResults = cache(async (limit = 4): Promise<QueryResult<ProjectResult[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.projects] });

  const { data, error } = await supabase
    .from("projects")
    .select("slug, title, metrics, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(24);

  if (error) {
    return queryFailure("getProjectResults", error.message, "Results could not be loaded.");
  }

  const results = (data ?? [])
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      metrics: parseList(metricSchema, row.metrics, `projects/${row.slug}.metrics`),
    }))
    .filter((row) => row.metrics.length > 0)
    .slice(0, limit);

  return { data: results, error: null };
});
