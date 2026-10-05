import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";

/** Shared 404 body for unmatched URLs and for content that no longer exists. */
export function NotFoundContent() {
  return (
    <Section underHeader spacing="lg" container="narrow" labelledBy="not-found-title" className="hero-wash">
      <p className="font-display text-sm font-semibold tabular-nums text-accent">404</p>
      <SectionHeading
        id="not-found-title"
        level={1}
        size="lg"
        title="This page doesn't exist"
        description="The link may be out of date, or the page has moved. Try one of these instead."
        className="mt-3"
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.home} size="lg">
          Go to the home page
        </ButtonLink>
        <ButtonLink href={ROUTES.services} variant="outline" size="lg">
          Browse services
        </ButtonLink>
      </div>
    </Section>
  );
}
