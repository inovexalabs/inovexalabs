import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils/cn";

export interface ResultMetric {
  metric: string;
  label: string;
  description?: string;
}

interface ResultsMetricsProps {
  metrics: ResultMetric[];
  /** Section heading. Omit when the metrics sit under an existing heading. */
  title?: string;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Measurable results. Renders nothing when no metrics exist — figures are
 * never invented, defaulted or filled in from anywhere but the database.
 */
export function ResultsMetrics({ metrics, title, id, tone = "light", className }: ResultsMetricsProps) {
  if (metrics.length === 0) return null;

  const headingId = title ? (id ?? "results-title") : undefined;

  return (
    <div className={className} aria-labelledby={headingId}>
      {title ? (
        <h2 id={headingId} className={cn("font-display text-h3 text-fg", tone === "dark" && "text-fg")}>
          {title}
        </h2>
      ) : null}
      <ul
        role="list"
        className={cn(
          "mt-6 grid gap-4 sm:grid-cols-2",
          metrics.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {metrics.map((item, index) => (
          <Reveal key={`${item.metric}-${item.label}`} as="li" delay={(index % 4) * 0.06}>
            <div
              className={cn(
                "h-full rounded-xl border border-line p-6",
                tone === "dark" ? "glass" : "bg-surface shadow-sm",
              )}
            >
              <p className="gradient-text font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-bold leading-none tracking-[-0.03em]">
                {item.metric}
              </p>
              <p className="mt-3 font-display text-h4 text-fg">{item.label}</p>
              {item.description ? <p className="mt-2 text-sm text-fg-muted">{item.description}</p> : null}
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
