import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLabMetrics, visibleMetrics } from "@/lib/queries/metrics";
import { cn } from "@/lib/utils";

/**
 * LAB STATUS.
 *
 * Every figure is counted from real published rows. When a metric has no
 * supporting data it is omitted entirely — the panel never shows a zero to look
 * populated, and never shows a number we cannot defend.
 */
export async function LabStatus({ className }: { className?: string }) {
  const metrics = await getLabMetrics();
  const rows = visibleMetrics(metrics);

  return (
    <div
      className={cn(
        "panel overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-steel px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-signal" />
          </span>
          <h3 className="mono-label text-signal">Inovexa Lab status</h3>
        </div>
        <span className="mono-label text-ash-deep">live</span>
      </div>

      {rows.length > 0 ? (
        <dl className="divide-y divide-steel">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 px-6 py-4">
              <dt className="text-sm text-bone-dim">{row.label}</dt>
              <dd className="font-mono text-lg tabular-nums text-bone">
                {String(row.value).padStart(2, "0")}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="px-6 py-8">
          <p className="text-sm leading-relaxed text-bone-dim">
            The lab is early. Metrics appear here automatically as soon as there is
            real work to count.
          </p>
          <Link
            href="/lab"
            className="group mt-4 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-signal"
          >
            See what we are building
            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
