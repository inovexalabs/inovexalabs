import { z } from "zod";

/**
 * Contact-inquiry validation.
 *
 * This schema runs on the server inside the Server Action. The browser may run
 * the same schema for instant feedback, but the server result is the one that
 * decides whether anything is written — client validation is convenience, never
 * enforcement.
 */
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(120, "That name is longer than we can store."),
  email: z.email("Enter an email address we can reply to.").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.string().trim().max(80).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(30, "A little more detail helps — 30 characters minimum.")
    .max(6000, "Please keep it under 6000 characters."),
  referralSource: z.string().trim().max(80).optional().or(z.literal("")),

  /**
   * Spam gates. A human never fills the honeypot, and never submits a form
   * within two seconds of it rendering. Both are checked server-side.
   */
  honeypot: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
  renderedAt: z.coerce.number().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof InquiryInput, string>>;
  /** Echoed back so a failed submission never loses the user's typing. */
  values?: Partial<Record<keyof InquiryInput, string>>;
}

export const FORM_STATE_IDLE: FormState = { status: "idle" };

/** Flattens a Zod error into one message per field for inline display. */
export function toFieldErrors(error: z.ZodError<InquiryInput>) {
  const fieldErrors: FormState["fieldErrors"] = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof InquiryInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
