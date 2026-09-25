import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabGraph } from "@/components/lab/lab-graph";
import { getHero } from "@/lib/queries/content";
import { getLabMetrics, visibleMetrics } from "@/lib/queries/metrics";

export async function Hero() {
  const [hero, metrics] = await Promise.all([getHero(), getLabMetrics()]);
  const stats = visibleMetrics(metrics).slice(0, 3);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24 lg:pt-40">
      {/* Atmosphere: a grid that fades out, plus a controlled signal glow. */}
      <div aria-hidden className="lab-grid lab-grid-mask pointer-events-none absolute inset-0 opacity-80" />
      <div aria-hidden className="lab-vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[86rem] edge-x">
        <div className="grid items-center gap-14 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-20">
          <div>
            <p
              className="hero-in mono-label flex flex-wrap items-center gap-2.5 text-signal"
              style={{ animationDelay: "60ms" }}
            >
              <span aria-hidden className="inline-block size-1.5 animate-pulse-dot rounded-full bg-signal" />
              {hero.eyebrow}
            </p>

            <h1 className="display-xl mt-7 text-bone">
              <span className="hero-in block" style={{ animationDelay: "140ms" }}>
                {hero.headlineLine1}
              </span>
              <span
                className="hero-in block text-bone-dim"
                style={{ animationDelay: "220ms" }}
              >
                {hero.headlineLine2}
              </span>
            </h1>

            <p
              className="hero-in mt-7 max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg"
              style={{ animationDelay: "300ms" }}
            >
              {hero.supporting}
            </p>

            <div
              className="hero-in mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "380ms" }}
            >
              <Button asChild size="lg">
                <Link href={hero.primaryCtaHref}>
                  {hero.primaryCtaLabel}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={hero.secondaryCtaHref}>
                  {hero.secondaryCtaLabel}
                  <MoveRight className="transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Metrics are counted from real records; anything unsupported is absent. */}
            {stats.length > 0 ? (
              <dl
                className="hero-in mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-steel pt-7"
                style={{ animationDelay: "460ms" }}
              >
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-mono text-2xl tabular-nums text-bone">
                      {String(stat.value).padStart(2, "0")}
                    </dd>
                    <dt className="mono-label mt-2 text-ash-deep">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            ) : (
              <p
                className="hero-in mt-12 max-w-lg border-t border-steel pt-7 text-sm leading-relaxed text-ash-deep"
                style={{ animationDelay: "460ms" }}
              >
                We are early, and we would rather show you real work than a wall of
                numbers. What exists is on this site, with its current status attached.
              </p>
            )}
          </div>

          <div className="hero-in" style={{ animationDelay: "260ms" }}>
            <LabGraph />
          </div>
        </div>
      </div>
    </section>
  );
}
