import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { getServiceIcon } from "@/lib/constants/service-icons";
import { ROUTES } from "@/lib/constants/routes";
import type { ServiceSummary } from "@/lib/supabase/queries/services";
import { cn } from "@/lib/utils/cn";

interface SolutionsMenuProps {
  /** `null` when the services query failed. */
  services: ServiceSummary[] | null;
  variant: "panel" | "list";
}

/** Solutions content shared by the desktop mega menu (`panel`) and the mobile drawer (`list`). */
export function SolutionsMenu({ services, variant }: SolutionsMenuProps) {
  const body =
    services === null || services.length === 0 ? (
      <SolutionsFallback failed={services === null} variant={variant} />
    ) : variant === "panel" ? (
      <PanelList services={services} />
    ) : (
      <CompactList services={services} />
    );

  if (variant === "list") return body;

  return (
    <GlassCard strong padding="none" radius="2xl" className="overflow-hidden shadow-xl">
      <div className="p-3">{body}</div>
      <div className="flex flex-col gap-3 border-t border-line bg-surface-muted/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-fg-muted">Not sure which fits? We&apos;ll help you scope it.</p>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href={ROUTES.services} className="rounded-xs text-fg underline-offset-4 hover:underline">
            All services
          </Link>
          <Link href={ROUTES.contact} className="rounded-xs text-accent underline-offset-4 hover:underline">
            Talk to an engineer
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}

function PanelList({ services }: { services: ServiceSummary[] }) {
  return (
    <ul className="grid gap-1 md:grid-cols-2">
      {services.map((service) => {
        const Icon = getServiceIcon(service.icon);
        return (
          <li key={service.slug}>
            <Link
              href={ROUTES.service(service.slug)}
              className="group flex gap-4 rounded-lg p-3.5 transition-colors duration-200 hover:bg-fg/[0.04] focus-visible:bg-fg/[0.04]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-iris-500/15 brand-gradient-soft text-iris-600 transition-colors duration-200 group-hover:text-electric-600">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-fg">{service.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-sm text-fg-muted">{service.summary}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function CompactList({ services }: { services: ServiceSummary[] }) {
  return (
    <ul className="grid gap-0.5 pb-2">
      {services.map((service) => {
        const Icon = getServiceIcon(service.icon);
        return (
          <li key={service.slug}>
            <Link
              href={ROUTES.service(service.slug)}
              className="flex min-h-11 items-center gap-3 rounded-md px-2 py-2 text-fg transition-colors hover:bg-fg/[0.04]"
            >
              <Icon aria-hidden="true" className="size-4.5 shrink-0 text-iris-600" />
              {service.title}
            </Link>
          </li>
        );
      })}
      <li>
        <Link
          href={ROUTES.services}
          className="flex min-h-11 items-center rounded-md px-2 py-2 font-medium text-accent underline-offset-4 hover:underline"
        >
          All services
        </Link>
      </li>
    </ul>
  );
}

function SolutionsFallback({ failed, variant }: { failed: boolean; variant: "panel" | "list" }) {
  return (
    <div className={cn(variant === "panel" ? "px-4 py-6" : "px-2 pb-3 pt-1")}>
      <p className="font-medium text-fg">
        {failed ? "Solutions couldn't be loaded." : "No solutions are published yet."}
      </p>
      <p className="mt-1 text-sm text-fg-muted">
        {failed ? "Refresh the page, or " : "In the meantime, "}
        <Link href={ROUTES.contact} className="font-medium text-accent underline underline-offset-4">
          tell us what you&apos;re building
        </Link>
        .
      </p>
    </div>
  );
}
