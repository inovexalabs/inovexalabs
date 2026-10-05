import { Link2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ResultsMetrics } from "@/components/content/results-metrics";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { getProjectResults } from "@/lib/supabase/queries/projects";
import Link from "next/link";

const HEADING_ID = "results-title";

/**
 * Case studies / results. Renders only the numbers an admin entered against a
 * project — when no project has measurable results yet, the section is hidden
 * rather than padded with claims.
 */
export async function ResultsSection() {
  const { data: results, error } = await getProjectResults(4);

  if (results !== null && results.length === 0) return null;

  return (
    <Section tone="muted" labelledBy={HEADING_ID} container="wide">
      <SectionHeading
        id={HEADING_ID}
        align="center"
        eyebrow="Case studies"
        title="Results, not adjectives"
        description="Figures below come straight from the projects they belong to. If a project has no measured outcome, nothing is shown for it."
      />

      {results === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <div className="mt-12 space-y-10 sm:mt-14">
          {results.map((project) => (
            <div key={project.slug}>
              <Link
                href={ROUTES.project(project.slug)}
                className="group inline-flex items-center gap-2 font-display text-h4 text-fg"
              >
                {project.title}
                <Link2 aria-hidden="true" className="size-4 text-accent transition-transform group-hover:rotate-45" />
              </Link>
              <ResultsMetrics metrics={project.metrics} className="mt-4" />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
