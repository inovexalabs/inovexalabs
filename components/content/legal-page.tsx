import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { ROUTES } from "@/lib/constants/routes";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

/**
 * Shared renderer for the privacy, terms and cookie pages. Content is plain
 * statements about how this site actually works — no certifications, no
 * guarantees and no legal claims the company has not made.
 */
export function LegalPage({ title, description, updated, sections }: LegalPageProps) {
  const headingId = "legal-title";

  return (
    <>
      <PageHero
        id={headingId}
        eyebrow="Legal"
        title={title}
        description={description}
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: title, path: ROUTES.privacy }]}
      />

      <Section spacing="md" container="narrow" labelledBy={headingId} className="pt-section-sm">
        <p className="text-sm text-fg-muted">Last updated: {updated}</p>

        <div className="mt-8 divide-y divide-line border-y border-line">
          {sections.map((section) => (
            <section key={section.heading} aria-labelledby={`legal-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}>
              <h2
                id={`legal-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}
                className="scroll-mt-32 py-6 font-display text-h3 text-fg"
              >
                {section.heading}
              </h2>
              <div className="space-y-4 pb-6">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="max-w-[46rem] text-fg-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
