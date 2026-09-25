import { MessageSquareQuote } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { Reveal } from "@/components/site/reveal";
import { getTestimonials } from "@/lib/queries/content";
import { getLabMetrics } from "@/lib/queries/metrics";

/**
 * Trust section.
 *
 * Two hard rules are enforced here:
 *   1. A testimonial appears only if it is published, attributed and (where
 *      possible) linked to a verifiable source.
 *   2. Client counts are derived from real customer records. With no records,
 *      there is no counter — just an honest statement.
 */
export async function TrustSection() {
  const [testimonials, metrics] = await Promise.all([getTestimonials(), getLabMetrics()]);
  const featured = testimonials.filter((t) => t.featured);
  const shown = (featured.length > 0 ? featured : testimonials).slice(0, 6);

  return (
    <Section id="trust" bordered>
      <SectionHeading
        eyebrow="Built with people who trust us"
        title="What clients say, in their words."
        lede="Published with attribution and, wherever possible, a link to the source. We do not write testimonials on behalf of clients, and we do not show them without permission."
      />

      {/* Only rendered when customer records actually exist. */}
      {metrics.happyClients ? (
        <dl className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-y border-steel py-6">
          <div className="flex items-baseline gap-3">
            <dd className="font-mono text-3xl tabular-nums text-signal">
              {String(metrics.happyClients).padStart(2, "0")}
            </dd>
            <dt className="mono-label text-ash">
              {metrics.happyClients === 1 ? "Happy client" : "Happy clients"}
            </dt>
          </div>
          {metrics.projectsShipped ? (
            <div className="flex items-baseline gap-3">
              <dd className="font-mono text-3xl tabular-nums text-bone">
                {String(metrics.projectsShipped).padStart(2, "0")}
              </dd>
              <dt className="mono-label text-ash">Projects delivered</dt>
            </div>
          ) : null}
          <p className="mono-label w-full text-ash-deep sm:w-auto">
            counted from published records
          </p>
        </dl>
      ) : null}

      <div className="mt-12">
        {shown.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 80}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquareQuote className="size-5" />}
            title="No borrowed praise here."
            body="We have not published testimonials yet, because we would rather quote a client who is genuinely happy than invent one. When the first projects ship and clients agree to be named, they will appear here."
            action={{ label: "Be one of the first", href: "/contact" }}
          />
        )}
      </div>
    </Section>
  );
}
