import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { TwoEngines } from "@/components/sections/two-engines";
import { ProductsSection } from "@/components/sections/products-section";
import { LabSection } from "@/components/sections/lab-section";
import { WorkSection } from "@/components/sections/work-section";
import { TrustSection } from "@/components/sections/trust-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProcessSection } from "@/components/sections/process-section";
import { StackSection } from "@/components/sections/stack-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { CtaBand } from "@/components/site/cta-band";
import { JourneyRail } from "@/components/lab/journey-rail";
import { JsonLd } from "@/components/site/json-ld";
import { getCompany, getExperiments, getProducts, getProjects, getServices } from "@/lib/queries/content";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default async function HomePage() {
  const [company, services, products, projects, experiments] = await Promise.all([
    getCompany(),
    getServices(),
    getProducts(),
    getProjects(),
    getExperiments(),
  ]);

  return (
    <>
      {/*
        The journey: IDEA → EXPERIMENT → BUILD → LAUNCH → IMPACT.
        Each stage maps onto a section further down this page.
      */}
      <Hero />

      <div className="relative mx-auto w-full max-w-[86rem] edge-x pb-4">
        <JourneyRail />
      </div>

      <TwoEngines />
      <ProductsSection />
      <LabSection />
      <WorkSection />
      <TrustSection />
      <ServicesSection />
      <ProcessSection />
      <StackSection />
      <InsightsSection />
      <CtaBand />

      <JsonLd
        id="inovexa-home-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/",
            name: company.promise,
            description: company.shortDescription,
          }),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          services.length
            ? itemListSchema(
                services.map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
                "Services",
              )
            : null,
          products.length
            ? itemListSchema(
                products.map((p) => ({ name: p.name, path: `/products/${p.slug}` })),
                "Products",
              )
            : null,
          projects.length
            ? itemListSchema(
                projects.map((p) => ({ name: p.name, path: `/work/${p.slug}` })),
                "Client work",
              )
            : null,
          experiments.length
            ? itemListSchema(
                experiments.map((e) => ({ name: e.title, path: `/lab/${e.slug}` })),
                "Lab experiments",
              )
            : null,
        ])}
      />
    </>
  );
}
