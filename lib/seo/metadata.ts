import type { Metadata } from "next";
import { BRAND_ASSETS } from "@/lib/constants/brand";

interface BuildMetadataOptions {
  title: string;
  description?: string | null;
  /** Route path, e.g. "/projects/atlas". Used for the canonical URL and og:url. */
  path: string;
  /** Skip the "%s | Inovexa Labs" template (home page, or titles that already include the brand). */
  absoluteTitle?: boolean;
  siteName?: string;
}

/**
 * Consistent title, description, canonical, Open Graph and Twitter tags for every page.
 * The branded share card is the default image; pages with their own cover replace it.
 */
export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  siteName = "Inovexa Labs",
}: BuildMetadataOptions): Metadata {
  const desc = description ?? undefined;
  const images = [{ ...BRAND_ASSETS.ogImage, alt: `${siteName} logo: Innovate. Code. Build.` }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName,
      title,
      description: desc,
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images,
    },
  };
}
