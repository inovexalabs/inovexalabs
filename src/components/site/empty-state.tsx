import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Shown wherever a dynamic section has no real content yet.
 *
 * Deliberately warm rather than blank: a missing section should read as
 * "not yet", never as "broken", and never be filled with invented content.
 */
export function EmptyState({
  title,
  body,
  action,
  icon,
  className,
  compact = false,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
  icon?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60",
        compact ? "px-6 py-8" : "px-6 py-14 sm:px-10 sm:py-20",
        className,
      )}
    >
      <div aria-hidden className="lab-grid-fine pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative flex flex-col items-start gap-4">
        {icon ? (
          <span className="flex size-11 items-center justify-center rounded-xl border border-steel bg-graphite text-signal">
            {icon}
          </span>
        ) : (
          <span className="mono-label flex items-center gap-2 text-ash">
            <span aria-hidden className="inline-block size-1.5 animate-pulse-dot rounded-full bg-ember" />
            Awaiting data
          </span>
        )}
        <h3 className="max-w-xl font-display text-lg font-medium tracking-tight text-bone sm:text-xl">
          {title}
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-ash">{body}</p>
        {action ? (
          <Link
            href={action.href}
            className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal underline-offset-4 hover:underline"
          >
            {action.label} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Consistent loading skeleton for a grid of cards. */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="panel h-64 animate-pulse p-6">
          <div className="h-3 w-20 rounded-full bg-steel" />
          <div className="mt-6 h-6 w-3/4 rounded-full bg-steel/80" />
          <div className="mt-3 h-3 w-full rounded-full bg-steel/50" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-steel/50" />
        </div>
      ))}
    </div>
  );
}
