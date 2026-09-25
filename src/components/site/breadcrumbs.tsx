import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({
  trail,
  className,
  label = "Breadcrumb",
}: {
  trail: Crumb[];
  className?: string;
  label?: string;
}) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label={label} className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ash">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="max-w-[16rem] truncate text-bone-dim sm:max-w-none">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-signal focus-visible:text-signal"
                >
                  {crumb.name}
                </Link>
              )}
              {!isLast ? <ChevronRight aria-hidden className="size-3 shrink-0 text-ash-deep" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
