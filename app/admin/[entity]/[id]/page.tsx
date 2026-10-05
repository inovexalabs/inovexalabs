import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateRecord } from "@/app/admin/[entity]/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentFormShell } from "@/components/admin/content-form-shell";
import { EntityFields } from "@/components/admin/entity-fields";
import { StatusBadge } from "@/components/admin/status-badge";
import { ENTITY_CONFIGS, isEntityKey } from "@/lib/admin/entities";
import { requireAdmin } from "@/lib/supabase/auth";
import { getEntityRow } from "@/lib/supabase/queries/admin-content";
import { mediaUrl } from "@/lib/utils/storage-url";
import { formatDate } from "@/lib/utils/format";
import { uuidSchema } from "@/lib/validations/common";

interface EditRecordPageProps {
  params: Promise<{ entity: string; id: string }>;
}

export async function generateMetadata({ params }: EditRecordPageProps): Promise<Metadata> {
  const { entity } = await params;
  if (!isEntityKey(entity)) return { title: "Not found" };
  return { title: `Edit ${ENTITY_CONFIGS[entity].singular.toLowerCase()}` };
}

export default async function EditRecordPage({ params }: EditRecordPageProps) {
  const { entity, id } = await params;
  if (!isEntityKey(entity)) notFound();
  if (!uuidSchema.safeParse(id).success) notFound();

  const config = ENTITY_CONFIGS[entity];
  const listPath = `/admin/${config.key}`;
  await requireAdmin(`${listPath}/${id}`);

  const { data: row, error } = await getEntityRow<Record<string, unknown>>(entity, id);

  if (error) {
    return (
      <>
        <AdminPageHeader title="Edit" back={{ href: listPath, label: config.label }} />
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error} Reload the page to try again.</p>
        </div>
      </>
    );
  }
  if (!row) notFound();

  const title = String(row.title ?? row.name ?? row.label ?? row.question ?? config.singular);
  const status = String(row.status ?? "draft");
  const imagePath = config.image ? (row[config.image.pathField] as string | null) : null;
  const currentImageUrl = imagePath ? mediaUrl(imagePath) : null;
  const publicHref = status === "published" ? (config.publicHref?.(row) ?? null) : null;
  const updatedAt = typeof row.updated_at === "string" ? row.updated_at : null;

  return (
    <>
      <AdminPageHeader
        title={title}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <StatusBadge status={status === "published" || status === "draft" || status === "archived" ? status : "draft"} />
            {updatedAt ? <span>Last updated {formatDate(updatedAt)}</span> : null}
          </span>
        }
        back={{ href: listPath, label: config.label }}
      />
      <ContentFormShell
        entity={config.key}
        mode="edit"
        action={updateRecord.bind(null, config.key, id)}
        defaultValues={config.toValues(row)}
        currentImageUrl={currentImageUrl}
        publicUrl={publicHref}
        listPath={listPath}
        fields={<EntityFields entity={config.key} mode="edit" />}
      />
    </>
  );
}
