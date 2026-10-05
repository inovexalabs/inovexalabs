import type { ReactNode } from "react";
import { PageviewTracker } from "@/components/analytics/pageview-tracker";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/json-ld";
import { getSiteSettings, parseSocialLinks } from "@/lib/supabase/queries/settings";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  // One cached settings read powers structured data and the analytics flag.
  // If settings are unreachable the site still renders, just without them.
  const { data: settings } = await getSiteSettings();

  const structuredData = settings
    ? [
        organizationJsonLd({
          name: settings.site_name,
          description: settings.studio_statement,
          email: settings.contact_email,
          phone: settings.contact_phone,
          address: settings.contact_address,
          socialLinks: parseSocialLinks(settings.social_links),
        }),
        webSiteJsonLd(settings.site_name),
      ]
    : null;

  return (
    <>
      {structuredData ? <JsonLd data={structuredData} /> : null}
      <PageviewTracker enabled={Boolean(settings?.analytics_id)} />
      <SkipLink />
      <SiteHeader />
      {/* Made inert while the mobile drawer is open. Pages start with <Section underHeader>. */}
      <main id="main-content" tabIndex={-1} data-inert-when-nav-open="" className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
