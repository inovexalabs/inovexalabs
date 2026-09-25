import { cn } from "@/lib/utils";
import type { ProjectPhase } from "@/types/content";

/**
 * BUILD SIGNAL.
 *
 * Optional, admin-managed progress across discovery, design, development and
 * testing. Rendered as a measurable readout rather than a decorative progress
 * bar, and only shown when a project actually has phase data recorded.
 */
export function BuildSignal({
  phases,
  className,
}: {
  phases: ProjectPhase[];
  className?: string;
}) {
  if (!phases || phases.length === 0) return null;

  const ordered = [...phases].sort((a, b) => a.display_order - b.display_order);
  const overall = Math.round(
    ordered.reduce((sum, phase) => sum + phase.progress, 0) / ordered.length,
  );

  return (
    <div className={cn("panel overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-plasma" />
          </span>
          <h2 className="mono-label text-plasma">Build signal</h2>
        </div>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ash-deep">
          overall {String(overall).padStart(3, "0")}%
        </span>
      </div>

      <ul className="divide-y divide-steel/70">
        {ordered.map((phase) => (
          <li key={phase.id} className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-bone-dim">
                {phase.label}
              </span>
              <span className="font-mono text-[0.6875rem] tabular-nums text-ash">
                {phase.progress}%
              </span>
            </div>

            {/* Instrument readout: filled cells plus an accessible progressbar. */}
            <div
              role="progressbar"
              aria-label={`${phase.label} progress`}
              aria-valuenow={phase.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2.5 flex gap-1"
            >
              {Array.from({ length: 20 }).map((_, cell) => {
                const filled = cell < Math.round(phase.progress / 5);
                return (
                  <span
                    key={cell}
                    aria-hidden
                    className={cn(
                      "h-2 flex-1 rounded-[1px] transition-colors",
                      filled ? "bg-plasma/80" : "bg-steel/70",
                    )}
                  />
                );
              })}
            </div>

            {phase.note ? (
              <p className="mt-2.5 text-xs leading-relaxed text-ash">{phase.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
