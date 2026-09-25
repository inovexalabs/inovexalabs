import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/cards/project-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { getProjects } from "@/lib/queries/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/work",
    title: "Built With Our Clients",
    description:
      "Software projects delivered by Inovexa Labs with our clients — the problem, the approach, the technology and what actually shipped.",
    keywords: [
      "software projects Nepal",
      "custom software case studies",
      "web application development Nepal",
      "software development company Kathmandu",
    ],
  });
}

export default async function WorkPage() {
  const projects = await getProjects();

  // Industries present in real records only — never an invented list.
  const industries = Array.from(
    new Set(projects.map((p) => p.industry?.trim()).filter((i): i is string => Boolean(i))),
  );

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Work", path: "/work" }]}
        eyebrow="Built with our clients"
        title="Work that runs in production."
        lede="Client projects published with the problem, the approach and what shipped. Where a result is verifiable we state it; where it is not, we leave it out rather than estimate."
        meta={
          <>
            <span className="mono-label text-ash">
              {String(projects.length).padStart(2, "0")}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
            {industries.slice(0, 4).map((industry) => (
              <span key={industry} className="mono-label text-ash-deep">
                {industry}
              </span>
            ))}
          </>
        }
      />

      {projects.length > 0 ? (
        <Section>
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <Section>
          <EmptyState
            icon={<Briefcase className="size-5" />}
            title="Your success story could be next."
            body="We publish client work only with permission, and only with detail we can stand behind. As projects reach production and clients agree to be named, they will appear here — with a full case study of the problem, the approach and the outcome."
            action={{ label: "Start your project", href: "/contact" }}
          />

          <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-3">
            {[
              {
                title: "What a case study contains",
                body: "The problem in the client's words, the constraints, the approach, the technology, and a qualitative outcome. Verified metrics only where we have them.",
              },
              {
                title: "Why this page is short",
                body: "Because we are early. A page of invented logos would be easier to produce and would tell you nothing about how we actually work.",
              },
              {
                title: "What we can show you now",
                body: "A live product in development, eight documented service areas, and three experiments with their progress published — all elsewhere on this site.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-carbon p-6">
                <h2 className="font-display text-base font-medium tracking-tight text-bone">
                  {item.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-ash">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section bordered>
        <SectionHeading
          eyebrow="Prefer evidence over promises?"
          title="Look at what we build for ourselves."
          lede="Our own products go through the same engineering process we bring to client work. They are the most honest sample of how we build."
          action={{ label: "Open the Product Lab", href: "/products" }}
        />
      </Section>

      <CtaBand
        eyebrow="Start your own project"
        title="Have an idea worth building?"
        body="Whether it becomes the next case study here or stays an honest recommendation to buy something off the shelf — we will tell you which one it is."
      />

      <JsonLd
        id="work-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/work",
            name: "Built With Our Clients",
            description: "Client software projects delivered by Inovexa Labs.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]),
          projects.length
            ? itemListSchema(
                projects.map((p) => ({ name: p.name, path: `/work/${p.slug}` })),
                "Inovexa Labs client work",
              )
            : null,
        ])}
      />
    </>
  );
}
