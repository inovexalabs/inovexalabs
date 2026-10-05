import { FlaskConical, Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/animations/reveal";
import { ExperimentCard } from "@/components/cards/experiment-card";
import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { INNOVATION_CATEGORIES, INNOVATION_CATEGORY_KEYS, LAB_STAGES, LAB_STAGE_KEYS } from "@/lib/constants/innovation";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getExperiments, INNOVATION_PAGE_SIZE } from "@/lib/supabase/queries/innovation";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

interface InnovationPageProps {
  searchParams: Promise<{ q?: string; category?: string; stage?: string; page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Innovation Lab",
    description:
      "Internal experiments, prototypes and research from the Inovexa Labs: AI, cybersecurity, Web3, automation and developer tools.",
    path: ROUTES.innovation,
    siteName: settings?.site_name,
  });
}

function chipClass(active: boolean): string {
  return active
    ? "inline-flex h-9 items-center rounded-full border border-transparent px-4 text-sm font-medium brand-gradient text-white"
    : "inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-fg-muted transition-colors hover:border-fg/30 hover:text-fg";
}

function buildHref(values: { q?: string; category?: string; stage?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (values.q) params.set("q", values.q);
  if (values.category) params.set("category", values.category);
  if (values.stage) params.set("stage", values.stage);
  if (values.page && values.page > 1) params.set("page", String(values.page));
  const query = params.toString();
  return query ? `${ROUTES.innovation}?${query}` : ROUTES.innovation;
}

export default async function InnovationPage({ searchParams }: InnovationPageProps) {
  const params = await searchParams;
  const search = (params.q ?? "").trim().slice(0, 60);
  const category = (params.category ?? "").trim().slice(0, 40);
  const stage = (params.stage ?? "").trim().slice(0, 24);
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const { data: experiments, error } = await getExperiments({ search, category, stage });
  const total = experiments?.length ?? 0;
  const start = (page - 1) * INNOVATION_PAGE_SIZE;
  const visible = experiments?.slice(start, start + INNOVATION_PAGE_SIZE) ?? [];
  const pageCount = Math.max(1, Math.ceil(total / INNOVATION_PAGE_SIZE));
  const hasFilters = Boolean(search || category || stage);

  const activeCategory = INNOVATION_CATEGORY_KEYS.find(
    (key) => key === category.toLowerCase() || INNOVATION_CATEGORIES[key].toLowerCase() === category.toLowerCase(),
  );

  return (
    <>
      <PageHero
        id="innovation-title"
        eyebrow="Innovation Lab"
        title="Experiments in progress"
        description="Prototypes, research and internal tools from the Lab. Some become products, some become open source, and all of them teach us something."
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: "Innovation Lab", path: ROUTES.innovation }]}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-fg-muted">
            <FlaskConical aria-hidden="true" className="size-4 text-accent" />
            {total} {total === 1 ? "experiment" : "experiments"}
          </span>
        }
      />

      <Section spacing="md" container="wide" labelledBy="innovation-title" className="pt-section-sm">
        <form action={ROUTES.innovation} method="get" className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
          <div className="relative flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
            <label htmlFor="innovation-search" className="sr-only">
              Search experiments
            </label>
            <Input
              id="innovation-search"
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search experiments"
              className="pl-10"
            />
          </div>
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {stage ? <input type="hidden" name="stage" value={stage} /> : null}
          <Button type="submit" variant="secondary" className="shrink-0">
            <SlidersHorizontal aria-hidden="true" />
            Search
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2" aria-label="Filter by category">
            <span className="mr-1 text-sm font-medium text-fg-muted">Category:</span>
            <Link href={buildHref({ q: search, stage })} aria-current={!category ? "true" : undefined} className={chipClass(!category)}>
              All
            </Link>
            {INNOVATION_CATEGORY_KEYS.map((key) => (
              <Link
                key={key}
                href={buildHref({ q: search, stage, category: key })}
                aria-current={activeCategory === key ? "true" : undefined}
                className={chipClass(activeCategory === key)}
              >
                {INNOVATION_CATEGORIES[key]}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2" aria-label="Filter by stage">
            <span className="mr-1 text-sm font-medium text-fg-muted">Stage:</span>
            <Link href={buildHref({ q: search, category })} aria-current={!stage ? "true" : undefined} className={chipClass(!stage)}>
              Any
            </Link>
            {LAB_STAGE_KEYS.map((key) => (
              <Link
                key={key}
                href={buildHref({ q: search, category, stage: key })}
                aria-current={stage.toLowerCase() === key ? "true" : undefined}
                className={chipClass(stage.toLowerCase() === key)}
              >
                {LAB_STAGES[key].label}
              </Link>
            ))}
          </div>
        </div>

        {experiments === null ? (
          <div role="alert" className="mt-10 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
            {error} Refresh the page to try again.
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <p className="font-display text-h3 text-fg">{hasFilters ? "Nothing matches those filters" : "The lab is quiet — for now"}</p>
            <p className="mx-auto mt-3 max-w-md text-fg-muted">
              {hasFilters
                ? "Try a different combination, or clear the filters to see every experiment."
                : "Experiments are published as they take shape. Check back soon, or read our articles in the meantime."}
            </p>
            {hasFilters ? (
              <Link
                href={ROUTES.innovation}
                className="mt-6 inline-flex h-11 items-center rounded-full border border-line-strong px-5 font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
              >
                Clear filters
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <ul role="list" className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((experiment, index) => (
                <Reveal key={experiment.slug} as="li" delay={(index % 3) * 0.06} className="flex">
                  <ExperimentCard experiment={experiment} />
                </Reveal>
              ))}
            </ul>

            <Pagination
              page={page}
              pageCount={pageCount}
              hrefFor={(n) => buildHref({ q: search, category, stage, page: n })}
            />
          </>
        )}
      </Section>
    </>
  );
}
