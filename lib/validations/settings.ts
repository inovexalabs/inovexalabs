import { z } from "zod";
import { contentStatusSchema, hrefSchema, optionalText, text } from "@/lib/validations/common";

const socialUrl = z
  .string()
  .trim()
  .max(200, "Link must be 200 characters or fewer.")
  .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), {
    message: "Use a full https:// address, or leave it empty.",
  });

/** Navigation row rules. Mirrors supabase/migrations/20261004121700_site_settings_content.sql. */

export const navItemFormSchema = z.object({
  label: text("Label", 2, 32),
  href: z
    .string()
    .trim()
    .regex(/^\/[^\s]*$|^https:\/\/[^\s]+$/, "Use a path like /contact or a full https:// address."),
  location: z.enum(["header", "footer"], { error: "Choose where it appears." }),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
});

export type NavItemFormValues = z.infer<typeof navItemFormSchema>;

export function emptyNavItemValues(location: "header" | "footer", sortOrder: number): NavItemFormValues {
  return { label: "", href: "", location, status: "draft", sort_order: sortOrder };
}

/**
 * Site settings rules. Every column the admin can edit on /admin/settings,
 * including the singleton hero copy and the closing homepage CTA.
 */
export const settingsFormSchema = z.object({
  site_name: text("Company name", 2, 60),
  studio_statement: z
    .string()
    .trim()
    .max(280, "Statement must be 280 characters or fewer.")
    .refine((value) => value === "" || value.length >= 20, {
      message: "Statement must be at least 20 characters, or left empty.",
    }),
  hero_headline: text("Headline", 10, 160),
  hero_subheadline: text("Supporting text", 20, 320),
  hero_primary_cta_label: text("Primary button", 2, 32),
  hero_primary_cta_href: hrefSchema,
  hero_secondary_cta_label: text("Secondary button", 2, 32),
  hero_secondary_cta_href: hrefSchema,
  final_cta_title: text("Closing heading", 3, 80),
  final_cta_description: text("Closing text", 10, 280),
  final_cta_label: text("Closing button", 2, 32),
  final_cta_href: hrefSchema,
  contact_email: z
    .string()
    .trim()
    .max(254, "Email must be 254 characters or fewer.")
    .refine((value) => value === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value), {
      message: "Enter a valid email address, or leave it empty.",
    }),
  contact_phone: optionalText("Phone", 30),
  contact_address: optionalText("Address", 160),
  footer_text: optionalText("Footer text", 280),
  analytics_id: optionalText("Analytics ID", 64),
  seo_title: optionalText("SEO title", 70),
  seo_description: optionalText("SEO description", 170),
  social_github: socialUrl,
  social_linkedin: socialUrl,
  social_twitter: socialUrl,
  social_youtube: socialUrl,
  social_instagram: socialUrl,
  social_discord: socialUrl,
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
