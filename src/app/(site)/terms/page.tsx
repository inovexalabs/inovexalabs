import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/terms",
    title: "Terms of Service",
    description:
      "The terms governing use of the Inovexa Labs website, including how to read the information published here.",
  });
}

export default function TermsPage() {
  return <LegalPage docKey="terms" />;
}
