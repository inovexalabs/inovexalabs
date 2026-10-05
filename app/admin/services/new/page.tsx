import type { Metadata } from "next";
import { createService } from "@/app/admin/services/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/forms/service-form";
import { requireAdmin } from "@/lib/supabase/auth";
import { listServicesForAdmin } from "@/lib/supabase/queries/admin-services";
import { emptyServiceValues } from "@/lib/validations/service";

export const metadata: Metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireAdmin("/admin/services/new");

  // New services go to the end of the list by default.
  const { data: services } = await listServicesForAdmin();
  const nextOrder = services && services.length > 0 ? Math.max(...services.map((service) => service.sort_order)) + 10 : 10;

  return (
    <>
      <AdminPageHeader
        title="New service"
        description="Fill in the basics now and the rest later: sections you leave empty are hidden on the page."
        back={{ href: "/admin/services", label: "Services" }}
      />
      <ServiceForm mode="create" action={createService} defaultValues={emptyServiceValues(nextOrder)} currentImageUrl={null} />
    </>
  );
}
