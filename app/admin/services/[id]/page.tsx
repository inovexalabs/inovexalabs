import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateService } from "@/app/admin/services/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { ServiceForm } from "@/components/admin/forms/service-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { ROUTES } from "@/lib/constants/routes";
import { requireAdmin } from "@/lib/supabase/auth";
import { getServiceForAdmin } from "@/lib/supabase/queries/admin-services";
import { formatDate } from "@/lib/utils/format";
import { uuidSchema } from "@/lib/validations/common";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  await requireAdmin(`/admin/services/${id}`);

  const { data: record, error } = await getServiceForAdmin(id);

  if (error) {
    return (
      <>
        <AdminPageHeader title="Edit service" back={{ href: "/admin/services", label: "Services" }} />
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error} Reload the page to try again.</p>
        </div>
      </>
    );
  }
  if (!record) notFound();

  const published = record.values.status === "published";

  return (
    <>
      <AdminPageHeader
        title={record.values.title}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <StatusBadge status={record.values.status} />
            <span>Last updated {formatDate(record.updatedAt)}</span>
          </span>
        }
        back={{ href: "/admin/services", label: "Services" }}
        actions={<DeleteServiceButton id={record.id} title={record.values.title} redirectTo="/admin/services" />}
      />
      <ServiceForm
        // Remount with fresh values after each save (updated_at changes).
        key={record.updatedAt}
        mode="edit"
        action={updateService.bind(null, record.id)}
        defaultValues={record.values}
        currentImageUrl={record.image?.url ?? null}
        publicUrl={published ? ROUTES.service(record.values.slug) : null}
      />
    </>
  );
}
