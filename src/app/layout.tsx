import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { JsonLd } from "@/components/site/json-ld";
import { getCompany, getSeoDefaults, getSocials } from "@/lib/queries/content";
import { organizationSchema, websiteSchema, jsonLdGraph } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const [defaults, company] = await Promise.all([getSeoDefaults(), getCompany()]);

  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: defaults.defaultTitle,
      template: defaults.titleTemplate,
    },
    description: defaults.defaultDescription,
    applicationName: company.name,
    authors: [{ name: company.name, url: absoluteUrl("/") }],
    creator: company.name,
    publisher: company.name,
    alternates: { canonical: absoluteUrl("/") },
    robots: defaults.robots,
    openGraph: {
      type: "website",
      siteName: company.name,
      title: defaults.defaultTitle,
      description: defaults.defaultDescription,
      url: absoluteUrl("/"),
      locale: "en_US",
      ...(defaults.ogImageUrl ? { images: [{ url: defaults.ogImageUrl }] } : {}),
    },
    twitter: {
      card: defaults.ogImageUrl ? "summary_large_image" : "summary",
      title: defaults.defaultTitle,
      description: defaults.defaultDescription,
      ...(defaults.twitterHandle ? { site: defaults.twitterHandle } : {}),
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg" }],
    },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

/**
 * The document shell only.
 *
 * Site chrome lives in the `(site)` route group and the administration panel
 * provides its own, so neither leaks into the other. Organisation and WebSite
 * structured data are emitted here because they describe the site as a whole.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [company, socials] = await Promise.all([getCompany(), getSocials()]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-dvh bg-void antialiased">
        {children}
        <JsonLd
          id="inovexa-organization"
          data={jsonLdGraph([organizationSchema(company, socials), websiteSchema(company)])}
        />
      </body>
    </html>
  );
}
