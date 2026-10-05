import "server-only";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { createClient } from "@/lib/supabase/server";
import type { Database, Enums } from "@/types/database";

/**
 * Live counts behind /admin/dashboard, read with the session client so RLS
 * applies (only admins reach these tables). Callers must have passed
 * requireAdmin() first.
 */

type Client = Awaited<ReturnType<typeof createClient>>;
type LeadRow = Database["public"]["Tables"]["contact_leads"]["Row"];

export interface ContentCount {
  key: string;
  label: string;
  href: string;
  published: number;
  total: number;
}

export interface PagePathStat {
  path: string;
  views: number;
}

export interface DashboardStats {
  content: ContentCount[];
  newLeads: number;
  totalLeads: number;
  /** Page views in the last 7 days (0 when analytics is off). */
  pageViews7d: number;
  topPaths: PagePathStat[];
  recentLeads: Pick<
    LeadRow,
    "id" | "reference_id" | "name" | "company" | "status" | "priority" | "created_at"
  >[];
  activeSubscribers: number;
  totalSubscribers: number;
}

/**
 * `table` is a union of table names, which collapses the builder's column
 * types. Re-anchoring on one concrete table restores usable types; the
 * runtime query still uses the configured table (only count/star are used,
 * which every table supports).
 */
function anchor(client: Client, table: keyof Database["public"]["Tables"]) {
  return client.from(table as "services");
}

/** Head-count (no rows transferred) filtered to a content status. */
async function countPublished(
  client: Client,
  table: keyof Database["public"]["Tables"],
  status: Enums<"content_status"> = "published",
) {
  const { count, error } = await anchor(client, table).select("*", { count: "exact", head: true }).eq("status", status);
  if (error) throw error;
  return count ?? 0;
}

async function countAll(client: Client, table: keyof Database["public"]["Tables"]) {
  const { count, error } = await anchor(client, table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

const CONTENT_TABLES: { key: string; label: string; href: string; table: keyof Database["public"]["Tables"] }[] = [
  { key: "services", label: "Services", href: "/admin/services", table: "services" },
  { key: "projects", label: "Projects", href: "/admin/projects", table: "projects" },
  { key: "innovation", label: "Experiments", href: "/admin/innovation", table: "innovation_projects" },
  { key: "blog", label: "Articles", href: "/admin/blog", table: "blog_posts" },
  { key: "team", label: "Team members", href: "/admin/team", table: "team_members" },
  { key: "testimonials", label: "Testimonials", href: "/admin/testimonials", table: "testimonials" },
  { key: "technologies", label: "Technologies", href: "/admin/technologies", table: "technologies" },
  { key: "process", label: "Process steps", href: "/admin/process", table: "process_steps" },
  { key: "faqs", label: "FAQ entries", href: "/admin/faqs", table: "faq_items" },
];

/** All dashboard numbers in one round of parallel queries. */
export async function getDashboardStats(): Promise<QueryResult<DashboardStats>> {
  const supabase = await createClient();

  try {
    const [
      publishedCounts,
      totalCounts,
      newLeads,
      totalLeads,
      recentLeads,
      activeSubscribers,
      totalSubscribers,
    ] = await Promise.all([
      Promise.all(CONTENT_TABLES.map((entry) => countPublished(supabase, entry.table))),
      Promise.all(CONTENT_TABLES.map((entry) => countAll(supabase, entry.table))),
      supabase
        .from("contact_leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
      countAll(supabase, "contact_leads"),
      supabase
        .from("contact_leads")
        .select("id, reference_id, name, company, status, priority, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      countAll(supabase, "newsletter_subscribers"),
    ]);

    if (newLeads.error) throw newLeads.error;
    if (recentLeads.error) throw recentLeads.error;
    if (activeSubscribers.error) throw activeSubscribers.error;

    const content = CONTENT_TABLES.map((entry, index) => ({
      key: entry.key,
      label: entry.label,
      href: entry.href,
      published: publishedCounts[index] ?? 0,
      total: totalCounts[index] ?? 0,
    }));

    // Analytics is optional: a missing table or disabled counter must not
    // take the whole dashboard down.
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let pageViews7d = 0;
    let topPaths: PagePathStat[] = [];
    const views = await supabase
      .from("analytics_events")
      .select("path")
      .gte("created_at", since)
      .limit(5000);
    if (views.error) {
      console.error("[getDashboardStats] page views unavailable:", views.error.message);
    } else {
      const counts = new Map<string, number>();
      for (const row of views.data ?? []) {
        const path = String(row.path);
        counts.set(path, (counts.get(path) ?? 0) + 1);
      }
      pageViews7d = [...counts.values()].reduce((sum, value) => sum + value, 0);
      topPaths = [...counts.entries()]
        .map(([path, viewCount]) => ({ path, views: viewCount }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 6);
    }

    return {
      data: {
        content,
        newLeads: newLeads.count ?? 0,
        totalLeads,
        pageViews7d,
        topPaths,
        recentLeads: recentLeads.data ?? [],
        activeSubscribers: activeSubscribers.count ?? 0,
        totalSubscribers,
      },
      error: null,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return queryFailure("getDashboardStats", detail, "Dashboard numbers could not be loaded.");
  }
}
