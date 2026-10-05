import { z } from "zod";
import { SERVICE_ICON_KEYS, type ServiceIconKey } from "@/lib/constants/service-icons";
import { contentStatusSchema, hrefSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/**
 * Service content rules. Shared by the admin form (client), the save actions
 * (server) and the public pages (parsing JSONB). Limits mirror the CHECK
 * constraints in supabase/migrations/20261004120500_services_content.sql.
 */

export const titledItemSchema = z.object({
  title: text("Title", 2, 80),
  description: text("Description", 10, 400),
});

export const faqItemSchema = z.object({
  question: text("Question", 5, 200),
  answer: text("Answer", 10, 1200),
});

export type TitledItem = z.infer<typeof titledItemSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;

export const SERVICE_LIST_LIMITS = {
  problems: 8,
  features: 12,
  process: 8,
  outcomes: 8,
  faqs: 12,
  technologies: 30,
} as const;

/** Images and the shared list/paragraph helpers now live in common.ts; re-exported for existing importers. */
export { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, parseList, toParagraphs } from "@/lib/validations/common";

export const serviceFormSchema = z.object({
  title: text("Title", 2, 80),
  slug: slugSchema,
  summary: text("Short description", 10, 200),
  overview: optionalText("Full description", 8000),
  icon: z.enum(SERVICE_ICON_KEYS as [ServiceIconKey, ...ServiceIconKey[]], { error: "Choose an icon." }),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
  cover_image_alt: optionalText("Image description", 200),
  problems: z.array(titledItemSchema).max(SERVICE_LIST_LIMITS.problems, `Add up to ${SERVICE_LIST_LIMITS.problems} problems.`),
  features: z.array(titledItemSchema).max(SERVICE_LIST_LIMITS.features, `Add up to ${SERVICE_LIST_LIMITS.features} capabilities.`),
  technologies: z
    .array(text("Technology", 1, 40))
    .max(SERVICE_LIST_LIMITS.technologies, `Add up to ${SERVICE_LIST_LIMITS.technologies} technologies.`)
    .refine(
      (items) => new Set(items.map((item) => item.toLowerCase())).size === items.length,
      "Each technology can only be listed once.",
    ),
  process: z.array(titledItemSchema).max(SERVICE_LIST_LIMITS.process, `Add up to ${SERVICE_LIST_LIMITS.process} steps.`),
  outcomes: z.array(titledItemSchema).max(SERVICE_LIST_LIMITS.outcomes, `Add up to ${SERVICE_LIST_LIMITS.outcomes} outcomes.`),
  faqs: z.array(faqItemSchema).max(SERVICE_LIST_LIMITS.faqs, `Add up to ${SERVICE_LIST_LIMITS.faqs} questions.`),
  cta_title: text("CTA heading", 5, 100),
  cta_description: text("CTA text", 10, 280),
  cta_label: text("Button label", 2, 32),
  cta_href: hrefSchema,
  seo_title: optionalText("SEO title", 70),
  seo_description: optionalText("SEO description", 170),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
export type ServiceFormInput = z.input<typeof serviceFormSchema>;

/** Starting values for a new service. CTA defaults mirror the column defaults in the database. */
export function emptyServiceValues(sortOrder: number): ServiceFormValues {
  return {
    title: "",
    slug: "",
    summary: "",
    overview: "",
    icon: "sparkles",
    status: "draft",
    sort_order: sortOrder,
    cover_image_alt: "",
    problems: [],
    features: [],
    technologies: [],
    process: [],
    outcomes: [],
    faqs: [],
    cta_title: "Have a project in mind?",
    cta_description: "Tell us what you are building and we will reply within two working days with next steps.",
    cta_label: "Start a Project",
    cta_href: "/contact",
    seo_title: "",
    seo_description: "",
  };
}
