import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { ProjectCard } from "@/components/cards/project-card";
import { BuildSignal } from "@/components/lab/build-signal";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/content/markdown";
import { Reveal } from "@/components/site/reveal";
import { getProjectBySlug, getProjectPhases, getProjects } from "@/lib/queries/content";
import { formatDate, toStringArray } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdGraph, projectSchema, webPageSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ path: `/work/${slug}`, robots: "noindex,nofollow" });

  return buildMetadata({
    path: `/work/${project.slug}`,
    title: project.seo_title || `${project.name}${project.client_name ? ` — ${project.client_name}` : ""}`,
    description: project.seo_description || project.summary,
    keywords: project.seo_keywords,
    canonicalOverride: project.canonical_url,
    ogTitle: project.og_title,
    ogDescription: project.og_description,
    ogImage: project.og_image_url || project.cover_image_url,
    robots: project.robots,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const phases = await getProjectPhases(project.id);
  const others = all.filter((p) => p.slug !== project.slug).slice(0, 2);
  const technologies = toStringArray(project.technologies);
  const gallery = toStringArray(project.gallery);
  const path = `/work/${project.slug}`;

  // Only metrics with both a label and a value are shown. An empty array means
  // the project page simply has no numbers — never placeholder figures.
  const verifiedMetrics = (project.metrics ?? []).filter(
    (m) => Boolean(m.label?.trim() && m.value?.trim()),
  );

  const narrative = [
    { key: "challenge", label: "The challenge", body: project.challenge },
    { key: "solution", label: "What we built", body: project.solution },
    { key: "outcome", label: "The outcome", body: project.outcome },
  ].filter((item) => Boolean(item.body?.trim()));

  return (
    <>
      <PageHeader
        trail={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.name, path },
        ]}
        eyebrow={project.industry ?? "Client work"}
        title={project.name}
        lede={project.summary}
        meta={
          <>
            {project.client_name ? (
              <span className="mono-label text-bone-dim">Client · {project.client_name}</span>
            ) : null}
            {project.project_types?.length ? (
              <span className="mono-label text-ash-deep">
                {project.project_types.join(" · ")}
              </span>
            ) : null}
            {project.delivered_on ? (
              <span className="mono-label text-ash-deep">
                Delivered {formatDate(project.delivered_on)}
              </span>
            ) : project.started_on ? (
              <span className="mono-label text-ash-deep">
                Started {formatDate(project.started_on)}
              </span>
            ) : null}
            {project.website_url ? (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-signal underline-offset-4 hover:underline"
              >
                Visit site
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </>
        }
      />

      {project.cover_image_url ? (
        <div className="mx-auto w-full max-w-[86rem] edge-x pt-14">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-graphite">
            <Image
              src={project.cover_image_url}
              alt={`${project.name}${project.client_name ? ` for ${project.client_name}` : ""}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            {narrative.map((item) => (
              <div key={item.key} className="mb-14 last:mb-0">
                <h2 className="display-md text-bone">{item.label}</h2>
                <Markdown content={item.body ?? ""} className="mt-6" />
              </div>
            ))}

            {verifiedMetrics.length > 0 ? (
              <div className="mt-4">
                <h2 className="display-md text-bone">Measured results.</h2>
                <dl className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-2">
                  {verifiedMetrics.map((metric) => (
                    <div key={`${metric.label}-${metric.value}`} className="bg-carbon p-6">
                      <dd className="font-display text-3xl tracking-tight text-signal">
                        {metric.value}
                      </dd>
                      <dt className="mono-label mt-3 text-ash">{metric.label}</dt>
                      {metric.source ? (
                        <p className="mt-2 text-xs text-ash-deep">Source: {metric.source}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60 p-6">
                <p className="mono-label text-ash-deep">On results</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">
                  We have not published performance figures for this project. Where a client has
                  agreed to share verified numbers, they appear here with their source; otherwise
                  we describe the work and let it speak for itself.
                </p>
              </div>
            )}

            {gallery.length > 0 ? (
              <div className="mt-16">
                <h2 className="display-md text-bone">Screens.</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {gallery.map((src, index) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-steel bg-graphite"
                    >
                      <Image
                        src={src}
                        alt={`${project.name} screenshot ${index + 1}`}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {/* BUILD SIGNAL renders only when phases exist in the database. */}
            <BuildSignal phases={phases} />

            <dl className="panel divide-y divide-steel overflow-hidden">
              {project.client_name ? <Row label="Client">{project.client_name}</Row> : null}
              {project.industry ? <Row label="Industry">{project.industry}</Row> : null}
              {project.started_on ? <Row label="Started">{formatDate(project.started_on)}</Row> : null}
              {project.delivered_on ? <Row label="Delivered">{formatDate(project.delivered_on)}</Row> : null}
              {project.case_study_url ? (
                <Row label="Full case study">
                  <a
                    href={project.case_study_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal underline underline-offset-4"
                  >
                    Open
                  </a>
                </Row>
              ) : null}
            </dl>

            {technologies.length > 0 ? (
              <div className="panel p-6">
                <h2 className="mono-label text-ash-deep">Built with</h2>
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
          </aside>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section bordered>
          <SectionHeading
            eyebrow="More client work"
            title="Other projects."
            action={{ label: "All work", href: "/work" }}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {others.map((item, index) => (
              <Reveal key={item.id} delay={index * 90}>
                <ProjectCard project={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : (
        <Section bordered>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/work"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal underline-offset-4 hover:underline"
            >
              ← All client work
            </Link>
            <span className="mono-label text-ash-deep">
              This is currently the only published project
            </span>
          </div>
        </Section>
      )}

      <CtaBand />

      <JsonLd
        id={`project-${project.slug}-graph`}
        data={jsonLdGraph([
          projectSchema(project),
          webPageSchema({ path, name: project.name, description: project.summary }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.name, path },
          ]),
        ])}
      />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <dt className="mono-label text-ash-deep">{label}</dt>
      <dd className="text-right text-sm text-bone-dim">{children}</dd>
    </div>
  );
}
