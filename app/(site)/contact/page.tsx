import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/content/faq-accordion";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFaqs } from "@/lib/supabase/queries/faqs";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Contact Inovexa Labs | Start a Technology Project",
    absoluteTitle: true,
    description:
      "Have a software, AI, automation, or technology idea? Contact Inovexa Labs to discuss your project and explore how we can build it.",
    path: ROUTES.contact,
    siteName: settings?.site_name,
  });
}

export default async function ContactPage() {
  const [{ data: settings }, { data: faqs }] = await Promise.all([getSiteSettings(), getFaqs("contact")]);

  const details = [
    settings?.contact_email
      ? { icon: Mail, label: "Email", value: settings.contact_email, href: `mailto:${settings.contact_email}` }
      : null,
    settings?.contact_phone
      ? {
          icon: Phone,
          label: "Phone",
          value: settings.contact_phone,
          href: `tel:${settings.contact_phone.replace(/[^\d+]/g, "")}`,
        }
      : null,
    settings?.contact_address ? { icon: MapPin, label: "Office", value: settings.contact_address, href: null } : null,
  ].filter((item): item is { icon: typeof Mail; label: string; value: string; href: string | null } => item !== null);

  return (
    <>
      <PageHero
        id="contact-title"
        eyebrow="Start a project"
        title="Tell us what you want to build"
        description="Share as much or as little as you have — a rough idea is enough. We reply within two working days with honest next steps."
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: "Contact", path: ROUTES.contact }]}
      />

      <Section spacing="md" container="wide" labelledBy="contact-title" className="pt-section-sm">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Card padding="lg" radius="2xl">
              <ContactForm />
            </Card>
          </div>

          <aside className="space-y-6 lg:col-span-5" aria-label="Contact details">
            <Card padding="lg" radius="2xl" className="bg-surface-muted/60">
              <h2 className="font-display text-h3 text-fg">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {[
                  ["We read it", "A real person reads your message — no autoresponders, no bots."],
                  ["We reply", "Within two working days, usually with a couple of clarifying questions."],
                  ["We scope it", "If there is a fit, we run a short paid discovery phase before any build commitment."],
                ].map(([title, body], index) => (
                  <li key={title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full brand-gradient-soft text-xs font-semibold tabular-nums text-iris-700"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-fg">{title}</p>
                      <p className="mt-0.5 text-sm text-fg-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            {details.length > 0 ? (
              <Card padding="lg" radius="2xl">
                <h2 className="font-display text-h4 text-fg">Reach us directly</h2>
                <ul className="mt-4 space-y-3">
                  {details.map((detail) => {
                    const Icon = detail.icon;
                    const content = (
                      <>
                        <Icon aria-hidden="true" className="size-4.5 shrink-0 text-accent" />
                        <span className="min-w-0">
                          <span className="block text-xs uppercase tracking-[0.12em] text-fg-subtle">{detail.label}</span>
                          <span className="block break-words text-fg">{detail.value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={detail.label}>
                        {detail.href ? (
                          <a href={detail.href} className="flex items-start gap-3 rounded-lg transition-colors hover:text-accent">
                            {content}
                          </a>
                        ) : (
                          <span className="flex items-start gap-3">{content}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ) : null}
          </aside>
        </div>
      </Section>

      {faqs && faqs.length > 0 ? (
        <Section id="faq" tone="muted" labelledBy="contact-faq-title" container="wide">
          <FaqAccordion faqs={faqs} title="Before you ask" id="contact-faq" structuredData />
        </Section>
      ) : null}
    </>
  );
}
