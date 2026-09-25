import { Section, SectionHeading } from "@/components/site/section";
import { BuildPipeline } from "@/components/lab/pipeline";

export function ProcessSection() {
  return (
    <Section id="process" bordered>
      <SectionHeading
        eyebrow="How we build"
        title="One pipeline, seven stages."
        lede="Idea, discover, design, build, test, launch, evolve. The stages are not sequential handoffs — they overlap deliberately — but every project moves through all seven, and you always know which one you are in."
      />

      <div className="mt-16">
        <BuildPipeline />
      </div>

      <dl className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-3">
        {[
          {
            dt: "Working software early",
            dd: "A deployable slice in the first weeks, so you can react to something real rather than to a document.",
          },
          {
            dt: "Written decisions",
            dd: "Architecture choices and their trade-offs are recorded, because the next engineer deserves the reasoning.",
          },
          {
            dt: "No surprise launches",
            dd: "Monitoring, rollback and a support path are part of the release, not a follow-up ticket.",
          },
        ].map((item) => (
          <div key={item.dt} className="bg-carbon p-6">
            <dt className="font-display text-base font-medium tracking-tight text-bone">{item.dt}</dt>
            <dd className="mt-2.5 text-sm leading-relaxed text-ash">{item.dd}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
