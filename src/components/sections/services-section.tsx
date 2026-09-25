import { Section, SectionHeading } from "@/components/site/section";
import { ServiceCard } from "@/components/cards/service-card";
import { Reveal } from "@/components/site/reveal";
import { getServices } from "@/lib/queries/content";

export async function ServicesSection() {
  const services = await getServices();
  if (services.length === 0) return null;

  return (
    <Section id="services" bordered>
      <SectionHeading
        eyebrow="What we do"
        title="Services, each with its own page."
        lede="Every capability has a dedicated page covering what it includes, how we approach it and how an engagement is shaped — so you can evaluate the specific thing you need rather than a list of everything we could do."
        action={{ label: "All services", href: "/services" }}
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={(index % 3) * 90}>
            <ServiceCard service={service} index={index} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
