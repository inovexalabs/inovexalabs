import { Section, SectionHeading } from "@/components/site/section";
import { TechWall } from "@/components/lab/tech-wall";
import { getTechnologies } from "@/lib/queries/content";

export async function StackSection() {
  const technologies = await getTechnologies();
  if (technologies.length === 0) return null;

  return (
    <Section id="stack" bordered>
      <SectionHeading
        eyebrow="Our technology"
        title="The stack, and why each part is in it."
        lede="Not a logo parade. Every technology here is something we use, with a note on what we actually use it for and how deeply we know it."
      />

      <div className="mt-12">
        <TechWall technologies={technologies} />
      </div>
    </Section>
  );
}
