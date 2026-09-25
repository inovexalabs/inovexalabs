import { getLabSignal } from "@/lib/queries/metrics";
import { getNavFallback } from "@/lib/navigation";
import { HeaderShell } from "./header-shell";

/**
 * Server wrapper: reads navigation from the database (with the structural
 * baseline as fallback) and the live LAB SIGNAL, then hands both to the
 * interactive shell.
 */
export async function SiteHeader() {
  const [items, signal] = await Promise.all([getNavFallback(), getLabSignal()]);

  return <HeaderShell items={items} signal={signal} />;
}
