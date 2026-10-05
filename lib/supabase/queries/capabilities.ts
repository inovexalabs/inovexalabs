import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import type { Tables } from "@/types/database";

export type Capability = Pick<Tables<"capabilities">, "slug" | "title" | "description" | "visual">;

/** Published capabilities in admin-defined order; position in the list is their visible number. */
export const getCapabilities = cache(async (): Promise<QueryResult<Capability[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.capabilities] });

  const { data, error } = await supabase
    .from("capabilities")
    .select("slug, title, description, visual")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return queryFailure("getCapabilities", error.message, "Capabilities could not be loaded.");
  }

  return { data, error: null };
});
