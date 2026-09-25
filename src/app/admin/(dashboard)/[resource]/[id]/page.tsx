import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResourceForm } from "@/components/admin/resource-form";
import { saveResource } from "@/actions/admin";
import { allFields, getResource, groupFields } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ resource: resourceKey, id }, { saved }] = await Promise.all([params, searchParams]);

  const resource = getResource(resourceKey);
  if (!resource) notFound();

  if (!isSupabaseConfigured) notFound();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error(`[inovexa:admin:edit:${resource.table}]`, error);
  if (!data) notFound();

  const record = data as Record<string, unknown>;
  const groups = groupFields(allFields(resource));
  const action = saveResource.bind(null, resource.key, id);

  const slug = typeof record.slug === "string" ? record.slug : null;
  const publicHref =
    resource.publicPath && slug ? absoluteUrl(`${resource.publicPath}/${slug}`) : null;

  const title = String(record[resource.titleField] ?? resource.singular);

  return (
    <div>
      <header className="mb-8">
        <Link
          href={`/admin/${resource.key}`}
          className="mono-label inline-flex items-center gap-2 text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-3" />
          {resource.label}
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-3xl font-medium tracking-tight text-bone">
              {title}
            </h1>
            <p className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash-deep">
              {slug ? <span>/{resource.publicPath ? `${resource.publicPath.slice(1)}/` : ""}{slug}</span> : null}
              <span>Updated {formatDate(record.updated_at as string)}</span>
              {record.created_at ? <span>Created {formatDate(record.created_at as string)}</span> : null}
            </p>
          </div>
        </div>

        {saved ? (
          <p
            role="status"
            className="mt-5 rounded-xl border border-signal/40 bg-signal/[0.07] px-4 py-3 text-sm text-bone"
          >
            Saved. The public site has been revalidated.
          </p>
        ) : null}
      </header>

      <ResourceForm
        action={action}
        groups={groups}
        defaults={record}
        isCreate={false}
        cancelHref={`/admin/${resource.key}`}
        publicHref={publicHref}
      />
    </div>
  );
}
