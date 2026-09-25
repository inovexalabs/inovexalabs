import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "What Inovexa Labs collects, why, where it is stored, how long it is kept, and how to have it deleted.",
  });
}

export default function PrivacyPage() {
  return <LegalPage docKey="privacy" />;
}
