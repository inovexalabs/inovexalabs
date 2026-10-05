import { notFound } from "next/navigation";
import { createRecord } from "@/app/admin/[entity]/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentFormShell } from "@/components/admin/content-form-shell";
import { EntityFields } from "@/components/admin/entity-fields";
import { ENTITY_CONFIGS, isEntityKey } from "@/lib/admin/entities";
import { requireAdmin } from "@/lib/supabase/auth";
import { nextEntitySortOrder } from "@/lib/supabase/queries/admin-content";

interface NewRecordPageProps {
  params: Promise<{ entity: string }>;
}

export default async function NewRecordPage({ params }: NewRecordPageProps) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();

  const config = ENTITY_CONFIGS[entity];
  const listPath = `/admin/${config.key}`;
  await requireAdmin(`${listPath}/new`);

  const sortOrder = await nextEntitySortOrder(entity);
  const defaultValues = config.empty(sortOrder);

  return (
    <>
      <AdminPageHeader
        title={`New ${config.singular.toLowerCase()}`}
        description="Fill in the basics now — sections you leave empty stay hidden on the page."
        back={{ href: listPath, label: config.label }}
      />
      <ContentFormShell
        entity={config.key}
        mode="create"
        action={createRecord.bind(null, config.key)}
        defaultValues={defaultValues}
        listPath={listPath}
        fields={<EntityFields entity={config.key} mode="create" />}
      />
    </>
  );
}
