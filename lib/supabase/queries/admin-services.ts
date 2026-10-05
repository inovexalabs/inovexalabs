import "server-only";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { createClient } from "@/lib/supabase/server";
import { isServiceIconKey } from "@/lib/constants/service-icons";
import { mediaUrl } from "@/lib/utils/storage-url";
import { faqItemSchema, parseList, titledItemSchema, type ServiceFormValues } from "@/lib/validations/service";
import type { Tables } from "@/types/database";

/**
 * Admin reads use the session client: RLS lets admins see drafts and archived
 * rows. Callers must already have passed requireAdmin().
 */

export type AdminServiceRow = Pick<
  Tables<"services">,
  "id" | "slug" | "title" | "icon" | "status" | "sort_order" | "updated_at"
>;

export async function listServicesForAdmin(): Promise<QueryResult<AdminServiceRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, icon, status, sort_order, updated_at")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) return queryFailure("listServicesForAdmin", error.message, "Services could not be loaded.");
  return { data, error: null };
}

export interface AdminServiceRecord {
  id: string;
  values: ServiceFormValues;
  image: { path: string; url: string } | null;
  updatedAt: string;
}

/** Full record shaped as form values. `data: null` with no error means "not found". */
export async function getServiceForAdmin(id: string): Promise<QueryResult<AdminServiceRecord | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();

  if (error) return queryFailure("getServiceForAdmin", error.message, "This service could not be loaded.");
  if (!data) return { data: null, error: null };

  const context = `services/${data.slug}`;
  return {
    data: {
      id: data.id,
      updatedAt: data.updated_at,
      image: data.cover_image_path ? { path: data.cover_image_path, url: mediaUrl(data.cover_image_path) } : null,
      values: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        overview: data.overview,
        icon: isServiceIconKey(data.icon) ? data.icon : "sparkles",
        status: data.status,
        sort_order: data.sort_order,
        cover_image_alt: data.cover_image_alt ?? "",
        problems: parseList(titledItemSchema, data.problems, `${context}.problems`),
        features: parseList(titledItemSchema, data.features, `${context}.features`),
        technologies: data.technologies,
        process: parseList(titledItemSchema, data.process, `${context}.process`),
        outcomes: parseList(titledItemSchema, data.outcomes, `${context}.outcomes`),
        faqs: parseList(faqItemSchema, data.faqs, `${context}.faqs`),
        cta_title: data.cta_title,
        cta_description: data.cta_description,
        cta_label: data.cta_label,
        cta_href: data.cta_href,
        seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "",
      },
    },
    error: null,
  };
}
