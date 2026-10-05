import { z } from "zod";
import { contentStatusSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/**
 * Project content rules. Shared by the admin form (client), the save actions
 * (server) and the public pages (parsing JSONB). Limits mirror the CHECK
 * constraints in supabase/migrations/20261004120800_projects.sql.
 */

export const PROJECT_LIST_LIMITS = {
  technologies: 24,
  metrics: 6,
  gallery: 8,
} as const;

/** One measurable result. Only what an admin actually entered is ever shown. */
export const metricSchema = z.object({
  metric: text("Metric", 1, 12),
  label: text("Label", 2, 60),
  description: text("Description", 3, 240),
});

export type ProjectMetric = z.infer<typeof metricSchema>;

/** A stored gallery image (`path`) or one chosen but not uploaded yet (`path` null). */
export const galleryEntrySchema = z.object({
  path: z.string().trim().max(300).nullable(),
  alt: text("Image description", 3, 200),
});

export type GalleryEntry = z.infer<typeof galleryEntrySchema>;

const httpsUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(200, `${label} must be 200 characters or fewer.`)
    .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), {
      message: `${label} must be a full https:// address.`,
    });

export const projectFormSchema = z.object({
  title: text("Title", 2, 90),
  slug: slugSchema,
  short_description: text("Short description", 20, 220),
  description: optionalText("Full description", 12000),
  category: text("Category", 2, 40),
  client_name: optionalText("Client name", 80),
  industry: optionalText("Industry", 60),
  status: contentStatusSchema,
  featured: z.boolean(),
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
  cover_image_alt: optionalText("Image description", 200),
  technologies: z
    .array(text("Technology", 1, 40))
    .max(PROJECT_LIST_LIMITS.technologies, `Add up to ${PROJECT_LIST_LIMITS.technologies} technologies.`)
    .refine(
      (items) => new Set(items.map((item) => item.toLowerCase())).size === items.length,
      "Each technology can only be listed once.",
    ),
  challenge: optionalText("Challenge", 4000),
  solution: optionalText("Solution", 4000),
  implementation: optionalText("Implementation", 6000),
  results: optionalText("Results", 4000),
  metrics: z
    .array(metricSchema)
    .max(PROJECT_LIST_LIMITS.metrics, `Add up to ${PROJECT_LIST_LIMITS.metrics} results.`),
  gallery: z.array(galleryEntrySchema).max(PROJECT_LIST_LIMITS.gallery, `Add up to ${PROJECT_LIST_LIMITS.gallery} images.`),
  project_url: httpsUrl("Project link"),
  github_url: httpsUrl("Repository link"),
  seo_title: optionalText("SEO title", 70),
  seo_description: optionalText("SEO description", 170),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

/** Starting values for a new project. */
export function emptyProjectValues(sortOrder: number): ProjectFormValues {
  return {
    title: "",
    slug: "",
    short_description: "",
    description: "",
    category: "",
    client_name: "",
    industry: "",
    status: "draft",
    featured: false,
    sort_order: sortOrder,
    cover_image_alt: "",
    technologies: [],
    challenge: "",
    solution: "",
    implementation: "",
    results: "",
    metrics: [],
    gallery: [],
    project_url: "",
    github_url: "",
    seo_title: "",
    seo_description: "",
  };
}
