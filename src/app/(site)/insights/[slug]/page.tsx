import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { PostCard } from "@/components/cards/post-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/content/markdown";
import { Reveal } from "@/components/site/reveal";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getCompany,
  getRelatedPosts,
} from "@/lib/queries/content";
import { formatDate, initials } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return buildMetadata({ path: `/insights/${slug}`, robots: "noindex,nofollow" });

  return buildMetadata({
    path: `/insights/${post.slug}`,
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    keywords: post.seo_keywords,
    canonicalOverride: post.canonical_url,
    ogTitle: post.og_title,
    ogDescription: post.og_description,
    ogImage: post.og_image_url || post.cover_image_url,
    robots: post.robots,
    type: "article",
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    authors: post.author ? [post.author.name] : null,
    section: post.category?.name ?? null,
    tags: post.tags?.map((t) => t.name) ?? null,
  });
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const [related, company] = await Promise.all([getRelatedPosts(post, 3), getCompany()]);
  const path = `/insights/${post.slug}`;
  const wasUpdated =
    post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10);

  return (
    <>
      <PageHeader
        trail={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: post.title, path },
        ]}
        eyebrow={post.category?.name ?? "Insight"}
        title={post.title}
        lede={post.excerpt}
      >
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          {post.author ? (
            <div className="flex items-center gap-3">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full border border-steel bg-graphite font-mono text-[0.625rem] text-bone-dim"
                >
                  {initials(post.author.name)}
                </span>
              )}
              <span>
                <span className="block text-sm text-bone">{post.author.name}</span>
                {post.author.role ? (
                  <span className="block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
                    {post.author.role}
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}

          <span className="mono-label text-ash-deep">
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
            {wasUpdated ? ` · updated ${formatDate(post.updated_at)}` : ""}
          </span>
          <span className="mono-label text-ash-deep">{post.reading_minutes ?? 5} min read</span>
        </div>
      </PageHeader>

      {post.cover_image_url ? (
        <div className="mx-auto w-full max-w-[86rem] edge-x pt-14">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-graphite">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:gap-20">
          <article className="min-w-0 max-w-3xl">
            <Markdown content={post.content} />

            {post.tags?.length ? (
              <ul className="mt-14 flex flex-wrap gap-2 border-t border-steel pt-8">
                {post.tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="rounded-full border border-steel bg-graphite px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            ) : null}

            {post.intent ? (
              <p className="mt-8 rounded-xl border border-steel bg-carbon p-5 text-sm leading-relaxed text-ash">
                <span className="mono-label block text-signal">What this answers</span>
                <span className="mt-2 block">{post.intent}</span>
              </p>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="panel p-6">
              <h2 className="mono-label text-ash-deep">Written by</h2>
              <p className="mt-4 font-display text-base font-medium tracking-tight text-bone">
                {post.author?.name ?? company.name}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ash">
                {post.author?.bio ??
                  "Notes from the people who build the software — written after shipping it, not before."}
              </p>
              <Link
                href="/about"
                className="mt-5 inline-block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-signal underline-offset-4 hover:underline"
              >
                About the lab →
              </Link>
            </div>

            <div className="panel mt-5 p-6">
              <h2 className="mono-label text-ash-deep">Keep reading</h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/services" className="text-sm text-bone-dim hover:text-signal">
                    What we do
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="text-sm text-bone-dim hover:text-signal">
                    All insights
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-bone-dim hover:text-signal">
                    Start a project
                  </Link>
                </li>
              </ul>
            </div>

            <Link
              href="/insights"
              className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal"
            >
              <ArrowLeft className="size-3" />
              Back to insights
            </Link>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section bordered>
          <SectionHeading
            eyebrow="Related reading"
            title="Where to go next."
            action={{ label: "All insights", href: "/insights" }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <PostCard post={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />

      <JsonLd
        id={`insight-${post.slug}-graph`}
        data={jsonLdGraph([
          articleSchema(post),
          webPageSchema({ path, name: post.title, description: post.excerpt }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path },
          ]),
        ])}
      />
    </>
  );
}
