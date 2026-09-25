import Link from "next/link";
import { ArrowRight, Inbox, Plus } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { RESOURCES } from "@/lib/admin/resources";
import { StatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { visibleMetrics } from "@/lib/queries/metrics";
import { getLabMetrics } from "@/lib/queries/metrics";

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-medium tracking-tight text-bone">
          Supabase is not configured
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-bone-dim">
          The control room needs a database. Set <code className="font-mono text-signal">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="font-mono text-signal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
          <code className="font-mono text-signal">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
          <code className="font-mono text-bone">.env.local</code>, run the migrations in{" "}
          <code className="font-mono text-bone">supabase/migrations</code>, then add your user to{" "}
          <code className="font-mono text-bone">admin_users</code>.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();

  const [metrics, recentInquiries, draftCounts] = await Promise.all([
    getLabMetrics(),
    supabase
      .from("contact_inquiries")
      .select("id, name, email, company, project_type, budget_range, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    Promise.all(
      RESOURCES.filter((resource) => resource.publishable).map(async (resource) => {
        const { count } = await supabase
          .from(resource.table)
          .select("id", { count: "exact", head: true })
          .eq("published", false);
        return { resource, drafts: count ?? 0 };
      }),
    ),
  ]);

  const inquiries = (recentInquiries.data ?? []) as {
    id: string;
    name: string;
    email: string;
    company: string | null;
    project_type: string | null;
    budget_range: string | null;
    status: string;
    created_at: string;
  }[];

  const drafts = draftCounts.filter((entry) => entry.drafts > 0);
  const stats = visibleMetrics(metrics);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-bone">
            Lab status
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-ash">
            Everything public on the site is edited here. Saves invalidate the relevant caches
            immediately, so changes appear without a redeploy.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            New product
          </Link>
        </Button>
      </div>

      {/* The same metrics the public site shows — one source of truth. */}
      <section>
        <h2 className="mono-label text-ash-deep">Public metrics</h2>
        {stats.length > 0 ? (
          <dl className="mt-5 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-carbon p-5">
                <dd className="font-mono text-2xl tabular-nums text-bone">
                  {String(stat.value).padStart(2, "0")}
                </dd>
                <dt className="mono-label mt-2.5 text-ash-deep">{stat.label}</dt>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-5 rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60 p-6 text-sm leading-relaxed text-ash">
            No metrics are being displayed publicly yet — every figure on the site is counted from
            real records, and a metric with nothing behind it is hidden rather than estimated.
            Publishing and delivering work will populate this panel automatically.
          </p>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* Recent inquiries */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="mono-label text-ash-deep">Recent inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-signal hover:underline"
            >
              View all →
            </Link>
          </div>

          {inquiries.length > 0 ? (
            <ul className="mt-5 divide-y divide-steel overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-carbon">
              {inquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-graphite"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-bone">
                        {inquiry.name}
                        {inquiry.company ? (
                          <span className="text-ash"> · {inquiry.company}</span>
                        ) : null}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash-deep">
                        {inquiry.project_type ?? "Unspecified"}
                        {inquiry.budget_range ? ` · ${inquiry.budget_range}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[0.625rem] text-ash-deep">
                      {formatDate(inquiry.created_at)}
                    </span>
                    <StatusPill label={inquiry.status.replace(/_/g, " ")} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60 p-8">
              <Inbox aria-hidden className="size-5 text-ash-deep" />
              <p className="mt-4 font-display text-base text-bone">No inquiries yet.</p>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                Submissions from the contact form land here. They are stored with the service-role
                key on the server, so the public anon key can never read them.
              </p>
            </div>
          )}
        </div>

        {/* Drafts + quick links */}
        <div className="space-y-6">
          <div>
            <h2 className="mono-label text-ash-deep">Unpublished drafts</h2>
            {drafts.length > 0 ? (
              <ul className="mt-5 space-y-2.5">
                {drafts.map(({ resource, drafts: count }) => (
                  <li key={resource.key}>
                    <Link
                      href={`/admin/${resource.key}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-steel bg-carbon px-4 py-3 transition-colors hover:border-signal/40"
                    >
                      <span className="text-sm text-bone-dim">{resource.label}</span>
                      <span className="font-mono text-[0.6875rem] tabular-nums text-ember">
                        {count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-steel bg-carbon/60 px-4 py-5 text-sm text-ash">
                Nothing is sitting unpublished.
              </p>
            )}
          </div>

          <div>
            <h2 className="mono-label text-ash-deep">Manage content</h2>
            <ul className="mt-5 grid grid-cols-2 gap-2">
              {RESOURCES.slice(0, 8).map((resource) => (
                <li key={resource.key}>
                  <Link
                    href={`/admin/${resource.key}`}
                    className="flex h-full flex-col justify-between gap-3 rounded-xl border border-steel bg-carbon p-3.5 transition-colors hover:border-signal/40"
                  >
                    <span className="text-sm text-bone-dim">{resource.label}</span>
                    <ArrowRight className="size-3.5 text-ash-deep" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
