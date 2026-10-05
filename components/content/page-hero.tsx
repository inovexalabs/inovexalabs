import type { ReactNode } from "react";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Section } from "@/components/layout/section";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/navigation/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";

export interface PageHeroProps {
  /** id of the page heading, used as the landmark name. */
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  /** Right-hand actions, e.g. a filter or a "Start a Project" button. */
  actions?: ReactNode;
}

/**
 * Shared opening section for the list pages: breadcrumbs, title and summary.
 * Bottom padding is kept small because the section after it always opens with
 * its own top spacing; full padding on both doubled the gap.
 */
export function PageHero({ id, eyebrow, title, description, breadcrumbs, actions }: PageHeroProps) {
  return (
    <Section
      underHeader
      spacing="md"
      container="wide"
      labelledBy={id}
      className="overflow-hidden hero-wash pb-6 sm:pb-8"
      background={
        <>
          <div aria-hidden="true" className="absolute inset-0 grid-lines" />
          <GlowOrb color="violet" size="lg" intensity="soft" className="-right-32 -top-40" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-bg" />
        </>
      }
    >
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-10">
        <SectionHeading
          id={id}
          level={1}
          size="lg"
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={actions}
        />
      </div>
    </Section>
  );
}
