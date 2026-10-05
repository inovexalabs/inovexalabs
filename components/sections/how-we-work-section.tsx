import { GlowOrb } from "@/components/animations/glow-orb";
import { Section } from "@/components/layout/section";
import { ProcessTimeline } from "@/components/process/process-timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProcessSteps } from "@/lib/supabase/queries/process";

const HEADING_ID = "how-we-work-title";

/**
 * "How We Work": the seven-stage process as an animated timeline, entirely
 * driven by rows in process_steps. Hidden when nothing is published yet.
 */
export async function HowWeWorkSection() {
  const { data: steps, error } = await getProcessSteps();

  if (steps !== null && steps.length === 0) return null;

  return (
    <Section
      tone="muted"
      labelledBy={HEADING_ID}
      container="wide"
      background={<GlowOrb color="blue" size="lg" intensity="soft" className="-left-40 top-1/4" />}
    >
      <SectionHeading
        id={HEADING_ID}
        align="center"
        eyebrow="How we work"
        title="From idea to product, in seven stages"
        description="Every engagement moves through the same disciplined path — discover the problem, decide the shape of the solution, build it in reviewable increments, then keep improving it after launch."
      />

      {steps === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <ProcessTimeline steps={steps} />
      )}
    </Section>
  );
}
