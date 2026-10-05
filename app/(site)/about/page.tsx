import { ArrowRight, FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/animations/reveal";
import { FaqAccordion } from "@/components/content/faq-accordion";
import { ProcessTimeline } from "@/components/process/process-timeline";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { TechnologyGrid } from "@/components/technology/technology-grid";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowOrb } from "@/components/animations/glow-orb";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFaqs } from "@/lib/supabase/queries/faqs";
import { getProcessSteps } from "@/lib/supabase/queries/process";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { getTeam } from "@/lib/supabase/queries/team";
import { getTechnologyGroups } from "@/lib/supabase/queries/technologies";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "About Inovexa Labs | Software & Technology Innovation Studio",
    absoluteTitle: true,
    description:
      "Learn about Inovexa Labs, a technology studio focused on software development, AI, cybersecurity, digital products, and experimental technology.",
    path: ROUTES.about,
    siteName: settings?.site_name,
  });
}

const PRINCIPLES = [
  {
    title: "Build With Purpose",
    description:
      "Technology should solve a problem. Every product we take on has a reason to exist, and we are happy to say when something does not need to be built.",
  },
  {
    title: "Security By Design",
    description:
      "Authentication, data handling and failure modes are designed in from the first sprint, not audited after launch.",
  },
  {
    title: "Continuous Experimentation",
    description:
      "The Lab exists so we can try new architectures, models and tools before asking a client to rely on them.",
  },
  {
    title: "Human-Centered Technology",
    description:
      "We design around the people who will use the product every day — their workflows, their constraints and their patience.",
  },
  {
    title: "Engineering Excellence",
    description:
      "Tested, reviewed, documented code that the next engineer can understand. Craft is a feature, not a luxury.",
  },
  {
    title: "Long-Term Thinking",
    description:
      "Products are expected to evolve. We choose architectures and dependencies that keep future changes affordable.",
  },
] as const;

const APPROACH = [
  ["Understand before building", "We start with the problem, the users and the business constraints — not the technology."],
  ["Decide in the open", "Architecture, scope and trade-offs are written down and agreed before they become expensive to change."],
  ["Ship in reviewable increments", "You see working software weekly, so feedback lands while it is still cheap to act on."],
  ["Measure and improve", "Launch is a milestone. We watch how the product is used and keep improving it."],
] as const;

export default async function AboutPage() {
  const [{ data: settings }, { data: team }, { data: steps }, { data: techGroups }, { data: faqs }] =
    await Promise.all([
      getSiteSettings(),
      getTeam(),
      getProcessSteps(),
      getTechnologyGroups(),
      getFaqs("general"),
    ]);

  const statement =
    settings?.studio_statement ??
    "We turn ambitious ideas into useful technology through engineering, innovation and continuous experimentation.";

  return (
    <>
      <Section
        underHeader
        spacing="md"
        container="wide"
        labelledBy="about-title"
        className="overflow-hidden hero-wash"
        background={
          <>
            <div aria-hidden="true" className="absolute inset-0 grid-lines" />
            <GlowOrb color="blue" size="lg" intensity="soft" className="-left-56 -top-40" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-bg" />
          </>
        }
      >
        <Breadcrumbs items={[{ name: "Home", path: ROUTES.home }, { name: "About", path: ROUTES.about }]} />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading
              id="about-title"
              level={1}
              size="lg"
              eyebrow="Who we are"
              title="A technology studio built around products"
              description={statement}
            />
          </div>
          <div className="lg:col-span-5">
            <p className="text-lead text-fg-muted">
              Inovexa Labs works at the intersection of software development, artificial intelligence, cybersecurity,
              automation and emerging technologies. Rather than taking orders, we treat every engagement as a product
              problem: understand it, design the solution, build it, test it, and keep improving it.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={ROUTES.contact} size="lg">
                Start a project
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={ROUTES.projects} variant="outline" size="lg">
                See our work
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section id="approach" labelledBy="approach-title" container="wide" className="pt-section-sm">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionHeading
            id="approach-title"
            title="Our approach"
            description="How an engagement moves from a conversation to a running product."
            className="lg:col-span-4"
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {APPROACH.map(([title, body], index) => (
              <Reveal as="li" key={title} delay={index * 0.06}>
                <Card padding="lg" radius="xl" className="h-full">
                  <span className="text-sm font-semibold tabular-nums text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-h4 text-fg">{title}</h3>
                  <p className="mt-2 text-fg-muted">{body}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="principles" tone="dark" labelledBy="principles-title" container="wide" background={<div aria-hidden="true" className="absolute inset-0 grid-lines" />}>
        <SectionHeading
          id="principles-title"
          eyebrow="What we believe"
          title="Core principles"
          description="Six commitments that decide how we build, what we refuse to build, and how we behave when nobody is watching."
        />
        <ul role="list" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((principle, index) => (
            <Reveal as="li" key={principle.title} delay={(index % 3) * 0.07} className="flex">
              <Card as="article" variant="glass" padding="lg" radius="xl" className="h-full">
                <h3 className="font-display text-h4 text-fg">{principle.title}</h3>
                <p className="mt-3 text-fg-muted">{principle.description}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {steps !== null && steps.length > 0 ? (
        <Section id="process" tone="muted" labelledBy="process-title" container="wide">
          <SectionHeading
            id="process-title"
            align="center"
            eyebrow="From idea to product"
            title="The way we work"
            description="The same seven stages every engagement moves through — from the first workshop to post-launch improvement."
          />
          <ProcessTimeline steps={steps} />
        </Section>
      ) : null}

      <Section id="lab" labelledBy="lab-title" container="wide">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="grid size-12 place-items-center rounded-xl border border-iris-500/15 brand-gradient-soft text-iris-700">
              <FlaskConical aria-hidden="true" className="size-5" />
            </span>
            <SectionHeading
              id="lab-title"
              title="The Innovation Lab"
              description="The “Labs” in Inovexa Labs is our experimental side: time and space to test ideas before they become products."
              className="mt-6"
            />
            <p className="mt-4 max-w-prose text-fg-muted">
              We explore artificial intelligence, cybersecurity, blockchain, Web3, automation, cloud and developer tools.
              Some experiments become internal tools, some become open source, some become commercial products — and
              some simply teach us something new.
            </p>
            <div className="mt-7">
              <ButtonLink href={ROUTES.innovation} variant="outline" className="group/all">
                Visit the lab
                <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-0.5" />
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            {techGroups && techGroups.length > 0 ? (
              <Card padding="lg" radius="2xl" className="bg-surface-muted/60">
                <h3 className="font-display text-h4 text-fg">Technology philosophy</h3>
                <p className="mt-2 text-fg-muted">
                  We keep a deliberately small stack, and we only list a technology here when we have shipped something
                  with it.
                </p>
                <TechnologyGrid groups={techGroups} />
              </Card>
            ) : null}
          </div>
        </div>
      </Section>

      {team !== null && team.length > 0 ? (
        <Section id="team" tone="muted" labelledBy="team-title" container="wide">
          <SectionHeading
            id="team-title"
            title="The team"
            description="The people doing the work — designers, engineers and researchers."
            actions={
              <ButtonLink href={ROUTES.team} variant="outline">
                Meet the team
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            }
          />
          <ul role="list" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal as="li" key={member.slug} delay={(index % 3) * 0.07} className="flex">
                <TeamMemberCard member={member} />
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {faqs && faqs.length > 0 ? (
        <Section id="faq" labelledBy="general-faq-title" container="wide">
          <FaqAccordion faqs={faqs} title="General questions" id="general-faq" structuredData />
        </Section>
      ) : null}

      <Section
        tone="dark"
        spacing="lg"
        container="narrow"
        className="overflow-hidden text-center"
        background={
          <>
            <div aria-hidden="true" className="absolute inset-0 grid-lines" />
            <GlowOrb color="violet" size="lg" intensity="soft" drift className="-right-40 -bottom-40" />
          </>
        }
      >
        <h2 className="font-display text-h2 text-fg">Want to build with us?</h2>
        <p className="mx-auto mt-5 max-w-reading text-lead text-fg-muted">
          Tell us what you are working on. If it is a fit, we will show you exactly how we would approach it.
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
