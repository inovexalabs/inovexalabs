import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { CtaBand } from "@/components/site/cta-band";
import { getServices } from "@/lib/queries/content";
import { SEARCH_KIND_META, searchHref, searchSite } from "@/lib/queries/search";
import { buildMetadata } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchHit } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  // Search results must never be indexed: they are derivative, and an indexed
  // results page is a duplicate-content generator.
  return buildMetadata({
    path: "/search",
    title: "Search",
    description:
      "Search Inovexa Labs products, client work, services, experiments and insights.",
    robots: "noindex,follow",
  });
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const [{ q }, services] = await Promise.all([searchParams, getServices()]);
  const query = (q ?? "").trim();
  const results = query.length >= 2 ? await searchSite(query) : [];

  const grouped = results.reduce<Record<string, SearchHit[]>>((acc, hit) => {
    (acc[hit.kind] ??= []).push(hit);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Search", path: "/search" }]}
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search the site."}
        lede="Products, client work, services, experiments and insights — searched in one place."
      >
        <form action="/search" method="get" role="search" className="mt-10 max-w-xl">
          <label htmlFor="q" className="sr-only">
            Search query
          </label>
          <div className="relative">
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ash-deep"
            />
            <Input
              id="q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search products, services, insights…"
              autoComplete="off"
              className="h-13 pl-11 pr-28 text-base"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 h-10 -translate-y-1/2 rounded-full bg-signal px-5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-void transition-colors hover:bg-signal-dim"
            >
              Search
            </button>
          </div>
        </form>
      </PageHeader>

      <Section>
        {query.length < 2 ? (
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Start typing"
              title="Try a service, a product or a topic."
              lede="Search covers everything we publish. Suggestions below are the areas people look for most."
            />
            <ul className="mt-10 flex flex-wrap gap-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/search?q=${encodeURIComponent(service.title)}`}
                    className="inline-block rounded-full border border-steel bg-carbon px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bone-dim transition-colors hover:border-signal/50 hover:text-bone"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/search?q=experiment"
                  className="inline-block rounded-full border border-steel bg-carbon px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bone-dim transition-colors hover:border-signal/50 hover:text-bone"
                >
                  Experiments
                </Link>
              </li>
            </ul>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title={`Nothing matched “${query}”.`}
            body="We would rather return no results than pad them with loosely related pages. Try a broader term, or browse a section directly."
            action={{ label: "Browse services", href: "/services" }}
          />
        ) : (
          <>
            <p role="status" className="mono-label text-ash">
              {String(results.length).padStart(2, "0")}{" "}
              {results.length === 1 ? "result" : "results"}
            </p>

            <div className="mt-12 space-y-16">
              {Object.entries(grouped).map(([kind, hits]) => (
                <div key={kind}>
                  <h2 className="mono-label border-b border-steel pb-4 text-signal">
                    {SEARCH_KIND_META[kind as SearchHit["kind"]]?.label ?? kind}
                    <span className="ml-3 text-ash-deep">{hits.length}</span>
                  </h2>
                  <ul className="mt-2 divide-y divide-steel/70">
                    {hits.map((hit) => (
                      <li key={`${hit.kind}-${hit.slug}`}>
                        <Link
                          href={searchHref(hit)}
                          className="group flex flex-col gap-2 py-5 transition-colors sm:flex-row sm:items-baseline sm:gap-6"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-lg font-medium tracking-tight text-bone transition-colors group-hover:text-signal">
                              {hit.title}
                            </span>
                            {hit.subtitle ? (
                              <span className="mt-1.5 block line-clamp-2 text-sm leading-relaxed text-ash">
                                {hit.subtitle}
                              </span>
                            ) : null}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep",
                            )}
                          >
                            {searchHref(hit)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
