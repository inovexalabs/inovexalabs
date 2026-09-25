import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getSeoDefaults, getSeoOverride } from "@/lib/queries/content";

export interface MetadataInput {
  /** Page title. Also used as the OG/Twitter title unless `ogTitle` is given. */
  title?: string | null;
  description?: string | null;
  /** Route path with a leading slash, e.g. "/products/restra". */
  path: string;
  keywords?: string[] | null;
  canonicalOverride?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  /** Defaults to "website". Use "article" for insights. */
  type?: "website" | "article";
  robots?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[] | null;
  section?: string | null;
  tags?: string[] | null;
}

/**
 * Single entry point for route metadata.
 *
 * Resolution order for every field:
 *   1. an explicit value from the content entity (its own Supabase SEO columns)
 *   2. a route-level override from the `seo_metadata` table
 *   3. site-wide defaults from `site_settings`
 *
 * Because entities carry their own SEO columns, `/products/restra` automatically
 * uses Restra's title, description, canonical URL and OG image with no per-page
 * wiring. A route marked noindex in the admin panel is respected here too.
 */
export async function buildMetadata(input: MetadataInput): Promise<Metadata> {
  const [defaults, override] = await Promise.all([
    getSeoDefaults(),
    getSeoOverride(input.path),
  ]);

  const isNoindex =
    override?.noindex === true ||
    input.robots?.includes("noindex") ||
    override?.robots?.includes("noindex");

  const title = input.title || override?.title || defaults.defaultTitle;
  const brandWord = defaults.defaultTitle.split("\u2014")[0]?.trim().split(/\s+/)[0] ?? "Inovexa";
  // Content SEO titles frequently already name the brand ("… | Inovexa Labs").
  // Using `absolute` for those avoids the template appending it a second time.
  const titleValue: Metadata["title"] = title.includes(brandWord)
    ? { absolute: title }
    : title;

  const description =
    input.description || override?.description || defaults.defaultDescription;
  const keywords = input.keywords?.length
    ? input.keywords
    : (override?.keywords ?? undefined);

  const canonical =
    input.canonicalOverride ||
    override?.canonical_url ||
    absoluteUrl(input.path);

  const ogTitle = input.ogTitle || override?.og_title || title;
  const ogDescription = input.ogDescription || override?.og_description || description;
  const ogImage = input.ogImage || override?.og_image_url || defaults.ogImageUrl;
  const robotsString = isNoindex ? "noindex,nofollow" : (override?.robots || defaults.robots);

  const images = ogImage ? [{ url: ogImage, alt: ogTitle }] : undefined;

  const twitterCards = ["summary", "summary_large_image", "app", "player"] as const;
  const twitterCard =
    twitterCards.find((card) => card === override?.twitter_card) ??
    (images ? "summary_large_image" : "summary");

  return {
    title: titleValue,
    description,
    keywords,
    alternates: { canonical },
    robots: robotsString,
    openGraph: {
      type: input.type ?? "website",
      siteName: defaults.defaultTitle.split("—")[0]?.trim() || "Inovexa Labs",
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: "en_US",
      images,
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime ?? undefined,
            modifiedTime: input.modifiedTime ?? input.publishedTime ?? undefined,
            authors: input.authors ?? undefined,
            section: input.section ?? undefined,
            tags: input.tags ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
      site: defaults.twitterHandle || undefined,
      creator: defaults.twitterHandle || undefined,
    },
  };
}
