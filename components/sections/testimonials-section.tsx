import { Section } from "@/components/layout/section";
import { TestimonialSlider } from "@/components/testimonials/testimonial-slider";
import { SectionHeading } from "@/components/ui/section-heading";
import { getTestimonials } from "@/lib/supabase/queries/testimonials";

const HEADING_ID = "testimonials-title";

/** Homepage testimonials. Hidden until an admin has published at least one. */
export async function TestimonialsSection() {
  const { data: testimonials, error } = await getTestimonials({ limit: 10 });

  if (testimonials !== null && testimonials.length === 0) return null;

  return (
    <Section labelledBy={HEADING_ID} container="wide">
      <SectionHeading
        id={HEADING_ID}
        align="center"
        eyebrow="Testimonials"
        title="What clients say"
        description="Every quote here was given by a client and entered by our team. We publish nothing we have not been told."
      />

      {testimonials === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <TestimonialSlider testimonials={testimonials} />
      )}
    </Section>
  );
}
