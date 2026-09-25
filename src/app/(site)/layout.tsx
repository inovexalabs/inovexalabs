import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

/**
 * Public site chrome.
 *
 * Everything the visitor sees lives in this route group. The administration
 * panel sits outside it, so it never inherits the marketing header or footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="relative">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
