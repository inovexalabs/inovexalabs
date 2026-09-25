import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

/**
 * Client work. Metrics are only rendered when the project record carries
 * verified values — the card never manufactures a number to look impressive.
 */
export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const verifiedMetrics = (project.metrics ?? []).filter(
    (m) => Boolean(m.label?.trim() && m.value?.trim()),
  );

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("panel panel-interactive group flex h-full flex-col overflow-hidden", className)}
    >
      {project.cover_image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-steel bg-graphite">
          <Image
            src={project.cover_image_url}
            alt={`${project.name}${project.client_name ? ` for ${project.client_name}` : ""}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {project.industry ? (
            <span className="mono-label text-signal">{project.industry}</span>
          ) : null}
          {project.delivered_on ? (
            <span className="mono-label text-ash-deep">
              {new Date(project.delivered_on).getFullYear()}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-medium tracking-tight text-bone">
              {project.name}
            </h3>
            {project.client_name ? (
              <p className="mt-1 text-sm text-ash">with {project.client_name}</p>
            ) : null}
          </div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-ash-deep transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ash">{project.summary}</p>

        {verifiedMetrics.length > 0 ? (
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-steel pt-5">
            {verifiedMetrics.slice(0, 2).map((metric) => (
              <div key={`${metric.label}-${metric.value}`}>
                <dt className="mono-label text-ash-deep">{metric.label}</dt>
                <dd className="mt-1 font-display text-lg tracking-tight text-bone">{metric.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {project.technologies?.length ? (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
            {project.technologies.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="rounded border border-steel bg-carbon px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ash"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
