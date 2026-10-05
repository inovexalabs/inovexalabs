import { z } from "zod";
import { INNOVATION_CATEGORIES, LAB_STAGE_KEYS } from "@/lib/constants/innovation";
import type { Enums } from "@/types/database";
import { contentStatusSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/**
 * Innovation Lab content rules. Mirrors the CHECK constraints in
 * supabase/migrations/20261004120900_innovation_projects.sql.
 */

export const INNOVATION_LIST_LIMITS = {
  technologies: 16,
} as const;

export const innovationCategorySchema = z.enum(
  Object.keys(INNOVATION_CATEGORIES) as [Enums<"innovation_category">, ...Enums<"innovation_category">[]],
  { error: "Choose a category." },
);

export const labStageSchema = z.enum(LAB_STAGE_KEYS as [Enums<"lab_stage">, ...Enums<"lab_stage">[]], {
  error: "Choose a stage.",
});

const httpsUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(200, `${label} must be 200 characters or fewer.`)
    .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), {
      message: `${label} must be a full https:// address.`,
    });

export const innovationFormSchema = z.object({
  title: text("Title", 2, 90),
  slug: slugSchema,
  category: innovationCategorySchema,
  stage: labStageSchema,
  description: text("Short description", 20, 240),
  long_description: optionalText("Full description", 12000),
  problem: optionalText("Problem", 3000),
  experiment: optionalText("Experiment", 4000),
  learnings: optionalText("What we learned", 4000),
  future_direction: optionalText("Future direction", 3000),
  technologies: z
    .array(text("Technology", 1, 40))
    .max(INNOVATION_LIST_LIMITS.technologies, `Add up to ${INNOVATION_LIST_LIMITS.technologies} technologies.`)
    .refine(
      (items) => new Set(items.map((item) => item.toLowerCase())).size === items.length,
      "Each technology can only be listed once.",
    ),
  github_url: httpsUrl("Repository link"),
  demo_url: httpsUrl("Demo link"),
  featured: z.boolean(),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
  cover_image_alt: optionalText("Image description", 200),
  seo_title: optionalText("SEO title", 70),
  seo_description: optionalText("SEO description", 170),
});

export type InnovationFormValues = z.infer<typeof innovationFormSchema>;

/** Starting values for a new experiment. */
export function emptyInnovationValues(sortOrder: number): InnovationFormValues {
  return {
    title: "",
    slug: "",
    category: "other",
    stage: "research",
    description: "",
    long_description: "",
    problem: "",
    experiment: "",
    learnings: "",
    future_direction: "",
    technologies: [],
    github_url: "",
    demo_url: "",
    featured: false,
    status: "draft",
    sort_order: sortOrder,
    cover_image_alt: "",
    seo_title: "",
    seo_description: "",
  };
}
