import { FileText, FlaskConical, FolderKanban, Layers, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { searchSite, type SearchCategory } from "@/lib/supabase/queries/search";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Search",
    description: "Search services, projects, Innovation Lab experiments and articles on this site.",
    path: ROUTES.search,
    siteName: settings?.site_name,
  });
}

const CATEGORY_META: Record<SearchCategory, { label: string; icon: typeof Layers }> = {
  services: { label: "Services", icon: Layers },
  projects: { label: "Projects", icon: FolderKanban },
  innovation: { label: "Innovation Lab", icon: FlaskConical },
  blog: { label: "Articles", icon: FileText },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 60);
  const searchResult = query ? await searchSite(query) : null;
  const results = searchResult?.data ?? null;
  const error = searchResult?.error ?? null;

  const total = results ? Object.values(results.counts).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <>
      <PageHero
        id="search-title"
        eyebrow="Search"
        title="Find anything on this site"
        description="Search across services, projects, Innovation Lab experiments and articles."
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: "Search", path: ROUTES.search }]}
      />

      <Section spacing="md" container="content" labelledBy="search-title" className="pt-section-sm">
        <form action={ROUTES.search} method="get" className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
            <label htmlFor="site-search" className="sr-only">
              Search the site
            </label>
            <Input
              id="site-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search for e.g. “security”, “dashboard”, “agents”"
              className="pl-10"
              autoFocus
            />
          </div>
          <Button type="submit" variant="secondary" className="shrink-0">
            <Search aria-hidden="true" />
            Search
          </Button>
        </form>

        {query === "" ? (
          <div className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
            <p className="font-display text-h3 text-fg">Type something to search</p>
            <p className="mx-auto mt-3 max-w-md text-fg-muted">
              Results are grouped by section, so you can jump straight to a service, project, experiment or article.
            </p>
          </div>
        ) : error ? (
          <div role="alert" className="mt-10 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
            {error} Try again in a moment.
          </div>
        ) : total === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
            <p className="font-display text-h3 text-fg">No results for “{query}”</p>
            <p className="mx-auto mt-3 max-w-md text-fg-muted">
              Try a shorter or more general term — or browse the services and projects directly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={ROUTES.services}
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
              >
                Services
              </Link>
              <Link
                href={ROUTES.projects}
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
              >
                Projects
              </Link>
              <Link
                href={ROUTES.contact}
                className="inline-flex h-11 items-center rounded-full brand-gradient px-5 font-medium text-white"
              >
                Ask us directly
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            <p role="status" className="text-sm text-fg-muted">
              {total} {total === 1 ? "result" : "results"} for “{query}”
            </p>

            {(Object.keys(CATEGORY_META) as SearchCategory[])
              .filter((category) => (results?.counts[category] ?? 0) > 0)
              .map((category) => {
                const meta = CATEGORY_META[category];
                const Icon = meta.icon;
                const hits = results?.hits.filter((hit) => hit.category === category) ?? [];

                return (
                  <section key={category} aria-labelledby={`search-${category}`}>
                    <h2 id={`search-${category}`} className="flex items-center gap-2 font-display text-h4 text-fg">
                      <span aria-hidden="true" className="grid size-8 place-items-center rounded-md brand-gradient-soft text-iris-700">
                        <Icon className="size-4" />
                      </span>
                      {meta.label}
                      <span className="text-sm font-normal text-fg-muted">({results?.counts[category]})</span>
                    </h2>

                    <ul role="list" className="mt-4 space-y-3">
                      {hits.map((hit) => (
                        <li key={`${hit.category}-${hit.href}`}>
                          <Card as="article" padding="sm" radius="lg" interactive className="h-full">
                            <Link href={hit.href} className="block rounded-xs">
                              <span className="font-display text-h4 text-fg">{hit.title}</span>
                              <span className="mt-1 block text-sm text-fg-muted">{hit.description}</span>
                              <span className="mt-2 block text-sm text-accent">{hit.href}</span>
                            </Link>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
          </div>
        )}
      </Section>
    </>
  );
}
