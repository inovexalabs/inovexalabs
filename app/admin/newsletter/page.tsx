import { Mail, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SubscriberControls } from "@/components/admin/newsletter/subscriber-controls";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { SUBSCRIBER_STATUSES } from "@/lib/constants/leads";
import { formatDate } from "@/lib/utils/format";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Newsletter" };

type Subscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

interface NewsletterPageProps {
  searchParams: Promise<{ show?: string }>;
}

function joined(value: string): string {
  const time = Date.parse(value);
  return Number.isNaN(time) ? "—" : formatDate(value);
}

export default async function NewsletterPage({ searchParams }: NewsletterPageProps) {
  await requireAdmin("/admin/newsletter");
  const { show } = await searchParams;
  const showAll = show === "all";

  const supabase = await createClient();

  const [activeCount, totalCount, listResult] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    showAll
      ? supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(250)
      : supabase
          .from("newsletter_subscribers")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(250),
  ]);

  const listError = listResult.error?.message ?? activeCount.error?.message ?? totalCount.error?.message ?? null;
  const subscribers: Subscriber[] = (listResult.data ?? []) as Subscriber[];

  return (
    <>
      <AdminPageHeader
        title="Newsletter"
        description="Everyone who opted in from the footer or contact form. Unsubscribed addresses stay on file but receive nothing."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active subscribers", value: activeCount.count ?? 0 },
          { label: "Unsubscribed", value: Math.max(0, (totalCount.count ?? 0) - (activeCount.count ?? 0)) },
          { label: "Total on file", value: totalCount.count ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line bg-surface p-5 shadow-xs">
            <p className="font-display text-h3 tabular-nums text-fg">{stat.value}</p>
            <p className="mt-1 text-sm text-fg-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {listError ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{listError} Reload the page to try again.</p>
        </div>
      ) : null}

      {!listError && subscribers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full brand-gradient-soft text-iris-600">
            <Mail aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-h4 text-fg">
            {showAll ? "No subscribers yet" : "No active subscribers yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-fg-muted">
            Sign-ups from the newsletter form appear here immediately.
          </p>
        </div>
      ) : null}

      {subscribers.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-xs">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <caption className="sr-only">Newsletter subscribers</caption>
            <thead>
              <tr className="border-b border-line bg-surface-muted/60">
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Email</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Source</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Status</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Joined</th>
                <th scope="col" className="px-5 py-3 text-right font-medium text-fg-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="align-middle">
                  <td className="max-w-[20rem] px-5 py-4">
                    <span className="block truncate font-medium text-fg">{subscriber.email}</span>
                  </td>
                  <td className="px-5 py-4 text-fg-muted">{subscriber.source}</td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={SUBSCRIBER_STATUSES[subscriber.status].variant}
                      dot
                    >
                      {SUBSCRIBER_STATUSES[subscriber.status].label}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-fg-muted">{joined(subscriber.created_at)}</td>
                  <td className="px-5 py-4">
                    <SubscriberControls id={subscriber.id} email={subscriber.email} status={subscriber.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-fg-muted">
        <p>
          {showAll
            ? "Showing everyone on file."
            : "Showing active subscribers only."}
        </p>
        <a
          href={showAll ? "/admin/newsletter" : "/admin/newsletter?show=all"}
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {showAll ? "Show active only" : "Show everyone, including unsubscribed"}
        </a>
      </div>
    </>
  );
}
