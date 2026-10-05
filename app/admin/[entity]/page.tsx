import { Layers, Plus, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordControls } from "@/components/admin/record-controls";
import { ButtonLink } from "@/components/ui/button";
import { ENTITY_CONFIGS, isEntityKey } from "@/lib/admin/entities";
import { requireAdmin } from "@/lib/supabase/auth";
import { listEntityRows } from "@/lib/supabase/queries/admin-content";

interface EntityListPageProps {
  params: Promise<{ entity: string }>;
}

export async function generateMetadata({ params }: EntityListPageProps): Promise<Metadata> {
  const { entity } = await params;
  if (!isEntityKey(entity)) return { title: "Not found" };
  return { title: ENTITY_CONFIGS[entity].label };
}

export default async function EntityListPage({ params }: EntityListPageProps) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();

  const config = ENTITY_CONFIGS[entity];
  const listPath = `/admin/${config.key}`;
  await requireAdmin(listPath);

  const { data: rows, error } = await listEntityRows<Record<string, unknown>>(entity);

  return (
    <>
      <AdminPageHeader
        title={config.label}
        description={config.description}
        actions={
          <ButtonLink href={`${listPath}/new`}>
            <Plus aria-hidden="true" />
            New {config.singular.toLowerCase()}
          </ButtonLink>
        }
      />

      {rows === null ? (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{error} Reload the page to try again.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full brand-gradient-soft text-iris-600">
            <Layers aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-h4 text-fg">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-fg-muted">
            Create the first {config.singular.toLowerCase()}. It stays a draft, hidden from the site, until you publish it.
          </p>
          <ButtonLink href={`${listPath}/new`} className="mt-6">
            <Plus aria-hidden="true" />
            New {config.singular.toLowerCase()}
          </ButtonLink>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-xs">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <caption className="sr-only">{config.label} managed in the admin area</caption>
            <thead>
              <tr className="border-b border-line bg-surface-muted/60">
                {config.columns.map((column) => (
                  <th key={column.header} scope="col" className="px-5 py-3 font-medium text-fg-muted">
                    {column.header}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 text-right font-medium text-fg-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => {
                const id = String(row.id ?? "");
                const title = String(row.title ?? row.name ?? row.label ?? row.question ?? config.singular);
                return (
                  <tr key={id} className="align-middle">
                    {config.columns.map((column, index) => (
                      <td
                        key={column.header}
                        className={`px-5 py-4 text-fg-muted ${index === 1 ? "max-w-[22rem]" : ""}`}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <RecordControls
                        entity={config.key}
                        id={id}
                        title={title}
                        status={String(row.status ?? "draft")}
                        featured={row.featured === true}
                        hasFeatured={config.columns.some((column) => column.header === "Featured")}
                        orderable={config.orderBy === "sort_order"}
                        editHref={`${listPath}/${id}`}
                        publicHref={config.publicHref?.(row) ?? null}
                        deleteHint={config.deleteHint}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-sm text-fg-muted">
        Need to change where these appear on the site?{" "}
        <Link href="/admin/navigation" className="text-accent underline-offset-4 hover:underline">
          Navigation
        </Link>{" "}
        controls the menus.
      </p>
    </>
  );
}
