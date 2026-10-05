import { FileText, Inbox, Mail, Newspaper, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/constants/leads";
import { requireAdmin } from "@/lib/supabase/auth";
import { getDashboardStats } from "@/lib/supabase/queries/admin-dashboard";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Dashboard" };

function formatWhen(value: string): string {
  const time = Date.parse(value);
  return Number.isNaN(time) ? "—" : formatDate(value);
}

export default async function DashboardPage() {
  await requireAdmin("/admin/dashboard");
  const { data: stats, error } = await getDashboardStats();

  const headline = [
    { label: "New leads", value: stats?.newLeads ?? 0, href: "/admin/leads", icon: Inbox },
    { label: "Published articles", value: stats?.content.find((entry) => entry.key === "blog")?.published ?? 0, href: "/admin/blog", icon: FileText },
    { label: "Live projects", value: stats?.content.find((entry) => entry.key === "projects")?.published ?? 0, href: "/admin/projects", icon: Newspaper },
    { label: "Active subscribers", value: stats?.activeSubscribers ?? 0, href: "/admin/newsletter", icon: Mail },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="What is live on the site and what needs your attention right now."
        actions={
          <>
            <ButtonLink href="/admin/projects/new" variant="outline">
              New project
            </ButtonLink>
            <ButtonLink href="/admin/leads">Open leads</ButtonLink>
          </>
        }
      />

      {error ? (
        <div role="alert" className="mb-8 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error} Reload the page to try again.</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {headline.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-line bg-surface p-5 shadow-xs transition-colors hover:border-iris-500/40"
          >
            <span className="grid size-9 place-items-center rounded-md brand-gradient-soft text-iris-600">
              <Icon aria-hidden="true" className="size-4.5" />
            </span>
            <p className="mt-4 font-display text-h3 tabular-nums text-fg">{value}</p>
            <p className="mt-1 text-sm text-fg-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <section aria-labelledby="content-overview" className="rounded-xl border border-line bg-surface shadow-xs">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="content-overview" className="font-display text-h4 text-fg">
              Content on the site
            </h2>
            <p className="text-sm text-fg-muted">Published / total</p>
          </div>
          <ul className="divide-y divide-line">
            {(stats?.content ?? []).map((entry) => (
              <li key={entry.key}>
                <Link
                  href={entry.href}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-fg/[0.03]"
                >
                  <span className="text-sm font-medium text-fg">{entry.label}</span>
                  <span className="flex items-center gap-3 text-sm tabular-nums text-fg-muted">
                    {entry.published === 0 && entry.total > 0 ? (
                      <Badge variant="warning" dot>
                        Drafts only
                      </Badge>
                    ) : null}
                    <span>
                      <span className="font-medium text-fg">{entry.published}</span> / {entry.total}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
        <section aria-labelledby="recent-leads" className="rounded-xl border border-line bg-surface shadow-xs">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="recent-leads" className="font-display text-h4 text-fg">
              Recent leads
            </h2>
            <Link href="/admin/leads" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
              View all
            </Link>
          </div>
          {(stats?.recentLeads ?? []).length === 0 ? (
            <div className="px-5 py-10 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-full brand-gradient-soft text-iris-600">
                <Inbox aria-hidden="true" className="size-5" />
              </span>
              <p className="mt-3 text-sm text-fg-muted">
                No enquiries yet. Submissions from /contact appear here the moment they arrive.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {(stats?.recentLeads ?? []).map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-fg/[0.03]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-fg">
                        {lead.name}
                        {lead.company ? <span className="font-normal text-fg-muted"> · {lead.company}</span> : null}
                      </span>
                      <span className="block truncate text-xs text-fg-muted">
                        {lead.reference_id} · {formatWhen(lead.created_at)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Badge variant={LEAD_PRIORITIES[lead.priority].variant}>{LEAD_PRIORITIES[lead.priority].label}</Badge>
                      <Badge variant={LEAD_STATUSES[lead.status].variant} dot>
                        {LEAD_STATUSES[lead.status].label}
                      </Badge>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="traffic" className="rounded-xl border border-line bg-surface shadow-xs">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="traffic" className="font-display text-h4 text-fg">
              Page views
            </h2>
            <Badge variant="neutral">Last 7 days</Badge>
          </div>
          {stats && stats.pageViews7d > 0 ? (
            <>
              <p className="px-5 pt-4 font-display text-h3 tabular-nums text-fg">{stats.pageViews7d}</p>
              <ul className="mt-2 divide-y divide-line pb-2">
                {stats.topPaths.map((entry) => (
                  <li key={entry.path} className="flex items-center justify-between gap-4 px-5 py-2.5 text-sm">
                    <code className="truncate text-fg-muted">{entry.path}</code>
                    <span className="shrink-0 font-medium tabular-nums text-fg">{entry.views}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-fg-muted">
                {stats
                  ? "No views counted yet. Set an analytics ID in Site settings to start the first-party counter."
                  : "Page view numbers are unavailable right now."}
              </p>
              <Link href="/admin/settings" className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
                Open site settings
              </Link>
            </div>
          )}
        </section>
        </div>
      </div>
    </>
  );
}
