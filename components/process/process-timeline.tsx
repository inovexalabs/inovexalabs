"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/animations/reveal";
import { getProcessIcon } from "@/lib/constants/process-icons";
import { cn } from "@/lib/utils/cn";
import { formatIndex } from "@/lib/utils/format";
import type { ProcessStep } from "@/lib/supabase/queries/process";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

/**
 * "How We Work" timeline.
 *
 * Desktop: a horizontal rail whose path draws once as it enters the viewport;
 * selecting a step highlights its node and shows the detail panel beneath.
 * Mobile: the same steps as a vertical rail with the detail inline.
 *
 * Entrance animations run once per element (no continuous loops), and every
 * step is a real <button>, so the timeline is fully keyboard operable.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const [active, setActive] = useState(0);
  const current = steps[Math.min(active, steps.length - 1)];

  if (!current) return null;

  const select = (index: number) => setActive(index);

  return (
    <div className="mt-12 sm:mt-16">
      {/* Desktop: horizontal rail + shared detail panel */}
      <div className="hidden lg:block">
        <div className="relative">
          <div aria-hidden="true" className="absolute left-0 right-0 top-7 h-px overflow-hidden">
            <motion.span
              className="block h-full w-full origin-left bg-linear-to-r from-electric-500/60 via-iris-500/60 to-lilac-400/60"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <ol className="relative grid grid-cols-7 gap-4">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.slug} delay={index * 0.06}>
                <StepButton step={step} index={index} active={index === active} onSelect={select} />
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <StepDetail step={current} />
        </div>
      </div>

      {/* Mobile: vertical rail with inline detail */}
      <div className="lg:hidden">
        <ol className="relative space-y-3 border-l border-line pl-6 sm:pl-8">
          {steps.map((step, index) => {
            const isActive = index === active;
            const Icon = getProcessIcon(step.icon);
            return (
              <Reveal as="li" key={step.slug} delay={index * 0.05} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-[1.68rem] top-5 grid size-9 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors duration-300 sm:-left-[2.18rem]",
                    isActive
                      ? "border-transparent brand-gradient text-white shadow-glow-purple"
                      : "border-line-strong bg-surface text-fg-muted",
                  )}
                >
                  {formatIndex(index)}
                </span>

                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-expanded={isActive}
                  aria-controls={`process-detail-${step.slug}`}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-[border-color,box-shadow,background-color] duration-300 ease-premium sm:p-5",
                    isActive ? "border-iris-500/40 bg-surface shadow-md" : "border-line bg-surface/60 hover:bg-surface",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-lg border transition-colors",
                        isActive ? "border-iris-500/25 brand-gradient-soft text-iris-700" : "border-line text-fg-muted",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-h4 text-fg">{step.title}</span>
                      <span className="mt-0.5 block text-sm text-fg-muted">{step.short_description}</span>
                    </span>
                  </span>
                </button>

                {isActive ? (
                  <div id={`process-detail-${step.slug}`} className="mt-3 rounded-xl border border-line bg-surface p-5">
                    <StepDetail step={step} compact />
                  </div>
                ) : null}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

interface StepButtonProps {
  step: ProcessStep;
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
}

function StepButton({ step, index, active, onSelect }: StepButtonProps) {
  const Icon = getProcessIcon(step.icon);

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-pressed={active}
      className="group flex w-full flex-col items-center gap-3 rounded-xl px-2 py-3 text-center transition-colors duration-300"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative grid size-14 place-items-center rounded-full border transition-[background-color,border-color,box-shadow,transform] duration-300 ease-premium",
          active
            ? "border-transparent brand-gradient text-white shadow-glow-brand"
            : "border-line-strong bg-surface text-fg-muted group-hover:-translate-y-0.5 group-hover:border-iris-500/40 group-hover:text-iris-700",
        )}
      >
        <Icon className="size-5.5" />
        <span
          className={cn(
            "absolute -top-2 -right-1 grid size-6 place-items-center rounded-full border border-line bg-surface text-[0.6875rem] font-semibold tabular-nums text-fg-muted",
            active && "border-iris-500/40 text-iris-700",
          )}
        >
          {formatIndex(index)}
        </span>
      </span>
      <span
        className={cn(
          "font-display text-sm font-semibold leading-tight transition-colors",
          active ? "text-fg" : "text-fg-muted group-hover:text-fg",
        )}
      >
        {step.title}
      </span>
      {step.duration ? <span className="text-xs text-fg-subtle">{step.duration}</span> : null}
    </button>
  );
}

/**
 * Long-form content for whichever step is selected. `compact` drops the icon
 * and title on mobile, where the step's own button already shows them.
 */
function StepDetail({ step, compact = false }: { step: ProcessStep; compact?: boolean }) {
  const Icon = getProcessIcon(step.icon);

  return (
    <div>
      {compact ? (
        step.duration ? (
          <span className="inline-flex rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-medium text-fg-muted">
            {step.duration}
          </span>
        ) : null
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-iris-500/15 brand-gradient-soft text-iris-700"
          >
            <Icon className="size-5" />
          </span>
          <h3 className="font-display text-h3 text-fg">{step.title}</h3>
          {step.duration ? (
            <span className="rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-medium text-fg-muted">
              {step.duration}
            </span>
          ) : null}
        </div>
      )}

      <p className={cn("max-w-[52rem] text-fg-muted", compact && !step.duration ? "" : "mt-4")}>{step.description}</p>

      {step.deliverables.length > 0 ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-fg">What you get</p>
          <ul role="list" className="mt-2.5 flex flex-wrap gap-2">
            {step.deliverables.map((deliverable) => (
              <li
                key={deliverable}
                className="rounded-full border border-line bg-surface-muted px-3 py-1.5 text-sm text-fg-muted"
              >
                {deliverable}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
