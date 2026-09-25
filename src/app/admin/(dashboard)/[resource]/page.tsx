import { notFound } from "next/navigation";
import { ResourceTable } from "@/components/admin/resource-table";
import { getResource } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ deleted?: string }>;
}) {
  const [{ resource: resourceKey }, { deleted }] = await Promise.all([params, searchParams]);
  const resource = getResource(resourceKey);
  if (!resource) notFound();

  let rows: Record<string, unknown>[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from(resource.table)
      .select("*")
      .order(resource.orderBy.column, { ascending: resource.orderBy.ascending })
      .limit(500);

    if (error) {
      console.error(`[inovexa:admin:list:${resource.table}]`, error);
    }
    rows = (data ?? []) as Record<string, unknown>[];
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-medium tracking-tight text-bone">
          {resource.label}
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ash">
          {resource.description}
          {resource.publicPath ? (
            <>
              {" "}
              Public pages live under{" "}
              <code className="font-mono text-[0.85em] text-signal">{resource.publicPath}</code>.
            </>
          ) : null}
        </p>
        {deleted ? (
          <p
            role="status"
            className="mt-5 rounded-xl border border-signal/40 bg-signal/[0.07] px-4 py-3 text-sm text-bone"
          >
            Record deleted.
          </p>
        ) : null}
      </header>

      <ResourceTable resource={resource} rows={rows} />
    </div>
  );
}
