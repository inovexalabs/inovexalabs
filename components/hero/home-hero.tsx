import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/animations/glow-orb";
import { HeroPointerGlow } from "@/components/hero/hero-pointer-glow";
import { HeroVisual } from "@/components/hero/hero-visual";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ROUTES } from "@/lib/constants/routes";
import { getServiceSummaries } from "@/lib/supabase/queries/services";
import { getSiteSettings, type SiteSettings } from "@/lib/supabase/queries/settings";
import { cn } from "@/lib/utils/cn";

const isExternal = (href: string) => href.startsWith("https://");

/** Home page hero. Copy comes from site_settings; the system map from published services. */
export async function HomeHero() {
  const [settingsResult, servicesResult] = await Promise.all([getSiteSettings(), getServiceSummaries()]);
  const mapServices = (servicesResult.data ?? []).map(({ slug, title, icon }) => ({ slug, title, icon }));

  return (
    <Section
      underHeader
      spacing="md"
      container="wide"
      labelledBy="hero-title"
      data-hero=""
      className="overflow-hidden hero-wash lg:flex lg:min-h-[min(100svh,62rem)] lg:items-center"
      background={
        <>
          <div className="absolute inset-0 grid-lines" />
          <GlowOrb color="blue" size="xl" intensity="soft" drift className="-left-72 -top-72" />
          <GlowOrb color="violet" size="lg" intensity="soft" drift className="-right-40 top-1/3 [animation-delay:-14s]" />
          <HeroPointerGlow />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-bg" />
        </>
      }
    >
      <div className="grid items-center gap-14 sm:gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          {settingsResult.data ? (
            <HeroCopy settings={settingsResult.data} />
          ) : (
            <HeroUnavailable message={settingsResult.error} />
          )}
        </div>
        <div className="lg:col-span-6">
          <HeroVisual services={mapServices} />
        </div>
      </div>
    </Section>
  );
}

function HeroCopy({ settings }: { settings: SiteSettings }) {
  const lines = settings.hero_headline
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <h1
        id="hero-title"
        className="font-display text-[clamp(2.5rem,1.45rem+4vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.04em] text-fg"
      >
        <span className="sr-only">{lines.join(" ")}</span>
        {lines.map((line, index) => (
          // Each line rises out of its own mask; the padding keeps descenders unclipped.
          <span key={`${index}-${line}`} aria-hidden="true" className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span
              className={cn("inline-block animate-rise-in", index > 0 && "gradient-text")}
              style={{ animationDelay: `${100 + index * 130}ms` }}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>

      <p
        className="mt-6 max-w-[34rem] animate-fade-up text-lead text-fg-muted sm:mt-8"
        style={{ animationDelay: "380ms" }}
      >
        {settings.hero_subheadline}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-10">
        <div className="animate-fade-up" style={{ animationDelay: "480ms" }}>
          <MagneticButton
            href={settings.hero_primary_cta_href}
            external={isExternal(settings.hero_primary_cta_href)}
            size="lg"
            className="group/cta"
          >
            {settings.hero_primary_cta_label}
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 ease-premium group-hover/cta:translate-x-0.5"
            />
          </MagneticButton>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "560ms" }}>
          <ButtonLink
            href={settings.hero_secondary_cta_href}
            external={isExternal(settings.hero_secondary_cta_href)}
            variant="outline"
            size="lg"
            className="bg-surface/60"
          >
            {settings.hero_secondary_cta_label}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}

function HeroUnavailable({ message }: { message: string }) {
  return (
    <div>
      <h1 id="hero-title" className="font-display text-h1 text-fg">
        Inovexa Labs
      </h1>
      <p className="mt-5 max-w-[34rem] text-lead text-fg-muted">
        {message} Refresh the page in a moment, or contact us directly.
      </p>
      <ButtonLink href={ROUTES.contact} size="lg" className="mt-8">
        Contact us
      </ButtonLink>
    </div>
  );
}
