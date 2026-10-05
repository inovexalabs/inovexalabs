import "server-only";
import { unstable_noStore as noStore } from "next/cache";

/** Every query returns data or a user-safe error message — never throws for expected failures. */
export type QueryResult<T> = { data: T; error: null } | { data: null; error: string };

/**
 * Logs a failed query and opts the current render out of caching, so a
 * transient outage is never frozen into a static page: ISR keeps serving the
 * last good version, and a failed build-time render falls back to on-demand.
 */
export function queryFailure(scope: string, detail: string, message: string): { data: null; error: string } {
  noStore();
  console.error(`[${scope}]`, detail);
  return { data: null, error: message };
}
