import { FlaskConical } from "lucide-react";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Reveal } from "@/components/animations/reveal";
import { ExperimentCard } from "@/components/cards/experiment-card";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { getFeaturedExperiments } from "@/lib/supabase/queries/innovation";

const HEADING_ID = "in-the-lab-title";

/** Homepage Innovation Lab: selected experiments, on a dark band. */
export async function LabSection() {
  const { data: experiments, error } = await getFeaturedExperiments(3);

  if (experiments !== null && experiments.length === 0) return null;

  return (
    <Section
      tone="dark"
      labelledBy={HEADING_ID}
      container="wide"
      background={
        <>
          <div aria-hidden="true" className="absolute inset-0 grid-lines" />
          <GlowOrb color="purple" size="xl" intensity="soft" className="-right-56 -top-64" />
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <SectionHeading
          id={HEADING_ID}
          eyebrow="Innovation Lab"
          title="Experiments in progress"
          description="The “Lab” side of Inovexa Labs: internal prototypes and research across AI, security, Web3 and developer tools — some become products, all of them teach us something."
          className="lg:col-span-8"
        />
        <div className="lg:col-span-4 lg:justify-self-end">
          <ButtonLink href={ROUTES.innovation} variant="outline" className="group/all">
            <FlaskConical aria-hidden="true" />
            Visit the lab
          </ButtonLink>
        </div>
      </div>

      {experiments === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <ul role="list" className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment, index) => (
            <Reveal key={experiment.slug} as="li" delay={index * 0.08} className="flex">
              <ExperimentCard experiment={experiment} variant="glass" />
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  );
}
