import { z } from "zod";
import { TECH_CATEGORIES } from "@/lib/constants/tech";
import type { Enums } from "@/types/database";
import { contentStatusSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/** Technology catalogue rules. Mirrors supabase/migrations/20261004121000_technologies.sql. */

export const techCategorySchema = z.enum(
  Object.keys(TECH_CATEGORIES) as [Enums<"tech_category">, ...Enums<"tech_category">[]],
  { error: "Choose a category." },
);

const httpsUrl = z
  .string()
  .trim()
  .max(200, "Website must be 200 characters or fewer.")
  .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), {
    message: "Website must be a full https:// address.",
  });

export const technologyFormSchema = z.object({
  name: text("Name", 2, 40),
  slug: slugSchema,
  category: techCategorySchema,
  description: optionalText("Description", 140),
  website: httpsUrl,
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
  logo_alt: optionalText("Logo description", 120),
});

export type TechnologyFormValues = z.infer<typeof technologyFormSchema>;

export function emptyTechnologyValues(sortOrder: number): TechnologyFormValues {
  return {
    name: "",
    slug: "",
    category: "backend",
    description: "",
    website: "",
    status: "draft",
    sort_order: sortOrder,
    logo_alt: "",
  };
}
