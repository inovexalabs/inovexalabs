import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";
import {
  faqItemSchema,
  parseList,
  titledItemSchema,
  toParagraphs,
  type FaqItem,
  type TitledItem,
} from "@/lib/validations/service";
import type { Tables } from "@/types/database";

export type ServiceSummary = Pick<Tables<"services">, "slug" | "title" | "summary" | "icon">;

/**
 * Published services in admin-defined order: the Solutions menu, the hero
 * map, the homepage cards and /services all read this. Deduplicated per request.
 */
export const getServiceSummaries = cache(async (): Promise<QueryResult<ServiceSummary[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.services] });

  const { data, error } = await supabase
    .from("services")
    .select("slug, title, summary, icon")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return queryFailure("getServiceSummaries", error.message, "Services could not be loaded.");
  }

  return { data, error: null };
});

export interface ServiceDetail {
  slug: string;
  title: string;
  summary: string;
  overview: string[];
  icon: string;
  image: { url: string; alt: string } | null;
  problems: TitledItem[];
  features: TitledItem[];
  technologies: string[];
  process: TitledItem[];
  outcomes: TitledItem[];
  faqs: FaqItem[];
  cta: { title: string; description: string; label: string; href: string };
  seo: { title: string | null; description: string | null };
  updatedAt: string;
}

/** One published service with its lists validated. `data: null` with no error means "not found". */
export const getServiceBySlug = cache(async (slug: string): Promise<QueryResult<ServiceDetail | null>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.services] });

  const { data, error } = await supabase
    .from("services")
    .select(
      "slug, title, summary, overview, icon, cover_image_path, cover_image_alt, problems, features, technologies, process, outcomes, faqs, cta_title, cta_description, cta_label, cta_href, seo_title, seo_description, updated_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return queryFailure("getServiceBySlug", error.message, "This service could not be loaded.");
  }
  if (!data) return { data: null, error: null };

  const context = `services/${data.slug}`;
  return {
    data: {
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      overview: toParagraphs(data.overview),
      icon: data.icon,
      image:
        data.cover_image_path && data.cover_image_alt
          ? { url: mediaUrl(data.cover_image_path), alt: data.cover_image_alt }
          : null,
      problems: parseList(titledItemSchema, data.problems, `${context}.problems`),
      features: parseList(titledItemSchema, data.features, `${context}.features`),
      technologies: data.technologies,
      process: parseList(titledItemSchema, data.process, `${context}.process`),
      outcomes: parseList(titledItemSchema, data.outcomes, `${context}.outcomes`),
      faqs: parseList(faqItemSchema, data.faqs, `${context}.faqs`),
      cta: { title: data.cta_title, description: data.cta_description, label: data.cta_label, href: data.cta_href },
      seo: { title: data.seo_title, description: data.seo_description },
      updatedAt: data.updated_at,
    },
    error: null,
  };
});

/** Slugs to pre-render at build time. New services render on first request. */
export async function getServiceSlugs(): Promise<string[]> {
  const { data } = await getServiceSummaries();
  return data?.map((service) => service.slug) ?? [];
}
