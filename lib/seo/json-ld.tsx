import { BRAND_ASSETS } from "@/lib/constants/brand";
import { env } from "@/lib/env";

type JsonLdObject = Record<string, unknown>;

/** Absolute URL for a site path, for structured data and canonical references. */
export function absoluteUrl(path: string): string {
  return new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
}

/** The logo uploaded in /admin/settings, or the built-in lockup, as an absolute ImageObject. */
function logoImageObject(logoUrl: string | null | undefined): JsonLdObject {
  return { "@type": "ImageObject", url: logoUrl || absoluteUrl(BRAND_ASSETS.logo) };
}

/** Renders schema.org data. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function serviceJsonLd(service: {
  title: string;
  summary: string;
  path: string;
  imageUrl: string | null;
  providerName: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url: absoluteUrl(service.path),
    ...(service.imageUrl ? { image: service.imageUrl } : {}),
    provider: {
      "@type": "Organization",
      name: service.providerName,
      url: absoluteUrl("/"),
    },
  };
}

/** Article structured data for blog posts. */
export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  imageUrl: string | null;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  publisherName: string;
  publisherLogoUrl?: string | null;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.authorName },
    publisher: {
      "@type": "Organization",
      name: article.publisherName,
      url: absoluteUrl("/"),
      logo: logoImageObject(article.publisherLogoUrl),
    },
    mainEntityOfPage: absoluteUrl(article.path),
  };
}

/** Organization structured data for the site-wide layout. */
export function organizationJsonLd(organization: {
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  socialLinks: Partial<Record<string, string>>;
  logoUrl?: string | null;
}): JsonLdObject {
  const sameAs = Object.values(organization.socialLinks).filter((url): url is string => Boolean(url));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.name,
    url: absoluteUrl("/"),
    logo: logoImageObject(organization.logoUrl),
    ...(organization.description ? { description: organization.description } : {}),
    ...(organization.email ? { email: organization.email } : {}),
    ...(organization.phone ? { telephone: organization.phone } : {}),
    ...(organization.address ? { address: organization.address } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** WebSite structured data (with site search) for the root layout. */
export function webSiteJsonLd(name: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/search?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  };
}
