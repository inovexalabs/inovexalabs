import { ArrowLeft, ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, ArticleToc } from "@/components/blog/article-body";
import { ShareButtons } from "@/components/blog/share-buttons";
import { PostCard } from "@/components/cards/post-card";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { articleJsonLd, absoluteUrl, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAdjacentPosts, getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/supabase/queries/blog";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { formatDate } from "@/lib/utils/format";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [{ data: post }, { data: settings }] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const metadata = buildMetadata({
    title: post.seo.title ?? post.title,
    description: post.seo.description ?? post.excerpt,
    path: ROUTES.blogPost(post.slug),
    siteName: settings?.site_name,
  });

  if (post.cover) {
    const images = [{ url: post.cover.url, alt: post.cover.alt }];
    metadata.openGraph = { ...metadata.openGraph, images, type: "article" };
    metadata.twitter = { ...metadata.twitter, images };
  } else {
    metadata.openGraph = { ...metadata.openGraph, type: "article" };
  }
  return metadata;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [{ data: post, error }, { data: settings }] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);

  if (error) throw new Error(error);
  if (!post) notFound();

  const url = post.canonical_url || absoluteUrl(ROUTES.blogPost(post.slug));
  const [{ data: related }, { data: adjacent }] = await Promise.all([
    getRelatedPosts(post.slug, post.category, 3),
    getAdjacentPosts(post.slug),
  ]);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          path: ROUTES.blogPost(post.slug),
          imageUrl: post.cover?.url ?? null,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.author ?? (settings?.site_name ?? "Inovexa Labs"),
          publisherName: settings?.site_name ?? "Inovexa Labs",
        })}
      />

      <Section
        underHeader
        spacing="md"
        container="wide"
        labelledBy="post-title"
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
            { name: "Insights", path: ROUTES.blog },
            { name: post.title, path: ROUTES.blogPost(post.slug) },
          ]}
        />

        <div className="mt-10 max-w-4xl">
          <Badge variant="brand">{post.category}</Badge>
          <h1 id="post-title" className="mt-5 font-display text-h1 text-fg">
            {post.title}
          </h1>
          <p className="mt-5 max-w-[44rem] text-lead text-fg-muted">{post.excerpt}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4 text-accent" />
              <time dateTime={post.publishedAt.slice(0, 10)}>{formatDate(post.publishedAt)}</time>
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock aria-hidden="true" className="size-4 text-accent" />
              {post.readingTime} min read
            </span>
            {post.author ? (
              <span className="inline-flex items-center gap-2">
                <User aria-hidden="true" className="size-4 text-accent" />
                {post.author}
              </span>
            ) : null}
          </div>
        </div>

        {post.cover ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
            <Image
              src={post.cover.url}
              alt={post.cover.alt}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </Section>

      <Section spacing="md" container="wide" className="pt-section-sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <ArticleToc content={post.content} />
            </div>
          </div>

          <article className="lg:col-span-9">
            <ArticleBody content={post.content} className="max-w-[46rem] text-[1.0625rem] leading-[1.75]" />

            {post.tags.length > 0 ? (
              <ul aria-label="Tags" className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`${ROUTES.blog}?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex h-8 items-center rounded-full border border-line bg-surface-muted px-3 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 border-t border-line pt-6">
              <ShareButtons title={post.title} url={url} />
            </div>

            <nav aria-label="Article navigation" className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              {adjacent?.previous ? (
                <Link
                  href={ROUTES.blogPost(adjacent.previous.slug)}
                  rel="prev"
                  className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm transition-colors hover:border-line-strong"
                >
                  <ArrowLeft aria-hidden="true" className="size-4 text-accent transition-transform group-hover:-translate-x-0.5" />
                  <span>
                    <span className="block text-xs text-fg-muted">Previous</span>
                    <span className="font-medium text-fg">{adjacent.previous.title}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {adjacent?.next ? (
                <Link
                  href={ROUTES.blogPost(adjacent.next.slug)}
                  rel="next"
                  className="group inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-right text-sm transition-colors hover:border-line-strong sm:text-right"
                >
                  <span>
                    <span className="block text-xs text-fg-muted">Next</span>
                    <span className="font-medium text-fg">{adjacent.next.title}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4 text-accent transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </article>
        </div>
      </Section>

      {related && related.length > 0 ? (
        <Section tone="muted" labelledBy="related-title" container="wide">
          <SectionHeading
            id="related-title"
            title="Keep reading"
            actions={
              <ButtonLink href={ROUTES.blog} variant="ghost">
                All articles
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            }
          />
          <ul role="list" className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="flex">
                <PostCard post={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section
        tone="dark"
        spacing="lg"
        container="narrow"
        className="overflow-hidden text-center"
        background={<div aria-hidden="true" className="absolute inset-0 grid-lines" />}
      >
        <h2 className="font-display text-h2 text-fg">Have a project in mind?</h2>
        <p className="mx-auto mt-5 max-w-reading text-lead text-fg-muted">
          Tell us what you are building and we will reply within two working days with next steps.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={ROUTES.contact} size="lg">
            Start a project
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
