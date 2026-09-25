import { Briefcase } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/cards/project-card";
import { Reveal } from "@/components/site/reveal";
import { getFeaturedProjects, getProjects } from "@/lib/queries/content";

export async function WorkSection() {
  const [featured, all] = await Promise.all([getFeaturedProjects(), getProjects()]);
  const projects = featured.length > 0 ? featured : all.slice(0, 4);

  return (
    <Section id="work" bordered>
      <SectionHeading
        eyebrow="Built with our clients"
        title="Real systems, in production."
        lede="Client work published with the problem, the approach and what actually shipped. Where a project has verified results we show them; where it does not, we show the work and leave the numbers out."
        action={{ label: "All client work", href: "/work" }}
      />

      <div className="mt-14">
        {projects.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="size-5" />}
            title="Your success story could be next."
            body="We publish client work only with permission and only with accurate detail. This section fills up as projects reach production and our clients agree to be named — we would rather show nothing than a borrowed logo."
            action={{ label: "Talk about your project", href: "/contact" }}
          />
        )}
      </div>
    </Section>
  );
}
