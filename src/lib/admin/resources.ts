import { TAGS, type CacheTag } from "@/lib/cache";
import {
  BUDGET_RANGES,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PROJECT_TYPES,
  REFERRAL_SOURCES,
  SERVICE_CATEGORIES,
  TECHNOLOGY_CATEGORIES,
  TIMELINES,
} from "@/config/site";

/**
 * The admin resource registry.
 *
 * Every manageable content type is described once, here. The list, create and
 * edit screens are generated from these definitions, so adding a content type is
 * a registry entry rather than three new pages — and every type gets the same
 * validation, cache invalidation and SEO surface for free.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "url"
  | "list"
  | "json";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  help?: string;
  placeholder?: string;
  /** Fieldset this field belongs to. */
  group?: string;
  /** Only show once the record exists (e.g. slug is generated on create). */
  editOnly?: boolean;
  colSpan?: 1 | 2;
}

export interface ListColumn {
  name: string;
  label: string;
  type?: "text" | "badge" | "boolean" | "date" | "truncate";
}

export interface ResourceDef {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  icon: string;
  tags: CacheTag[];
  /** Slug-page path prefix for the public site, when the resource has one. */
  publicPath?: string;
  titleField: string;
  /** Fields that behave as the record title in lists. */
  subtitleField?: string;
  listColumns: ListColumn[];
  fields: FieldDef[];
  hasSeo: boolean;
  publishable: boolean;
  canCreate: boolean;
  canDelete: boolean;
  orderBy: { column: string; ascending: boolean };
  /** Columns searched by the admin list filter. */
  searchColumns: string[];
}

/**
 * The SEO surface, shared by every publishable entity. These columns exist
 * directly on each content table so `/products/restra` picks up its own
 * metadata without a join.
 */
export const SEO_FIELDS: FieldDef[] = [
  { name: "seo_title", label: "SEO title", type: "text", group: "SEO", colSpan: 2, help: "Falls back to the record title. Aim for under 60 characters." },
  { name: "seo_description", label: "Meta description", type: "textarea", group: "SEO", colSpan: 2, help: "Falls back to the summary. Aim for 140–160 characters." },
  { name: "seo_keywords", label: "Keywords", type: "list", group: "SEO", colSpan: 2, help: "Comma separated. Used as the meta keywords and in search." },
  { name: "canonical_url", label: "Canonical URL", type: "url", group: "SEO", colSpan: 2, help: "Leave blank to use this page's own URL. Set it only when the canonical version lives elsewhere." },
  { name: "og_title", label: "OG title", type: "text", group: "SEO", colSpan: 2 },
  { name: "og_description", label: "OG description", type: "textarea", group: "SEO", colSpan: 2 },
  { name: "og_image_url", label: "OG image URL", type: "url", group: "SEO", colSpan: 2, help: "1200×630 recommended. Upload to the og-images bucket and paste the public URL." },
  {
    name: "robots",
    label: "Robots",
    type: "select",
    group: "SEO",
    colSpan: 2,
    options: ["index,follow", "index,nofollow", "noindex,follow", "noindex,nofollow"],
  },
];

const PUBLISH_FIELDS: FieldDef[] = [
  { name: "published", label: "Published", type: "boolean", group: "Publishing", help: "Unpublished records are invisible to the public site and to the sitemap." },
  { name: "published_at", label: "Publish date", type: "date", group: "Publishing", help: "Future-dated insights stay hidden until this date." },
];

const slugField: FieldDef = {
  name: "slug",
  label: "Slug",
  type: "text",
  required: true,
  editOnly: true,
  help: "Used in the public URL. Changing it changes the URL — add a redirect if the old one was indexed.",
};

export const RESOURCES: ResourceDef[] = [
  {
    key: "products",
    table: "products",
    label: "Products",
    singular: "Product",
    description: "Software built inside the Product Lab.",
    icon: "flask-conical",
    tags: [TAGS.products],
    publicPath: "/products",
    titleField: "name",
    subtitleField: "tagline",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "status", label: "Status", type: "badge" },
      { name: "category", label: "Category" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "updated_at", label: "Updated", type: "date" },
    ],
    searchColumns: ["name", "slug", "tagline"],
    orderBy: { column: "updated_at", ascending: false },
    hasSeo: true,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "name", label: "Name", type: "text", required: true, group: "Identity", colSpan: 2 },
      { name: "tagline", label: "Tagline", type: "text", required: true, group: "Identity", colSpan: 2, help: "Short category line, e.g. “Restaurant Management System”." },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: PRODUCT_STATUSES,
        group: "Identity",
        help: "Drives the status indicator on the card and page.",
      },
      { name: "category", label: "Category", type: "select", options: PRODUCT_CATEGORIES, group: "Identity" },
      { name: "short_description", label: "Short description", type: "textarea", group: "Content", colSpan: 2, help: "One or two sentences for cards and meta descriptions." },
      { name: "full_description", label: "Full description", type: "markdown", group: "Content", colSpan: 2, help: "Markdown: ## headings, **bold**, - lists, [links](https://example.com)." },
      { name: "logo_url", label: "Logo URL", type: "url", group: "Media", colSpan: 2 },
      { name: "cover_image_url", label: "Cover image URL", type: "url", group: "Media", colSpan: 2 },
      { name: "gallery", label: "Gallery image URLs", type: "list", group: "Media", colSpan: 2, help: "Comma separated public URLs." },
      { name: "video_url", label: "Video embed URL", type: "url", group: "Media", colSpan: 2, help: "An embeddable https URL." },
      { name: "product_url", label: "Product URL", type: "url", group: "Links", colSpan: 2, help: "Only set this once the product is genuinely reachable." },
      { name: "technologies", label: "Technologies", type: "list", group: "Details", colSpan: 2, help: "Comma separated." },
      { name: "launch_date", label: "Launch date", type: "date", group: "Details" },
      { name: "last_updated_note", label: "Stage note", type: "text", group: "Details", help: "Shown on the card, e.g. “Active development in the Product Lab”." },
      { name: "is_open_source", label: "Open source", type: "boolean", group: "Details" },
      { name: "featured", label: "Featured", type: "boolean", group: "Details", help: "Featured products appear on the homepage." },
    ],
  },
  {
    key: "projects",
    table: "projects",
    label: "Client work",
    singular: "Project",
    description: "Client projects and case studies.",
    icon: "briefcase",
    tags: [TAGS.projects],
    publicPath: "/work",
    titleField: "name",
    subtitleField: "client_name",
    listColumns: [
      { name: "name", label: "Project" },
      { name: "client_name", label: "Client" },
      { name: "industry", label: "Industry" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "delivered_on", label: "Delivered", type: "date" },
    ],
    searchColumns: ["name", "slug", "client_name", "industry"],
    orderBy: { column: "updated_at", ascending: false },
    hasSeo: true,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "name", label: "Project name", type: "text", required: true, group: "Identity", colSpan: 2 },
      { name: "client_name", label: "Client", type: "text", group: "Identity", help: "Only name a client with their permission." },
      { name: "industry", label: "Industry", type: "text", group: "Identity" },
      { name: "project_types", label: "Project types", type: "list", group: "Identity", colSpan: 2, help: "Comma separated, e.g. Web Application, AI." },
      { name: "summary", label: "Summary", type: "textarea", required: true, group: "Content", colSpan: 2 },
      { name: "challenge", label: "The challenge", type: "markdown", group: "Content", colSpan: 2 },
      { name: "solution", label: "What we built", type: "markdown", group: "Content", colSpan: 2 },
      { name: "outcome", label: "The outcome", type: "markdown", group: "Content", colSpan: 2, help: "Qualitative is fine. Do not state a number you cannot source." },
      {
        name: "metrics",
        label: "Verified metrics",
        type: "json",
        group: "Content",
        colSpan: 2,
        help: 'JSON array, e.g. [{"label":"Processing time","value":"-60%","source":"client ops report"}]. Leave empty and the results block is hidden.',
      },
      { name: "technologies", label: "Technologies", type: "list", group: "Details", colSpan: 2 },
      { name: "cover_image_url", label: "Cover image URL", type: "url", group: "Media", colSpan: 2 },
      { name: "gallery", label: "Gallery image URLs", type: "list", group: "Media", colSpan: 2 },
      { name: "website_url", label: "Live site URL", type: "url", group: "Links", colSpan: 2 },
      { name: "case_study_url", label: "External case study URL", type: "url", group: "Links", colSpan: 2 },
      { name: "started_on", label: "Started", type: "date", group: "Timeline" },
      { name: "delivered_on", label: "Delivered", type: "date", group: "Timeline" },
      { name: "featured", label: "Featured", type: "boolean", group: "Details" },
    ],
  },
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    description: "Service offering pages.",
    icon: "layers",
    tags: [TAGS.services],
    publicPath: "/services",
    titleField: "title",
    subtitleField: "tagline",
    listColumns: [
      { name: "title", label: "Service" },
      { name: "category", label: "Category" },
      { name: "display_order", label: "Order" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    searchColumns: ["title", "slug", "summary"],
    orderBy: { column: "display_order", ascending: true },
    hasSeo: true,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "title", label: "Title", type: "text", required: true, group: "Identity", colSpan: 2 },
      { name: "tagline", label: "Tagline", type: "text", group: "Identity", colSpan: 2 },
      { name: "category", label: "Category", type: "select", options: SERVICE_CATEGORIES, group: "Identity" },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        group: "Identity",
        options: [
          "globe", "layers", "smartphone", "sparkles", "workflow", "server",
          "shopping-bag", "pen-tool", "clipboard-list", "layout-grid", "flame",
          "book-open", "calculator", "bar-chart-3",
        ],
      },
      { name: "summary", label: "Summary", type: "textarea", required: true, group: "Content", colSpan: 2 },
      { name: "body", label: "Body", type: "markdown", group: "Content", colSpan: 2 },
      {
        name: "deliverables",
        label: "What this includes",
        type: "list",
        group: "Content",
        colSpan: 2,
        help: "One item per line, or comma separated.",
      },
      { name: "process_notes", label: "How we approach it", type: "list", group: "Content", colSpan: 2 },
      { name: "engagement_models", label: "Engagement models", type: "list", group: "Content", colSpan: 2 },
      {
        name: "faqs",
        label: "FAQs",
        type: "json",
        group: "Content",
        colSpan: 2,
        help: 'JSON array of {"q":"…","a":"…"}. Rendered as visible Q&A and as FAQPage structured data.',
      },
      { name: "display_order", label: "Display order", type: "number", group: "Details" },
      { name: "featured", label: "Featured", type: "boolean", group: "Details" },
    ],
  },
  {
    key: "experiments",
    table: "experiments",
    label: "Experiments",
    singular: "Experiment",
    description: "Research and experiments in the Product Lab.",
    icon: "beaker",
    tags: [TAGS.experiments],
    publicPath: "/lab",
    titleField: "title",
    subtitleField: "code",
    listColumns: [
      { name: "code", label: "Code" },
      { name: "title", label: "Experiment" },
      { name: "status", label: "Status", type: "badge" },
      { name: "progress", label: "Progress" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    searchColumns: ["title", "slug", "code", "summary"],
    orderBy: { column: "started_on", ascending: false },
    hasSeo: true,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "code", label: "Code", type: "text", group: "Identity", help: "e.g. EXPERIMENT #017" },
      { name: "title", label: "Title", type: "text", required: true, group: "Identity" },
      { name: "status", label: "Status", type: "select", required: true, options: PRODUCT_STATUSES, group: "Identity" },
      { name: "summary", label: "Summary", type: "textarea", required: true, group: "Content", colSpan: 2 },
      { name: "hypothesis", label: "Hypothesis", type: "textarea", group: "Content", colSpan: 2, help: "One falsifiable sentence. If it cannot be wrong, it is not an experiment." },
      { name: "body", label: "Notes", type: "markdown", group: "Content", colSpan: 2 },
      { name: "finding", label: "Finding", type: "markdown", group: "Content", colSpan: 2, help: "Recorded when the experiment concludes." },
      { name: "progress", label: "Progress %", type: "number", group: "Details", help: "0–100." },
      { name: "technologies", label: "Technologies", type: "list", group: "Details", colSpan: 2 },
      { name: "image_url", label: "Image URL", type: "url", group: "Media", colSpan: 2 },
      { name: "started_on", label: "Started", type: "date", group: "Timeline" },
      { name: "concluded_on", label: "Concluded", type: "date", group: "Timeline" },
      { name: "featured", label: "Featured", type: "boolean", group: "Details" },
    ],
  },
  {
    key: "insights",
    table: "blog_posts",
    label: "Insights",
    singular: "Article",
    description: "Blog articles and guides.",
    icon: "pen-line",
    tags: [TAGS.blog],
    publicPath: "/insights",
    titleField: "title",
    subtitleField: "excerpt",
    listColumns: [
      { name: "title", label: "Title", type: "truncate" },
      { name: "is_pillar", label: "Pillar", type: "boolean" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "published_at", label: "Published at", type: "date" },
      { name: "updated_at", label: "Updated", type: "date" },
    ],
    searchColumns: ["title", "slug", "excerpt"],
    orderBy: { column: "published_at", ascending: false },
    hasSeo: true,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "title", label: "Title", type: "text", required: true, group: "Content", colSpan: 2 },
      { name: "excerpt", label: "Excerpt", type: "textarea", group: "Content", colSpan: 2, help: "Used on cards and as the fallback meta description." },
      { name: "content", label: "Content", type: "markdown", required: true, group: "Content", colSpan: 2 },
      { name: "reading_minutes", label: "Reading time (minutes)", type: "number", group: "Content" },
      { name: "intent", label: "Search intent", type: "text", group: "Content", colSpan: 2, help: "Which question this article answers. Shown on the article page." },
      { name: "cover_image_url", label: "Cover image URL", type: "url", group: "Media", colSpan: 2 },
      { name: "cover_image_alt", label: "Cover image alt text", type: "text", group: "Media", colSpan: 2, help: "Describe the image for screen readers and search engines." },
      { name: "category_id", label: "Category", type: "text", group: "Organisation", help: "Category UUID from blog_categories." },
      { name: "author_id", label: "Author", type: "text", group: "Organisation", help: "Author UUID from authors." },
      { name: "is_pillar", label: "Pillar article", type: "boolean", group: "Organisation", help: "Pillar articles lead the insights index." },
      { name: "featured", label: "Featured", type: "boolean", group: "Organisation" },
      { name: "updated_note", label: "Update note", type: "text", group: "Organisation", colSpan: 2 },
    ],
  },
  {
    key: "technologies",
    table: "technologies",
    label: "Technologies",
    singular: "Technology",
    description: "The stack shown in the technology wall.",
    icon: "cpu",
    tags: [TAGS.technologies],
    titleField: "name",
    subtitleField: "category",
    listColumns: [
      { name: "name", label: "Technology" },
      { name: "category", label: "Category" },
      { name: "proficiency", label: "Proficiency" },
      { name: "display_order", label: "Order" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    searchColumns: ["name", "slug", "category"],
    orderBy: { column: "display_order", ascending: true },
    hasSeo: false,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "name", label: "Name", type: "text", required: true, group: "Identity" },
      { name: "category", label: "Category", type: "select", required: true, options: TECHNOLOGY_CATEGORIES, group: "Identity" },
      {
        name: "proficiency",
        label: "Proficiency",
        type: "select",
        options: ["core", "working", "exploring"],
        group: "Identity",
        help: "Shown as the coloured indicator. Only claim what is true.",
      },
      { name: "description", label: "What we use it for", type: "textarea", group: "Content", colSpan: 2, help: "Required in spirit: a logo with no reason is decoration." },
      { name: "website_url", label: "Website URL", type: "url", group: "Links", colSpan: 2 },
      { name: "display_order", label: "Display order", type: "number", group: "Details" },
    ],
  },
  {
    key: "team",
    table: "team_members",
    label: "Team",
    singular: "Team member",
    description: "People shown on the About page.",
    icon: "users",
    tags: [TAGS.team],
    titleField: "name",
    subtitleField: "role",
    listColumns: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "display_order", label: "Order" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    searchColumns: ["name", "slug", "role"],
    orderBy: { column: "display_order", ascending: true },
    hasSeo: false,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "name", label: "Name", type: "text", required: true, group: "Identity" },
      { name: "role", label: "Role", type: "text", required: true, group: "Identity" },
      { name: "bio", label: "Bio", type: "textarea", group: "Content", colSpan: 2 },
      { name: "photo_url", label: "Photo URL", type: "url", group: "Media", colSpan: 2 },
      { name: "skills", label: "Skills", type: "list", group: "Details", colSpan: 2 },
      { name: "social_links", label: "Social links", type: "json", group: "Details", colSpan: 2, help: 'JSON object of platform → URL.' },
      { name: "display_order", label: "Display order", type: "number", group: "Details" },
    ],
  },
  {
    key: "customers",
    table: "customers",
    label: "Customers",
    singular: "Customer",
    description: "Client organisations, shown only with consent.",
    icon: "building-2",
    tags: [TAGS.team, TAGS.testimonials],
    titleField: "name",
    subtitleField: "industry",
    listColumns: [
      { name: "name", label: "Customer" },
      { name: "industry", label: "Industry" },
      { name: "is_public", label: "Consent", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    searchColumns: ["name", "slug"],
    orderBy: { column: "name", ascending: true },
    hasSeo: false,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      slugField,
      { name: "name", label: "Customer name", type: "text", required: true, group: "Identity", colSpan: 2 },
      { name: "industry", label: "Industry", type: "text", group: "Identity" },
      { name: "website_url", label: "Website URL", type: "url", group: "Links" },
      { name: "logo_url", label: "Logo URL", type: "url", group: "Media", colSpan: 2 },
      { name: "logo_alt", label: "Logo alt text", type: "text", group: "Media", colSpan: 2 },
      { name: "description", label: "Description", type: "textarea", group: "Content", colSpan: 2 },
      {
        name: "is_public",
        label: "Consent to display",
        type: "boolean",
        group: "Consent",
        help: "Both this and Published must be on before a customer appears publicly. Never switch this on without written permission.",
      },
    ],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Client quotes, published with attribution.",
    icon: "message-square-quote",
    tags: [TAGS.testimonials],
    titleField: "author_name",
    subtitleField: "author_company",
    listColumns: [
      { name: "author_name", label: "Author" },
      { name: "author_company", label: "Company" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "given_on", label: "Given", type: "date" },
    ],
    searchColumns: ["author_name", "author_company", "quote"],
    orderBy: { column: "given_on", ascending: false },
    hasSeo: false,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      ...PUBLISH_FIELDS,
      { name: "author_name", label: "Author name", type: "text", required: true, group: "Attribution" },
      { name: "author_role", label: "Role", type: "text", group: "Attribution" },
      { name: "author_company", label: "Company", type: "text", group: "Attribution" },
      { name: "given_on", label: "Date given", type: "date", group: "Attribution" },
      { name: "quote", label: "Quote", type: "textarea", required: true, group: "Content", colSpan: 2, help: "Reproduce the client's words exactly. Do not edit for marketing." },
      { name: "source_url", label: "Source URL", type: "url", group: "Content", colSpan: 2, help: "Where this quote can be verified. Strongly recommended." },
      { name: "author_image_url", label: "Author photo URL", type: "url", group: "Media", colSpan: 2 },
      { name: "company_logo_url", label: "Company logo URL", type: "url", group: "Media", colSpan: 2 },
      { name: "customer_id", label: "Customer ID", type: "text", group: "Relations", help: "Links this quote to a customer record so client counts stay accurate." },
      { name: "project_id", label: "Project ID", type: "text", group: "Relations" },
      { name: "featured", label: "Featured", type: "boolean", group: "Publishing" },
    ],
  },
  {
    key: "navigation",
    table: "navigation_items",
    label: "Navigation",
    singular: "Navigation item",
    description: "Header, footer and legal menus.",
    icon: "menu",
    tags: [TAGS.settings],
    titleField: "title",
    subtitleField: "href",
    listColumns: [
      { name: "location", label: "Location" },
      { name: "title", label: "Label" },
      { name: "href", label: "URL" },
      { name: "display_order", label: "Order" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    searchColumns: ["title", "href"],
    orderBy: { column: "display_order", ascending: true },
    hasSeo: false,
    publishable: true,
    canCreate: true,
    canDelete: true,
    fields: [
      { name: "published", label: "Published", type: "boolean", group: "Publishing" },
      { name: "location", label: "Location", type: "select", required: true, options: ["header", "footer", "legal", "social"], group: "Identity" },
      { name: "title", label: "Label", type: "text", required: true, group: "Identity" },
      { name: "href", label: "URL", type: "text", required: true, group: "Identity", help: "Internal paths start with /." },
      { name: "description", label: "Description", type: "text", group: "Identity", colSpan: 2 },
      { name: "display_order", label: "Display order", type: "number", group: "Details" },
    ],
  },
  {
    key: "inquiries",
    table: "contact_inquiries",
    label: "Inquiries",
    singular: "Inquiry",
    description: "Project inquiries submitted through the contact form.",
    icon: "inbox",
    tags: [],
    titleField: "name",
    subtitleField: "email",
    listColumns: [
      { name: "created_at", label: "Received", type: "date" },
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "project_type", label: "Type" },
      { name: "budget_range", label: "Budget" },
      { name: "status", label: "Status", type: "badge" },
    ],
    searchColumns: ["name", "email", "company", "description"],
    orderBy: { column: "created_at", ascending: false },
    hasSeo: false,
    publishable: false,
    canCreate: false,
    canDelete: true,
    fields: [
      { name: "status", label: "Status", type: "select", required: true, options: ["new", "read", "in_discussion", "won", "archived", "spam"], group: "Triage" },
      { name: "notes", label: "Internal notes", type: "textarea", group: "Triage", colSpan: 2, help: "Never shown publicly." },
      { name: "name", label: "Name", type: "text", group: "Submission", colSpan: 1 },
      { name: "email", label: "Email", type: "text", group: "Submission", colSpan: 1 },
      { name: "company", label: "Company", type: "text", group: "Submission" },
      { name: "phone", label: "Phone", type: "text", group: "Submission" },
      { name: "project_type", label: "Project type", type: "select", options: PROJECT_TYPES, group: "Submission" },
      { name: "budget_range", label: "Budget range", type: "select", options: BUDGET_RANGES, group: "Submission" },
      { name: "timeline", label: "Timeline", type: "select", options: TIMELINES, group: "Submission" },
      { name: "referral_source", label: "Heard about us via", type: "select", options: REFERRAL_SOURCES, group: "Submission", colSpan: 2 },
      { name: "description", label: "Description", type: "textarea", group: "Submission", colSpan: 2 },
    ],
  },
];

export const RESOURCE_MAP = new Map(RESOURCES.map((resource) => [resource.key, resource]));

export function getResource(key: string): ResourceDef | null {
  return RESOURCE_MAP.get(key) ?? null;
}

/** Field definitions including SEO, in the order the form should render them. */
export function allFields(resource: ResourceDef): FieldDef[] {
  return resource.hasSeo ? [...resource.fields, ...SEO_FIELDS] : resource.fields;
}

/** Groups fields into fieldsets for the edit form. */
export function groupFields(fields: FieldDef[]) {
  const groups = new Map<string, FieldDef[]>();
  for (const field of fields) {
    const key = field.group ?? "Details";
    const bucket = groups.get(key) ?? [];
    bucket.push(field);
    groups.set(key, bucket);
  }
  return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
}

/** Admin routes never need SEO on non-indexable or non-content resources. */
export function seoAllowed(resource: ResourceDef) {
  return resource.hasSeo;
}
