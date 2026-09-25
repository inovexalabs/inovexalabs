import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Eyebrow, Section } from "@/components/site/section";

/**
 * The single most important explanation on the site: there are two engines.
 *
 * They are drawn as one connected system — a shared bus across the top and a
 * coupling in the middle — because in practice they feed each other: lab
 * research becomes client capability, and client work surfaces new experiments.
 */
const ENGINES = [
  {
    number: "01",
    title: "Custom Software",
    promise: "Your idea. Your problem. Our engineering.",
    body: "We work with businesses, startups, organisations and individuals to turn a specific problem into software that holds up in production.",
    capabilities: [
      "Web applications",
      "SaaS platforms",
      "Business systems",
      "Mobile applications",
      "AI solutions",
      "Automation",
      "APIs & backend systems",
      "E-commerce",
    ],
    cta: { label: "Build With Us", href: "/services" },
    tone: "signal" as const,
  },
  {
    number: "02",
    title: "Product Lab",
    promise: "We don't only build for clients. We build for ourselves.",
    body: "We research, experiment, build and launch our own software products — the ideas we choose to own rather than hand over.",
    capabilities: [
      "Product experiments",
      "Internal tools",
      "SaaS ideas",
      "AI experiments",
      "New technology",
      "Products in development",
    ],
    cta: { label: "Explore Our Lab", href: "/lab" },
    tone: "plasma" as const,
  },
];

export function TwoEngines() {
  return (
    <Section id="two-engines" className="relative">
      <div className="max-w-3xl">
        <Eyebrow>Two engines, one system</Eyebrow>
        <h2 className="display-lg mt-5 text-bone">Two ways we create impact.</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">
          Most software companies have one engine. We run two, and they are wired
          together — research from the lab becomes capability for clients, and client
          work tells us what to research next.
        </p>
      </div>

      {/* The bus: both engines hang off the same system. */}
      <div aria-hidden className="relative mt-14 hidden lg:block">
        <div className="hairline" />
        <div className="absolute inset-0 flex justify-center">
          <span className="mono-label -mt-2.5 bg-void px-4 text-ash-deep">
            shared engineering core
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
        {ENGINES.map((engine, index) => (
          <Reveal key={engine.number} delay={index * 110}>
            <article
              className="panel group relative flex h-full flex-col overflow-hidden p-7 sm:p-9"
            >
              <div
                aria-hidden
                className={
                  engine.tone === "signal"
                    ? "pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-signal/[0.055] blur-2xl"
                    : "pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-plasma/[0.06] blur-2xl"
                }
              />

              <div className="relative flex items-center justify-between gap-4">
                <span
                  className={
                    engine.tone === "signal"
                      ? "mono-label text-signal"
                      : "mono-label text-plasma"
                  }
                >
                  Engine {engine.number}
                </span>
                <span aria-hidden className="font-mono text-[0.625rem] tracking-[0.2em] text-ash-deep">
                  {engine.number === "01" ? "/client" : "/lab"}
                </span>
              </div>

              <h3 className="relative mt-7 font-display text-3xl font-medium tracking-tight text-bone sm:text-4xl">
                {engine.title}
              </h3>

              <p
                className={
                  engine.tone === "signal"
                    ? "relative mt-4 font-display text-lg leading-snug tracking-tight text-signal/90"
                    : "relative mt-4 font-display text-lg leading-snug tracking-tight text-plasma/90"
                }
              >
                {engine.promise}
              </p>

              <p className="relative mt-5 text-sm leading-relaxed text-bone-dim">{engine.body}</p>

              <ul className="relative mt-7 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {engine.capabilities.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5 text-sm text-ash">
                    <span
                      aria-hidden
                      className={
                        engine.tone === "signal"
                          ? "mt-1.5 size-1 shrink-0 rounded-full bg-signal/70"
                          : "mt-1.5 size-1 shrink-0 rounded-full bg-plasma/70"
                      }
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={engine.cta.href}
                className="relative mt-9 inline-flex w-fit items-center gap-2 rounded-full border border-steel px-5 py-2.5 text-sm font-medium text-bone transition-colors duration-400 hover:border-signal/55 hover:bg-signal/[0.06]"
              >
                {engine.cta.label}
                <ArrowRight className="size-3.5 transition-transform duration-400 group-hover:translate-x-1" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>

      {/* The coupling between the two engines. */}
      <div className="mt-8 flex items-center justify-center gap-4 lg:mt-10">
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-steel" />
        <span className="mono-label flex items-center gap-2.5 rounded-full border border-steel bg-carbon px-4 py-2 text-ash">
          <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-signal" />
          one team · two directions
        </span>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-steel" />
      </div>
    </Section>
  );
}
