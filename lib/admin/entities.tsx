import "server-only";
import type { ReactNode } from "react";
import { z } from "zod";
import { StatusBadge } from "@/components/admin/status-badge";
import { ENTITY_FORMS, type AdminEntityKey } from "@/lib/admin/entity-forms";
import type { MediaFolder } from "@/lib/supabase/media";
import { formatDate } from "@/lib/utils/format";
import { emptyBlogValues, type BlogFormValues } from "@/lib/validations/blog";
import { emptyFaqValues, type FaqFormValues } from "@/lib/validations/faq";
import { emptyInnovationValues, type InnovationFormValues } from "@/lib/validations/innovation";
import { emptyNavItemValues, type NavItemFormValues } from "@/lib/validations/settings";
import { emptyProcessValues, type ProcessFormValues } from "@/lib/validations/process";
import { emptyProjectValues, type ProjectFormValues } from "@/lib/validations/project";
import { emptyTeamValues, type TeamFormValues } from "@/lib/validations/team";
import { emptyTechnologyValues, type TechnologyFormValues } from "@/lib/validations/technology";
import { emptyTestimonialValues, type TestimonialFormValues } from "@/lib/validations/testimonial";

/**
 * Registry for the content sections managed through /admin/[entity].
 *
 * Each entry declares the table, the Zod schema shared by the form and the
 * save action, how rows map to form values, and which columns the list shows.
 * The routes (list / new / edit) and the Server Actions are generic — adding
 * a content type means adding one entry here plus its field component.
 */
export type { AdminEntityKey };

export interface AdminColumn {
  header: string;
  cell: (row: Record<string, unknown>) => ReactNode;
}

type AnyFormValues = Record<string, unknown>;

export interface EntityConfig {
  /** Route segment: /admin/[entity] */
  key: AdminEntityKey;
  label: string;
  singular: string;
  /** One-line description shown under the list heading. */
  description: string;
  table: keyof import("@/types/database").Database["public"]["Tables"];
  /** Scalar columns to load for the list. */
  listColumns: string;
  /** Column to order the list by (plus title as a tiebreaker where present). */
  orderBy: string;
  columns: AdminColumn[];
  schema: z.ZodType<AnyFormValues, AnyFormValues>;
  empty: (sortOrder: number) => AnyFormValues;
  /** Maps validated form values to a database row (image path handled separately). */
  toRow: (values: AnyFormValues, imagePath: string | null) => Record<string, unknown>;
  /** Maps a database row back to form values. */
  toValues: (row: Record<string, unknown>) => AnyFormValues;
  image?: { pathField: string; altField: string; folder: MediaFolder };
  /** Where the public page lives, when the record has one. */
  publicHref?: (row: Record<string, unknown>) => string | null;
  /** Extra text for the delete confirmation. */
  deleteHint: string;
}

const str = (value: unknown): string => (typeof value === "string" ? value : "");
const num = (value: unknown): number => (typeof value === "number" ? value : 0);
const bool = (value: unknown): boolean => value === true;
const strArray = (value: unknown): string[] => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);

/** Renders a timestamp cell as "4 Oct 2026", or a dash when it is empty. */
const dateCell = (value: unknown): ReactNode => {
  if (typeof value !== "string" || !value) return "—";
  const time = Date.parse(value);
  return Number.isNaN(time) ? "—" : formatDate(value);
};

/** Renders a content status with its badge (colour is never the only signal). */
const statusCell = (value: unknown): ReactNode => {
  const status = str(value);
  if (status === "published" || status === "draft" || status === "archived") return <StatusBadge status={status} />;
  return status || "—";
};

export const ENTITY_CONFIGS: Record<AdminEntityKey, EntityConfig> = {
  projects: {
    key: "projects",
    ...ENTITY_FORMS.projects,
    label: "Projects",
    description:
      "Case studies shown on /projects. Results and gallery images only appear on the page once they are entered here.",
    table: "projects",
    listColumns: "id, slug, title, category, featured, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Project",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.title)}</span>
            <span className="block truncate text-sm text-fg-muted">/projects/{str(row.slug)}</span>
          </span>
        ),
      },
      { header: "Category", cell: (row) => str(row.category) },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyProjectValues(sort) as unknown as AnyFormValues,
    toRow: (values, imagePath) => {
      const v = values as unknown as ProjectFormValues;
      return {
        title: v.title,
        slug: v.slug,
        short_description: v.short_description,
        description: v.description,
        category: v.category,
        client_name: v.client_name || null,
        industry: v.industry || null,
        cover_image_path: imagePath,
        cover_image_alt: imagePath ? v.cover_image_alt : null,
        gallery: v.gallery.map((entry) => ({ path: entry.path, alt: entry.alt })),
        technologies: v.technologies,
        challenge: v.challenge || null,
        solution: v.solution || null,
        implementation: v.implementation || null,
        results: v.results || null,
        metrics: v.metrics,
        project_url: v.project_url || null,
        github_url: v.github_url || null,
        featured: v.featured,
        status: v.status,
        sort_order: v.sort_order,
        seo_title: v.seo_title || null,
        seo_description: v.seo_description || null,
      };
    },
    toValues: (row) => ({
      title: str(row.title),
      slug: str(row.slug),
      short_description: str(row.short_description),
      description: str(row.description),
      category: str(row.category),
      client_name: str(row.client_name),
      industry: str(row.industry),
      status: str(row.status),
      featured: bool(row.featured),
      sort_order: num(row.sort_order),
      cover_image_alt: str(row.cover_image_alt),
      technologies: strArray(row.technologies),
      challenge: str(row.challenge),
      solution: str(row.solution),
      implementation: str(row.implementation),
      results: str(row.results),
      metrics: Array.isArray(row.metrics) ? row.metrics : [],
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      project_url: str(row.project_url),
      github_url: str(row.github_url),
      seo_title: str(row.seo_title),
      seo_description: str(row.seo_description),
    }),
    publicHref: (row) => (row.slug ? `/projects/${str(row.slug)}` : null),
    deleteHint: "The case study page and its images are removed permanently. Links to it will stop working.",
  },

  innovation: {
    key: "innovation",
    ...ENTITY_FORMS.innovation,
    label: "Innovation Lab",
    description: "Internal experiments shown on /innovation. Stage and status are separate: stage is the life cycle.",
    table: "innovation_projects",
    listColumns: "id, slug, title, category, stage, featured, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Experiment",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.title)}</span>
            <span className="block truncate text-sm text-fg-muted">/innovation/{str(row.slug)}</span>
          </span>
        ),
      },
      { header: "Category", cell: (row) => str(row.category) },
      { header: "Stage", cell: (row) => str(row.stage) },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyInnovationValues(sort) as unknown as AnyFormValues,
    toRow: (values, imagePath) => {
      const v = values as unknown as InnovationFormValues;
      return {
        title: v.title,
        slug: v.slug,
        category: v.category,
        stage: v.stage,
        description: v.description,
        long_description: v.long_description,
        problem: v.problem || null,
        experiment: v.experiment || null,
        learnings: v.learnings || null,
        future_direction: v.future_direction || null,
        cover_image_path: imagePath,
        cover_image_alt: imagePath ? v.cover_image_alt : null,
        technologies: v.technologies,
        github_url: v.github_url || null,
        demo_url: v.demo_url || null,
        featured: v.featured,
        status: v.status,
        sort_order: v.sort_order,
        seo_title: v.seo_title || null,
        seo_description: v.seo_description || null,
      };
    },
    toValues: (row) => ({
      title: str(row.title),
      slug: str(row.slug),
      category: str(row.category),
      stage: str(row.stage),
      description: str(row.description),
      long_description: str(row.long_description),
      problem: str(row.problem),
      experiment: str(row.experiment),
      learnings: str(row.learnings),
      future_direction: str(row.future_direction),
      technologies: strArray(row.technologies),
      github_url: str(row.github_url),
      demo_url: str(row.demo_url),
      featured: bool(row.featured),
      status: str(row.status),
      sort_order: num(row.sort_order),
      cover_image_alt: str(row.cover_image_alt),
      seo_title: str(row.seo_title),
      seo_description: str(row.seo_description),
    }),
    publicHref: (row) => (row.slug ? `/innovation/${str(row.slug)}` : null),
    deleteHint: "The experiment page and its images are removed permanently.",
  },

  blog: {
    key: "blog",
    ...ENTITY_FORMS.blog,
    label: "Blog",
    description: "Articles for /blog. Publishing stamps the date shown to readers; drafts stay invisible to visitors.",
    table: "blog_posts",
    listColumns: "id, slug, title, category, author_name, featured, status, sort_order, published_at, updated_at",
    orderBy: "published_at",
    columns: [
      {
        header: "Article",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.title)}</span>
            <span className="block truncate text-sm text-fg-muted">/blog/{str(row.slug)}</span>
          </span>
        ),
      },
      { header: "Category", cell: (row) => str(row.category) },
      { header: "Author", cell: (row) => str(row.author_name) || "—" },
      { header: "Status", cell: statusCell },
      { header: "Published", cell: (row) => dateCell(row.published_at) },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: () => emptyBlogValues() as unknown as AnyFormValues,
    toRow: (values, imagePath) => {
      const v = values as unknown as BlogFormValues;
      return {
        title: v.title,
        slug: v.slug,
        excerpt: v.excerpt,
        content: v.content,
        category: v.category,
        tags: v.tags,
        author_name: v.author_name || null,
        featured: v.featured,
        status: v.status,
        cover_image_path: imagePath,
        cover_image_alt: imagePath ? v.cover_image_alt : null,
        seo_title: v.seo_title || null,
        seo_description: v.seo_description || null,
        canonical_url: v.canonical_url || null,
      };
    },
    toValues: (row) => ({
      title: str(row.title),
      slug: str(row.slug),
      excerpt: str(row.excerpt),
      content: str(row.content),
      category: str(row.category),
      tags: strArray(row.tags),
      author_name: str(row.author_name),
      featured: bool(row.featured),
      status: str(row.status),
      cover_image_alt: str(row.cover_image_alt),
      seo_title: str(row.seo_title),
      seo_description: str(row.seo_description),
      canonical_url: str(row.canonical_url),
    }),
    publicHref: (row) => (row.slug ? `/blog/${str(row.slug)}` : null),
    deleteHint: "The article and its cover image are removed permanently. Links to it will stop working.",
  },

  testimonials: {
    key: "testimonials",
    ...ENTITY_FORMS.testimonials,
    label: "Testimonials",
    description: "Client quotes shown on the homepage. Only add quotes you have permission to publish.",
    table: "testimonials",
    listColumns: "id, name, role, company, rating, featured, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Client",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.name)}</span>
            <span className="block truncate text-sm text-fg-muted">
              {[str(row.role), str(row.company)].filter(Boolean).join(" · ") || "—"}
            </span>
          </span>
        ),
      },
      { header: "Rating", cell: (row) => `${num(row.rating)} / 5` },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyTestimonialValues(sort) as unknown as AnyFormValues,
    toRow: (values, imagePath) => {
      const v = values as unknown as TestimonialFormValues;
      return {
        name: v.name,
        role: v.role || null,
        company: v.company || null,
        testimonial: v.testimonial,
        rating: v.rating,
        featured: v.featured,
        status: v.status,
        sort_order: v.sort_order,
        avatar_path: imagePath,
        avatar_alt: imagePath ? v.avatar_alt : null,
      };
    },
    toValues: (row) => ({
      name: str(row.name),
      role: str(row.role),
      company: str(row.company),
      testimonial: str(row.testimonial),
      rating: num(row.rating),
      featured: bool(row.featured),
      status: str(row.status),
      sort_order: num(row.sort_order),
      avatar_alt: str(row.avatar_alt),
    }),
    deleteHint: "The quote is removed from the site permanently.",
  },

  team: {
    key: "team",
    ...ENTITY_FORMS.team,
    label: "Team",
    description: "People shown on /about, with skills and profile links.",
    table: "team_members",
    listColumns: "id, slug, name, role, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Member",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.name)}</span>
            <span className="block truncate text-sm text-fg-muted">{str(row.role)}</span>
          </span>
        ),
      },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyTeamValues(sort) as unknown as AnyFormValues,
    toRow: (values, imagePath) => {
      const v = values as unknown as TeamFormValues;
      return {
        name: v.name,
        slug: v.slug,
        role: v.role,
        bio: v.bio,
        skills: v.skills,
        social_links: v.social_links,
        status: v.status,
        sort_order: v.sort_order,
        photo_path: imagePath,
        photo_alt: imagePath ? v.photo_alt : null,
      };
    },
    toValues: (row) => ({
      name: str(row.name),
      slug: str(row.slug),
      role: str(row.role),
      bio: str(row.bio),
      skills: strArray(row.skills),
      social_links: Array.isArray(row.social_links) ? row.social_links : [],
      status: str(row.status),
      sort_order: num(row.sort_order),
      photo_alt: str(row.photo_alt),
    }),
    publicHref: () => "/team",
    deleteHint: "The profile and photo are removed from /about and /team permanently.",
  },

  technologies: {
    key: "technologies",
    ...ENTITY_FORMS.technologies,
    label: "Technologies",
    description: "The stack the site claims. Nothing appears on the site until a technology is published here.",
    table: "technologies",
    listColumns: "id, slug, name, category, website, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Technology",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.name)}</span>
            <span className="block truncate text-sm text-fg-muted">{str(row.website) || "—"}</span>
          </span>
        ),
      },
      { header: "Category", cell: (row) => str(row.category) },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyTechnologyValues(sort) as unknown as AnyFormValues,
    toRow: (values, imagePath) => {
      const v = values as unknown as TechnologyFormValues;
      return {
        name: v.name,
        slug: v.slug,
        category: v.category,
        description: v.description || null,
        website: v.website || null,
        status: v.status,
        sort_order: v.sort_order,
        logo_path: imagePath,
        logo_alt: imagePath ? v.logo_alt : null,
      };
    },
    toValues: (row) => ({
      name: str(row.name),
      slug: str(row.slug),
      category: str(row.category),
      description: str(row.description),
      website: str(row.website),
      status: str(row.status),
      sort_order: num(row.sort_order),
      logo_alt: str(row.logo_alt),
    }),
    deleteHint: "The technology disappears from the stack section and every badge that uses it.",
  },

  process: {
    key: "process",
    ...ENTITY_FORMS.process,
    label: "Process",
    description: "The “How We Work” timeline. Position in this list is the visible step number.",
    table: "process_steps",
    listColumns: "id, slug, title, icon, duration, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Step",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.title)}</span>
            <span className="block truncate text-sm text-fg-muted">{str(row.short_description)}</span>
          </span>
        ),
      },
      { header: "Duration", cell: (row) => str(row.duration) || "—" },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyProcessValues(sort) as unknown as AnyFormValues,
    toRow: (values) => {
      const v = values as unknown as ProcessFormValues;
      return {
        title: v.title,
        slug: v.slug,
        short_description: v.short_description,
        description: v.description,
        icon: v.icon,
        deliverables: v.deliverables,
        duration: v.duration || null,
        status: v.status,
        sort_order: v.sort_order,
      };
    },
    toValues: (row) => ({
      title: str(row.title),
      slug: str(row.slug),
      short_description: str(row.short_description),
      description: str(row.description),
      icon: str(row.icon),
      deliverables: strArray(row.deliverables),
      duration: str(row.duration),
      status: str(row.status),
      sort_order: num(row.sort_order),
    }),
    deleteHint: "The step disappears from the timeline on the homepage and /about.",
  },

  faqs: {
    key: "faqs",
    ...ENTITY_FORMS.faqs,
    label: "FAQs",
    description: "Frequently asked questions attached to a page. Service-specific FAQs live on the service itself.",
    table: "faq_items",
    listColumns: "id, question, page, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      { header: "Question", cell: (row) => str(row.question) },
      { header: "Page", cell: (row) => str(row.page) },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyFaqValues(sort) as unknown as AnyFormValues,
    toRow: (values) => {
      const v = values as unknown as FaqFormValues;
      return { question: v.question, answer: v.answer, page: v.page, status: v.status, sort_order: v.sort_order };
    },
    toValues: (row) => ({
      question: str(row.question),
      answer: str(row.answer),
      page: str(row.page),
      status: str(row.status),
      sort_order: num(row.sort_order),
    }),
    deleteHint: "The question is removed from the page it was attached to.",
  },

  navigation: {
    key: "navigation",
    ...ENTITY_FORMS.navigation,
    label: "Navigation",
    description:
      "Header and footer links. The site falls back to its built-in links when nothing here is published.",
    table: "navigation_items",
    listColumns: "id, label, href, location, status, sort_order, updated_at",
    orderBy: "sort_order",
    columns: [
      { header: "Order", cell: (row) => num(row.sort_order) },
      {
        header: "Link",
        cell: (row) => (
          <span className="min-w-0">
            <span className="block truncate font-medium text-fg">{str(row.label)}</span>
            <span className="block truncate text-sm text-fg-muted">{str(row.href)}</span>
          </span>
        ),
      },
      { header: "Location", cell: (row) => str(row.location) },
      { header: "Status", cell: statusCell },
      { header: "Updated", cell: (row) => dateCell(row.updated_at) },
    ],
    empty: (sort) => emptyNavItemValues("header", sort) as unknown as AnyFormValues,
    toRow: (values) => {
      const v = values as unknown as NavItemFormValues;
      return { label: v.label, href: v.href, location: v.location, status: v.status, sort_order: v.sort_order };
    },
    toValues: (row) => ({
      label: str(row.label),
      href: str(row.href),
      location: str(row.location),
      status: str(row.status),
      sort_order: num(row.sort_order),
    }),
    deleteHint: "The link is removed from the site navigation.",
  },
};

export const ENTITY_KEYS = Object.keys(ENTITY_CONFIGS) as AdminEntityKey[];

export function isEntityKey(value: string): value is AdminEntityKey {
  return (ENTITY_KEYS as string[]).includes(value);
}

export function getEntityConfig(value: string): EntityConfig | null {
  return isEntityKey(value) ? ENTITY_CONFIGS[value] : null;
}

/** Every cache tag a content mutation should invalidate. */
export const ENTITY_CACHE_TAG: Record<AdminEntityKey, string> = {
  projects: "projects",
  innovation: "innovation",
  blog: "blog",
  testimonials: "testimonials",
  team: "team",
  technologies: "technologies",
  process: "process",
  faqs: "faqs",
  navigation: "navigation",
};

/** Public paths affected by a change, for revalidatePath(). */
export function publicPathsFor(entity: AdminEntityKey, row: Record<string, unknown>): string[] {
  const config = ENTITY_CONFIGS[entity];
  const href = config.publicHref?.(row);
  const paths = new Set<string>(["/"]);
  if (href) paths.add(href);
  if (entity === "blog") paths.add("/blog");
  if (entity === "projects") paths.add("/projects");
  if (entity === "innovation") paths.add("/innovation");
  if (entity === "team") {
    paths.add("/about");
    paths.add("/team");
  }
  if (entity === "technologies") paths.add("/about");
  if (entity === "process") paths.add("/about");
  if (entity === "navigation") {
    paths.add("/about");
    paths.add("/projects");
  }
  return [...paths];
}
