import { ArrowRight, CircleCheck, Gauge, Plus, Target, type LucideIcon } from "lucide-react";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Section, type SectionTone } from "@/components/layout/section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatIndex } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { FaqItem, TitledItem } from "@/lib/validations/service";

/* Every section renders only with content; the page decides order and tone. */

export function ServiceOverview({ id, paragraphs }: { id: string; paragraphs: string[] }) {
  const headingId = `${id}-title`;
  return (
    <Section id={id} labelledBy={headingId} container="wide">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <SectionHeading id={headingId} title="Overview" className="lg:col-span-4" />
        <div className="space-y-5 lg:col-span-8">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 48)}
              className={cn("max-w-[44rem] text-lg leading-relaxed", index === 0 ? "text-fg" : "text-fg-muted")}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

const MARKERS: Record<"problem" | "capability" | "outcome", { icon: LucideIcon; tile: string }> = {
  problem: { icon: Target, tile: "bg-amber-500/10 text-amber-700" },
  capability: { icon: CircleCheck, tile: "brand-gradient-soft text-iris-600" },
  outcome: { icon: Gauge, tile: "bg-emerald-500/10 text-emerald-700" },
};

interface ServiceItemGridProps {
  id: string;
  title: string;
  items: TitledItem[];
  marker: keyof typeof MARKERS;
  tone?: SectionTone;
}

/** Problems, capabilities and outcomes: a grid of titled items with a section-specific marker. */
export function ServiceItemGrid({ id, title, items, marker, tone = "light" }: ServiceItemGridProps) {
  const headingId = `${id}-title`;
  const { icon: Icon, tile } = MARKERS[marker];

  return (
    <Section id={id} tone={tone} labelledBy={headingId} container="wide">
      <SectionHeading id={headingId} title={title} />
      <ul
        role="list"
        className={cn(
          "mt-10 grid gap-4 sm:mt-12 md:grid-cols-2",
          items.length % 3 === 0 || items.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        )}
      >
        {items.map((item) => (
          <li key={item.title} className="flex gap-4 rounded-xl border border-line bg-surface p-6 shadow-xs">
            <span aria-hidden="true" className={cn("grid size-10 shrink-0 place-items-center rounded-lg", tile)}>
              <Icon className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-h4 text-fg">{item.title}</h3>
              <p className="mt-2 text-fg-muted">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceTechnologies({ id, technologies }: { id: string; technologies: string[] }) {
  const headingId = `${id}-title`;
  return (
    <Section
      id={id}
      tone="dark"
      labelledBy={headingId}
      container="wide"
      background={<div className="absolute inset-0 grid-lines" />}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <SectionHeading id={headingId} title="Technologies" className="lg:col-span-4" />
        <ul role="list" aria-labelledby={headingId} className="flex flex-wrap content-start gap-2.5 lg:col-span-8">
          {technologies.map((technology) => (
            <li
              key={technology}
              className="glass inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium text-fg"
            >
              {technology}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

const PROCESS_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/** Numbered steps; on desktop a connector runs between steps within each row of four. */
export function ServiceProcess({ id, steps }: { id: string; steps: TitledItem[] }) {
  const headingId = `${id}-title`;
  const columns = Math.min(steps.length, 4);

  return (
    <Section id={id} labelledBy={headingId} container="wide">
      <SectionHeading id={headingId} title="Process" />
      <ol className={cn("mt-10 grid gap-8 sm:mt-12 md:grid-cols-2 lg:gap-6", PROCESS_COLUMNS[columns])}>
        {steps.map((step, index) => {
          const lastInRow = (index + 1) % columns === 0 || index === steps.length - 1;
          return (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-4">
                <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-iris-500/25 bg-surface font-display text-sm font-semibold tabular-nums text-iris-700 shadow-sm">
                  <span className="sr-only">Step </span>
                  {formatIndex(index)}
                </span>
                {!lastInRow ? (
                  <span aria-hidden="true" className="hidden h-px flex-1 bg-linear-to-r from-iris-500/40 to-line lg:block" />
                ) : null}
              </div>
              <h3 className="mt-5 font-display text-h4 text-fg">{step.title}</h3>
              <p className="mt-2 text-fg-muted">{step.description}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/** Native <details> accordion: works without JavaScript and with the keyboard. */
export function ServiceFaq({ id, faqs }: { id: string; faqs: FaqItem[] }) {
  const headingId = `${id}-title`;
  return (
    <Section id={id} labelledBy={headingId} container="wide">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <SectionHeading id={headingId} title="FAQ" className="lg:col-span-4" />
        <div className="divide-y divide-line border-y border-line lg:col-span-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-xs py-5 text-left font-display text-h4 text-fg [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-fg-muted transition-transform duration-300 ease-premium group-open:rotate-45"
                >
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="max-w-[44rem] pb-6 pr-14 text-fg-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

interface ServiceCtaProps {
  id: string;
  cta: { title: string; description: string; label: string; href: string };
}

export function ServiceCta({ id, cta }: ServiceCtaProps) {
  const headingId = `${id}-title`;
  return (
    <Section
      id={id}
      tone="dark"
      labelledBy={headingId}
      spacing="lg"
      container="narrow"
      className="overflow-hidden text-center"
      background={
        <>
          <div className="absolute inset-0 grid-lines" />
          <GlowOrb color="blue" size="xl" intensity="soft" drift className="-left-60 top-0" />
          <GlowOrb color="violet" size="lg" intensity="soft" drift className="-right-40 -bottom-40 [animation-delay:-12s]" />
        </>
      }
    >
      <h2 id={headingId} className="font-display text-h2 text-fg">
        {cta.title}
      </h2>
      <p className="mx-auto mt-5 max-w-reading text-lead text-fg-muted">{cta.description}</p>
      <div className="mt-10 flex justify-center">
        <MagneticButton href={cta.href} external={cta.href.startsWith("https://")} size="lg" className="group/cta">
          {cta.label}
          <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
        </MagneticButton>
      </div>
    </Section>
  );
}
