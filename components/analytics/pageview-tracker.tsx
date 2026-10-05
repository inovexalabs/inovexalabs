"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { recordPageview } from "@/app/analytics/actions";

interface PageviewTrackerProps {
  /** False when no analytics ID is configured — nothing is sent at all. */
  enabled: boolean;
}

/**
 * Counts page views for the first-party analytics in Supabase. One send per
 * distinct path per session; failures are ignored so telemetry can never
 * interfere with the page.
 */
export function PageviewTracker({ enabled }: PageviewTrackerProps) {
  const pathname = usePathname();
  const sent = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !pathname) return;
    if (sent.current.has(pathname)) return;
    sent.current.add(pathname);

    void recordPageview({ path: pathname, referrer: document.referrer || undefined }).catch(() => {
      // Telemetry is best-effort by design: never surface it to the visitor.
    });
  }, [enabled, pathname]);

  return null;
}
