import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Reveal } from "@/components/animations/reveal";
import { ServiceCard } from "@/components/cards/service-card";
import { ServiceCtaCard } from "@/components/cards/service-cta-card";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { getServiceSummaries } from "@/lib/supabase/queries/services";

const HEADING_ID = "home-services-title";

/** Homepage summary cards for every published service, on a dark band. */
export async function ServicesSection() {
  const { data: services, error } = await getServiceSummaries();

  // Nothing published: hide the section rather than show an empty heading.
  if (services !== null && services.length === 0) return null;

  return (
    <Section
      tone="dark"
      labelledBy={HEADING_ID}
      container="wide"
      background={
        <>
          <div className="absolute inset-0 grid-lines" />
          <GlowOrb color="purple" size="xl" intensity="soft" className="-right-60 -top-80" />
        </>
      }
    >
      <SectionHeading
        id={HEADING_ID}
        title="Services"
        actions={
          <ButtonLink href={ROUTES.services} variant="outline" className="group/all">
            All services
            <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-0.5" />
          </ButtonLink>
        }
      />

      {services === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <ul role="list" className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.slug} as="li" delay={(index % 4) * 0.06} className="flex">
              <ServiceCard service={service} variant="glass" />
            </Reveal>
          ))}
          {/* Fills the gap an incomplete last row would leave, with a useful next step. */}
          {services.length % 4 !== 0 ? (
            <Reveal as="li" delay={(services.length % 4) * 0.06} className="flex">
              <ServiceCtaCard />
            </Reveal>
          ) : null}
        </ul>
      )}
    </Section>
  );
}
