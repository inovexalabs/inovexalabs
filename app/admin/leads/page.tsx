import { Inbox, Search, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LEAD_PRIORITIES, LEAD_STATUS_KEYS, LEAD_STATUSES } from "@/lib/constants/leads";
import { requireAdmin } from "@/lib/supabase/auth";
import { listLeads } from "@/lib/supabase/queries/admin-leads";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Leads" };

interface LeadsPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

function received(value: string): string {
  const time = Date.parse(value);
  return Number.isNaN(time) ? "—" : formatDate(value);
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  await requireAdmin("/admin/leads");
  const params = await searchParams;
  const status = params.status ?? "";
  const q = params.q ?? "";

  const { data: leads, error } = await listLeads({ status, q });
  const filtered = Boolean(status || q.trim());

  return (
    <>
      <AdminPageHeader
        title="Leads"
        description="Enquiries from /contact, newest first. Only admins can read them."
      />

      <form
        method="get"
        action="/admin/leads"
        className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-line bg-surface p-5 shadow-xs"
      >
        <FormField id="lead-q" label="Search" className="min-w-[14rem] flex-1">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
            />
            <Input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Name, email, company or reference"
              className="pl-10"
              {...fieldA11y("lead-q", {})}
            />
          </div>
        </FormField>

        <FormField id="lead-status-filter" label="Status" className="w-full sm:w-52">
          <Select
            name="status"
            defaultValue={status}
            {...fieldA11y("lead-status-filter", {})}
          >
            <option value="">All statuses</option>
            {LEAD_STATUS_KEYS.map((key) => (
              <option key={key} value={key}>
                {LEAD_STATUSES[key].label}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="flex gap-2">
          <Button type="submit">Filter</Button>
          {filtered ? (
            <Link
              href="/admin/leads"
              className="inline-flex h-11 items-center rounded-md px-4 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {error ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error} Reload the page to try again.</p>
        </div>
      ) : null}

      {!error && leads !== null && leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full brand-gradient-soft text-iris-600">
            <Inbox aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-h4 text-fg">
            {filtered ? "No leads match those filters" : "No leads yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-fg-muted">
            {filtered
              ? "Try a different status or search term."
              : "Submissions from the contact form will appear here the moment they arrive."}
          </p>
          {filtered ? (
            <Link href="/admin/leads" className="mt-6 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
              Show all leads
            </Link>
          ) : null}
        </div>
      ) : null}

      {leads !== null && leads.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-xs">
          <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
            <caption className="sr-only">Contact form enquiries</caption>
            <thead>
              <tr className="border-b border-line bg-surface-muted/60">
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Lead</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Company</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Project</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Status</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Priority</th>
                <th scope="col" className="px-5 py-3 font-medium text-fg-muted">Received</th>
                <th scope="col" className="px-5 py-3 text-right font-medium text-fg-muted">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((lead) => (
                <tr key={lead.id} className="align-middle">
                  <td className="max-w-[18rem] px-5 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block group">
                      <span className="block truncate font-medium text-fg group-hover:text-accent">{lead.name}</span>
                      <span className="block truncate text-sm text-fg-muted">{lead.email}</span>
                    </Link>
                  </td>
                  <td className="max-w-[12rem] px-5 py-4 text-fg-muted">
                    <span className="block truncate">{lead.company ?? "—"}</span>
                  </td>
                  <td className="max-w-[12rem] px-5 py-4 text-fg-muted">
                    <span className="block truncate">{lead.project_type}</span>
                    <span className="block truncate text-xs">{lead.reference_id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={LEAD_STATUSES[lead.status].variant} dot>
                      {LEAD_STATUSES[lead.status].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={LEAD_PRIORITIES[lead.priority].variant}>
                      {LEAD_PRIORITIES[lead.priority].label}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-fg-muted">{received(lead.created_at)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex h-9 items-center rounded-md border border-line px-3 text-sm font-medium text-fg transition-colors hover:border-iris-500/40 hover:text-accent"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {leads !== null && leads.length > 0 ? (
        <p className="mt-4 text-sm text-fg-muted">
          Showing {leads.length}
          {leads.length >= 250 ? " (first 250)" : ""} lead{leads.length === 1 ? "" : "s"}.
        </p>
      ) : null}
    </>
  );
}
