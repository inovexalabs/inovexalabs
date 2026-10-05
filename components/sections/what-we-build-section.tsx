import { PauseOffscreen } from "@/components/animations/pause-offscreen";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { CapabilityVisual } from "@/components/sections/capability-visual";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCapabilities } from "@/lib/supabase/queries/capabilities";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { cn } from "@/lib/utils/cn";

const HEADING_ID = "what-we-build-title";

/**
 * Desktop rhythm: rows alternate wide/narrow (7+5, then 5+7). A trailing odd
 * item spans the full row; on tablets it spans both columns.
 */
function spanClasses(index: number, total: number): string {
  const lastAndAlone = index === total - 1 && index % 2 === 0;
  if (lastAndAlone) return "md:col-span-2 lg:col-span-12";
  const wideFirstRow = Math.floor(index / 2) % 2 === 0;
  const isFirstInRow = index % 2 === 0;
  return isFirstInRow === wideFirstRow ? "lg:col-span-7" : "lg:col-span-5";
}

/** "What We Build": company statement plus the numbered capabilities, all admin-editable. */
export async function WhatWeBuildSection() {
  const [capabilitiesResult, settingsResult] = await Promise.all([getCapabilities(), getSiteSettings()]);
  const capabilities = capabilitiesResult.data;
  const statement = settingsResult.data?.studio_statement ?? null;

  // Nothing published yet: the section stays hidden rather than showing an empty heading.
  if (capabilities !== null && capabilities.length === 0) return null;

  return (
    <Section labelledBy={HEADING_ID} container="wide" className="pt-section-sm">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <SectionHeading id={HEADING_ID} title="What We Build" className="lg:col-span-5" />
        {statement ? (
          <Reveal className="lg:col-span-7">
            <p className="max-w-[40rem] font-display text-[clamp(1.25rem,1.05rem+0.9vw,1.875rem)] font-medium leading-[1.3] tracking-[-0.018em] text-fg">
              {statement}
            </p>
          </Reveal>
        ) : null}
      </div>

      {capabilities === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {capabilitiesResult.error} Refresh the page to try again.
        </p>
      ) : (
        // role="list" keeps list semantics in Safari, which drops them when list-style is removed.
        <PauseOffscreen as="ol" role="list" className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-12">
          {capabilities.map((capability, index) => (
            <Reveal
              key={capability.slug}
              as="li"
              delay={(index % 2) * 0.1}
              className={cn("flex", spanClasses(index, capabilities.length))}
            >
              <Card
                as="article"
                id={`capability-${capability.slug}`}
                aria-labelledby={`capability-${capability.slug}-title`}
                padding="none"
                radius="xl"
                className="flex w-full flex-col p-2"
              >
                <div className="flex flex-1 flex-col px-4 pb-5 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
                  <CardTitle id={`capability-${capability.slug}-title`} className="text-h3">
                    {capability.title}
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-reading">{capability.description}</CardDescription>
                </div>
                <CapabilityVisual
                  visual={capability.visual}
                  number={String(index + 1).padStart(2, "0")}
                  className="order-first"
                />
              </Card>
            </Reveal>
          ))}
        </PauseOffscreen>
      )}
    </Section>
  );
}
