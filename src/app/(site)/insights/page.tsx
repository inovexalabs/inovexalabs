import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { PostCard } from "@/components/cards/post-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { getBlogCategories, getBlogPosts, getServices } from "@/lib/queries/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/insights",
    title: "Insights on Software, AI and Product Engineering",
    description:
      "Practical writing from Inovexa Labs on software development, applied AI, SaaS engineering and building technology businesses in Nepal — written after shipping, not before.",
    keywords: [
      "software engineering blog Nepal",
      "AI development insights",
      "how to build a SaaS product",
      "custom software development cost Nepal",
    ],
  });
}

export default async function InsightsPage() {
  const [posts, categories, services] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getServices(),
  ]);

  const [lead, ...rest] = posts;
  const usedCategories = categories.filter((category) =>
    posts.some((post) => post.category_id === category.id),
  );

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }]}
        eyebrow="Insights"
        title="Notes from the work."
        lede="Practical writing on software, applied AI and building technology businesses. Every article is written by the people who did the work, and none of it exists to fill a content calendar."
        meta={
          <>
            <span className="mono-label text-ash">
              {String(posts.length).padStart(2, "0")}{" "}
              {posts.length === 1 ? "article" : "articles"}
            </span>
            {usedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/insights?category=${category.slug}`}
                className="mono-label text-ash-deep transition-colors hover:text-signal"
              >
                {category.name}
              </Link>
            ))}
          </>
        }
      />

      {posts.length > 0 && lead ? (
        <>
          <Section>
            <article className="panel panel-interactive group overflow-hidden">
              <Link href={`/insights/${lead.slug}`} className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                <div className="relative min-h-[16rem] border-b border-steel bg-graphite lg:border-b-0 lg:border-r">
                  <div aria-hidden className="lab-grid-fine absolute inset-0 opacity-70" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-signal/[0.06] via-transparent to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-7 sm:p-9">
                    <span className="mono-label text-signal">
                      {lead.is_pillar ? "Pillar guide" : "Latest"}
                    </span>
                    <span aria-hidden className="mono-label text-ash-deep">
                      {lead.reading_minutes ?? 5} min read
                    </span>
                  </div>
                </div>

                <div className="p-7 sm:p-9">
                  {lead.category ? (
                    <span className="mono-label text-signal">{lead.category.name}</span>
                  ) : null}
                  <h2 className="mt-5 font-display text-2xl font-medium tracking-tight text-bone transition-colors duration-400 group-hover:text-signal sm:text-3xl">
                    {lead.title}
                  </h2>
                  {lead.excerpt ? (
                    <p className="mt-4 text-base leading-relaxed text-bone-dim">{lead.excerpt}</p>
                  ) : null}
                  {lead.intent ? (
                    <p className="mt-5 border-t border-steel pt-5 text-xs leading-relaxed text-ash-deep">
                      <span className="mono-label">Answers:</span> {lead.intent}
                    </p>
                  ) : null}
                </div>
              </Link>
            </article>
          </Section>

          {rest.length > 0 ? (
            <Section bordered>
              <SectionHeading
                eyebrow="Archive"
                title="Everything else we have published."
              />
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, index) => (
                  <Reveal key={post.id} delay={(index % 3) * 80}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>
            </Section>
          ) : null}
        </>
      ) : (
        <Section>
          <EmptyState
            icon={<BookOpen className="size-5" />}
            title="Nothing published yet."
            body="We would rather write nothing than pad this section with thin articles written for search engines. When something genuinely useful goes up, it appears here."
            action={{ label: "See what we build", href: "/services" }}
          />
        </Section>
      )}

      {/* Internal linking: articles point at the services they relate to. */}
      {services.length > 0 ? (
        <Section bordered>
          <SectionHeading
            eyebrow="Keep reading"
            title="The services behind these articles."
            lede="Each capability has its own page covering approach, deliverables and how an engagement is shaped."
            action={{ label: "All services", href: "/services" }}
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <li key={service.id} className="bg-carbon">
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors duration-500 hover:bg-graphite"
                >
                  <span className="font-display text-base font-medium tracking-tight text-bone group-hover:text-signal">
                    {service.title}
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
                    {service.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBand
        eyebrow="Questions this raised?"
        title="Ask us directly."
        body="If an article left you with a specific question about your own system, ask it. We answer straight, whether or not it turns into a project."
      />

      <JsonLd
        id="insights-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/insights",
            name: "Insights",
            description:
              "Practical writing on software development, applied AI and building technology businesses.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
          ]),
          posts.length
            ? itemListSchema(
                posts.map((p) => ({ name: p.title, path: `/insights/${p.slug}` })),
                "Inovexa Labs insights",
              )
            : null,
        ])}
      />
    </>
  );
}
