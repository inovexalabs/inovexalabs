import { ArrowRight, GitBranch, Globe } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { INNOVATION_CATEGORIES, LAB_STAGES } from "@/lib/constants/innovation";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getExperimentBySlug, getExperimentSlugs } from "@/lib/supabase/queries/innovation";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

interface ExperimentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getExperimentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [{ data: experiment }, { data: settings }] = await Promise.all([getExperimentBySlug(slug), getSiteSettings()]);
  if (!experiment) return { title: "Experiment not found", robots: { index: false } };

  const metadata = buildMetadata({
    title: experiment.seo.title ?? experiment.title,
    description: experiment.seo.description ?? experiment.description,
    path: ROUTES.innovationItem(experiment.slug),
    siteName: settings?.site_name,
  });

  if (experiment.image) {
    const images = [{ url: experiment.image.url, alt: experiment.image.alt }];
    metadata.openGraph = { ...metadata.openGraph, images };
    metadata.twitter = { ...metadata.twitter, images };
  }
  return metadata;
}

interface NarrativeProps {
  id: string;
  title: string;
  paragraphs: string[];
  tone?: "light" | "muted";
}

function Narrative({ id, title, paragraphs, tone = "light" }: NarrativeProps) {
  const headingId = `${id}-title`;
  return (
    <Section id={id} tone={tone} labelledBy={headingId} container="wide">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <SectionHeading id={headingId} title={title} className="lg:col-span-4" />
        <div className="space-y-4 lg:col-span-8">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="max-w-[46rem] text-fg-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  const { slug } = await params;
  const { data: experiment, error } = await getExperimentBySlug(slug);

  if (error) throw new Error(error);
  if (!experiment) notFound();

  const stage = LAB_STAGES[experiment.stage];

  return (
    <>
      <Section
        underHeader
        spacing="md"
        container="wide"
        labelledBy="experiment-title"
        className="overflow-hidden navy-gradient"
        background={
          <>
            <div aria-hidden="true" className="absolute inset-0 grid-lines" />
            <GlowOrb color="purple" size="lg" intensity="soft" className="-right-32 -top-48" />
          </>
        }
      >
        <Breadcrumbs
          items={[
            { name: "Home", path: ROUTES.home },
            { name: "Innovation Lab", path: ROUTES.innovation },
            { name: experiment.title, path: ROUTES.innovationItem(experiment.slug) },
          ]}
        />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={stage?.variant ?? "neutral"} dot>
                {stage?.label ?? experiment.stageLabel}
              </Badge>
              <Badge variant="brand">{experiment.categoryLabel}</Badge>
            </div>

            <h1 id="experiment-title" className="mt-5 font-display text-h1 text-fg">
              {experiment.title}
            </h1>
            <p className="mt-5 max-w-[38rem] text-lead text-fg-muted">{experiment.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {experiment.demo_url ? (
                <ButtonLink href={experiment.demo_url} external size="lg">
                  <Globe aria-hidden="true" />
                  Open demo
                </ButtonLink>
              ) : null}
              {experiment.github_url ? (
                <ButtonLink
                  href={experiment.github_url}
                  external
                  size="lg"
                  variant={experiment.demo_url ? "outline" : "primary"}
                  className={experiment.demo_url ? "border-lilac-300/30 bg-surface/10" : undefined}
                >
                  <GitBranch aria-hidden="true" />
                  View source
                </ButtonLink>
              ) : null}
              <ButtonLink
                href={ROUTES.contact}
                size="lg"
                variant="outline"
                className="border-lilac-300/30 bg-surface/10"
              >
                Talk to us
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            {experiment.image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-navy-900 shadow-xl">
                <Image
                  src={experiment.image.url}
                  alt={experiment.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-line bg-navy-900"
              >
                <div className="absolute inset-0 grid-lines" />
                <span className="absolute size-56 rounded-full border border-dashed border-lilac-300/25 motion-safe:animate-spin-slow" />
                <p className="relative font-display text-h2 text-fg/80">{experiment.categoryLabel}</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {experiment.long_description.length > 0 ? (
        <Section id="overview" labelledBy="overview-title" container="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <SectionHeading id="overview-title" title="Overview" className="lg:col-span-4" />
            <div className="space-y-4 lg:col-span-8">
              {experiment.long_description.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="max-w-[46rem] text-lg text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {experiment.problem ? (
        <Narrative id="problem" title="The problem" paragraphs={experiment.problem} tone="muted" />
      ) : null}
      {experiment.experiment ? <Narrative id="experiment" title="The experiment" paragraphs={experiment.experiment} /> : null}

      {experiment.technologies.length > 0 ? (
        <Section id="technology" tone="muted" labelledBy="technology-title" container="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <SectionHeading id="technology-title" title="Technology" className="lg:col-span-4" />
            <ul role="list" aria-labelledby="technology-title" className="flex flex-wrap content-start gap-2.5 lg:col-span-8">
              {experiment.technologies.map((technology) => (
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

      <Section id="status" labelledBy="status-title" container="wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="status-title" title="Current status" className="lg:col-span-4" />
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={stage?.variant ?? "neutral"} dot>
                  {stage?.label ?? experiment.stageLabel}
                </Badge>
                <span className="text-sm text-fg-muted">{INNOVATION_CATEGORIES[experiment.category]}</span>
              </div>
              <p className="mt-4 max-w-[46rem] text-fg-muted">
                {experiment.stage === "archived"
                  ? "This experiment is archived. It stays published for reference, but it is no longer being worked on."
                  : experiment.stage === "live"
                    ? "This experiment is live and available to use."
                    : "This experiment is active in the Lab. We update its stage as the work progresses."}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {experiment.learnings ? (
        <Narrative id="learnings" title="What we learned" paragraphs={experiment.learnings} tone="muted" />
      ) : null}
      {experiment.future_direction ? (
        <Narrative id="future" title="Future direction" paragraphs={experiment.future_direction} />
      ) : null}

      <Section
        id="get-started"
        tone="dark"
        spacing="lg"
        container="narrow"
        className="overflow-hidden text-center"
        background={<div aria-hidden="true" className="absolute inset-0 grid-lines" />}
      >
        <h2 className="font-display text-h2 text-fg">Want to explore something similar?</h2>
        <p className="mx-auto mt-5 max-w-reading text-lead text-fg-muted">
          The Lab takes on client questions too. Tell us what you are curious about and we will tell you what is
          possible.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={ROUTES.contact} size="lg">
            Start a conversation
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
