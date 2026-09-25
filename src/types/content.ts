import type { ProductStatus } from "@/config/site";

export type Uuid = string;
export type Json = Record<string, unknown>;

/** Columns every publishable entity shares. */
export interface Publishable {
  id: Uuid;
  slug: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** The SEO surface every public entity exposes to the metadata factory. */
export interface SeoFields {
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  robots: string | null;
}

export interface SiteSetting {
  id: Uuid;
  key: string;
  group_name: string;
  label: string;
  description: string | null;
  value: Json;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: Uuid;
  location: "header" | "footer" | "legal" | "social";
  parent_id: Uuid | null;
  title: string;
  href: string;
  description: string | null;
  display_order: number;
  published: boolean;
}

export interface Service extends Publishable, SeoFields {
  title: string;
  tagline: string | null;
  summary: string;
  body: string | null;
  icon: string | null;
  category: string | null;
  deliverables: string[];
  process_notes: string[];
  engagement_models: string[];
  faqs: { q: string; a: string }[];
  display_order: number;
  featured: boolean;
}

export interface Product extends Publishable, SeoFields {
  name: string;
  tagline: string;
  short_description: string | null;
  full_description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery: unknown[];
  video_url: string | null;
  product_url: string | null;
  status: ProductStatus;
  category: string | null;
  technologies: string[];
  launch_date: string | null;
  last_updated_note: string | null;
  is_open_source: boolean;
  featured: boolean;
}

export interface ProductFeature {
  id: Uuid;
  product_id: Uuid;
  title: string;
  description: string | null;
  icon: string | null;
  display_order: number;
}

export interface ProductImage {
  id: Uuid;
  product_id: Uuid;
  url: string;
  alt: string;
  caption: string | null;
  display_order: number;
}

export interface ProjectMetric {
  label?: string;
  value?: string;
  source?: string;
}

export interface Project extends Publishable, SeoFields {
  name: string;
  client_name: string | null;
  industry: string | null;
  summary: string;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  metrics: ProjectMetric[];
  technologies: string[];
  cover_image_url: string | null;
  gallery: unknown[];
  website_url: string | null;
  case_study_url: string | null;
  project_types: string[];
  started_on: string | null;
  delivered_on: string | null;
  featured: boolean;
}

export interface ProjectPhase {
  id: Uuid;
  project_id: Uuid;
  phase_key: "discover" | "design" | "development" | "testing";
  label: string;
  progress: number;
  note: string | null;
  display_order: number;
}

export interface Experiment extends Publishable, SeoFields {
  code: string | null;
  title: string;
  summary: string;
  body: string | null;
  status: ProductStatus;
  hypothesis: string | null;
  finding: string | null;
  progress: number;
  technologies: string[];
  image_url: string | null;
  started_on: string | null;
  concluded_on: string | null;
  featured: boolean;
}

export interface Customer {
  id: Uuid;
  slug: string;
  name: string;
  industry: string | null;
  website_url: string | null;
  logo_url: string | null;
  logo_alt: string | null;
  description: string | null;
  is_public: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: Uuid;
  customer_id: Uuid | null;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  author_image_url: string | null;
  company_logo_url: string | null;
  quote: string;
  project_id: Uuid | null;
  source_url: string | null;
  given_on: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: Uuid;
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  skills: string[];
  social_links: Record<string, string>;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: Uuid;
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  social_links: Record<string, string>;
}

export interface BlogCategory {
  id: Uuid;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
}

export interface BlogTag {
  id: Uuid;
  slug: string;
  name: string;
}

export interface BlogPost extends Publishable, SeoFields {
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_id: Uuid | null;
  category_id: Uuid | null;
  reading_minutes: number | null;
  intent: string | null;
  is_pillar: boolean;
  featured: boolean;
  updated_note: string | null;
}

/** A blog post joined with its author, category and tags — the shape pages use. */
export interface BlogPostDetail extends BlogPost {
  author: Author | null;
  category: BlogCategory | null;
  tags: BlogTag[];
}

export interface Technology {
  id: Uuid;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  icon: string | null;
  website_url: string | null;
  proficiency: "core" | "working" | "exploring" | null;
  display_order: number;
  published: boolean;
}

export interface SeoMetadata {
  id: Uuid;
  path: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card: string | null;
  robots: string | null;
  structured_data: Json | null;
  noindex: boolean;
}

export type ContactInquiryStatus = "new" | "read" | "in_discussion" | "won" | "archived" | "spam";

export interface ContactInquiry {
  id: Uuid;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  project_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  description: string;
  referral_source: string | null;
  status: ContactInquiryStatus;
  notes: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchHit {
  kind: "product" | "project" | "service" | "insight" | "experiment";
  slug: string;
  title: string;
  subtitle: string | null;
  keywords: string | null;
  published_at: string | null;
}

/** Aggregated, database-derived company metrics. Never hard-coded. */
export interface LabMetrics {
  projectsShipped: number | null;
  productsLaunched: number | null;
  activeProducts: number | null;
  activeExperiments: number | null;
  industriesServed: number | null;
  happyClients: number | null;
}
