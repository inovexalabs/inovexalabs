import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";
import type { Experiment } from "@/types/content";

/**
 * A vertical rail rather than a horizontal scroller: it reads as a record of
 * work over time, stays legible on a phone, and never needs sideways scrolling.
 */
export function ExperimentTimeline({ experiments }: { experiments: Experiment[] }) {
  const ordered = [...experiments].sort((a, b) => {
    const aDate = a.started_on ?? a.created_at;
    const bDate = b.started_on ?? b.created_at;
    return bDate.localeCompare(aDate);
  });

  return (
    <ol className="relative">
      {/* The rail */}
      <span
        aria-hidden
        className="absolute bottom-4 left-[0.3125rem] top-4 w-px bg-gradient-to-b from-transparent via-steel to-transparent sm:left-[0.3125rem]"
      />

      {ordered.map((experiment, index) => (
        <Reveal as="li" key={experiment.id} delay={index * 70} className="relative pl-8 sm:pl-10">
          {/* Node */}
          <span aria-hidden className="absolute left-0 top-[1.6rem] flex size-2.5 items-center justify-center">
            <span className="absolute size-2.5 rounded-full border border-steel bg-void" />
            <span
              className={
                experiment.status === "idea"
                  ? "relative size-1 rounded-full bg-ember"
                  : experiment.status === "archived"
                    ? "relative size-1 rounded-full bg-ash-deep"
                    : "relative size-1 animate-pulse-dot rounded-full bg-plasma"
              }
            />
          </span>

          <Link
            href={`/lab/${experiment.slug}`}
            className="group block border-b border-steel/70 py-6 transition-colors duration-500 hover:border-signal/40"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-plasma">
                {experiment.code ?? "Experiment"}
              </span>
              <StatusBadge status={experiment.status} size="sm" pulse={false} />
              {experiment.started_on ? (
                <time
                  dateTime={experiment.started_on}
                  className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep"
                >
                  {formatDate(experiment.started_on, { month: "short", year: "numeric" })}
                </time>
              ) : null}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-medium tracking-tight text-bone transition-colors duration-400 group-hover:text-signal sm:text-2xl">
                {experiment.title}
              </h3>
              <ArrowUpRight className="mt-1.5 size-4 shrink-0 text-ash-deep transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash sm:text-[0.9375rem]">
              {experiment.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Progress readout */}
              <div className="flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-label={`${experiment.title} progress`}
                  aria-valuenow={experiment.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="flex gap-1"
                >
                  {Array.from({ length: 10 }).map((_, cell) => (
                    <span
                      key={cell}
                      aria-hidden
                      className={
                        cell < Math.round(experiment.progress / 10)
                          ? "h-1.5 w-3 rounded-[1px] bg-plasma/80"
                          : "h-1.5 w-3 rounded-[1px] bg-steel"
                      }
                    />
                  ))}
                </div>
                <span className="font-mono text-[0.625rem] tabular-nums text-ash-deep">
                  {String(experiment.progress).padStart(3, "0")}%
                </span>
              </div>

              {experiment.technologies?.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {experiment.technologies.slice(0, 5).map((tech) => (
                    <li
                      key={tech}
                      className="rounded border border-steel bg-carbon px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ash"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Link>
        </Reveal>
      ))}
    </ol>
  );
}
