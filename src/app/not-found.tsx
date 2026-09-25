import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/site/section";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getNavFallback } from "@/lib/navigation";
import { getServices } from "@/lib/queries/content";

/**
 * Root 404. Renders the full site chrome itself, because unmatched URLs resolve
 * here rather than inside the `(site)` route group.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: "noindex,follow",
};

export default async function NotFound() {
  const [links, services] = await Promise.all([getNavFallback(), getServices()]);

  return (
    <>
      <SiteHeader />

      <main className="relative overflow-hidden">
        <div aria-hidden className="lab-grid lab-grid-mask pointer-events-none absolute inset-0 opacity-70" />
        <div aria-hidden className="lab-vignette pointer-events-none absolute inset-0" />

        <div className="relative mx-auto flex w-full max-w-[86rem] flex-col justify-center edge-x pb-24 pt-32 sm:pt-40">
          <div className="max-w-2xl">
            <Eyebrow>
              <span className="flex items-center gap-2.5">
                <Compass className="size-3.5" />
                Error 404
              </span>
            </Eyebrow>

            <h1 className="display-xl mt-6 text-bone">This page isn&apos;t in the lab.</h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
              The URL you followed does not match anything we publish. It may have moved, or the
              link that brought you here may be out of date. The routes below all work.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/">
                  Back to the homepage
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/search">Search the site</Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 grid gap-10 border-t border-steel pt-12 lg:grid-cols-3">
            <div>
              <h2 className="mono-label text-ash-deep">Main sections</h2>
              <ul className="mt-5 space-y-3">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-bone-dim transition-colors hover:text-signal"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mono-label text-ash-deep">Services</h2>
              <ul className="mt-5 space-y-3">
                {services.slice(0, 6).map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm text-bone-dim transition-colors hover:text-signal"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mono-label text-ash-deep">Found a broken link?</h2>
              <p className="mt-5 text-sm leading-relaxed text-ash">
                Tell us what you were trying to reach and we will either point you at it or fix
                the link. Broken links are a maintenance bug, not an inevitability.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal underline-offset-4 hover:underline"
              >
                Report it
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
