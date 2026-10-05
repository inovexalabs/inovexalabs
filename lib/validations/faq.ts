import { z } from "zod";
import { FAQ_PAGES } from "@/lib/constants/faqs";
import { contentStatusSchema, text } from "@/lib/validations/common";

/** FAQ entry rules. Mirrors supabase/migrations/20261004121600_faq_items.sql. */

export const faqFormSchema = z.object({
  question: text("Question", 5, 200),
  answer: text("Answer", 10, 1200),
  page: z.enum(FAQ_PAGES, { error: "Choose where it appears." }),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;

export function emptyFaqValues(sortOrder: number): FaqFormValues {
  return {
    question: "",
    answer: "",
    page: "general",
    status: "draft",
    sort_order: sortOrder,
  };
}
