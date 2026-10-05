import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import type { Tables } from "@/types/database";

export type ProcessStep = Pick<
  Tables<"process_steps">,
  "slug" | "title" | "short_description" | "description" | "icon" | "deliverables" | "duration"
>;

/**
 * Published "How We Work" steps in admin-defined order; position in the list
 * is the visible step number.
 */
export const getProcessSteps = cache(async (): Promise<QueryResult<ProcessStep[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.process] });

  const { data, error } = await supabase
    .from("process_steps")
    .select("slug, title, short_description, description, icon, deliverables, duration")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return queryFailure("getProcessSteps", error.message, "Our process could not be loaded.");
  }

  return { data, error: null };
});
