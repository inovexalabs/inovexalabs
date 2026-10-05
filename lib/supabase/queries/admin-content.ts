import "server-only";
import { getEntityConfig, type AdminEntityKey, type EntityConfig } from "@/lib/admin/entities";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

/**
 * Admin reads use the session client: RLS lets admins see drafts and archived
 * rows. Callers must already have passed requireAdmin().
 */

function configOrFailure(entity: string): EntityConfig | null {
  return getEntityConfig(entity);
}

/**
 * `config.table` is a union of table names, which collapses Supabase's column
 * types to `never`. Re-anchoring the builder on one concrete table restores
 * usable types; the results are cast to the caller's row shape anyway.
 */
function tableBuilder(supabase: Awaited<ReturnType<typeof createClient>>, table: keyof Database["public"]["Tables"]) {
  return supabase.from(table as "services");
}

/** All rows for one entity in admin order. `R` is the caller's row shape. */
export async function listEntityRows<R>(entity: AdminEntityKey): Promise<QueryResult<R[]>> {
  const config = configOrFailure(entity);
  if (!config) return queryFailure("listEntityRows", `Unknown entity ${entity}`, "That section does not exist.");

  const supabase = await createClient();
  const { data, error } = await tableBuilder(supabase, config.table)
    .select(config.listColumns)
    .order(config.orderBy, { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) return queryFailure("listEntityRows", error.message, `${config.label} could not be loaded.`);
  return { data: (data ?? []) as unknown as R[], error: null };
}

/** One row (all columns) for editing. `null` with no error means "not found". */
export async function getEntityRow<R>(entity: AdminEntityKey, id: string): Promise<QueryResult<R | null>> {
  const config = configOrFailure(entity);
  if (!config) return queryFailure("getEntityRow", `Unknown entity ${entity}`, "That section does not exist.");

  const supabase = await createClient();
  const { data, error } = await tableBuilder(supabase, config.table).select("*").eq("id", id).maybeSingle();

  if (error) return queryFailure("getEntityRow", error.message, `This record could not be loaded.`);
  return { data: (data ?? null) as unknown as R | null, error: null };
}

/** Next free sort order so a new record lands at the end of the list. */
export async function nextEntitySortOrder(entity: AdminEntityKey): Promise<number> {
  const config = configOrFailure(entity);
  if (!config) return 10;

  const supabase = await createClient();
  const { data } = await tableBuilder(supabase, config.table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || typeof data.sort_order !== "number") return 10;
  return data.sort_order + 10;
}
