import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/site/logo";
import { getNavigation, getServices, getCompany, getSocials } from "@/lib/queries/content";
import { getLabSignal } from "@/lib/queries/metrics";
import { LabSignal } from "@/components/site/lab-signal";

const SOCIAL_LABELS: Record<string, string> = {
  x: "X",
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
};

export async function SiteFooter() {
  const [footerNav, legalNav, services, company, socials, signal] = await Promise.all([
    getNavigation("footer"),
    getNavigation("legal"),
    getServices(),
    getCompany(),
    getSocials(),
    getLabSignal(),
  ]);

  // Footer navigation is rendered in the order an editor set (`display_order`),
  // rather than being re-shuffled by hard-coded rules here.
  const socialEntries = Object.entries(socials).filter(([, url]) => Boolean(url));
  const hasAddress = Boolean(company.addressLine?.trim() || company.city?.trim());

  return (
    <footer className="relative overflow-hidden border-t border-steel/80 bg-carbon">
      <div aria-hidden className="lab-grid lab-grid-mask absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-[86rem] edge-x pb-10 pt-20 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-6 text-sm leading-relaxed text-ash">
              Software development × product innovation.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash-deep">
              {company.positioning}
            </p>
            <div className="mt-7">
              <LabSignal signal={signal} />
            </div>
          </div>

          {/* Services */}
          <FooterColumn title="Services">
            {services.slice(0, 7).map((service) => (
              <FooterLink key={service.slug} href={`/services/${service.slug}`}>
                {service.title}
              </FooterLink>
            ))}
            <FooterLink href="/services">All services</FooterLink>
          </FooterColumn>

          {/* Company */}
          <FooterColumn title="Company">
            {footerNav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.title}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Contact">
            <li>
              <a
                href={`mailto:${company.email}`}
                className="group inline-flex items-center gap-2 text-sm text-bone-dim transition-colors hover:text-signal"
              >
                <Mail className="size-3.5 shrink-0 text-ash-deep" />
                {company.email}
              </a>
            </li>
            {company.phone ? (
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s+/g, "")}`}
                  className="text-sm text-bone-dim transition-colors hover:text-signal"
                >
                  {company.phone}
                </a>
              </li>
            ) : null}
            {hasAddress ? (
              <li className="flex items-start gap-2 text-sm text-ash">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-ash-deep" />
                <span>
                  {company.addressLine}
                  {company.addressLine && company.city ? ", " : ""}
                  {company.city}
                  {company.country ? `, ${company.country}` : ""}
                </span>
              </li>
            ) : (
              <li className="text-sm text-ash-deep">
                {company.city ? `${company.city}, ${company.country}` : company.country}
                <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
                  Remote-first
                </span>
              </li>
            )}
            {socialEntries.length > 0 ? (
              <li className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {socialEntries.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ash transition-colors hover:text-signal"
                  >
                    {SOCIAL_LABELS[key] ?? key}
                    <ArrowUpRight className="size-3" />
                  </a>
                ))}
              </li>
            ) : null}
          </FooterColumn>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ash-deep">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mono-label text-ash-deep">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-bone-dim transition-colors hover:text-signal">
        {children}
      </Link>
    </li>
  );
}
