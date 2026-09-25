import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { StatusBadge } from "@/components/site/status-badge";
import { ExperimentCard } from "@/components/cards/experiment-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/content/markdown";
import { Reveal } from "@/components/site/reveal";
import { getExperimentBySlug, getExperiments } from "@/lib/queries/content";
import { formatDate, toStringArray } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, experimentSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const experiments = await getExperiments();
  return experiments.map((experiment) => ({ slug: experiment.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);
  if (!experiment) return buildMetadata({ path: `/lab/${slug}`, robots: "noindex,nofollow" });

  return buildMetadata({
    path: `/lab/${experiment.slug}`,
    title: experiment.seo_title || experiment.title,
    description: experiment.seo_description || experiment.summary,
    keywords: experiment.seo_keywords,
    canonicalOverride: experiment.canonical_url,
    ogTitle: experiment.og_title,
    ogDescription: experiment.og_description,
    ogImage: experiment.og_image_url || experiment.image_url,
    robots: experiment.robots,
  });
}

export default async function ExperimentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [experiment, all] = await Promise.all([getExperimentBySlug(slug), getExperiments()]);
  if (!experiment) notFound();

  const others = all.filter((e) => e.slug !== experiment.slug).slice(0, 3);
  const technologies = toStringArray(experiment.technologies);
  const path = `/lab/${experiment.slug}`;

  return (
    <>
      <PageHeader
        trail={[
          { name: "Home", path: "/" },
          { name: "Lab", path: "/lab" },
          { name: experiment.title, path },
        ]}
        eyebrow={
          <span className="flex flex-wrap items-center gap-3">
            <span className="text-plasma">{experiment.code ?? "Experiment"}</span>
            <StatusBadge status={experiment.status} />
          </span>
        }
        title={experiment.title}
        lede={experiment.summary}
        meta={
          <>
            {experiment.started_on ? (
              <span className="mono-label text-ash-deep">
                Started {formatDate(experiment.started_on)}
              </span>
            ) : null}
            {experiment.concluded_on ? (
              <span className="mono-label text-ash-deep">
                Concluded {formatDate(experiment.concluded_on)}
              </span>
            ) : (
              <span className="mono-label text-ash-deep">Ongoing</span>
            )}
          </>
        }
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            {/* The hypothesis is the most important part of an experiment page. */}
            {experiment.hypothesis ? (
              <div className="relative rounded-[var(--radius-panel)] border border-plasma/25 bg-plasma/[0.045] p-6 sm:p-8">
                <p className="mono-label text-plasma">Hypothesis</p>
                <p className="mt-4 font-display text-lg leading-snug tracking-tight text-bone sm:text-xl">
                  {experiment.hypothesis}
                </p>
              </div>
            ) : null}

            {experiment.body ? (
              <Markdown content={experiment.body} className="mt-12" />
            ) : (
              <div className="mt-12 space-y-5 text-base leading-relaxed text-bone-dim">
                <p>
                  This experiment is in its early stage. The hypothesis above is what we are
                  testing; the progress readout alongside shows how far it has moved.
                </p>
                <p className="text-ash">
                  We publish findings here as they emerge — including when the hypothesis turns
                  out to be wrong, which is often the more useful outcome.
                </p>
              </div>
            )}

            {experiment.finding ? (
              <div className="mt-14">
                <h2 className="display-md text-bone">What we found.</h2>
                <Markdown content={experiment.finding} className="mt-6" />
              </div>
            ) : (
              <div className="mt-14 rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60 p-6">
                <p className="mono-label text-ash-deep">Findings</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">
                  Recorded when the experiment concludes. We would rather leave this empty than
                  write a conclusion before the evidence exists.
                </p>
              </div>
            )}

            {experiment.image_url ? (
              <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-graphite">
                <Image
                  src={experiment.image_url}
                  alt={experiment.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {/* Progress instrument */}
            <div className="panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-steel px-5 py-4">
                <h2 className="mono-label text-plasma">Development progress</h2>
                <span className="font-mono text-[0.6875rem] tabular-nums text-ash">
                  {String(experiment.progress).padStart(3, "0")}%
                </span>
              </div>
              <div className="p-5">
                <div
                  role="progressbar"
                  aria-label={`${experiment.title} progress`}
                  aria-valuenow={experiment.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="flex gap-1"
                >
                  {Array.from({ length: 20 }).map((_, cell) => (
                    <span
                      key={cell}
                      aria-hidden
                      className={
                        cell < Math.round(experiment.progress / 5)
                          ? "h-2.5 flex-1 rounded-[1px] bg-plasma/80"
                          : "h-2.5 flex-1 rounded-[1px] bg-steel/70"
                      }
                    />
                  ))}
                </div>
                <dl className="mt-6 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="mono-label text-ash-deep">Status</dt>
                    <dd>
                      <StatusBadge status={experiment.status} size="sm" />
                    </dd>
                  </div>
                  {experiment.started_on ? (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="mono-label text-ash-deep">Started</dt>
                      <dd className="font-mono text-[0.6875rem] text-bone-dim">
                        {formatDate(experiment.started_on)}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between gap-4">
                    <dt className="mono-label text-ash-deep">Updated</dt>
                    <dd className="font-mono text-[0.6875rem] text-bone-dim">
                      {formatDate(experiment.updated_at)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {technologies.length > 0 ? (
              <div className="panel p-6">
                <h2 className="mono-label text-ash-deep">Technology involved</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-steel bg-graphite px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-bone-dim"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href="/lab"
              className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal"
            >
              <ArrowLeft className="size-3" />
              Back to the lab
            </Link>
          </aside>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section bordered>
          <SectionHeading
            eyebrow="Also in the lab"
            title="Other experiments."
            action={{ label: "All experiments", href: "/lab" }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <ExperimentCard experiment={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        eyebrow="From experiment to product"
        title="Want to put research behind your idea?"
        body="We run the same hypothesis-first process on client problems — because testing the hardest assumption early is cheaper than discovering it after launch."
      />

      <JsonLd
        id={`experiment-${experiment.slug}-graph`}
        data={jsonLdGraph([
          experimentSchema(experiment),
          webPageSchema({ path, name: experiment.title, description: experiment.summary }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lab", path: "/lab" },
            { name: experiment.title, path },
          ]),
        ])}
      />
    </>
  );
}
