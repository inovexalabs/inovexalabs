import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import type { ProjectSummary } from "@/lib/supabase/queries/projects";

interface ProjectCardProps {
  project: ProjectSummary;
  headingLevel?: "h2" | "h3";
}

/** Portfolio card: cover image, category, summary, technology badges. The whole card is one link. */
export function ProjectCard({ project, headingLevel = "h3" }: ProjectCardProps) {
  return (
    <Card as="article" padding="none" radius="xl" interactive className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        {project.image ? (
          <Image
            src={project.image.url}
            alt={project.image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 hero-wash">
            <div className="absolute inset-0 grid-lines" />
            <span className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(115_87_217/0.35),transparent)]" />
          </div>
        )}
        <div className="absolute left-4 top-4">
          <Badge variant="neutral" className="bg-surface/90 backdrop-blur">
            {project.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <CardTitle as={headingLevel} href={ROUTES.project(project.slug)}>
          {project.title}
        </CardTitle>
        <CardDescription className="flex-1">{project.short_description}</CardDescription>

        {project.technologies.length > 0 ? (
          <ul aria-label="Technologies used" className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-fg-muted"
              >
                {technology}
              </li>
            ))}
            {project.technologies.length > 4 ? (
              <li className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-fg-muted">
                +{project.technologies.length - 4}
              </li>
            ) : null}
          </ul>
        ) : null}

        <span aria-hidden="true" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          View case study
          <ArrowUpRight className="size-4 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Card>
  );
}
