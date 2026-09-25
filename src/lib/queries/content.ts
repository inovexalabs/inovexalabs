import { TAGS, cachedRead } from "@/lib/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { reportQueryError } from "@/lib/supabase/config";
import {
  EMPTY,
  fallbackCategories,
  fallbackExperiments,
  fallbackFooterNav,
  fallbackLegalNav,
  fallbackNav,
  fallbackPosts,
  fallbackProductFeatures,
  fallbackProducts,
  fallbackServices,
  fallbackSettings,
  fallbackTags,
  fallbackTechnologies,
} from "@/content/fallback";
import type {
  BlogCategory,
  BlogPostDetail,
  BlogTag,
  Customer,
  Experiment,
  NavigationItem,
  Product,
  ProductFeature,
  Project,
  ProjectPhase,
  Service,
  SiteSetting,
  TeamMember,
  Technology,
  Testimonial,
} from "@/types/content";

type Client = NonNullable<ReturnType<typeof getPublicClient>>;

/* ==========================================================================
   Site settings
   ========================================================================== */

export const getSiteSettings = cachedRead(
  async (): Promise<SiteSetting[]> => {
    const db = getPublicClient();
    if (!db) return fallbackSettings;

    const { data, error } = await db
      .from("site_settings")
      .select("*")
      .neq("group_name", "internal")
      .order("group_name");

    if (error) {
      reportQueryError("getSiteSettings", error);
      return fallbackSettings;
    }
    return (data ?? []) as SiteSetting[];
  },
  ["site-settings"],
  [TAGS.settings],
);

/** Typed access to a single settings group, e.g. `getSetting<CompanyInfo>("company")`. */
export async function getSetting<T extends Record<string, unknown>>(
  key: string,
): Promise<T | null> {
  const settings = await getSiteSettings();
  const found = settings.find((s) => s.key === key);
  return (found?.value as T) ?? null;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  positioning: string;
  promise: string;
  supportingLine: string;
  shortDescription: string;
  founded: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  businessHours: string;
}

const COMPANY_DEFAULTS: CompanyInfo = {
  name: "Inovexa Labs",
  legalName: "Inovexa Labs",
  positioning: "On-demand software development company and product innovation lab.",
  promise: "We build software for today. We invent products for tomorrow.",
  supportingLine:
    "From custom software solutions to products born inside our lab, Inovexa Labs turns ideas into technology that works.",
  shortDescription:
    "Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.",
  founded: "",
  email: "hello@inovexalabs.com",
  phone: "",
  addressLine: "",
  city: "Kathmandu",
  region: "Bagmati",
  country: "Nepal",
  countryCode: "NP",
  postalCode: "",
  latitude: "",
  longitude: "",
  businessHours: "",
};

export async function getCompany(): Promise<CompanyInfo> {
  const value = await getSetting<Partial<CompanyInfo>>("company");
  return { ...COMPANY_DEFAULTS, ...(value ?? {}) };
}

export interface HeroContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  supporting: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

const HERO_DEFAULTS: HeroContent = {
  eyebrow: "INOVEXA LABS · SOFTWARE × INNOVATION",
  headlineLine1: "We build software for today.",
  headlineLine2: "We invent products for tomorrow.",
  supporting:
    "Inovexa Labs builds custom software for ambitious businesses and develops technology products designed to solve real-world problems.",
  primaryCtaLabel: "Start a Project",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Explore Our Products",
  secondaryCtaHref: "/products",
};

export async function getHero(): Promise<HeroContent> {
  const value = await getSetting<Partial<HeroContent>>("hero");
  return { ...HERO_DEFAULTS, ...(value ?? {}) };
}

export interface SeoDefaults {
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImageUrl: string;
  twitterHandle: string;
  robots: string;
}

const SEO_DEFAULTS: SeoDefaults = {
  titleTemplate: "%s | Inovexa Labs",
  defaultTitle: "Inovexa Labs — Software Development & Product Innovation",
  defaultDescription:
    "Inovexa Labs is an on-demand software development company and product innovation lab. We build custom software for businesses and develop our own technology products.",
  ogImageUrl: "",
  twitterHandle: "",
  robots: "index,follow",
};

export async function getSeoDefaults(): Promise<SeoDefaults> {
  const value = await getSetting<Partial<SeoDefaults>>("seo_defaults");
  return { ...SEO_DEFAULTS, ...(value ?? {}) };
}

export async function getSocials(): Promise<Record<string, string>> {
  const value = await getSetting<Record<string, string>>("socials");
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(value ?? {})) {
    if (typeof v === "string" && v.trim()) cleaned[k] = v.trim();
  }
  return cleaned;
}

/* ==========================================================================
   Navigation
   ========================================================================== */

export async function getNavigation(
  location: NavigationItem["location"],
): Promise<NavigationItem[]> {
  const all = await cachedRead(
    async (): Promise<NavigationItem[]> => {
      const db = getPublicClient();
      if (!db) {
        return [...fallbackNav, ...fallbackFooterNav, ...fallbackLegalNav];
      }
      const { data, error } = await db
        .from("navigation_items")
        .select("*")
        .eq("published", true)
        .order("display_order");
      if (error) {
        reportQueryError("getNavigation", error);
        return [...fallbackNav, ...fallbackFooterNav, ...fallbackLegalNav];
      }
      return (data ?? []) as NavigationItem[];
    },
    ["navigation"],
    [TAGS.settings],
  )();

  return all.filter((item) => item.location === location);
}

/* ==========================================================================
   Services
   ========================================================================== */

export const getServices = cachedRead(
  async (): Promise<Service[]> => {
    const db = getPublicClient();
    if (!db) return fallbackServices;

    const { data, error } = await db
      .from("services")
      .select("*")
      .eq("published", true)
      .order("display_order");
    if (error) {
      reportQueryError("getServices", error);
      return fallbackServices;
    }
    return (data ?? []) as Service[];
  },
  ["services"],
  [TAGS.services],
);

export const getFeaturedServices = cachedRead(
  async (): Promise<Service[]> => {
    const services = await getServices();
    const featured = services.filter((s) => s.featured);
    return featured.length > 0 ? featured : services.slice(0, 6);
  },
  ["services-featured"],
  [TAGS.services],
);

export function getServiceBySlug(slug: string) {
  return cachedRead(
    async (): Promise<Service | null> => {
      const db = getPublicClient();
      if (!db) return fallbackServices.find((s) => s.slug === slug) ?? null;

      const { data, error } = await db
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) {
        reportQueryError("getServiceBySlug", error);
        return fallbackServices.find((s) => s.slug === slug) ?? null;
      }
      return (data as Service) ?? null;
    },
    ["service", slug],
    [TAGS.services],
  )();
}

/* ==========================================================================
   Products
   ========================================================================== */

export const getProducts = cachedRead(
  async (): Promise<Product[]> => {
    const db = getPublicClient();
    if (!db) return fallbackProducts;

    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      reportQueryError("getProducts", error);
      return fallbackProducts;
    }
    return (data ?? []) as Product[];
  },
  ["products"],
  [TAGS.products],
);

export const getFeaturedProducts = cachedRead(
  async (): Promise<Product[]> => {
    const products = await getProducts();
    return products.filter((p) => p.featured);
  },
  ["products-featured"],
  [TAGS.products],
);

export function getProductBySlug(slug: string) {
  return cachedRead(
    async (): Promise<Product | null> => {
      const db = getPublicClient();
      if (!db) return fallbackProducts.find((p) => p.slug === slug) ?? null;

      const { data, error } = await db
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) {
        reportQueryError("getProductBySlug", error);
        return fallbackProducts.find((p) => p.slug === slug) ?? null;
      }
      return (data as Product) ?? null;
    },
    ["product", slug],
    [TAGS.products],
  )();
}

export function getProductFeatures(productId: string) {
  return cachedRead(
    async (): Promise<ProductFeature[]> => {
      const db = getPublicClient();
      if (!db) {
        return fallbackProductFeatures.filter((f) => f.product_id === productId);
      }
      const { data, error } = await db
        .from("product_features")
        .select("*")
        .eq("product_id", productId)
        .order("display_order");
      if (error) {
        reportQueryError("getProductFeatures", error);
        return [];
      }
      return (data ?? []) as ProductFeature[];
    },
    ["product-features", productId],
    [TAGS.products],
  )();
}

/* ==========================================================================
   Projects (client work)
   ========================================================================== */

export const getProjects = cachedRead(
  async (): Promise<Project[]> => {
    const db = getPublicClient();
    if (!db) return [...EMPTY];

    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      reportQueryError("getProjects", error);
      return [];
    }
    return (data ?? []) as Project[];
  },
  ["projects"],
  [TAGS.projects],
);

export const getFeaturedProjects = cachedRead(
  async (): Promise<Project[]> => {
    const projects = await getProjects();
    const featured = projects.filter((p) => p.featured);
    return featured.length > 0 ? featured : projects.slice(0, 3);
  },
  ["projects-featured"],
  [TAGS.projects],
);

export function getProjectBySlug(slug: string) {
  return cachedRead(
    async (): Promise<Project | null> => {
      const db = getPublicClient();
      if (!db) return null;

      const { data, error } = await db
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) {
        reportQueryError("getProjectBySlug", error);
        return null;
      }
      return (data as Project) ?? null;
    },
    ["project", slug],
    [TAGS.projects],
  )();
}

export function getProjectPhases(projectId: string) {
  return cachedRead(
    async (): Promise<ProjectPhase[]> => {
      const db = getPublicClient();
      if (!db) return [];
      const { data, error } = await db
        .from("project_phases")
        .select("*")
        .eq("project_id", projectId)
        .order("display_order");
      if (error) {
        reportQueryError("getProjectPhases", error);
        return [];
      }
      return (data ?? []) as ProjectPhase[];
    },
    ["project-phases", projectId],
    [TAGS.projects],
  )();
}

/* ==========================================================================
   Experiments
   ========================================================================== */

export const getExperiments = cachedRead(
  async (): Promise<Experiment[]> => {
    const db = getPublicClient();
    if (!db) return fallbackExperiments;

    const { data, error } = await db
      .from("experiments")
      .select("*")
      .eq("published", true)
      .order("started_on", { ascending: false });
    if (error) {
      reportQueryError("getExperiments", error);
      return fallbackExperiments;
    }
    return (data ?? []) as Experiment[];
  },
  ["experiments"],
  [TAGS.experiments],
);

export function getExperimentBySlug(slug: string) {
  return cachedRead(
    async (): Promise<Experiment | null> => {
      const db = getPublicClient();
      if (!db) return fallbackExperiments.find((e) => e.slug === slug) ?? null;

      const { data, error } = await db
        .from("experiments")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) {
        reportQueryError("getExperimentBySlug", error);
        return fallbackExperiments.find((e) => e.slug === slug) ?? null;
      }
      return (data as Experiment) ?? null;
    },
    ["experiment", slug],
    [TAGS.experiments],
  )();
}

/* ==========================================================================
   Blog
   ========================================================================== */

const POST_SELECT = `
  *,
  author:authors(id, slug, name, role, bio, avatar_url, email, social_links),
  category:blog_categories(id, slug, name, description, display_order),
  blog_post_tags(tag:blog_tags(id, slug, name))
`;

interface RawPost extends Omit<BlogPostDetail, "tags"> {
  blog_post_tags?: { tag: BlogTag | null }[] | null;
}

function mapPost(row: RawPost): BlogPostDetail {
  const { blog_post_tags, ...rest } = row;
  const tags = (blog_post_tags ?? [])
    .map((t) => t.tag)
    .filter((t): t is BlogTag => Boolean(t));
  return { ...rest, tags };
}

export const getBlogPosts = cachedRead(
  async (): Promise<BlogPostDetail[]> => {
    const db = getPublicClient();
    if (!db) return fallbackPosts;

    const { data, error } = await db
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("published", true)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error) {
      reportQueryError("getBlogPosts", error);
      return fallbackPosts;
    }
    return (data ?? []).map((row) => mapPost(row as unknown as RawPost));
  },
  ["blog-posts"],
  [TAGS.blog],
);

export function getBlogPostBySlug(slug: string) {
  return cachedRead(
    async (): Promise<BlogPostDetail | null> => {
      const db = getPublicClient();
      if (!db) return fallbackPosts.find((p) => p.slug === slug) ?? null;

      const { data, error } = await db
        .from("blog_posts")
        .select(POST_SELECT)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) {
        reportQueryError("getBlogPostBySlug", error);
        return fallbackPosts.find((p) => p.slug === slug) ?? null;
      }
      return data ? mapPost(data as unknown as RawPost) : null;
    },
    ["blog-post", slug],
    [TAGS.blog],
  )();
}

export const getBlogCategories = cachedRead(
  async (): Promise<BlogCategory[]> => {
    const db = getPublicClient();
    if (!db) return fallbackCategories;
    const { data, error } = await db
      .from("blog_categories")
      .select("*")
      .order("display_order");
    if (error) {
      reportQueryError("getBlogCategories", error);
      return fallbackCategories;
    }
    return (data ?? []) as BlogCategory[];
  },
  ["blog-categories"],
  [TAGS.blog],
);

export const getBlogTags = cachedRead(
  async (): Promise<BlogTag[]> => {
    const db = getPublicClient();
    if (!db) return fallbackTags;
    const { data, error } = await db.from("blog_tags").select("*").order("name");
    if (error) {
      reportQueryError("getBlogTags", error);
      return fallbackTags;
    }
    return (data ?? []) as BlogTag[];
  },
  ["blog-tags"],
  [TAGS.blog],
);

/** Editor-curated related reading, falling back to the same category. */
export async function getRelatedPosts(post: BlogPostDetail, limit = 3) {
  const db = getPublicClient();
  if (!db) {
    return fallbackPosts.filter((p) => p.slug !== post.slug).slice(0, limit);
  }

  const { data, error } = await db
    .from("blog_post_relations")
    .select(`related:blog_posts!blog_post_relations_related_post_id_fkey(${POST_SELECT})`)
    .eq("post_id", post.id)
    .order("display_order")
    .limit(limit);

  if (error) {
    reportQueryError("getRelatedPosts", error);
  }

  const curated = (data ?? [])
    .map((row) => (row as unknown as { related: RawPost | null }).related)
    .filter((r): r is RawPost => Boolean(r))
    .map(mapPost);

  if (curated.length >= limit) return curated.slice(0, limit);

  const all = await getBlogPosts();
  const filler = all
    .filter(
      (p) =>
        p.slug !== post.slug &&
        !curated.some((c) => c.slug === p.slug) &&
        (post.category_id ? p.category_id === post.category_id : true),
    )
    .slice(0, limit - curated.length);

  return [...curated, ...filler];
}

/* ==========================================================================
   Technologies, team, testimonials, customers
   ========================================================================== */

export const getTechnologies = cachedRead(
  async (): Promise<Technology[]> => {
    const db = getPublicClient();
    if (!db) return fallbackTechnologies;

    const { data, error } = await db
      .from("technologies")
      .select("*")
      .eq("published", true)
      .order("display_order");
    if (error) {
      reportQueryError("getTechnologies", error);
      return fallbackTechnologies;
    }
    return (data ?? []) as Technology[];
  },
  ["technologies"],
  [TAGS.technologies],
);

export const getTeamMembers = cachedRead(
  async (): Promise<TeamMember[]> => {
    const db = getPublicClient();
    if (!db) return [];
    const { data, error } = await db
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("display_order");
    if (error) {
      reportQueryError("getTeamMembers", error);
      return [];
    }
    return (data ?? []) as TeamMember[];
  },
  ["team-members"],
  [TAGS.team],
);

export const getTestimonials = cachedRead(
  async (): Promise<Testimonial[]> => {
    const db = getPublicClient();
    if (!db) return [];
    const { data, error } = await db
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("given_on", { ascending: false });
    if (error) {
      reportQueryError("getTestimonials", error);
      return [];
    }
    return (data ?? []) as Testimonial[];
  },
  ["testimonials"],
  [TAGS.testimonials],
);

export const getCustomers = cachedRead(
  async (): Promise<Customer[]> => {
    const db = getPublicClient();
    if (!db) return [];
    const { data, error } = await db
      .from("customers")
      .select("*")
      .eq("published", true)
      .eq("is_public", true)
      .order("name");
    if (error) {
      reportQueryError("getCustomers", error);
      return [];
    }
    return (data ?? []) as Customer[];
  },
  ["customers"],
  [TAGS.team],
);

/* ==========================================================================
   Route-level SEO overrides
   ========================================================================== */

export function getSeoOverride(path: string) {
  return cachedRead(
    async () => {
      const db = getPublicClient();
      if (!db) return null;
      const { data, error } = await db
        .from("seo_metadata")
        .select("*")
        .eq("path", path)
        .maybeSingle();
      if (error) {
        reportQueryError("getSeoOverride", error);
        return null;
      }
      return data;
    },
    ["seo-override", path],
    [TAGS.seo],
  )();
}
