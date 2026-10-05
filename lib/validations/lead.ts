import { z } from "zod";
import { LEAD_PRIORITY_KEYS, LEAD_STATUS_KEYS } from "@/lib/constants/leads";
import type { Enums } from "@/types/database";
import { text } from "@/lib/validations/common";

/**
 * Admin-side lead rules: pipeline changes and notes. The lead payload itself
 * is validated by contactFormSchema on the public form and again in the
 * Server Action.
 */

export const leadStatusSchema = z.enum(LEAD_STATUS_KEYS as [Enums<"lead_status">, ...Enums<"lead_status">[]], {
  error: "Choose a status.",
});

export const leadPrioritySchema = z.enum(LEAD_PRIORITY_KEYS as [Enums<"lead_priority">, ...Enums<"lead_priority">[]], {
  error: "Choose a priority.",
});

export const leadUpdateSchema = z.object({
  status: leadStatusSchema,
  priority: leadPrioritySchema,
});

export type LeadUpdateValues = z.infer<typeof leadUpdateSchema>;

export const leadNoteSchema = z.object({
  note: text("Note", 2, 2000),
});

export type LeadNoteValues = z.infer<typeof leadNoteSchema>;
