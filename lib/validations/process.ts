import { z } from "zod";
import { PROCESS_ICON_KEYS, type ProcessIconKey } from "@/lib/constants/process-icons";
import { contentStatusSchema, optionalText, slugSchema, text } from "@/lib/validations/common";

/**
 * "How We Work" step rules. Mirrors the CHECK constraints in
 * supabase/migrations/20261004120700_process_steps.sql.
 */

export const PROCESS_LIMITS = {
  deliverables: 8,
} as const;

export const processFormSchema = z.object({
  title: text("Title", 2, 60),
  slug: slugSchema,
  short_description: text("Short description", 20, 200),
  description: text("Detailed description", 40, 900),
  icon: z.enum(PROCESS_ICON_KEYS as [ProcessIconKey, ...ProcessIconKey[]], { error: "Choose an icon." }),
  deliverables: z
    .array(text("Deliverable", 2, 60))
    .max(PROCESS_LIMITS.deliverables, `Add up to ${PROCESS_LIMITS.deliverables} deliverables.`)
    .refine(
      (items) => new Set(items.map((item) => item.toLowerCase())).size === items.length,
      "Each deliverable can only be listed once.",
    ),
  duration: optionalText("Duration", 40),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
});

export type ProcessFormValues = z.infer<typeof processFormSchema>;

export function emptyProcessValues(sortOrder: number): ProcessFormValues {
  return {
    title: "",
    slug: "",
    short_description: "",
    description: "",
    icon: "compass",
    deliverables: [],
    duration: "",
    status: "draft",
    sort_order: sortOrder,
  };
}
