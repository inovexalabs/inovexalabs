import type { z } from "zod";
import type { MediaFolder } from "@/lib/supabase/media";
import { blogFormSchema } from "@/lib/validations/blog";
import { faqFormSchema } from "@/lib/validations/faq";
import { innovationFormSchema } from "@/lib/validations/innovation";
import { processFormSchema } from "@/lib/validations/process";
import { projectFormSchema } from "@/lib/validations/project";
import { navItemFormSchema } from "@/lib/validations/settings";
import { teamFormSchema } from "@/lib/validations/team";
import { technologyFormSchema } from "@/lib/validations/technology";
import { testimonialFormSchema } from "@/lib/validations/testimonial";

/**
 * The part of the admin entity registry the browser needs: the form's Zod
 * schema, its image field and its name. Kept apart from lib/admin/entities.tsx
 * (server-only, with JSX list columns and row mappers) because Client
 * Components cannot receive functions or schema instances as props — they
 * look their entry up here by entity key instead.
 */
export type AdminEntityKey =
  | "projects"
  | "innovation"
  | "blog"
  | "testimonials"
  | "team"
  | "technologies"
  | "process"
  | "faqs"
  | "navigation";

type AnyFormValues = Record<string, unknown>;

export interface EntityFormConfig {
  singular: string;
  schema: z.ZodType<AnyFormValues, AnyFormValues>;
  image?: { pathField: string; altField: string; folder: MediaFolder };
}

const asFormSchema = (schema: z.ZodType) => schema as unknown as z.ZodType<AnyFormValues, AnyFormValues>;

export const ENTITY_FORMS: Record<AdminEntityKey, EntityFormConfig> = {
  projects: {
    singular: "Project",
    schema: asFormSchema(projectFormSchema),
    image: { pathField: "cover_image_path", altField: "cover_image_alt", folder: "projects" },
  },
  innovation: {
    singular: "Experiment",
    schema: asFormSchema(innovationFormSchema),
    image: { pathField: "cover_image_path", altField: "cover_image_alt", folder: "innovation" },
  },
  blog: {
    singular: "Article",
    schema: asFormSchema(blogFormSchema),
    image: { pathField: "cover_image_path", altField: "cover_image_alt", folder: "blog" },
  },
  testimonials: {
    singular: "Testimonial",
    schema: asFormSchema(testimonialFormSchema),
    image: { pathField: "avatar_path", altField: "avatar_alt", folder: "testimonials" },
  },
  team: {
    singular: "Team member",
    schema: asFormSchema(teamFormSchema),
    image: { pathField: "photo_path", altField: "photo_alt", folder: "team" },
  },
  technologies: {
    singular: "Technology",
    schema: asFormSchema(technologyFormSchema),
    image: { pathField: "logo_path", altField: "logo_alt", folder: "technologies" },
  },
  process: {
    singular: "Process step",
    schema: asFormSchema(processFormSchema),
  },
  faqs: {
    singular: "FAQ entry",
    schema: asFormSchema(faqFormSchema),
  },
  navigation: {
    singular: "Navigation link",
    schema: asFormSchema(navItemFormSchema),
  },
};
