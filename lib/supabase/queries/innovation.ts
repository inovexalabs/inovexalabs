import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { INNOVATION_CATEGORIES, LAB_STAGES, labStageLabel } from "@/lib/constants/innovation";
import { createPublicClient } from "@/lib/supabase/public";
import { exactTerm, ilikeTerm } from "@/lib/supabase/queries/filter";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";
import { toParagraphs } from "@/lib/validations/common";
import type { Enums } from "@/types/database";

const SUMMARY_COLUMNS =
  "slug, title, category, stage, description, technologies, featured, cover_image_path, cover_image_alt, sort_order";

interface SummaryRow {
  slug: string;
  title: string;
  category: Enums<"innovation_category">;
  stage: Enums<"lab_stage">;
  description: string;
  technologies: string[];
  featured: boolean;
  cover_image_path: string | null;
  cover_image_alt: string | null;
}

export interface ExperimentSummary {
  slug: string;
  title: string;
  category: Enums<"innovation_category">;
  categoryLabel: string;
  stage: Enums<"lab_stage">;
  stageLabel: string;
  description: string;
  technologies: string[];
  featured: boolean;
  image: { url: string; alt: string } | null;
}

export interface ExperimentFilters {
  search?: string;
  category?: string;
  stage?: string;
}

export const INNOVATION_PAGE_SIZE = 9;

function toSummary(row: SummaryRow): ExperimentSummary {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    categoryLabel: INNOVATION_CATEGORIES[row.category] ?? "Other",
    stage: row.stage,
    stageLabel: labStageLabel(row.stage),
    description: row.description,
    technologies: row.technologies,
    featured: row.featured,
    image:
      row.cover_image_path && row.cover_image_alt
        ? { url: mediaUrl(row.cover_image_path), alt: row.cover_image_alt }
        : null,
  };
}

/** Published experiments, optionally filtered by search, category or stage. */
export const getExperiments = cache(
  async (filters: ExperimentFilters = {}): Promise<QueryResult<ExperimentSummary[]>> => {
    const supabase = createPublicClient({ tags: [CACHE_TAGS.innovation] });
    const pattern = ilikeTerm(filters.search);
    const category = exactTerm(filters.category, 40);
    const stage = exactTerm(filters.stage, 20);

    let query = supabase.from("innovation_projects").select(SUMMARY_COLUMNS).eq("status", "published");

    if (category) {
      const key = category.toLowerCase() as Enums<"innovation_category">;
      if (key in INNOVATION_CATEGORIES) query = query.eq("category", key);
    }
    if (stage) {
      const key = stage.toLowerCase() as Enums<"lab_stage">;
      if (key in LAB_STAGES) query = query.eq("stage", key);
    }
    if (pattern) query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`);

    const { data, error } = await query.order("sort_order", { ascending: true }).order("title", { ascending: true });

    if (error) {
      return queryFailure("getExperiments", error.message, "Experiments could not be loaded.");
    }

    return { data: (data ?? []).map(toSummary), error: null };
  },
);

/** Selected experiments for the homepage "In the Lab" section. */
export const getFeaturedExperiments = cache(async (limit = 3): Promise<QueryResult<ExperimentSummary[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.innovation] });

  const { data, error } = await supabase
    .from("innovation_projects")
    .select(SUMMARY_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true })
    .limit(limit);

  if (error) {
    return queryFailure("getFeaturedExperiments", error.message, "Experiments could not be loaded.");
  }

  return { data: (data ?? []).map(toSummary), error: null };
});

export interface ExperimentDetail extends ExperimentSummary {
  long_description: string[];
  problem: string[] | null;
  experiment: string[] | null;
  learnings: string[] | null;
  future_direction: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
}

const paragraphsOr = (value: string | null): string[] | null => (value ? toParagraphs(value) : null);

/** One published experiment. `data: null` with no error means "not found". */
export const getExperimentBySlug = cache(async (slug: string): Promise<QueryResult<ExperimentDetail | null>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.innovation] });

  const { data, error } = await supabase
    .from("innovation_projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return queryFailure("getExperimentBySlug", error.message, "This experiment could not be loaded.");
  }
  if (!data) return { data: null, error: null };

  return {
    data: {
      ...toSummary(data),
      long_description: data.long_description ? toParagraphs(data.long_description) : [],
      problem: paragraphsOr(data.problem),
      experiment: paragraphsOr(data.experiment),
      learnings: paragraphsOr(data.learnings),
      future_direction: paragraphsOr(data.future_direction),
      github_url: data.github_url,
      demo_url: data.demo_url,
      seo: { title: data.seo_title, description: data.seo_description },
      updatedAt: data.updated_at,
    },
    error: null,
  };
});

/** Slugs to pre-render at build time. */
export async function getExperimentSlugs(): Promise<string[]> {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.innovation] });
  const { data } = await supabase.from("innovation_projects").select("slug").eq("status", "published");
  return data?.map((row) => row.slug) ?? [];
}
