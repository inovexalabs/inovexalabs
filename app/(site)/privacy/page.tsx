import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Privacy Policy",
    description: "How Inovexa Labs collects, uses and protects the information you share with this website.",
    path: ROUTES.privacy,
    siteName: settings?.site_name,
  });
}

export default async function PrivacyPage() {
  const { data: settings } = await getSiteSettings();
  const contactEmail = settings?.contact_email;

  return (
    <LegalPage
      title="Privacy Policy"
      description="What we collect when you use this website or contact us, why we collect it, and what you can ask us to do about it."
      updated="October 2026"
      sections={[
        {
          heading: "Who we are",
          paragraphs: [
            `This website is operated by ${settings?.site_name ?? "Inovexa Labs"}, a technology studio. Questions about this policy can be sent${contactEmail ? ` to ${contactEmail}` : " through the contact form on this site"}.`,
          ],
        },
        {
          heading: "Information you give us",
          paragraphs: [
            "When you submit the contact form we collect the details you enter: your name, email address, and anything else you choose to include — phone number, company, project type, budget, timeline and your project description.",
            "We use that information only to reply to your enquiry and, if the conversation continues, to prepare a proposal. We do not sell it, rent it or share it with advertisers.",
            "When you subscribe to the newsletter we store your email address and the fact that you subscribed, so we can send you updates and honour an unsubscribe request.",
          ],
        },
        {
          heading: "Information collected automatically",
          paragraphs: [
            "The site is hosted infrastructure may record standard technical logs — such as IP address, requested path, and user agent — for security, abuse prevention and diagnosing faults.",
            "If an analytics identifier is configured by the operator, it is used to count page views and understand which pages are useful. No advertising trackers or cross-site profiling tools are used by this website.",
          ],
        },
        {
          heading: "Cookies and local storage",
          paragraphs: [
            "This website sets only the cookies required to keep you signed in when you use the admin area, and to remember essential preferences. There are no advertising or third-party marketing cookies.",
            "You can block or delete cookies in your browser settings. Blocking the session cookie will sign you out of the admin area but will not affect the public pages.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Contact enquiries are kept for as long as needed to handle your request and for a reasonable period afterwards, so we have a record if you come back to us.",
            "You can ask us to delete your enquiry, subscription or any other personal data we hold, and we will do so unless we are legally required to keep it.",
          ],
        },
        {
          heading: "Who has access",
          paragraphs: [
            "Access to submitted information is restricted to the Inovexa Labs team members who need it to answer you. The database and storage behind this site are protected by row-level security and access controls.",
            "We do not sell or share your personal data with third parties. If a service provider processes data on our behalf (for example, hosting), they are bound by their own data-processing terms.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can request a copy of the data we hold about you, ask for corrections, or ask us to delete it. You can also object to processing or withdraw consent at any time — for example by unsubscribing from the newsletter.",
            "To exercise any of those rights, use the contact form on this site. We will respond within a reasonable period.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "When the way this site handles data changes, this page is updated and the date at the top is revised. Continued use of the site after a change means you accept the updated policy.",
          ],
        },
      ]}
    />
  );
}
