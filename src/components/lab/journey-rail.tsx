import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The five-stage spine of the whole site: IDEA → EXPERIMENT → BUILD → LAUNCH →
 * IMPACT. Rendered as a rail on desktop and a stepped list on mobile so it never
 * depends on horizontal scrolling.
 */
export function JourneyRail({ className }: { className?: string }) {
  const steps = siteConfig.journey;

  return (
    <section
      aria-label="How Inovexa Labs works: idea to impact"
      className={cn("relative", className)}
    >
      <ol className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="group relative bg-carbon p-6 transition-colors duration-500 hover:bg-graphite"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ash-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index < steps.length - 1 ? (
                <span aria-hidden className="hidden h-px w-8 bg-steel lg:block" />
              ) : (
                <span aria-hidden className="size-1.5 rounded-full bg-signal" />
              )}
            </div>

            <p className="mt-6 font-display text-lg tracking-tight text-bone transition-colors duration-500 group-hover:text-signal">
              {step.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ash">{step.blurb}</p>

            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-signal/60 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
