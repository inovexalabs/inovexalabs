import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { ExperimentTimeline } from "@/components/lab/experiment-timeline";
import { LabStatus } from "@/components/lab/lab-status";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { getExperiments } from "@/lib/queries/content";
import { getLabMetrics } from "@/lib/queries/metrics";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/lab",
    title: "Inside the Lab — Experiments & Research",
    description:
      "Active experiments from the Inovexa Labs Product Lab: each one states its hypothesis, its current progress and the technology involved — including the ones that go nowhere.",
    keywords: [
      "product experiments",
      "AI experiments",
      "software research lab",
      "product development company Nepal",
    ],
  });
}

export default async function LabPage() {
  const [experiments, metrics] = await Promise.all([getExperiments(), getLabMetrics()]);

  const active = experiments.filter((e) =>
    ["idea", "experiment", "in_development"].includes(e.status),
  );
  const concluded = experiments.filter((e) => ["live", "archived"].includes(e.status));

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Lab", path: "/lab" }]}
        eyebrow="Inside the lab"
        title="Where products come from."
        lede="An experiment is how we decide whether an idea deserves to become a product. Each one names its hypothesis up front so it can be judged honestly — including the ones that are still wrong."
        meta={
          <>
            <span className="mono-label text-ash">
              {String(active.length).padStart(2, "0")} active
            </span>
            {concluded.length > 0 ? (
              <span className="mono-label text-ash-deep">
                {String(concluded.length).padStart(2, "0")} concluded
              </span>
            ) : null}
            {metrics.productsLaunched ? (
              <span className="mono-label text-ash-deep">
                {String(metrics.productsLaunched).padStart(2, "0")} products launched
              </span>
            ) : null}
          </>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Active research"
              title="On the bench right now."
            />
            <div className="mt-10">
              {active.length > 0 ? (
                <ExperimentTimeline experiments={active} />
              ) : (
                <EmptyState
                  icon={<FlaskConical className="size-5" />}
                  title="Nothing on the bench."
                  body="When an experiment starts it is numbered and published here with its hypothesis. When nothing is running, this page stays empty rather than showing old work as new."
                  action={{ label: "See our products", href: "/products" }}
                />
              )}
            </div>

            {concluded.length > 0 ? (
              <div className="mt-20">
                <SectionHeading eyebrow="Concluded" title="What we learned and closed." />
                <div className="mt-10">
                  <ExperimentTimeline experiments={concluded} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <LabStatus />

            <div className="panel mt-5 p-6">
              <h2 className="mono-label text-signal">How an experiment works here</h2>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    n: "01",
                    t: "Write the hypothesis",
                    d: "One sentence, falsifiable. If it cannot be wrong, it is not an experiment.",
                  },
                  {
                    n: "02",
                    t: "Find the cheap test",
                    d: "The smallest thing that produces evidence, built in days rather than months.",
                  },
                  {
                    n: "03",
                    t: "Publish the progress",
                    d: "Status and percentage live on this site, so the record is honest even when the result is negative.",
                  },
                  {
                    n: "04",
                    t: "Promote or retire",
                    d: "It becomes a product, becomes a client capability, or gets archived with its findings.",
                  },
                ].map((step) => (
                  <li key={step.n} className="flex gap-3.5">
                    <span className="font-mono text-[0.625rem] text-ash-deep">{step.n}</span>
                    <span>
                      <span className="block text-sm font-medium text-bone">{step.t}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ash">{step.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Bring us a hard problem"
        title="Some client problems start as experiments."
        body="If the right approach is genuinely unclear, we will say so and propose a short piece of research before committing to a build. That is often the cheapest way to avoid building the wrong thing."
      />

      <JsonLd
        id="lab-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/lab",
            name: "Inside the Lab",
            description:
              "Experiments and research directions from the Inovexa Labs Product Lab.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lab", path: "/lab" },
          ]),
          experiments.length
            ? itemListSchema(
                experiments.map((e) => ({ name: e.title, path: `/lab/${e.slug}` })),
                "Inovexa Labs experiments",
              )
            : null,
        ])}
      />
    </>
  );
}
