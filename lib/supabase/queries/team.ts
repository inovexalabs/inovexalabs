import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";
import { parseList } from "@/lib/validations/common";
import { socialLinkSchema } from "@/lib/validations/team";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  photo: { url: string; alt: string } | null;
  skills: string[];
  social: { label: string; url: string }[];
}

/** Published team members in admin-defined order, for /about. */
export const getTeam = cache(async (): Promise<QueryResult<TeamMember[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.team] });

  const { data, error } = await supabase
    .from("team_members")
    .select("slug, name, role, bio, photo_path, photo_alt, skills, social_links, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return queryFailure("getTeam", error.message, "The team could not be loaded.");
  }

  return {
    data: (data ?? []).map((row) => ({
      slug: row.slug,
      name: row.name,
      role: row.role,
      bio: row.bio || null,
      photo: row.photo_path && row.photo_alt ? { url: mediaUrl(row.photo_path), alt: row.photo_alt } : null,
      skills: row.skills,
      social: parseList(socialLinkSchema, row.social_links, `team/${row.slug}.social_links`),
    })),
    error: null,
  };
});
