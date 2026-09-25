import { PROCESS_STEPS } from "@/config/site";
import { Reveal } from "@/components/site/reveal";

/**
 * IDEA → DISCOVER → DESIGN → BUILD → TEST → LAUNCH → EVOLVE.
 *
 * A pipeline, not a list of bullet points: each stage is a node on a continuous
 * line, so the seven steps read as one system rather than seven services.
 */
export function BuildPipeline() {
  return (
    <div className="relative">
      {/* The spine */}
      <div
        aria-hidden
        className="absolute left-[0.4375rem] top-2 bottom-2 w-px bg-gradient-to-b from-signal/50 via-steel to-transparent lg:left-0 lg:right-0 lg:top-[0.4375rem] lg:h-px lg:w-auto lg:bg-gradient-to-r"
      />

      <ol className="relative grid gap-10 lg:grid-cols-7 lg:gap-5">
        {PROCESS_STEPS.map((step, index) => (
          <Reveal
            as="li"
            key={step.id}
            delay={index * 70}
            className="group relative pl-8 lg:pl-0 lg:pt-10"
          >
            {/* Node */}
            <span
              aria-hidden
              className="absolute left-0 top-0.5 flex size-3.5 items-center justify-center lg:left-0 lg:top-0"
            >
              <span className="absolute size-3.5 rounded-full border border-steel bg-void" />
              <span className="relative size-1.5 rounded-full bg-steel-bright transition-colors duration-500 group-hover:bg-signal" />
            </span>

            <span className="mono-label text-ash-deep transition-colors duration-500 group-hover:text-signal">
              {step.number}
            </span>
            <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-bone">
              {step.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ash">{step.body}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
