import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/cookies",
    title: "Cookie Policy",
    description:
      "What this website stores in your browser. No advertising cookies, no cross-site tracking, no third-party analytics by default.",
  });
}

export default function CookiesPage() {
  return <LegalPage docKey="cookies" />;
}
