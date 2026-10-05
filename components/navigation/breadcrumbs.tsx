import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Visible trail plus BreadcrumbList structured data. The last item is the current page. */
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-fg-muted">
          {items.map((item, index) => {
            const current = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {current ? (
                  <span aria-current="page" className="font-medium text-fg">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="rounded-xs transition-colors hover:text-fg">
                      {item.name}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
