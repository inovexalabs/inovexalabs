import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Terms of Service",
    description: "The terms that apply when you use this website or engage Inovexa Labs for work.",
    path: ROUTES.terms,
    siteName: settings?.site_name,
  });
}

export default async function TermsPage() {
  const { data: settings } = await getSiteSettings();

  return (
    <LegalPage
      title="Terms of Service"
      description="The terms that apply when you use this website, submit an enquiry, or engage us for project work."
      updated="October 2026"
      sections={[
        {
          heading: "About these terms",
          paragraphs: [
            `These terms govern your use of this website, operated by ${settings?.site_name ?? "Inovexa Labs"}. By using the site you accept them. If you engage us for project work, a separate written agreement (statement of work) takes precedence for that engagement.`,
          ],
        },
        {
          heading: "Using this website",
          paragraphs: [
            "You may browse the site and share links to its pages for lawful purposes. You must not attempt to disrupt the site, gain unauthorized access to it or its data, scrape it at scale, or submit malicious content through its forms.",
            "The content on this site — articles, case studies, experiment write-ups and code samples — is published for information. You may quote it with attribution; you may not republish it in full as your own.",
          ],
        },
        {
          heading: "Enquiries and proposals",
          paragraphs: [
            "Submitting the contact form does not create a contract or an obligation for either party. It starts a conversation.",
            "Any scope, price, timeline and deliverables for project work are agreed in writing before work begins. Verbal estimates given during early conversations are indicative only.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "Ownership of the work we produce for you is defined in your agreement. Unless stated otherwise in writing, you receive the rights to the deliverables once invoices for that work have been paid.",
            "We keep the right to describe the engagement publicly (for example, naming you and the general nature of the work) only where you have agreed to it.",
          ],
        },
        {
          heading: "Third-party services",
          paragraphs: [
            "This site and the products we build may rely on third-party platforms (hosting, databases, payment providers, APIs). Their own terms and availability apply to those parts, and we are not responsible for their outages or changes.",
          ],
        },
        {
          heading: "Disclaimers",
          paragraphs: [
            "The website is provided as-is. We work to keep it accurate and available, but we do not guarantee that every page is free of errors or that the site will be uninterrupted.",
            "Nothing on this site constitutes professional advice tailored to your situation, and nothing creates a warranty beyond what is stated in your signed agreement with us.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "To the extent permitted by law, neither party is liable for indirect or consequential losses arising from the use of this website. Liability for project work is governed by the agreement signed for that engagement.",
          ],
        },
        {
          heading: "Changes and contact",
          paragraphs: [
            "We may update these terms; the date at the top reflects the latest revision. Continued use of the site after a change means you accept the updated terms.",
            `Questions about these terms can be sent${settings?.contact_email ? ` to ${settings.contact_email}` : " through the contact form on this site"}.`,
          ],
        },
      ]}
    />
  );
}
