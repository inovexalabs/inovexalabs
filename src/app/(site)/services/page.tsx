import type { Metadata } from "next";
import { ServiceCard } from "@/components/cards/service-card";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { ProcessSection } from "@/components/sections/process-section";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { getServices } from "@/lib/queries/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/services",
    title: "Software Development Services",
    description:
      "Web, SaaS, mobile, AI, business software, backend engineering, e-commerce and product design — each with a dedicated page covering approach, scope and engagement.",
    keywords: [
      "software development services Nepal",
      "custom software development",
      "web development company Nepal",
      "SaaS development company Nepal",
      "AI development company Nepal",
    ],
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  // Group by category so related capabilities sit together rather than in a flat wall.
  const grouped = services.reduce<Record<string, typeof services>>((acc, service) => {
    const key = service.category ?? "Other";
    (acc[key] ??= []).push(service);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Engineering, applied to your problem."
        lede="We are an on-demand software development company. These are the capabilities we bring — each with its own page, because deciding on a specific approach matters more than reading a list of everything we could do."
        meta={
          <>
            <span className="mono-label text-ash">
              {String(services.length).padStart(2, "0")} services
            </span>
            <span className="mono-label text-ash">Nepal · remote worldwide</span>
          </>
        }
      />

      {Object.entries(grouped).map(([category, items]) => (
        <Section key={category} bordered>
          <SectionHeading
            eyebrow={category}
            title={
              category === "Engineering"
                ? "Build it properly."
                : category === "Product"
                  ? "Take it to market."
                  : category === "Intelligence"
                    ? "Make it think."
                    : "Make it usable."
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service, index) => (
              <Reveal key={service.id} delay={(index % 3) * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <ProcessSection />
      <CtaBand />

      <JsonLd
        id="services-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/services",
            name: "Software Development Services",
            description:
              "Custom software, web, SaaS, mobile, AI and backend engineering services from Inovexa Labs.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          itemListSchema(
            services.map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
            "Inovexa Labs services",
          ),
        ])}
      />
    </>
  );
}
