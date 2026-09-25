import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ContactForm } from "@/components/contact/contact-form";
import { JsonLd } from "@/components/site/json-ld";
import { getCompany, getServices } from "@/lib/queries/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/contact",
    title: "Start a Project",
    description:
      "Tell Inovexa Labs about the problem you are solving. We reply within one business day with a straight assessment, a realistic shape for the work and a clear next step.",
    keywords: [
      "hire software developers Nepal",
      "start a software project",
      "custom software development quote",
    ],
  });
}

interface PageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const [{ service }, services, company] = await Promise.all([
    searchParams,
    getServices(),
    getCompany(),
  ]);

  const preselected = services.find((s) => s.slug === service);

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
        eyebrow="Start a project"
        title="Have an idea worth building?"
        lede="Tell us the problem, not the solution. The more concretely you describe what is expensive, repeated or broken today, the more useful our first reply will be."
        meta={
          <>
            <span className="mono-label flex items-center gap-2 text-ash">
              <Clock className="size-3.5" />
              Replies within one business day
            </span>
            <a
              href={`mailto:${company.email}`}
              className="mono-label flex items-center gap-2 text-signal transition-colors hover:underline"
            >
              <Mail className="size-3.5" />
              {company.email}
            </a>
          </>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          <ContactForm defaultProjectType={preselected ? "Web Application" : undefined} />

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="panel p-6">
              <h2 className="mono-label text-signal">What happens next</h2>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    n: "01",
                    t: "We read it properly",
                    d: "A person on the engineering side reads your inquiry, not a sales inbox.",
                  },
                  {
                    n: "02",
                    t: "A straight first reply",
                    d: "Within one business day: whether we are the right fit, and what we would do first.",
                  },
                  {
                    n: "03",
                    t: "One short call",
                    d: "Thirty minutes to understand the workflow, the constraints and the existing systems.",
                  },
                  {
                    n: "04",
                    t: "A scoped proposal",
                    d: "Or, if the honest answer is that software is not the right move, we say that instead.",
                  },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="font-mono text-[0.625rem] text-ash-deep">{step.n}</span>
                    <span>
                      <span className="block text-sm font-medium text-bone">{step.t}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ash">{step.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="panel p-6">
              <h2 className="mono-label text-ash-deep">Good to know</h2>
              <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-ash">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-signal" />
                  Your inquiry is stored in our own database, never shared, and never used for
                  marketing.
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-signal" />
                  We will not put you on a drip sequence. One reply, then it is your move.
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-signal" />
                  {company.city}, {company.country} — remote-first, working with clients in any
                  timezone.
                </li>
              </ul>
            </div>

            <div className="panel p-6">
              <h2 className="mono-label text-ash-deep">Not sure what you need?</h2>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                Skim the services, or look at how we approach a build end to end. Both pages exist
                to help you frame the problem before you talk to anyone.
              </p>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/services" className="text-sm text-bone-dim hover:text-signal">
                    All services →
                  </Link>
                </li>
                <li>
                  <Link href="/insights" className="text-sm text-bone-dim hover:text-signal">
                    Read how we think →
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <JsonLd
        id="contact-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/contact",
            name: "Start a Project",
            description:
              "Contact Inovexa Labs about a custom software project, product build or technical partnership.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ])}
      />
    </>
  );
}
