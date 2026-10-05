import { Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/animations/reveal";
import { PostCard } from "@/components/cards/post-card";
import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { getPostFacets, getPosts } from "@/lib/supabase/queries/blog";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

interface BlogPageProps {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Technology & Engineering Blog",
    description:
      "Practical articles about software development, AI, cybersecurity, cloud technology, Web3, automation, and modern engineering.",
    path: ROUTES.blog,
    siteName: settings?.site_name,
  });
}

function buildHref(values: { q?: string; category?: string; tag?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (values.q) params.set("q", values.q);
  if (values.category) params.set("category", values.category);
  if (values.tag) params.set("tag", values.tag);
  if (values.page && values.page > 1) params.set("page", String(values.page));
  const query = params.toString();
  return query ? `${ROUTES.blog}?${query}` : ROUTES.blog;
}

function chipClass(active: boolean): string {
  return active
    ? "inline-flex h-9 items-center rounded-full border border-transparent px-4 text-sm font-medium brand-gradient text-white"
    : "inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-fg-muted transition-colors hover:border-fg/30 hover:text-fg";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const search = (params.q ?? "").trim().slice(0, 60);
  const category = (params.category ?? "").trim().slice(0, 40);
  const tag = (params.tag ?? "").trim().slice(0, 30);
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [{ data: result, error }, { data: facets }] = await Promise.all([
    getPosts({ search, category, tag, page }),
    getPostFacets(),
  ]);

  const hasFilters = Boolean(search || category || tag);

  return (
    <>
      <PageHero
        id="blog-title"
        eyebrow="Knowledge hub"
        title="Insights"
        description="Engineering notes, security practices and lessons from building products — written by the people who built them."
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: "Insights", path: ROUTES.blog }]}
      />

      <Section spacing="md" container="wide" labelledBy="blog-title" className="pt-section-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form action={ROUTES.blog} method="get" className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <Input id="blog-search" type="search" name="q" defaultValue={search} placeholder="Search articles" className="pl-10" />
            </div>
            {category ? <input type="hidden" name="category" value={category} /> : null}
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <Button type="submit" variant="secondary" className="shrink-0">
              <SlidersHorizontal aria-hidden="true" />
              Search
            </Button>
          </form>

          {facets && facets.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-label="Filter by category">
              <Link href={buildHref({ q: search, tag })} aria-current={!category ? "true" : undefined} className={chipClass(!category)}>
                All
              </Link>
              {facets.categories.map((value) => (
                <Link
                  key={value}
                  href={buildHref({ q: search, tag, category: value })}
                  aria-current={category.toLowerCase() === value.toLowerCase() ? "true" : undefined}
                  className={chipClass(category.toLowerCase() === value.toLowerCase())}
                >
                  {value}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {facets && facets.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Filter by tag">
            <span className="mr-1 text-sm font-medium text-fg-muted">Tags:</span>
            <Link href={buildHref({ q: search, category })} aria-current={!tag ? "true" : undefined} className={chipClass(!tag)}>
              Any
            </Link>
            {facets.tags.map((value) => (
              <Link
                key={value}
                href={buildHref({ q: search, category, tag: value })}
                aria-current={tag.toLowerCase() === value.toLowerCase() ? "true" : undefined}
                className={chipClass(tag.toLowerCase() === value.toLowerCase())}
              >
                {value}
              </Link>
            ))}
          </div>
        ) : null}

        {result === null ? (
          <div role="alert" className="mt-10 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
            {error} Refresh the page to try again.
          </div>
        ) : result.items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <p className="font-display text-h3 text-fg">{hasFilters ? "No articles match" : "Nothing published yet"}</p>
            <p className="mx-auto mt-3 max-w-md text-fg-muted">
              {hasFilters
                ? "Try another search term or clear the filters to see everything."
                : "We are drafting the first articles. Subscribe in the footer to hear when they go live."}
            </p>
            {hasFilters ? (
              <Link
                href={ROUTES.blog}
                className="mt-6 inline-flex h-11 items-center rounded-full border border-line-strong px-5 font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
              >
                Clear filters
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-fg-muted" role="status">
              {result.total} {result.total === 1 ? "article" : "articles"}
              {hasFilters ? " matching your filters" : ""}
            </p>

            <ul role="list" className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post, index) => (
                <Reveal key={post.slug} as="li" delay={(index % 3) * 0.06} className="flex">
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>

            <Pagination page={result.page} pageCount={result.pageCount} hrefFor={(n) => buildHref({ q: search, category, tag, page: n })} />
          </>
        )}
      </Section>
    </>
  );
}
