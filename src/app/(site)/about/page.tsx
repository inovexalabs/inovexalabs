import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading, Eyebrow } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal } from "@/components/site/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { LabStatus } from "@/components/lab/lab-status";
import { Button } from "@/components/ui/button";
import { getCompany, getServices, getSocials, getTeamMembers } from "@/lib/queries/content";
import { COMPANY_VALUES, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdGraph, organizationSchema, webPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/about",
    title: "About Inovexa Labs — We're Building More Than Software",
    description:
      "Why Inovexa Labs exists, how we engineer, what we value, and where the Product Lab is heading. An on-demand software development company and product innovation lab.",
    keywords: [
      "about Inovexa Labs",
      "software company Nepal",
      "product innovation lab",
      "software development company Kathmandu",
    ],
  });
}

export default async function AboutPage() {
  const [company, team, socials, services] = await Promise.all([
    getCompany(),
    getTeamMembers(),
    getSocials(),
    getServices(),
  ]);

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
        eyebrow="About Inovexa Labs"
        title="We're building more than software."
        lede={company.positioning}
        meta={
          <>
            <span className="mono-label text-ash">{company.city}, {company.country}</span>
            <span className="mono-label text-ash-deep">{services.length} service areas</span>
            {Object.values(socials).filter(Boolean).length > 0 ? (
              <span className="mono-label text-ash-deep">
                {Object.values(socials).filter(Boolean).length} public profiles
              </span>
            ) : null}
          </>
        }
      />

      {/* Why we exist */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <div className="max-w-2xl">
            <Eyebrow>Why Inovexa exists</Eyebrow>
            <h2 className="display-md mt-5 text-bone">
              Most software companies pick one side of the line. We work both.
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-bone-dim">
              <p>
                Inovexa Labs is an on-demand software development company and a product
                innovation lab. Those are not two marketing lines for the same thing — they are
                two genuinely different kinds of work that we deliberately run together.
              </p>
              <p>
                The client side keeps us honest about deadlines, budgets, existing systems and the
                messy reality that no greenfield project is ever quite greenfield. The product
                side keeps us honest about something harder: whether what we build is actually
                worth using when nobody is paying us to build it.
              </p>
              <p>
                Running both means we cannot hide behind process. When one of our own products
                needs a decision about tenancy, billing or retrieval quality, we make it the same
                way we would for a client, and we live with the result.
              </p>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-2">
              <div className="bg-carbon p-6">
                <h3 className="font-display text-lg font-medium tracking-tight text-signal">
                  Custom Software
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">
                  We work with businesses, startups, organisations and individuals to turn ideas
                  and problems into reliable software — scoped honestly, engineered to last, and
                  handed over properly.
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-signal"
                >
                  Build with us
                  <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="bg-carbon p-6">
                <h3 className="font-display text-lg font-medium tracking-tight text-plasma">
                  Product Lab
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">
                  We research, experiment, build and launch our own software products. Some become
                  commercial products, some become capabilities we bring to client work, and some
                  get archived with their findings published.
                </p>
                <Link
                  href="/lab"
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-plasma"
                >
                  Explore the lab
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <LabStatus />
            <div className="panel mt-5 p-6">
              <h2 className="mono-label text-ash-deep">Where we are</h2>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                Based in {company.city}, {company.country}
                {company.region ? ` (${company.region})` : ""}. We work remotely with clients
                wherever they are, and we document everything so timezone gaps stay small.
              </p>
              <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
                {company.email}
              </p>
            </div>
          </aside>
        </div>
      </Section>

      {/* Engineering philosophy */}
      <Section bordered>
        <SectionHeading
          eyebrow="Engineering philosophy"
          title="How we think about building."
          lede="These are working positions, not slogans. They decide what we ship and, more often, what we refuse to ship."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel md:grid-cols-2">
          {ENGINEERING_PHILOSOPHY.map((item, index) => (
            <Reveal key={item.title} delay={index * 70} className="bg-carbon p-7">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ash-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-bone">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section bordered>
        <SectionHeading
          eyebrow="Company values"
          title="What we hold to."
          lede="The first one matters most: we would rather show you less and have all of it be true."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {COMPANY_VALUES.map((value, index) => (
            <Reveal as="li" key={value.title} delay={index * 70} className="flex gap-5">
              <span className="mt-1 font-mono text-[0.625rem] text-signal">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-base font-medium tracking-tight text-bone">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Team */}
      <Section bordered>
        <SectionHeading
          eyebrow="Team"
          title="The people building it."
          lede="Small on purpose. Team profiles are published here from our database as people come on board."
        />

        <div className="mt-14">
          {team.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.id} className="panel panel-interactive p-6">
                  {member.photo_url ? (
                    <Image
                      src={member.photo_url}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="size-16 rounded-2xl border border-steel object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex size-16 items-center justify-center rounded-2xl border border-steel bg-graphite font-display text-lg text-bone-dim"
                    >
                      {member.name.slice(0, 1)}
                    </span>
                  )}
                  <h3 className="mt-5 font-display text-lg font-medium tracking-tight text-bone">
                    {member.name}
                  </h3>
                  <p className="mono-label mt-1.5 text-signal">{member.role}</p>
                  {member.bio ? (
                    <p className="mt-3.5 text-sm leading-relaxed text-ash">{member.bio}</p>
                  ) : null}
                  {member.skills?.length ? (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {member.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded border border-steel bg-carbon px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ash"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Users className="size-5" />}
              title="Profiles publish as the team grows."
              body="We are deliberately small while the Product Lab is young. Rather than pad this page with faces, we would rather you judge us by the software — our own products and our services are all documented on this site."
              action={{ label: "See what we've built", href: "/products" }}
            />
          )}
        </div>
      </Section>

      {/* Future vision */}
      <Section bordered>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
          <div className="max-w-2xl">
            <Eyebrow>Where this goes</Eyebrow>
            <h2 className="display-md mt-5 text-bone">
              A studio that ships its own products, and builds yours properly.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-bone-dim">
              <p>
                The direction is explicit: keep taking on client engineering where we can genuinely
                help, and keep promoting experiments into products until the lab has a portfolio
                worth standing behind.
              </p>
              <p>
                We are not trying to become the largest software company in the region. We are
                trying to become the one whose own products you can open, use, and judge — and
                whose client work reads as evidence rather than assertion.
              </p>
              <p>
                Everything on this site is driven by our own database. Statuses, progress,
                products, articles and metrics all update from the same place our team works from.
                If something here looks thin, it is because it is thin — and it will fill in as
                there is real work behind it.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a Project
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">See our products</Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="panel p-6">
              <h2 className="mono-label text-signal">The journey we work in</h2>
              <ol className="mt-6 space-y-5">
                {siteConfig.journey.map((stage, index) => (
                  <li key={stage.id} className="flex gap-4">
                    <span className="font-mono text-[0.625rem] text-ash-deep">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-bone">{stage.label}</span>
                      <span className="mt-1 block text-sm text-ash">{stage.blurb}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand />

      <JsonLd
        id="about-graph"
        data={jsonLdGraph([
          organizationSchema(company, socials),
          webPageSchema({
            path: "/about",
            name: "About Inovexa Labs",
            description: company.shortDescription,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ])}
      />
    </>
  );
}

const ENGINEERING_PHILOSOPHY = [
  {
    title: "The database is the source of truth",
    body: "Authorisation, isolation and constraints belong in the database, not in application code somebody might forget to call. A missed filter should be a compile error, not a breach.",
  },
  {
    title: "Ship the thinnest complete slice",
    body: "A vertical slice in production teaches more in two weeks than a full specification teaches in two months. We would rather be corrected early than be right late.",
  },
  {
    title: "Write the states people skip",
    body: "Empty, loading, error, offline, permission-denied. The happy path is the easy half, and it is rarely where the support tickets come from.",
  },
  {
    title: "Delete more than you add",
    body: "Every dependency, background job and configuration flag is a permanent liability. We add them deliberately and remove them when they stop earning their place.",
  },
  {
    title: "Measurable AI or no AI",
    body: "If a model's output cannot be evaluated against a fixed set with a number attached, it is a demo. We build the evaluation before we build the feature.",
  },
  {
    title: "Say when it is not a fit",
    body: "Sometimes the honest answer is to buy an existing tool, hire a different team, or not build the thing at all. We would rather lose the project than ship the wrong one.",
  },
];
