import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Unmatched URLs render outside the (site) layout, so this adds the header itself. */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} data-inert-when-nav-open="" className="outline-none">
        <NotFoundContent />
      </main>
    </>
  );
}
