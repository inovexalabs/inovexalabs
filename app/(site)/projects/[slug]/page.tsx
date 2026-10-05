import { ArrowRight, ExternalLink, GitBranch, Lightbulb, Target, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/cards/project-card";
import { ResultsMetrics } from "@/components/content/results-metrics";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getProjectBySlug, getProjects, getProjectSlugs } from "@/lib/supabase/queries/projects";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { cn } from "@/lib/utils/cn";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [{ data: project }, { data: settings }] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const metadata = buildMetadata({
    title: project.seo.title ?? project.title,
    description: project.seo.description ?? project.short_description,
    path: ROUTES.project(project.slug),
    siteName: settings?.site_name,
  });

  if (project.image) {
    const images = [{ url: project.image.url, alt: project.image.alt }];
    metadata.openGraph = { ...metadata.openGraph, images, type: "article" };
    metadata.twitter = { ...metadata.twitter, images };
  }
  return metadata;
}

function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className="space-y-4">
      {items.map((paragraph, index) => (
        <p key={paragraph.slice(0, 40)} className={cn("max-w-[46rem] text-fg-muted", index === 0 && "text-fg", className)}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

interface NarrativeSectionProps {
  id: string;
  title: string;
  icon: "target" | "lightbulb" | "wrench";
  paragraphs: string[];
  tone?: "light" | "muted";
}

const NARRATIVE_ICONS = { target: Target, lightbulb: Lightbulb, wrench: Wrench } as const;

function NarrativeSection({ id, title, icon, paragraphs, tone = "light" }: NarrativeSectionProps) {
  const Icon = NARRATIVE_ICONS[icon];
  const headingId = `${id}-title`;

  return (
    <Section id={id} tone={tone} labelledBy={headingId} container="wide">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-lg border border-iris-500/15 brand-gradient-soft text-iris-700"
          >
            <Icon className="size-5" />
          </span>
          <SectionHeading id={headingId} title={title} className="mt-5" />
        </div>
        <div className="lg:col-span-8">
          <Paragraphs items={paragraphs} />
        </div>
      </div>
    </Section>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { data: project, error } = await getProjectBySlug(slug);

  if (error) throw new Error(error);
  if (!project) notFound();

  const hasResults = project.metrics.length > 0 || project.results !== null;

  return (
    <>
      <Section
        underHeader
        spacing="md"
        container="wide"
        labelledBy="project-title"
        className="overflow-hidden hero-wash"
        background={
          <>
            <div aria-hidden="true" className="absolute inset-0 grid-lines" />
            <GlowOrb color="violet" size="lg" intensity="soft" className="-right-32 -top-48" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-bg" />
          </>
        }
      >
        <Breadcrumbs
          items={[
            { name: "Home", path: ROUTES.home },
            { name: "Projects", path: ROUTES.projects },
            { name: project.title, path: ROUTES.project(project.slug) },
          ]}
        />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-accent">{project.category}</p>
            <h1 id="project-title" className="mt-3 font-display text-h1 text-fg">
              {project.title}
            </h1>
            <p className="mt-5 max-w-[38rem] text-lead text-fg-muted">{project.short_description}</p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {project.client_name ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">Client</dt>
                  <dd className="mt-1 font-medium text-fg">{project.client_name}</dd>
                </div>
              ) : null}
              {project.industry ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">Industry</dt>
                  <dd className="mt-1 font-medium text-fg">{project.industry}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">Category</dt>
                <dd className="mt-1 font-medium text-fg">{project.category}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={ROUTES.contact} size="lg" className="group/cta">
                Build something like this
                <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
              </ButtonLink>
              {project.project_url ? (
                <ButtonLink href={project.project_url} external variant="outline" size="lg">
                  <ExternalLink aria-hidden="true" />
                  Visit site
                </ButtonLink>
              ) : null}
              {project.github_url ? (
                <ButtonLink href={project.github_url} external variant="outline" size="lg">
                  <GitBranch aria-hidden="true" />
                  Source
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-5">
            {project.image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
                <Image
                  src={project.image.url}
                  alt={project.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden="true"
                data-tone="dark"
                className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl navy-gradient shadow-xl"
              >
                <div className="absolute inset-0 grid-lines" />
                <span className="absolute size-56 rounded-full border border-dashed border-lilac-300/25 motion-safe:animate-spin-slow" />
                <p className="relative font-display text-h2 text-fg/80">{project.category}</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {project.description.length > 0 ? (
        <Section id="overview" labelledBy="overview-title" container="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <SectionHeading id="overview-title" title="Overview" className="lg:col-span-4" />
            <div className="lg:col-span-8">
              <Paragraphs items={project.description} className="text-lg" />
            </div>
          </div>
        </Section>
      ) : null}

      {project.challenge ? (
        <NarrativeSection id="challenge" title="The challenge" icon="target" paragraphs={project.challenge} tone="muted" />
      ) : null}
      {project.solution ? (
        <NarrativeSection id="solution" title="The solution" icon="lightbulb" paragraphs={project.solution} />
      ) : null}
      {project.implementation ? (
        <NarrativeSection
          id="implementation"
          title="Implementation"
          icon="wrench"
          paragraphs={project.implementation}
          tone="muted"
        />
      ) : null}

      {project.technologies.length > 0 ? (
        <Section id="technology" labelledBy="technology-title" container="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <SectionHeading id="technology-title" title="Technology" className="lg:col-span-4" />
            <ul role="list" aria-labelledby="technology-title" className="flex flex-wrap content-start gap-2.5 lg:col-span-8">
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg shadow-xs"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {hasResults ? (
        <Section id="results" tone="dark" labelledBy="results-title" container="wide" background={<div aria-hidden="true" className="absolute inset-0 grid-lines" />}>
          <SectionHeading
            id="results-title"
            title="Results"
            description="Outcomes recorded by our team after launch. Figures are only shown where they were measured."
          />
          <ResultsMetrics metrics={project.metrics} className="mt-8" tone="dark" />
          {project.results ? (
            <div className="mt-8">
              <Paragraphs items={project.results} className="text-fg-muted" />
            </div>
          ) : null}
        </Section>
      ) : null}

      {project.gallery.length > 0 ? (
        <Section id="gallery" labelledBy="gallery-title" container="wide">
          <SectionHeading id="gallery-title" title="Gallery" />
          <ul role="list" className="mt-10 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((image, index) => (
              <li key={`${image.url}-${index}`} className="overflow-hidden rounded-xl border border-line bg-surface-muted">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section
        id="get-started"
        tone="dark"
        spacing="lg"
        container="narrow"
        className="overflow-hidden text-center"
        background={
          <>
            <div aria-hidden="true" className="absolute inset-0 grid-lines" />
            <GlowOrb color="blue" size="lg" intensity="soft" drift className="-left-40 top-0" />
          </>
        }
      >
        <h2 className="font-display text-h2 text-fg">Have a similar problem?</h2>
        <p className="mx-auto mt-5 max-w-reading text-lead text-fg-muted">
          Tell us what you are working on and we will reply within two working days with next steps.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={ROUTES.contact} size="lg">
            Start a project
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      {/* Related content: other published projects in the same category */}
      <RelatedProjects currentSlug={project.slug} category={project.category} />
    </>
  );
}

/** Other projects in the same category, rendered only when there are any. */
async function RelatedProjects({ currentSlug, category }: { currentSlug: string; category: string }) {
  const { data } = await getProjects({ category, pageSize: 3 });
  const related = (data?.items ?? []).filter((item) => item.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <Section tone="muted" labelledBy="related-title" container="wide" className="pt-0">
      <SectionHeading id="related-title" title="More like this" />
      <ul role="list" className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {related.map((project, index) => (
          <Reveal key={project.slug} as="li" delay={index * 0.06} className="flex">
            <ProjectCard project={project} headingLevel="h3" />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
