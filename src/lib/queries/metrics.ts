import { TAGS, cachedRead } from "@/lib/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { reportQueryError } from "@/lib/supabase/config";
import {
  fallbackExperiments,
  fallbackProducts,
} from "@/content/fallback";
import type { LabMetrics } from "@/types/content";

/**
 * Every number the site displays is counted from real rows.
 *
 * A metric that cannot be backed by data resolves to `null`, and the UI hides
 * it rather than showing a zero or — worse — an encouraging invention. There is
 * no placeholder arithmetic in this file.
 */

/** Products considered "on the bench": anything not yet shipped or retired. */
const ACTIVE_PRODUCT_STATUSES = ["experiment", "in_development"] as const;
/** Experiments still being worked on. */
const ACTIVE_EXPERIMENT_STATUSES = ["idea", "experiment", "in_development"] as const;

export const getLabMetrics = cachedRead(
  async (): Promise<LabMetrics> => {
    const db = getPublicClient();

    if (!db) {
      // Baseline: only the Product Lab data exists, and only that is counted.
      const activeProducts = fallbackProducts.filter((p) =>
        (ACTIVE_PRODUCT_STATUSES as readonly string[]).includes(p.status),
      ).length;
      const launched = fallbackProducts.filter((p) => p.status === "live").length;
      const activeExperiments = fallbackExperiments.filter((e) =>
        (ACTIVE_EXPERIMENT_STATUSES as readonly string[]).includes(e.status),
      ).length;

      return {
        projectsShipped: null,
        productsLaunched: launched > 0 ? launched : null,
        activeProducts: activeProducts > 0 ? activeProducts : null,
        activeExperiments: activeExperiments > 0 ? activeExperiments : null,
        industriesServed: null,
        happyClients: null,
      };
    }

    const [projects, products, experiments, customers, testimonials] = await Promise.all([
      db.from("projects").select("id, industry, delivered_on").eq("published", true),
      db.from("products").select("id, status").eq("published", true),
      db.from("experiments").select("id, status").eq("published", true),
      db.from("customers").select("id").eq("published", true).eq("is_public", true),
      db.from("testimonials").select("id, customer_id").eq("published", true),
    ]);

    for (const [scope, result] of Object.entries({ projects, products, experiments, customers, testimonials })) {
      if (result.error) reportQueryError(`metrics:${scope}`, result.error);
    }

    const projectRows = (projects.data ?? []) as { industry: string | null; delivered_on: string | null }[];
    const productRows = (products.data ?? []) as { status: string }[];
    const experimentRows = (experiments.data ?? []) as { status: string }[];
    const customerRows = (customers.data ?? []) as { id: string }[];
    const testimonialRows = (testimonials.data ?? []) as { customer_id: string | null }[];

    const delivered = projectRows.filter((p) => Boolean(p.delivered_on)).length;
    const launched = productRows.filter((p) => p.status === "live").length;
    const activeProducts = productRows.filter((p) =>
      (ACTIVE_PRODUCT_STATUSES as readonly string[]).includes(p.status),
    ).length;
    const activeExperiments = experimentRows.filter((e) =>
      (ACTIVE_EXPERIMENT_STATUSES as readonly string[]).includes(e.status),
    ).length;
    const industries = new Set(
      projectRows.map((p) => p.industry?.trim()).filter((i): i is string => Boolean(i)),
    ).size;

    // "Happy clients" is only claimed when there is a real customer record or a
    // real published testimonial behind it.
    const clientIds = new Set<string>();
    for (const c of customerRows) clientIds.add(c.id);
    for (const t of testimonialRows) if (t.customer_id) clientIds.add(t.customer_id);
    const clients = clientIds.size;

    const orNull = (n: number) => (n > 0 ? n : null);

    return {
      projectsShipped: orNull(delivered),
      productsLaunched: orNull(launched),
      activeProducts: orNull(activeProducts),
      activeExperiments: orNull(activeExperiments),
      industriesServed: orNull(industries),
      happyClients: orNull(clients),
    };
  },
  ["lab-metrics"],
  [TAGS.projects, TAGS.products, TAGS.experiments, TAGS.testimonials],
);

/**
 * The LAB SIGNAL readout. Priority order reflects what the lab is actually
 * busy with, and falls back to nothing at all when the lab is quiet.
 */
export type LabSignal =
  | { kind: "experiments"; count: number }
  | { kind: "products"; count: number }
  | { kind: "idle"; count: 0 };

export async function getLabSignal(): Promise<LabSignal> {
  const metrics = await getLabMetrics();
  if (metrics.activeExperiments) {
    return { kind: "experiments", count: metrics.activeExperiments };
  }
  if (metrics.activeProducts) {
    return { kind: "products", count: metrics.activeProducts };
  }
  return { kind: "idle", count: 0 };
}

/** The ordered metric list shown in the Lab Status panel. Nulls are filtered out. */
export function visibleMetrics(metrics: LabMetrics) {
  return [
    { label: "Projects shipped", value: metrics.projectsShipped },
    { label: "Products launched", value: metrics.productsLaunched },
    { label: "Active products", value: metrics.activeProducts },
    { label: "Active experiments", value: metrics.activeExperiments },
    { label: "Industries served", value: metrics.industriesServed },
    { label: "Happy clients", value: metrics.happyClients },
  ].filter((m): m is { label: string; value: number } => m.value !== null);
}
