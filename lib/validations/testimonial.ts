import { z } from "zod";
import { contentStatusSchema, optionalText, text } from "@/lib/validations/common";

/** Testimonial rules. Only admins create these rows — the site never generates them. */

export const testimonialFormSchema = z.object({
  name: text("Name", 2, 60),
  role: optionalText("Role", 60),
  company: optionalText("Company", 60),
  testimonial: text("Quote", 20, 800),
  rating: z
    .number({ error: "Choose a rating." })
    .int("Use a whole number.")
    .min(1, "Rate between 1 and 5.")
    .max(5, "Rate between 1 and 5."),
  featured: z.boolean(),
  status: contentStatusSchema,
  sort_order: z
    .number({ error: "Enter a number." })
    .int("Use a whole number.")
    .min(0, "Use 0 or more.")
    .max(10000, "Use 10000 or less."),
  avatar_alt: optionalText("Photo description", 120),
});

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export function emptyTestimonialValues(sortOrder: number): TestimonialFormValues {
  return {
    name: "",
    role: "",
    company: "",
    testimonial: "",
    rating: 5,
    featured: false,
    status: "draft",
    sort_order: sortOrder,
    avatar_alt: "",
  };
}
