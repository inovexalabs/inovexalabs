import { absoluteUrl } from "@/lib/utils";
import type {
  BlogPostDetail,
  Experiment,
  Product,
  Project,
  Service,
} from "@/types/content";
import type { CompanyInfo } from "@/lib/queries/content";

/**
 * JSON-LD builders.
 *
 * Every value emitted here also appears in the visible page content. There are
 * deliberately no aggregateRating, review, offerPrice or postal addresses:
 * inventing those is misleading structured data, and Google can act on it.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${absoluteUrl("/")}#organization`;
const SITE_ID = `${absoluteUrl("/")}#website`;

export function organizationSchema(company: CompanyInfo, socials: Record<string, string>): Json {
  const sameAs = Object.values(socials).filter(Boolean);

  // A postal address is only emitted when a real one is configured. Post Office
  // Box style placeholders would be inaccurate data, so they are omitted.
  const hasAddress = Boolean(company.addressLine?.trim() && company.city?.trim());

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.name,
    legalName: company.legalName || company.name,
    description: company.shortDescription,
    url: absoluteUrl("/"),
    email: company.email || undefined,
    telephone: company.phone || undefined,
    ...(sameAs.length ? { sameAs } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: company.addressLine,
            addressLocality: company.city,
            addressRegion: company.region || undefined,
            postalCode: company.postalCode || undefined,
            addressCountry: company.countryCode || undefined,
          },
        }
      : {}),
    knowsAbout: [
      "Custom software development",
      "Web application development",
      "SaaS product engineering",
      "Applied AI and automation",
      "Business software",
      "Mobile application development",
    ],
  };
}

export function websiteSchema(company: CompanyInfo): Json {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: absoluteUrl("/"),
    name: company.name,
    description: company.shortDescription,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function webPageSchema(input: {
  path: string;
  name: string;
  description?: string | null;
}): Json {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description ?? undefined,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function serviceSchema(service: Service, company: CompanyInfo): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    description: service.summary,
    serviceType: service.category ?? service.title,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": ORG_ID },
    areaServed: company.country ? { "@type": "Country", name: company.country } : undefined,
    hasOfferCatalog: service.deliverables?.length
      ? {
          "@type": "OfferCatalog",
          name: `${service.title} deliverables`,
          itemListElement: service.deliverables.map((item, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: { "@type": "Service", name: item },
          })),
        }
      : undefined,
  };
}

/**
 * Only emitted for products that actually exist as software — never for an
 * idea or an archived concept, and never with a fabricated rating or price.
 */
export function softwareApplicationSchema(product: Product): Json | null {
  const isRealSoftware = ["in_development", "live"].includes(product.status);
  if (!isRealSoftware) return null;

  return {
    "@type": "SoftwareApplication",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#software`,
    name: product.name,
    description: product.short_description ?? product.tagline,
    applicationCategory: product.category ?? "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl(`/products/${product.slug}`),
    ...(product.product_url ? { installUrl: product.product_url } : {}),
    ...(product.launch_date ? { datePublished: product.launch_date } : {}),
    ...(product.technologies?.length ? { keywords: product.technologies.join(", ") } : {}),
    publisher: { "@id": ORG_ID },
  };
}

export function articleSchema(post: BlogPostDetail): Json {
  const path = `/insights/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(path)}#article`,
    headline: post.title,
    description: post.excerpt ?? undefined,
    url: absoluteUrl(path),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${absoluteUrl(path)}#webpage` },
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    ...(post.cover_image_url ? { image: [post.cover_image_url] } : {}),
    ...(post.author
      ? {
          author: {
            "@type": "Person",
            name: post.author.name,
            description: post.author.bio ?? undefined,
            url: absoluteUrl("/about"),
          },
        }
      : {}),
    publisher: { "@id": ORG_ID },
    ...(post.category ? { articleSection: post.category.name } : {}),
    ...(post.tags?.length ? { keywords: post.tags.map((t) => t.name).join(", ") } : {}),
    ...(post.reading_minutes ? { timeRequired: `PT${post.reading_minutes}M` } : {}),
    inLanguage: "en",
  };
}

export function itemListSchema(items: { name: string; path: string }[], name: string): Json {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function projectSchema(project: Project): Json {
  return {
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/work/${project.slug}`)}#project`,
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    ...(project.client_name ? { creator: { "@type": "Organization", name: project.client_name } } : {}),
    ...(project.started_on ? { dateCreated: project.started_on } : {}),
    ...(project.technologies?.length ? { keywords: project.technologies.join(", ") } : {}),
    about: project.industry ?? undefined,
    inLanguage: "en",
  };
}

export function experimentSchema(experiment: Experiment): Json {
  return {
    "@type": "ResearchProject",
    "@id": `${absoluteUrl(`/lab/${experiment.slug}`)}#experiment`,
    name: experiment.title,
    description: experiment.summary,
    url: absoluteUrl(`/lab/${experiment.slug}`),
    ...(experiment.started_on ? { startDate: experiment.started_on } : {}),
    ...(experiment.concluded_on ? { endDate: experiment.concluded_on } : {}),
    ...(experiment.technologies?.length ? { keywords: experiment.technologies.join(", ") } : {}),
    parentOrganization: { "@id": ORG_ID },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json | null {
  if (!faqs?.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** Wraps one or more schema nodes into a single @graph document. */
export function jsonLdGraph(nodes: (Json | null | undefined)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is Json => Boolean(node)),
  };
}
