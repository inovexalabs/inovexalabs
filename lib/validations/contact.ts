import { z } from "zod";
import { BUDGET_RANGES, PROJECT_TYPES, SERVICE_INTERESTS, TIMELINES } from "@/lib/constants/contact";
import { text } from "@/lib/validations/common";

/**
 * Public project-intake rules for /contact. Validated in the browser first,
 * then again inside the Server Action — the client copy is never trusted.
 * Mirrors the CHECK constraints on public.contact_leads.
 */

export const CONTACT_LIMITS = {
  services: 8,
} as const;

const optionalPhone = z
  .string()
  .trim()
  .max(30, "Phone must be 30 characters or fewer.")
  .refine((value) => value === "" || /^[+()\d\s.-]{5,30}$/.test(value), {
    message: "Enter a valid phone number, or leave it empty.",
  });

export const contactFormSchema = z.object({
  name: text("Name", 2, 80),
  email: z.email("Enter a valid email address.").max(254, "Email must be 254 characters or fewer."),
  phone: optionalPhone,
  company: z.string().trim().max(80, "Company must be 80 characters or fewer."),
  project_type: z.enum(PROJECT_TYPES, { error: "Choose a project type." }),
  budget: z.enum(BUDGET_RANGES, { error: "Choose a budget range." }),
  timeline: z.enum(TIMELINES, { error: "Choose a timeline." }),
  services: z
    .array(z.enum(SERVICE_INTERESTS, { error: "Choose a service." }))
    .max(CONTACT_LIMITS.services, `Choose up to ${CONTACT_LIMITS.services} services.`),
  description: text("Project description", 10, 5000),
  source: z.enum(["contact-form", "referral", "social", "other"] as const, { error: "Choose a source." }),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please agree to the privacy policy so we can reply to you.",
  }),
  /** Spam trap: real visitors never fill this hidden field. */
  website: z.string().max(0, "This submission was rejected.").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function emptyContactValues(): ContactFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    project_type: "New Product",
    budget: "Not Sure",
    timeline: "Flexible",
    services: [],
    description: "",
    source: "contact-form",
    consent: false,
    website: "",
  };
}

/** Newsletter signup: email plus consent. */
export const newsletterFormSchema = z.object({
  email: z.email("Enter a valid email address.").max(254, "Email must be 254 characters or fewer."),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please agree to receive updates before subscribing.",
  }),
  website: z.string().max(0, "This submission was rejected.").optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
