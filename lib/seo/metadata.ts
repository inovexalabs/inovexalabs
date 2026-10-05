import type { Metadata } from "next";

interface BuildMetadataOptions {
  title: string;
  description?: string | null;
  /** Route path, e.g. "/projects/atlas". Used for the canonical URL and og:url. */
  path: string;
  /** Skip the "%s | Inovexa Labs" template (home page, or titles that already include the brand). */
  absoluteTitle?: boolean;
  siteName?: string;
}

/** Consistent title, description, canonical, Open Graph and Twitter tags for every page. */
export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  siteName = "Inovexa Labs",
}: BuildMetadataOptions): Metadata {
  const desc = description ?? undefined;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}
