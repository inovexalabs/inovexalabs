import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/cards/service-icon";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

export function ServiceCard({
  service,
  className,
  index,
}: {
  service: Service;
  className?: string;
  index?: number;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "panel panel-interactive group flex h-full flex-col p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl border border-steel bg-graphite text-bone-dim transition-colors duration-500 group-hover:border-signal/40 group-hover:text-signal">
          <ServiceIcon name={service.icon} />
        </span>
        {typeof index === "number" ? (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ash-deep">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <h3 className="mt-6 font-display text-lg font-medium tracking-tight text-bone">
        {service.title}
      </h3>
      {service.tagline ? (
        <p className="mt-1.5 text-sm text-signal/90">{service.tagline}</p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-ash">{service.summary}</p>

      <span className="mt-auto flex items-center gap-2 pt-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ash-deep transition-colors duration-500 group-hover:text-signal">
        Explore
        <ArrowRight className="size-3 transition-transform duration-400 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
