import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Logo } from "@/components/layout/logo";
import { ROUTES } from "@/lib/constants/routes";
import { getNavigationItems } from "@/lib/supabase/queries/navigation";
import { getServiceSummaries } from "@/lib/supabase/queries/services";
import { getSiteSettings, parseSocialLinks } from "@/lib/supabase/queries/settings";
import { mediaUrl } from "@/lib/utils/storage-url";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: ROUTES.privacy },
  { label: "Terms of Service", href: ROUTES.terms },
  { label: "Cookie Policy", href: ROUTES.cookiePolicy },
] as const;

const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  x: "X",
  youtube: "YouTube",
  instagram: "Instagram",
  discord: "Discord",
};

/**
 * Global footer: brand, contact details, link columns (all from Supabase),
 * social links and the newsletter signup. Rendered by the site layout on
 * every public page.
 */
export async function SiteFooter() {
  const [settingsResult, servicesResult, navResult] = await Promise.all([
    getSiteSettings(),
    getServiceSummaries(),
    getNavigationItems("footer"),
  ]);

  const settings = settingsResult.data;
  const socials = parseSocialLinks(settings?.social_links);
  const services = servicesResult.data ?? [];
  const footerNav = navResult.data ?? [];
  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="border-t border-line navy-gradient">
      <div className="mx-auto w-full max-w-wide px-gutter py-section">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Logo
              logoUrl={settings?.logo_path ? mediaUrl(settings.logo_path) : null}
              siteName={settings?.site_name}
            />
            <p className="mt-4 max-w-sm text-sm text-fg-muted">
              {settings?.footer_text ??
                "Turning ideas into technology. Building products that matter."}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              {settings?.contact_email ? (
                <li>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="inline-flex items-center gap-2.5 text-fg-muted transition-colors hover:text-fg"
                  >
                    <Mail aria-hidden="true" className="size-4 shrink-0 text-accent" />
                    {settings.contact_email}
                  </a>
                </li>
              ) : null}
              {settings?.contact_phone ? (
                <li>
                  <a
                    href={`tel:${settings.contact_phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2.5 text-fg-muted transition-colors hover:text-fg"
                  >
                    <Phone aria-hidden="true" className="size-4 shrink-0 text-accent" />
                    {settings.contact_phone}
                  </a>
                </li>
              ) : null}
              {settings?.contact_address ? (
                <li className="flex items-start gap-2.5 text-fg-muted">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  {settings.contact_address}
                </li>
              ) : null}
            </ul>

            {Object.keys(socials).length > 0 ? (
              <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-2">
                {Object.entries(socials).map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Services" className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.length > 0 ? (
                services.slice(0, 7).map((service) => (
                  <li key={service.slug}>
                    <Link href={ROUTES.service(service.slug)} className="text-fg-muted transition-colors hover:text-fg">
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href={ROUTES.services} className="text-fg-muted transition-colors hover:text-fg">
                    All services
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNav.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">Legal</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <NewsletterForm title="Newsletter" description="Occasional notes on what we are building." />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-muted">
            © {year} {settings?.site_name ?? "Inovexa Labs"}. All rights reserved.
          </p>
          <p className="text-sm font-medium text-accent">Imagine. Build. Innovate.</p>
        </div>
      </div>
    </footer>
  );
}
