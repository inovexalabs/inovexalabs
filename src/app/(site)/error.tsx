"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Renders inside the site chrome, so navigation
 * stays available even when a page fails.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Structured enough to correlate with server logs via the digest.
    console.error("[inovexa:route-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="lab-grid lab-grid-mask pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-[86rem] edge-x pb-24 pt-32 sm:pt-40">
        <div className="max-w-2xl">
          <p className="mono-label flex items-center gap-2.5 text-ember">
            <AlertTriangle className="size-3.5" />
            Something failed
          </p>

          <h1 className="display-lg mt-6 text-bone">This section failed to load.</h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-bone-dim">
            The page hit an unexpected error. It has been logged with a reference so we can trace
            it. Retrying is often enough — if it is not, the rest of the site still works.
          </p>

          {error.digest ? (
            <p className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ash-deep">
              Reference {error.digest}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={reset}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/">Back to the homepage</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Report a problem</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
