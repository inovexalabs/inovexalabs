import { ExternalLink, Layers, Pencil, Plus, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { getServiceIcon } from "@/lib/constants/service-icons";
import { requireAdmin } from "@/lib/supabase/auth";
import { listServicesForAdmin, type AdminServiceRow } from "@/lib/supabase/queries/admin-services";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  await requireAdmin("/admin/services");
  const { data: services, error } = await listServicesForAdmin();

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Each service has its own page and appears in the Solutions menu, the homepage and the services list once published."
        actions={
          <ButtonLink href="/admin/services/new">
            <Plus aria-hidden="true" />
            New service
          </ButtonLink>
        }
      />

      {services === null ? (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error} Reload the page to try again.</p>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full brand-gradient-soft text-iris-600">
            <Layers aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-h4 text-fg">No services yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-fg-muted">
            Create your first service. It stays a draft, hidden from the site, until you publish it.
          </p>
          <ButtonLink href="/admin/services/new" className="mt-6">
            <Plus aria-hidden="true" />
            New service
          </ButtonLink>
        </div>
      ) : (
        <ServiceList services={services} />
      )}
    </>
  );
}

function ServiceList({ services }: { services: AdminServiceRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[4rem_minmax(0,1fr)_8rem_8rem_8.5rem] gap-4 border-b border-line bg-surface-muted/60 px-5 py-3 text-sm font-medium text-fg-muted md:grid"
      >
        <span>Order</span>
        <span>Service</span>
        <span>Status</span>
        <span>Updated</span>
        <span className="text-right">Actions</span>
      </div>
      <ul className="divide-y divide-line">
        {services.map((service) => {
          const Icon = getServiceIcon(service.icon);
          const editHref = `/admin/services/${service.id}`;
          return (
            <li
              key={service.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 md:grid-cols-[4rem_minmax(0,1fr)_8rem_8rem_8.5rem]"
            >
              <p className="hidden tabular-nums text-fg-muted md:block">
                <span className="sr-only">Order </span>
                {service.sort_order}
              </p>
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-md border border-iris-500/15 brand-gradient-soft text-iris-600"
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <Link href={editHref} className="block truncate rounded-xs font-medium text-fg hover:text-accent">
                    {service.title}
                  </Link>
                  <p className="truncate text-sm text-fg-muted">/services/{service.slug}</p>
                </div>
              </div>
              <div className="col-start-1 flex flex-wrap items-center gap-x-3 gap-y-1 md:col-start-auto md:block">
                <span className="sr-only">Status: </span>
                <StatusBadge status={service.status} />
                <span className="text-sm text-fg-muted md:hidden">Updated {formatDate(service.updated_at)}</span>
              </div>
              <p className="hidden text-sm text-fg-muted md:block">
                <span className="sr-only">Updated </span>
                {formatDate(service.updated_at)}
              </p>
              <div className="col-start-2 row-span-2 row-start-1 flex justify-end gap-1 md:col-start-auto md:row-span-1 md:row-start-auto">
                <ButtonLink
                  href={editHref}
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label={`Edit ${service.title}`}
                >
                  <Pencil aria-hidden="true" />
                </ButtonLink>
                {service.status === "published" ? (
                  <ButtonLink
                    href={ROUTES.service(service.slug)}
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    aria-label={`View ${service.title} on the site (opens in a new tab)`}
                    external
                  >
                    <ExternalLink aria-hidden="true" />
                  </ButtonLink>
                ) : null}
                <DeleteServiceButton id={service.id} title={service.title} compact />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
