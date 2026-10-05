import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { TechnologyGrid } from "@/components/technology/technology-grid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { getTechnologyGroups } from "@/lib/supabase/queries/technologies";

const HEADING_ID = "tech-stack-title";

/** Homepage technology ecosystem. Only admin-published technologies appear. */
export async function TechStackSection() {
  const { data: groups, error } = await getTechnologyGroups();

  if (groups !== null && groups.length === 0) return null;

  return (
    <Section labelledBy={HEADING_ID} container="wide">
      <SectionHeading
        id={HEADING_ID}
        title="Technology we work with"
        description="A deliberately small, well-understood stack. We add a technology to this list only when we have shipped something with it."
        actions={
          <ButtonLink href={ROUTES.about} variant="ghost" className="group/all">
            How we build
            <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-0.5" />
          </ButtonLink>
        }
      />

      {groups === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <TechnologyGrid groups={groups} />
      )}
    </Section>
  );
}
