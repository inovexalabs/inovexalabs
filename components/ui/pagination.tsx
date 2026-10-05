import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps {
  page: number;
  pageCount: number;
  /** Builds the href for a page number, e.g. (n) => `/projects?page=${n}`. */
  hrefFor: (page: number) => string;
  className?: string;
}

function pageNumbers(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) items.push("gap");
    items.push(value);
    previous = value;
  }
  return items;
}

/** Numbered pagination. Renders nothing on a single page. */
export function Pagination({ page, pageCount, hrefFor, className }: PaginationProps) {
  if (pageCount <= 1) return null;

  const previous = page > 1 ? hrefFor(page - 1) : null;
  const next = page < pageCount ? hrefFor(page + 1) : null;

  return (
    <nav aria-label="Pagination" className={cn("mt-12 flex flex-wrap items-center justify-center gap-2", className)}>
      {previous ? (
        <Link
          href={previous}
          rel="prev"
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Previous
        </Link>
      ) : null}

      <ul className="flex items-center gap-1.5">
        {pageNumbers(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-sm text-fg-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "grid size-11 place-items-center rounded-full text-sm font-medium transition-colors",
                  item === page
                    ? "brand-gradient text-white shadow-sm"
                    : "border border-line-strong text-fg hover:border-fg/30 hover:bg-fg/[0.04]",
                )}
              >
                <span className="sr-only">Page </span>
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {next ? (
        <Link
          href={next}
          rel="next"
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
        >
          Next
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
