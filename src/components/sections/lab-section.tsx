import { FlaskConical } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { ExperimentTimeline } from "@/components/lab/experiment-timeline";
import { LabStatus } from "@/components/lab/lab-status";
import { getExperiments } from "@/lib/queries/content";

export async function LabSection() {
  const experiments = await getExperiments();

  return (
    <Section id="lab" bordered>
      <SectionHeading
        eyebrow="Inside the lab"
        title="What we are testing right now."
        lede="Experiments are how we decide what deserves to become a product. Each one states its hypothesis, its current progress and the technology involved — including the ones that go nowhere."
        action={{ label: "Open the lab", href: "/lab" }}
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          {experiments.length > 0 ? (
            <ExperimentTimeline experiments={experiments} />
          ) : (
            <EmptyState
              icon={<FlaskConical className="size-5" />}
              title="The bench is clear."
              body="Experiments are published here as they start, with their number, hypothesis and progress. When nothing is running, this space stays empty."
              action={{ label: "Start a project instead", href: "/contact" }}
            />
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <LabStatus />
          <p className="mt-5 text-xs leading-relaxed text-ash-deep">
            Counted directly from published records in our database. Metrics with no
            supporting data are omitted rather than estimated.
          </p>
        </div>
      </div>
    </Section>
  );
}
