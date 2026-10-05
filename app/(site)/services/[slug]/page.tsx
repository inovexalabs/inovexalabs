import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceHero } from "@/components/services/service-hero";
import {
  ServiceCta,
  ServiceFaq,
  ServiceItemGrid,
  ServiceOverview,
  ServiceProcess,
  ServiceTechnologies,
} from "@/components/services/service-sections";
import { ROUTES } from "@/lib/constants/routes";
import { faqJsonLd, JsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getServiceBySlug, getServiceSlugs } from "@/lib/supabase/queries/services";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/** Published services are pre-rendered; services published later render on first request. */
export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [{ data: service }, { data: settings }] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) return { title: "Service not found", robots: { index: false } };

  const metadata = buildMetadata({
    title: service.seo.title ?? service.title,
    description: service.seo.description ?? service.summary,
    path: ROUTES.service(service.slug),
    siteName: settings?.site_name,
  });

  if (service.image) {
    const images = [{ url: service.image.url, alt: service.image.alt }];
    metadata.openGraph = { ...metadata.openGraph, images };
    metadata.twitter = { ...metadata.twitter, images };
  }
  return metadata;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [{ data: service, error }, { data: settings }] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);

  // A failed query must not look like a missing page: surface it to the error boundary.
  if (error) throw new Error(error);
  if (!service) notFound();

  const processId = "process";

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            title: service.title,
            summary: service.summary,
            path: ROUTES.service(service.slug),
            imageUrl: service.image?.url ?? null,
            providerName: settings?.site_name ?? "Inovexa Labs",
          }),
          ...(service.faqs.length > 0 ? [faqJsonLd(service.faqs)] : []),
        ]}
      />

      <ServiceHero service={service} processAnchor={service.process.length > 0 ? `#${processId}` : null} />

      {service.overview.length > 0 ? <ServiceOverview id="overview" paragraphs={service.overview} /> : null}
      {service.problems.length > 0 ? (
        <ServiceItemGrid id="problems" title="Problems We Solve" items={service.problems} marker="problem" tone="muted" />
      ) : null}
      {service.features.length > 0 ? (
        <ServiceItemGrid id="capabilities" title="Capabilities" items={service.features} marker="capability" />
      ) : null}
      {service.technologies.length > 0 ? (
        <ServiceTechnologies id="technologies" technologies={service.technologies} />
      ) : null}
      {service.process.length > 0 ? <ServiceProcess id={processId} steps={service.process} /> : null}
      {service.outcomes.length > 0 ? (
        <ServiceItemGrid id="outcomes" title="Expected Outcomes" items={service.outcomes} marker="outcome" tone="muted" />
      ) : null}
      {service.faqs.length > 0 ? <ServiceFaq id="faq" faqs={service.faqs} /> : null}
      <ServiceCta id="get-started" cta={service.cta} />
    </>
  );
}
