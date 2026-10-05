import "server-only";
import { ilikeTerm } from "@/lib/supabase/queries/filter";
import { queryFailure, type QueryResult } from "@/lib/supabase/queries/result";
import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUS_KEYS } from "@/lib/constants/leads";
import type { Database, Enums } from "@/types/database";

/**
 * Admin-only lead reads (RLS has no public SELECT on contact_leads).
 * Callers must have passed requireAdmin() first.
 */

type Lead = Database["public"]["Tables"]["contact_leads"]["Row"];
type LeadNote = Database["public"]["Tables"]["lead_notes"]["Row"];

export type LeadListRow = Pick<
  Lead,
  "id" | "reference_id" | "name" | "email" | "company" | "project_type" | "status" | "priority" | "created_at"
>;

export interface LeadFilters {
  status?: string;
  q?: string;
}

/** True when `value` is a real `lead_status` enum value (guards the filter). */
function isLeadStatus(value: string | undefined): value is Enums<"lead_status"> {
  return Boolean(value && (LEAD_STATUS_KEYS as string[]).includes(value));
}

/** Leads, newest first, optionally filtered by pipeline status and free text. */
export async function listLeads(filters: LeadFilters): Promise<QueryResult<LeadListRow[]>> {
  const supabase = await createClient();

  let query = supabase
    .from("contact_leads")
    .select("id, reference_id, name, email, company, project_type, status, priority, created_at")
    .order("created_at", { ascending: false })
    .limit(250);

  if (isLeadStatus(filters.status)) query = query.eq("status", filters.status);

  const term = ilikeTerm(filters.q);
  if (term) {
    query = query.or(
      `name.ilike.${term},email.ilike.${term},company.ilike.${term},reference_id.ilike.${term}`,
    );
  }

  const { data, error } = await query;
  if (error) return queryFailure("listLeads", error.message, "Leads could not be loaded.");
  return { data: (data ?? []) as LeadListRow[], error: null };
}

/** One lead with every column. `null` with no error means "not found". */
export async function getLead(id: string): Promise<QueryResult<Lead | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return queryFailure("getLead", error.message, "This lead could not be loaded.");
  return { data, error: null };
}

/** Internal notes on a lead, newest first. */
export async function getLeadNotes(leadId: string): Promise<QueryResult<LeadNote[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_notes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) return queryFailure("getLeadNotes", error.message, "Notes could not be loaded.");
  return { data: data ?? [], error: null };
}
