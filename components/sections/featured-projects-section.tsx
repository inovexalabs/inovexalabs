import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/cards/project-card";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { getFeaturedProjects } from "@/lib/supabase/queries/projects";

const HEADING_ID = "featured-projects-title";

/** Homepage portfolio: featured projects from Supabase. Hidden when none exist. */
export async function FeaturedProjectsSection() {
  const { data: projects, error } = await getFeaturedProjects(6);

  if (projects !== null && projects.length === 0) return null;

  return (
    <Section labelledBy={HEADING_ID} container="wide">
      <SectionHeading
        id={HEADING_ID}
        title="Selected work"
        description="Products we have designed, built and shipped with clients — each one started as a problem worth solving."
        actions={
          <ButtonLink href={ROUTES.projects} variant="outline" className="group/all">
            All projects
            <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-0.5" />
          </ButtonLink>
        }
      />

      {projects === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <ul role="list" className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} as="li" delay={(index % 3) * 0.08} className="flex">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  );
}
