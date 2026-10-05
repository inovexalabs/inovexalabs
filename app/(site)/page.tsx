import type { Metadata } from "next";
import { BlogInsightsSection } from "@/components/sections/blog-insights-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HowWeWorkSection } from "@/components/sections/how-we-work-section";
import { LabSection } from "@/components/sections/lab-section";
import { ResultsSection } from "@/components/sections/results-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhatWeBuildSection } from "@/components/sections/what-we-build-section";
import { HomeHero } from "@/components/hero/home-hero";
import { SectionDivider } from "@/components/layout/section-divider";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();

  return buildMetadata({
    title: settings?.seo_title ?? settings?.site_name ?? "Inovexa Labs",
    description: settings?.seo_description ?? settings?.hero_subheadline,
    siteName: settings?.site_name,
    path: "/",
    absoluteTitle: true,
  });
}

/**
 * Homepage. Order: hero → what we build → services → selected work → how we
 * work → innovation lab → technology → results → testimonials → insights →
 * closing CTA. Every section reads from Supabase and hides itself when the
 * underlying content has not been published yet.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <SectionDivider />
      <WhatWeBuildSection />
      <ServicesSection />
      <FeaturedProjectsSection />
      <HowWeWorkSection />
      <LabSection />
      <TechStackSection />
      <ResultsSection />
      <TestimonialsSection />
      <BlogInsightsSection />
      <FinalCtaSection />
    </>
  );
}
