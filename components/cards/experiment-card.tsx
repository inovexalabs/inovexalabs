import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getInnovationIcon, LAB_STAGES } from "@/lib/constants/innovation";
import { ROUTES } from "@/lib/constants/routes";
import type { ExperimentSummary } from "@/lib/supabase/queries/innovation";

interface ExperimentCardProps {
  experiment: ExperimentSummary;
  variant?: "surface" | "glass";
  headingLevel?: "h2" | "h3";
}

/** Innovation Lab card: stage badge, category, title, description, technologies. */
export function ExperimentCard({ experiment, variant = "surface", headingLevel = "h3" }: ExperimentCardProps) {
  const Icon = getInnovationIcon(experiment.category);
  const stage = LAB_STAGES[experiment.stage];

  return (
    <Card
      as="article"
      variant={variant === "glass" ? "glass" : "surface"}
      padding="none"
      radius="xl"
      interactive
      className="group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {experiment.image ? (
          <Image
            src={experiment.image.url}
            alt={experiment.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 navy-gradient">
            <div className="absolute inset-0 grid-lines" />
            <span className="absolute inset-0 grid place-items-center text-lilac-300/70">
              <Icon className="size-14" />
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant={stage?.variant ?? "neutral"} dot>
            {stage?.label ?? experiment.stageLabel}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-accent">{experiment.categoryLabel}</p>
        <CardTitle as={headingLevel} href={ROUTES.innovationItem(experiment.slug)} className="mt-2">
          {experiment.title}
        </CardTitle>
        <CardDescription className="flex-1">{experiment.description}</CardDescription>

        {experiment.technologies.length > 0 ? (
          <ul aria-label="Technologies used" className="mt-4 flex flex-wrap gap-1.5">
            {experiment.technologies.slice(0, 4).map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-fg-muted"
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}

        <span aria-hidden="true" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Learn more
          <ArrowUpRight className="size-4 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Card>
  );
}
