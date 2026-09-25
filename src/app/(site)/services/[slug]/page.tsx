import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Layers } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { ServiceIcon } from "@/components/cards/service-icon";
import { ServiceCard } from "@/components/cards/service-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";
import { getCompany, getServiceBySlug, getServices } from "@/lib/queries/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
  serviceSchema,
  webPageSchema,
} from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return buildMetadata({ path: `/services/${slug}`, robots: "noindex,nofollow" });

  // The service's own SEO columns drive the metadata automatically.
  return buildMetadata({
    path: `/services/${service.slug}`,
    title: service.seo_title || service.title,
    description: service.seo_description || service.summary,
    keywords: service.seo_keywords,
    canonicalOverride: service.canonical_url,
    ogTitle: service.og_title,
    ogDescription: service.og_description,
    ogImage: service.og_image_url,
    robots: service.robots,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, services, company] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getCompany(),
  ]);

  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const path = `/services/${service.slug}`;

  return (
    <>
      <PageHeader
        trail={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path },
        ]}
        eyebrow={service.category ?? "Service"}
        title={service.title}
        lede={service.summary}
        meta={
          <>
            <span className="flex size-9 items-center justify-center rounded-xl border border-steel bg-graphite text-signal">
              <ServiceIcon name={service.icon} />
            </span>
            {service.tagline ? (
              <span className="mono-label text-bone-dim">{service.tagline}</span>
            ) : null}
          </>
        }
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            {service.body ? (
              <Markdown content={service.body} className="max-w-none" />
            ) : (
              <p className="text-base leading-relaxed text-bone-dim">{service.summary}</p>
            )}

            {service.process_notes?.length ? (
              <div className="mt-16">
                <h2 className="mono-label text-plasma">How we approach it</h2>
                <ul className="mt-6 space-y-3.5">
                  {service.process_notes.map((note) => (
                    <li key={note} className="flex items-start gap-3 text-sm leading-relaxed text-bone-dim">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-signal" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.faqs?.length ? (
              <div className="mt-16">
                <h2 className="mono-label text-plasma">Questions we get asked</h2>
                <dl className="mt-6 divide-y divide-steel border-y border-steel">
                  {service.faqs.map((faq) => (
                    <div key={faq.q} className="py-6">
                      <dt className="font-display text-base font-medium tracking-tight text-bone">
                        {faq.q}
                      </dt>
                      <dd className="mt-2.5 text-sm leading-relaxed text-ash">{faq.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {service.deliverables?.length ? (
              <div className="panel p-6">
                <h2 className="mono-label text-signal">What this includes</h2>
                <ul className="mt-5 space-y-3">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-bone-dim">
                      <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-signal/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.engagement_models?.length ? (
              <div className="panel mt-5 p-6">
                <h2 className="mono-label text-ash-deep">Engagement models</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.engagement_models.map((model) => (
                    <li
                      key={model}
                      className="rounded-full border border-steel bg-graphite px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-bone-dim"
                    >
                      {model}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="panel mt-5 p-6">
              <h2 className="mono-label text-ash-deep">Start here</h2>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                Describe the problem and we will tell you whether {service.title.toLowerCase()} is
                the right shape for it — and what we would do first.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href={`/contact?service=${service.slug}`}>
                  Start a Project
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section bordered>
          <SectionHeading
            eyebrow="Related"
            title="Often combined with."
            action={{ label: "All services", href: "/services" }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section bordered>
        <div className="flex flex-wrap items-center gap-3">
          <Layers aria-hidden className="size-4 text-ash-deep" />
          <span className="mono-label text-ash-deep">Also from Inovexa Labs</span>
          <Link
            href="/products"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal underline-offset-4 hover:underline"
          >
            Products we build for ourselves →
          </Link>
        </div>
      </Section>

      <CtaBand
        eyebrow="Next step"
        title={`Ready to talk about ${service.title.toLowerCase()}?`}
        body="One short conversation is usually enough to tell whether we are the right team for this, and what a sensible first release would look like."
      />

      <JsonLd
        id={`service-${service.slug}-graph`}
        data={jsonLdGraph([
          serviceSchema(service, company),
          webPageSchema({
            path,
            name: service.title,
            description: service.summary,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path },
          ]),
          faqSchema(service.faqs ?? []),
        ])}
      />
    </>
  );
}
