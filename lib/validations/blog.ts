import { z } from "zod";
import { contentStatusSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/**
 * Blog post rules. Mirrors supabase/migrations/20261004121300_blog_posts.sql.
 *
 * `content` uses the lightweight markup rendered by
 * components/blog/article-body.tsx: ## and ### headings, - bullets, 1. ordered
 * lists, > quotes, ``` code fences, **bold**, *italic* and `code`. Raw HTML is
 * never rendered, so nothing in a post can inject markup.
 */

export const BLOG_LIMITS = {
  tags: 8,
} as const;

const httpsUrl = z
  .string()
  .trim()
  .max(200, "Canonical URL must be 200 characters or fewer.")
  .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), {
    message: "Canonical URL must be a full https:// address.",
  });

export const blogFormSchema = z.object({
  title: text("Title", 5, 120),
  slug: slugSchema,
  excerpt: text("Excerpt", 20, 260),
  content: text("Content", 100, 120000),
  category: text("Category", 2, 40),
  tags: z
    .array(text("Tag", 1, 30))
    .max(BLOG_LIMITS.tags, `Add up to ${BLOG_LIMITS.tags} tags.`)
    .refine(
      (items) => new Set(items.map((item) => item.toLowerCase())).size === items.length,
      "Each tag can only be listed once.",
    ),
  author_name: optionalText("Author name", 60),
  featured: z.boolean(),
  status: contentStatusSchema,
  cover_image_alt: optionalText("Image description", 200),
  seo_title: optionalText("SEO title", 70),
  seo_description: optionalText("SEO description", 170),
  canonical_url: httpsUrl,
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

/** Starting values for a new post. Drafts start dated now; publishing stamps published_at. */
export function emptyBlogValues(): BlogFormValues {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    tags: [],
    author_name: "",
    featured: false,
    status: "draft",
    cover_image_alt: "",
    seo_title: "",
    seo_description: "",
    canonical_url: "",
  };
}

/** Words per minute used for the reading-time estimate. */
export const WORDS_PER_MINUTE = 220;

/** Estimated reading time in minutes, minimum 1. */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
