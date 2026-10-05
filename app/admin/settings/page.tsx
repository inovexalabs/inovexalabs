import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { TriangleAlert } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";
import { getSiteSettings, parseSocialLinks, type SiteSettings } from "@/lib/supabase/queries/settings";
import { mediaUrl } from "@/lib/utils/storage-url";
import type { SettingsFormValues } from "@/lib/validations/settings";

export const metadata: Metadata = { title: "Site settings" };

const str = (value: unknown): string => (typeof value === "string" ? value : "");

/** The stored singleton row → flat form values (social links are spread back out). */
function toFormValues(row: SiteSettings): SettingsFormValues {
  const social = parseSocialLinks(row.social_links);

  return {
    site_name: str(row.site_name),
    studio_statement: str(row.studio_statement),
    hero_headline: str(row.hero_headline),
    hero_subheadline: str(row.hero_subheadline),
    hero_primary_cta_label: str(row.hero_primary_cta_label),
    hero_primary_cta_href: str(row.hero_primary_cta_href),
    hero_secondary_cta_label: str(row.hero_secondary_cta_label),
    hero_secondary_cta_href: str(row.hero_secondary_cta_href),
    final_cta_title: str(row.final_cta_title),
    final_cta_description: str(row.final_cta_description),
    final_cta_label: str(row.final_cta_label),
    final_cta_href: str(row.final_cta_href),
    contact_email: str(row.contact_email),
    contact_phone: str(row.contact_phone),
    contact_address: str(row.contact_address),
    footer_text: str(row.footer_text),
    analytics_id: str(row.analytics_id),
    seo_title: str(row.seo_title),
    seo_description: str(row.seo_description),
    social_github: str(social.github),
    social_linkedin: str(social.linkedin),
    social_twitter: str(social.twitter),
    social_youtube: str(social.youtube),
    social_instagram: str(social.instagram),
    social_discord: str(social.discord),
  };
}

export default async function SettingsPage() {
  const session = await requireAdmin("/admin/settings");
  const { data: settings, error } = await getSiteSettings();

  if (error || !settings) {
    return (
      <>
        <AdminPageHeader title="Site settings" description="The copy and details used across the whole site." />
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            {error} Apply the latest Supabase migrations, then reload this page.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Site settings"
        description="One row powers the homepage hero, contact details, footer and search previews across the site."
      />
      {session.role !== "owner" ? (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-4 text-amber-800">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            You are signed in as an editor. Only the site owner can save these settings, including the logo and favicon.
          </p>
        </div>
      ) : null}
      <SettingsForm
        defaultValues={toFormValues(settings)}
        logoUrl={settings.logo_path ? mediaUrl(settings.logo_path) : null}
        faviconUrl={settings.favicon_path ? mediaUrl(settings.favicon_path) : null}
      />
    </>
  );
}
