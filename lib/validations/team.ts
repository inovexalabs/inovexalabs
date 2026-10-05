import { z } from "zod";
import { contentStatusSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/** Team member rules. Mirrors supabase/migrations/20261004121200_team_members.sql. */

export const TEAM_LIMITS = {
  skills: 10,
  socialLinks: 6,
} as const;

/** One profile link, e.g. { label: "GitHub", url: "https://github.com/…" }. */
export const socialLinkSchema = z.object({
  label: text("Label", 2, 30),
  url: z
    .string()
    .trim()
    .max(200, "Link must be 200 characters or fewer.")
    .refine((value) => /^https:\/\/\S+$/.test(value), { message: "Link must be a full https:// address." }),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;

export const teamFormSchema = z.object({
  name: text("Name", 2, 60),
  slug: slugSchema,
  role: text("Role", 2, 70),
  bio: optionalText("Bio", 1200),
  skills: z
    .array(text("Skill", 1, 30))
    .max(TEAM_LIMITS.skills, `Add up to ${TEAM_LIMITS.skills} skills.`)
    .refine(
      (items) => new Set(items.map((item) => item.toLowerCase())).size === items.length,
      "Each skill can only be listed once.",
    ),
  social_links: z
    .array(socialLinkSchema)
    .max(TEAM_LIMITS.socialLinks, `Add up to ${TEAM_LIMITS.socialLinks} links.`),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
  photo_alt: optionalText("Photo description", 120),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export function emptyTeamValues(sortOrder: number): TeamFormValues {
  return {
    name: "",
    slug: "",
    role: "",
    bio: "",
    skills: [],
    social_links: [],
    status: "draft",
    sort_order: sortOrder,
    photo_alt: "",
  };
}
