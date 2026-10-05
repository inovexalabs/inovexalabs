import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/animations/motion-provider";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/lib/env";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { cn } from "@/lib/utils/cn";
import { mediaUrl } from "@/lib/utils/storage-url";
import "./globals.css";

/** The favicon uploaded in /admin/settings, or the built-in mark in public/icon.svg. */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  const favicon = settings?.favicon_path ? mediaUrl(settings.favicon_path) : null;

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: "Inovexa Labs",
      template: "%s | Inovexa Labs",
    },
    applicationName: "Inovexa Labs",
    icons: favicon
      ? { icon: favicon, apple: favicon }
      : { icon: { url: "/icon.svg", type: "image/svg+xml" } },
  };
}

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(fontSans.variable, fontDisplay.variable)}>
      <head>
        {/* Without JavaScript, scroll-reveal content must still be visible. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Toaster />
      </body>
    </html>
  );
}
