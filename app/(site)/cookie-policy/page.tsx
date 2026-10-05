import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Cookie Policy",
    description: "Which cookies this website uses, and which it deliberately does not.",
    path: ROUTES.cookiePolicy,
    siteName: settings?.site_name,
  });
}

export default async function CookiePolicyPage() {
  const { data: settings } = await getSiteSettings();

  return (
    <LegalPage
      title="Cookie Policy"
      description="This site uses only the cookies it needs to work. Here is the complete list — and what you will not find in it."
      updated="October 2026"
      sections={[
        {
          heading: "What cookies are",
          paragraphs: [
            "Cookies are small text files a website asks your browser to store. They are commonly used to keep you signed in, remember preferences or measure how a site is used.",
          ],
        },
        {
          heading: "Cookies this site sets",
          paragraphs: [
            "Session cookie — set only when you sign in to the admin area. It keeps you authenticated between requests and is issued by our authentication provider (Supabase). It expires when you sign out or the session ends.",
            "Consent and preference cookies — none are used. The public pages do not store anything in your browser.",
          ],
        },
        {
          heading: "Cookies this site does not set",
          paragraphs: [
            "No advertising cookies. No cross-site tracking pixels. No social media embeds that track you across the web. No session-replay or heat-mapping scripts.",
            "If analytics is enabled by the operator, it is a privacy-conscious, first-party counter that records page views and referrers — not a profile of you as an individual.",
          ],
        },
        {
          heading: "Managing cookies",
          paragraphs: [
            "You can delete or block cookies in your browser settings at any time. Blocking the session cookie will not affect browsing the public site; it will only sign you out of the admin area.",
            "Most browsers also let you clear cookies for a single site, so you can reset the admin session without touching anything else.",
          ],
        },
        {
          heading: "Third-party content",
          paragraphs: [
            "Links to external sites are plain links — they do not load third-party scripts until you click them. Once you leave this site, that site's own cookie policy applies.",
          ],
        },
        {
          heading: "Questions",
          paragraphs: [
            `If anything here is unclear, ask us${settings?.contact_email ? ` at ${settings.contact_email}` : " through the contact form on this site"}.`,
          ],
        },
      ]}
    />
  );
}
