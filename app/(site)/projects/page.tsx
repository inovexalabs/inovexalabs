import { Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/cards/project-card";
import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getProjectCategories, getProjects, PROJECTS_PAGE_SIZE } from "@/lib/supabase/queries/projects";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

interface ProjectsPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Software Projects & Products",
    description:
      "Explore software products, digital platforms, AI systems, and technology projects built and researched by Inovexa Labs.",
    path: ROUTES.projects,
    siteName: settings?.site_name,
  });
}

/** Builds the filter URL for a page number, preserving the active filters. */
function pageHref(search: string, category: string, page: number): string {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${ROUTES.projects}?${query}` : ROUTES.projects;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const search = (params.q ?? "").trim().slice(0, 60);
  const category = (params.category ?? "").trim().slice(0, 40);
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [{ data: result, error }, { data: categories }] = await Promise.all([
    getProjects({ search, category, page, pageSize: PROJECTS_PAGE_SIZE }),
    getProjectCategories(),
  ]);

  const hasFilters = Boolean(search || category);

  return (
    <>
      <PageHero
        id="projects-title"
        eyebrow="Portfolio"
        title="Projects"
        description="A selection of products we have designed and engineered — filter by category or search for a technology to find relevant work."
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: "Projects", path: ROUTES.projects }]}
      />

      <Section spacing="md" container="wide" labelledBy="projects-title" className="pt-section-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form action={ROUTES.projects} method="get" className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
              />
              <label htmlFor="projects-search" className="sr-only">
                Search projects
              </label>
              <Input
                id="projects-search"
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Search projects, e.g. “dashboard”"
                className="pl-10"
              />
            </div>
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <Button type="submit" variant="secondary" className="shrink-0">
              <SlidersHorizontal aria-hidden="true" />
              Search
            </Button>
          </form>

          {categories && categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={pageHref(search, "", 1)}
                aria-current={!category ? "true" : undefined}
                className={
                  !category
                    ? "inline-flex h-9 items-center rounded-full border border-transparent px-4 text-sm font-medium brand-gradient text-white"
                    : "inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-fg-muted transition-colors hover:border-fg/30 hover:text-fg"
                }
              >
                All
              </Link>
              {categories.map((value) => (
                <Link
                  key={value}
                  href={pageHref(search, value, 1)}
                  aria-current={category.toLowerCase() === value.toLowerCase() ? "true" : undefined}
                  className={
                    category.toLowerCase() === value.toLowerCase()
                      ? "inline-flex h-9 items-center rounded-full border border-transparent px-4 text-sm font-medium brand-gradient text-white"
                      : "inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-fg-muted transition-colors hover:border-fg/30 hover:text-fg"
                  }
                >
                  {value}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {result === null ? (
          <div role="alert" className="mt-10 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
            {error} Refresh the page to try again.
          </div>
        ) : result.items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <p className="font-display text-h3 text-fg">{hasFilters ? "No projects match" : "Projects are on the way"}</p>
            <p className="mx-auto mt-3 max-w-md text-fg-muted">
              {hasFilters
                ? "Nothing matched that search. Try a different term, or clear the filters to see everything."
                : "We are publishing our case studies right now. Tell us what you are building in the meantime."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {hasFilters ? (
                <Link
                  href={ROUTES.projects}
                  className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
                >
                  Clear filters
                </Link>
              ) : null}
              <Link
                href={ROUTES.contact}
                className="inline-flex h-11 items-center rounded-full brand-gradient px-5 font-medium text-white"
              >
                Start a project
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-fg-muted" role="status">
              {result.total} {result.total === 1 ? "project" : "projects"}
              {hasFilters ? " matching your filters" : ""}
            </p>

            <ul role="list" className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((project, index) => (
                <Reveal key={project.slug} as="li" delay={(index % 3) * 0.06} className="flex">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </ul>

            <Pagination page={result.page} pageCount={result.pageCount} hrefFor={(n) => pageHref(search, category, n)} />
          </>
        )}
      </Section>
    </>
  );
}
