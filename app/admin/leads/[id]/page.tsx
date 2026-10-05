import { Building2, CalendarDays, Inbox, Mail, Phone, Tag, TriangleAlert, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeadDangerZone } from "@/components/admin/leads/lead-danger-zone";
import { LeadNotes } from "@/components/admin/leads/lead-notes";
import { LeadPipelineForm } from "@/components/admin/leads/lead-pipeline-form";
import { Badge } from "@/components/ui/badge";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/constants/leads";
import { requireAdmin } from "@/lib/supabase/auth";
import { getLead, getLeadNotes } from "@/lib/supabase/queries/admin-leads";
import { formatDate } from "@/lib/utils/format";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LeadDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getLead(id);
  return { title: data ? `${data.reference_id} · ${data.name}` : "Lead" };
}

function detailRow(icon: LucideIcon, label: string, value: ReactNode) {
  const Icon = icon;
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-muted" />
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{label}</dt>
        <dd className="mt-0.5 break-words text-sm text-fg">{value}</dd>
      </div>
    </div>
  );
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/leads/${id}`);

  const { data: lead, error } = await getLead(id);
  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700"
      >
        <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <p>{error} Reload the page to try again.</p>
      </div>
    );
  }
  if (!lead) notFound();

  const { data: notes } = await getLeadNotes(lead.id);
  const receivedAt = Date.parse(lead.created_at);

  return (
    <>
      <AdminPageHeader
        back={{ href: "/admin/leads", label: "Leads" }}
        title={lead.name}
        description={
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{lead.reference_id}</span>
            <Badge variant={LEAD_STATUSES[lead.status].variant} dot>
              {LEAD_STATUSES[lead.status].label}
            </Badge>
            <Badge variant={LEAD_PRIORITIES[lead.priority].variant}>
              {LEAD_PRIORITIES[lead.priority].label}
            </Badge>
            <span>
              Received {Number.isNaN(receivedAt) ? "—" : formatDate(lead.created_at)}
            </span>
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:items-start">
        <div className="space-y-6">
          <section aria-labelledby="lead-request" className="rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <h2 id="lead-request" className="font-display text-h4 text-fg">
              What they asked for
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fg">{lead.description}</p>

            {lead.services.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Tag aria-hidden="true" className="size-4 text-fg-muted" />
                {lead.services.map((service) => (
                  <Badge key={service} variant="blue">
                    {service}
                  </Badge>
                ))}
              </div>
            ) : null}
          </section>

          <section aria-labelledby="lead-details" className="rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <h2 id="lead-details" className="font-display text-h4 text-fg">
              Contact details
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {detailRow(Mail, "Email", (
                <a href={`mailto:${lead.email}`} className="text-accent underline-offset-4 hover:underline">
                  {lead.email}
                </a>
              ))}
              {detailRow(Phone, "Phone", lead.phone ? (
                <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="text-accent underline-offset-4 hover:underline">
                  {lead.phone}
                </a>
              ) : null)}
              {detailRow(Building2, "Company", lead.company)}
              {detailRow(Inbox, "Project type", lead.project_type)}
              {detailRow(Tag, "Budget", lead.budget)}
              {detailRow(CalendarDays, "Timeline", lead.timeline)}
              {detailRow(CalendarDays, "Source", lead.source)}
            </dl>
          </section>

          <section aria-labelledby="lead-notes" className="rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <h2 id="lead-notes" className="font-display text-h4 text-fg">
              Internal notes
            </h2>
            <div className="mt-4">
              <LeadNotes
                leadId={lead.id}
                notes={(notes ?? []).map((note) => ({ id: note.id, note: note.note, created_at: note.created_at }))}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6" aria-label="Lead pipeline and actions">
          <section aria-labelledby="lead-pipeline" className="rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <h2 id="lead-pipeline" className="font-display text-h4 text-fg">
              Pipeline
            </h2>
            <div className="mt-4">
              <LeadPipelineForm id={lead.id} status={lead.status} priority={lead.priority} />
            </div>
          </section>

          <section aria-labelledby="lead-actions" className="rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <h2 id="lead-actions" className="font-display text-h4 text-fg">
              Manage
            </h2>
            <div className="mt-4">
              <LeadDangerZone
                id={lead.id}
                referenceId={lead.reference_id}
                name={lead.name}
                status={lead.status}
              />
            </div>
          </section>

          <p className="text-sm text-fg-muted">
            Looking for past enquiries?{" "}
            <Link href="/admin/leads" className="text-accent underline-offset-4 hover:underline">
              All leads
            </Link>{" "}
            are listed newest first.
          </p>
        </aside>
      </div>
    </>
  );
}
