"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { uuidSchema } from "@/lib/validations/common";
import { leadNoteSchema, leadUpdateSchema } from "@/lib/validations/lead";

const NOT_ALLOWED = "Your account doesn't have permission to manage leads.";

/** Dashboard and leads pages show these numbers/statuses. */
function revalidateLeadPages() {
  revalidatePath("/admin/leads", "page");
  revalidatePath("/admin/dashboard", "page");
}

/** Move a lead through the pipeline and set its priority. */
export async function updateLead(id: string, input: unknown): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("That lead could not be found.");

  const parsed = leadUpdateSchema.safeParse(input);
  if (!parsed.success) return actionError("That pipeline change is not valid.", toFieldErrors(parsed.error));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .update({ status: parsed.data.status, priority: parsed.data.priority })
    .eq("id", id)
    .select("id, reference_id")
    .maybeSingle();

  if (error) {
    console.error("[updateLead]", error.code, error.message);
    return actionError("The pipeline change could not be saved. Try again in a moment.");
  }
  if (!data) return actionError("This lead no longer exists. It may have been deleted.");

  revalidateLeadPages();
  return { ok: true, data: null, message: `${data.reference_id} updated.` };
}

/** Attach an internal note to a lead. */
export async function addLeadNote(id: string, formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("That lead could not be found.");

  const parsed = leadNoteSchema.safeParse({ note: formData.get("note") });
  if (!parsed.success) return actionError("Some fields need attention.", toFieldErrors(parsed.error));

  const supabase = await createClient();
  const { error } = await supabase
    .from("lead_notes")
    .insert({ lead_id: id, author_id: session.user.id, note: parsed.data.note });

  if (error) {
    console.error("[addLeadNote]", error.code, error.message);
    return actionError("The note could not be saved. Try again in a moment.");
  }

  revalidatePath("/admin/leads");
  return { ok: true, data: null, message: "Note added." };
}

/** Remove one internal note. */
export async function deleteLeadNote(noteId: string): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(noteId).success) return actionError("That note could not be found.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_notes")
    .delete()
    .eq("id", noteId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[deleteLeadNote]", error.code, error.message);
    return actionError("The note could not be deleted. Try again in a moment.");
  }
  if (!data) return actionError("That note was already deleted.");

  revalidatePath("/admin/leads");
  return { ok: true, data: null, message: "Note deleted." };
}

/** Permanently delete a lead. Notes cascade in the database. */
export async function deleteLead(id: string): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("That lead could not be found.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_leads")
    .delete()
    .eq("id", id)
    .select("id, reference_id")
    .maybeSingle();

  if (error) {
    console.error("[deleteLead]", error.code, error.message);
    return actionError("The lead could not be deleted. Try again in a moment.");
  }
  if (!data) return actionError("This lead was already deleted.");

  revalidateLeadPages();
  return { ok: true, data: null, message: `${data.reference_id} was deleted.` };
}
