import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";
import type { Tables } from "@/types/database";

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar: { url: string; alt: string } | null;
  testimonial: string;
  rating: number;
}

function toTestimonial(row: Tables<"testimonials">): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    avatar: row.avatar_path && row.avatar_alt ? { url: mediaUrl(row.avatar_path), alt: row.avatar_alt } : null,
    testimonial: row.testimonial,
    rating: row.rating,
  };
}

/**
 * Published testimonials in admin-defined order, featured first when asked.
 * Rows are written only by admins: nothing here is generated.
 */
export const getTestimonials = cache(
  async (options: { featuredOnly?: boolean; limit?: number } = {}): Promise<QueryResult<Testimonial[]>> => {
    const supabase = createPublicClient({ tags: [CACHE_TAGS.testimonials] });

    let query = supabase.from("testimonials").select("*").eq("status", "published");
    if (options.featuredOnly) query = query.eq("featured", true);

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .limit(options.limit ?? 12);

    if (error) {
      return queryFailure("getTestimonials", error.message, "Testimonials could not be loaded.");
    }

    return { data: (data ?? []).map(toTestimonial), error: null };
  },
);
