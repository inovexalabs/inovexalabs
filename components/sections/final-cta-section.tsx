import { ArrowRight } from "lucide-react";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ROUTES } from "@/lib/constants/routes";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

const HEADING_ID = "final-cta-title";
const isExternal = (href: string) => href.startsWith("https://");

/**
 * Closing homepage CTA. Copy comes from site_settings so it can be rewritten
 * without a deploy; the fallbacks mirror the column defaults in the database.
 */
export async function FinalCtaSection() {
  const { data: settings } = await getSiteSettings();

  const title = settings?.final_cta_title ?? "Have an idea?";
  const description =
    settings?.final_cta_description ??
    "Tell us what you are building. We will reply within two working days with next steps.";
  const label = settings?.final_cta_label ?? "Start a Project";
  const href = settings?.final_cta_href ?? ROUTES.contact;

  return (
    <Section
      tone="dark"
      labelledBy={HEADING_ID}
      spacing="lg"
      container="narrow"
      className="overflow-hidden text-center"
      background={
        <>
          <div aria-hidden="true" className="absolute inset-0 grid-lines" />
          <GlowOrb color="blue" size="xl" intensity="soft" drift className="-left-64 top-0" />
          <GlowOrb color="violet" size="lg" intensity="soft" drift className="-right-40 -bottom-40 [animation-delay:-12s]" />
        </>
      }
    >
      <h2 id={HEADING_ID} className="font-display text-h1 text-fg">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-reading text-lead text-fg-muted">{description}</p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <MagneticButton href={href} external={isExternal(href)} size="lg" className="group/cta">
          {label}
          <ArrowRight aria-hidden="true" className="transition-transform duration-300 ease-premium group-hover/cta:translate-x-0.5" />
        </MagneticButton>
        <ButtonLink href={ROUTES.projects} variant="outline" size="lg" className="bg-surface/60">
          Explore our work
        </ButtonLink>
      </div>
    </Section>
  );
}
