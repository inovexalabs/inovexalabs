import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/types/content";

export function ExperimentCard({
  experiment,
  className,
}: {
  experiment: Experiment;
  className?: string;
}) {
  return (
    <Link
      href={`/lab/${experiment.slug}`}
      className={cn("panel panel-interactive group relative flex h-full flex-col p-6", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-plasma">
          {experiment.code ?? "Experiment"}
        </span>
        <StatusBadge status={experiment.status} size="sm" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-medium tracking-tight text-bone">
          {experiment.title}
        </h3>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-ash-deep transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plasma" />
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ash">{experiment.summary}</p>

      {/* Progress readout */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="mono-label text-ash-deep">Progress</span>
          <span className="font-mono text-[0.6875rem] tabular-nums text-bone-dim">
            {String(experiment.progress).padStart(3, "0")}%
          </span>
        </div>
        <div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-steel/70"
          role="progressbar"
          aria-label={`${experiment.title} progress`}
          aria-valuenow={experiment.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-plasma/70 to-plasma transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${Math.min(100, Math.max(0, experiment.progress))}%` }}
          />
        </div>

        {experiment.technologies?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {experiment.technologies.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded border border-steel bg-carbon px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ash"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
