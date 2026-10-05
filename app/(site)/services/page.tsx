import type { Metadata } from "next";
import { ServiceCard } from "@/components/cards/service-card";
import { ServiceCtaCard } from "@/components/cards/service-cta-card";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getServiceSummaries } from "@/lib/supabase/queries/services";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: services }, { data: settings }] = await Promise.all([getServiceSummaries(), getSiteSettings()]);
  const siteName = settings?.site_name ?? "Inovexa Labs";
  const titles = services?.map((service) => service.title) ?? [];
  const description =
    titles.length > 0 ? `${siteName} services: ${titles.join(", ")}.`.slice(0, 170) : settings?.studio_statement;

  return buildMetadata({ title: "Services", description, path: ROUTES.services, siteName });
}

export default async function ServicesPage() {
  const [{ data: services, error }, { data: settings }] = await Promise.all([getServiceSummaries(), getSiteSettings()]);

  return (
    <Section underHeader spacing="md" container="wide" labelledBy="services-title" className="hero-wash">
      <Breadcrumbs
        items={[
          { name: "Home", path: ROUTES.home },
          { name: "Services", path: ROUTES.services },
        ]}
      />
      <SectionHeading
        id="services-title"
        level={1}
        size="lg"
        title="Services"
        description={settings?.studio_statement ?? undefined}
        className="mt-10"
      />

      {services === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : services.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <p className="font-display text-h4 text-fg">Our services are being updated</p>
          <p className="mx-auto mt-2 max-w-sm text-fg-muted">Tell us what you&apos;re building and we&apos;ll point you to the right team.</p>
          <ButtonLink href={ROUTES.contact} className="mt-6">
            Contact us
          </ButtonLink>
        </div>
      ) : (
        <ul role="list" className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <li key={service.slug} className="flex">
              <ServiceCard service={service} headingLevel="h2" />
            </li>
          ))}
          {services.length % 4 !== 0 ? (
            <li className="flex">
              <ServiceCtaCard headingLevel="h2" />
            </li>
          ) : null}
        </ul>
      )}
    </Section>
  );
}
