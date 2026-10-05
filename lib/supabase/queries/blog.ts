import "server-only";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { exactTerm, ilikeTerm } from "@/lib/supabase/queries/filter";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { mediaUrl } from "@/lib/utils/storage-url";

export const BLOG_PAGE_SIZE = 9;

interface PostRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author_name: string | null;
  reading_time: number;
  featured: boolean;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  published_at: string | null;
  created_at: string;
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string | null;
  readingTime: number;
  featured: boolean;
  cover: { url: string; alt: string } | null;
  /** Publication date shown to readers: explicit publish date, else creation date. */
  publishedAt: string;
}

export interface PostFilters {
  search?: string;
  category?: string;
  tag?: string;
  page?: number;
}

export interface PostPage {
  items: PostSummary[];
  total: number;
  page: number;
  pageCount: number;
}

function toSummary(row: PostRow): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    author: row.author_name,
    readingTime: row.reading_time,
    featured: row.featured,
    cover: row.cover_image_path && row.cover_image_alt
      ? { url: mediaUrl(row.cover_image_path), alt: row.cover_image_alt }
      : null,
    publishedAt: row.published_at ?? row.created_at,
  };
}

/** Published posts, newest first, filtered server-side and paginated. */
export const getPosts = cache(async (filters: PostFilters = {}): Promise<QueryResult<PostPage>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const pattern = ilikeTerm(filters.search);
  const category = exactTerm(filters.category);
  const tag = exactTerm(filters.tag, 30);

  let query = supabase
    .from("blog_posts")
    .select(
      "slug, title, excerpt, category, tags, author_name, reading_time, featured, cover_image_path, cover_image_alt, published_at, created_at",
      { count: "exact" },
    )
    .eq("status", "published");

  if (category) query = query.ilike("category", category);
  if (tag) query = query.contains("tags", [tag]);
  if (pattern) query = query.or(`title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`);

  const { data, error, count } = await query
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE - 1);

  if (error) {
    return queryFailure("getPosts", error.message, "Articles could not be loaded.");
  }

  const total = count ?? 0;
  return {
    data: {
      items: (data ?? []).map(toSummary),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
    },
    error: null,
  };
});

/** The newest featured post for the homepage. */
export const getFeaturedPost = cache(async (): Promise<QueryResult<PostSummary | null>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, excerpt, category, tags, author_name, reading_time, featured, cover_image_path, cover_image_alt, published_at, created_at",
    )
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return queryFailure("getFeaturedPost", error.message, "Articles could not be loaded.");
  }

  return { data: data ? toSummary(data) : null, error: null };
});

/** The latest articles for the homepage and related-article blocks. */
export const getLatestPosts = cache(async (limit = 3, excludeSlug?: string): Promise<QueryResult<PostSummary[]>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, excerpt, category, tags, author_name, reading_time, featured, cover_image_path, cover_image_alt, published_at, created_at",
    )
    .eq("status", "published")
    .neq("slug", excludeSlug ?? "")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return queryFailure("getLatestPosts", error.message, "Articles could not be loaded.");
  }

  return { data: (data ?? []).map(toSummary), error: null };
});

/** Categories and tags in use, for the filter controls. */
export const getPostFacets = cache(
  async (): Promise<QueryResult<{ categories: string[]; tags: string[] }>> => {
    const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });

    const { data, error } = await supabase.from("blog_posts").select("category, tags").eq("status", "published");

    if (error) {
      return queryFailure("getPostFacets", error.message, "Categories could not be loaded.");
    }

    const categories = [...new Set((data ?? []).map((row) => row.category))].filter((value) => value.trim().length > 0);
    const tags = [...new Set((data ?? []).flatMap((row) => row.tags))].filter((value) => value.trim().length > 0);

    return { data: { categories, tags }, error: null };
  },
);

export interface PostDetail extends PostSummary {
  /** Raw markup; rendered by components/blog/article-body.tsx. */
  content: string;
  canonical_url: string | null;
  seo: { title: string | null; description: string | null };
  updatedAt: string;
}

/** One published post. `data: null` with no error means "not found". */
export const getPostBySlug = cache(async (slug: string): Promise<QueryResult<PostDetail | null>> => {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();

  if (error) {
    return queryFailure("getPostBySlug", error.message, "This article could not be loaded.");
  }
  if (!data) return { data: null, error: null };

  return {
    data: {
      ...toSummary(data),
      content: data.content,
      canonical_url: data.canonical_url,
      seo: { title: data.seo_title, description: data.seo_description },
      updatedAt: data.updated_at,
    },
    error: null,
  };
});

/** Articles in the same category (newest first) for the related block. */
export const getRelatedPosts = cache(
  async (slug: string, category: string, limit = 3): Promise<QueryResult<PostSummary[]>> => {
    const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "slug, title, excerpt, category, tags, author_name, reading_time, featured, cover_image_path, cover_image_alt, published_at, created_at",
      )
      .eq("status", "published")
      .eq("category", category)
      .neq("slug", slug)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return queryFailure("getRelatedPosts", error.message, "Related articles could not be loaded.");
    }

    return { data: (data ?? []).map(toSummary), error: null };
  },
);

/** Previous and next articles by creation order, for the footer navigation. */
export const getAdjacentPosts = cache(
  async (slug: string): Promise<QueryResult<{ previous: PostSummary | null; next: PostSummary | null }>> => {
    const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });
    const columns =
      "slug, title, excerpt, category, tags, author_name, reading_time, featured, cover_image_path, cover_image_alt, published_at, created_at";

    const current = await supabase.from("blog_posts").select("created_at").eq("slug", slug).maybeSingle();
    if (current.error) {
      return queryFailure("getAdjacentPosts", current.error.message, "Neighbouring articles could not be loaded.");
    }
    if (!current.data) return { data: { previous: null, next: null }, error: null };

    const timestamp = current.data.created_at;
    const [older, newer] = await Promise.all([
      supabase
        .from("blog_posts")
        .select(columns)
        .eq("status", "published")
        .lt("created_at", timestamp)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("blog_posts")
        .select(columns)
        .eq("status", "published")
        .gt("created_at", timestamp)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    if (older.error || newer.error) {
      const failure = older.error ?? newer.error;
      return queryFailure(
        "getAdjacentPosts",
        failure?.message ?? "unknown",
        "Neighbouring articles could not be loaded.",
      );
    }

    return {
      data: { previous: older.data ? toSummary(older.data) : null, next: newer.data ? toSummary(newer.data) : null },
      error: null,
    };
  },
);

/** Slugs to pre-render at build time. */
export async function getPostSlugs(): Promise<string[]> {
  const supabase = createPublicClient({ tags: [CACHE_TAGS.blog] });
  const { data } = await supabase.from("blog_posts").select("slug").eq("status", "published");
  return data?.map((row) => row.slug) ?? [];
}
