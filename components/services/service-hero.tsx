import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { GlowOrb } from "@/components/animations/glow-orb";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ROUTES } from "@/lib/constants/routes";
import { getServiceIcon } from "@/lib/constants/service-icons";
import type { ServiceDetail } from "@/lib/supabase/queries/services";

interface ServiceHeroProps {
  service: ServiceDetail;
  /** In-page anchor for the secondary button, when the Process section exists. */
  processAnchor: string | null;
}

export function ServiceHero({ service, processAnchor }: ServiceHeroProps) {
  const Icon = getServiceIcon(service.icon);

  return (
    <Section
      underHeader
      spacing="md"
      container="wide"
      labelledBy="service-title"
      className="overflow-hidden hero-wash"
      background={
        <>
          <div className="absolute inset-0 grid-lines" />
          <GlowOrb color="violet" size="lg" intensity="soft" className="-right-32 -top-48" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-bg" />
        </>
      }
    >
      <Breadcrumbs
        items={[
          { name: "Home", path: ROUTES.home },
          { name: "Services", path: ROUTES.services },
          { name: service.title, path: ROUTES.service(service.slug) },
        ]}
      />

      <div className="mt-10 grid items-center gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <span
            aria-hidden="true"
            className="grid size-14 place-items-center rounded-xl border border-iris-500/15 bg-surface text-iris-600 shadow-md"
          >
            <Icon className="size-6.5" />
          </span>
          <h1 id="service-title" className="mt-6 font-display text-h1 text-fg">
            {service.title}
          </h1>
          <p className="mt-5 max-w-[38rem] text-lead text-fg-muted">{service.summary}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticButton
              href={service.cta.href}
              external={service.cta.href.startsWith("https://")}
              size="lg"
              className="group/cta"
            >
              {service.cta.label}
              <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
            </MagneticButton>
            {processAnchor ? (
              <ButtonLink href={processAnchor} variant="outline" size="lg" className="bg-surface/60">
                See how we work
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-5">
          {service.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
              <Image
                src={service.image.url}
                alt={service.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <ServiceEmblem icon={service.icon} />
          )}
        </div>
      </div>
    </Section>
  );
}

/** Decorative stand-in when a service has no image: the service icon in a dark instrument panel. */
function ServiceEmblem({ icon }: { icon: string }) {
  const Icon = getServiceIcon(icon);

  return (
    <div
      aria-hidden="true"
      data-tone="dark"
      className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl navy-gradient shadow-xl"
    >
      <div className="absolute inset-0 grid-lines" />
      <div className="absolute size-72 rounded-full bg-[radial-gradient(closest-side,rgb(115_87_217/0.4),transparent)]" />
      <span className="absolute size-56 rounded-full border border-dashed border-lilac-300/25 motion-safe:animate-spin-slow" />
      <span className="absolute size-40 rounded-full border border-electric-300/20" />
      <span className="relative grid size-24 place-items-center rounded-2xl border border-lilac-300/30 bg-navy-900/80 text-lilac-300 shadow-glow-purple">
        <Icon className="size-10" />
      </span>
    </div>
  );
}
