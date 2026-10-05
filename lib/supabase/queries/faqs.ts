import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import type { Enums } from "@/types/database";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

/** Published FAQ entries for one page, in admin-defined order. */
export const getFaqs = cache(async (page: Enums<"faq_page">): Promise<QueryResult<Faq[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.faqs] });

  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer")
    .eq("page", page)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("question", { ascending: true });

  if (error) {
    return queryFailure("getFaqs", error.message, "Frequently asked questions could not be loaded.");
  }

  return { data: data ?? [], error: null };
});
