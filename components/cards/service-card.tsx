import { ArrowUpRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { ROUTES } from "@/lib/constants/routes";
import { getServiceIcon } from "@/lib/constants/service-icons";
import type { ServiceSummary } from "@/lib/supabase/queries/services";
import { cn } from "@/lib/utils/cn";

interface ServiceCardProps {
  service: ServiceSummary;
  /** `glass` for dark sections, `surface` for light ones. */
  variant?: "surface" | "glass";
  headingLevel?: "h2" | "h3";
}

/** Summary card; the whole card is one link to /services/[slug]. */
export function ServiceCard({ service, variant = "surface", headingLevel = "h3" }: ServiceCardProps) {
  const Icon = getServiceIcon(service.icon);

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-lg border transition-colors duration-300",
          variant === "glass"
            ? "border-lilac-300/20 bg-iris-500/15 text-lilac-300 group-hover:text-electric-300"
            : "border-iris-500/15 brand-gradient-soft text-iris-600 group-hover:text-electric-600",
        )}
      >
        <Icon className="size-5.5" />
      </span>
      <CardTitle as={headingLevel} href={ROUTES.service(service.slug)} className="mt-6">
        {service.title}
      </CardTitle>
      <CardDescription className="flex-1">{service.summary}</CardDescription>
      <span aria-hidden="true" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Explore service
        <ArrowUpRight className="size-4 transition-transform duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </>
  );

  return variant === "glass" ? (
    <GlassCard as="article" interactive padding="lg" className="group flex h-full flex-col">
      {content}
    </GlassCard>
  ) : (
    <Card as="article" interactive padding="lg" radius="xl" className="group flex h-full flex-col">
      {content}
    </Card>
  );
}
