"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { allFields, getResource, type ResourceDef } from "@/lib/admin/resources";
import { coerceForm } from "@/lib/admin/coerce";
import type { AdminActionState } from "@/lib/admin/form-state";

/**
 * Public content is cached by tag. Any admin write invalidates the affected
 * tags so the public site reflects the change on the next request — no
 * redeploy, no stale page. `revalidatePath("/", "layout")` catches anything
 * that renders globally, such as the header navigation and footer.
 */
function revalidateResource(resource: ResourceDef) {
  for (const tag of resource.tags) {
    revalidateTag(tag);
  }
  // Metrics and navigation depend on several tables at once.
  revalidateTag("settings");
  revalidateTag("seo");
  revalidatePath("/", "layout");
  if (resource.publicPath) revalidatePath(resource.publicPath, "layout");
}

export async function saveResource(
  resourceKey: string,
  id: string | null,
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const resource = getResource(resourceKey);
  if (!resource) return { status: "error", message: "Unknown content type." };

  const fields = allFields(resource);
  const isCreate = !id;

  if (isCreate && !resource.canCreate) {
    return { status: "error", message: "This content type cannot be created from the dashboard." };
  }

  const { row, errors } = coerceForm(resource, fields, formData, { isCreate });

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: errors,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error, data } = isCreate
    ? await supabase.from(resource.table).insert(row).select("id").single()
    : await supabase.from(resource.table).update(row).eq("id", id).select("id").single();

  if (error) {
    console.error(`[inovexa:admin:${resource.table}]`, error);

    // Surface the two mistakes an editor can actually fix.
    if (error.code === "23505") {
      return {
        status: "error",
        message: "That slug is already in use. Choose a different one.",
        fieldErrors: { slug: "Already in use." },
      };
    }
    if (error.code === "42501") {
      return {
        status: "error",
        message:
          "Your account is not on the admin allowlist, so the database rejected this write.",
      };
    }
    return {
      status: "error",
      message: `Could not save: ${error.message}`,
    };
  }

  revalidateResource(resource);

  const savedId = (data as { id?: string } | null)?.id;
  redirect(
    savedId && isCreate
      ? `/admin/${resource.key}/${savedId}?saved=1`
      : `/admin/${resource.key}/${id}?saved=1`,
  );
}

export async function deleteResource(resourceKey: string, id: string) {
  await requireAdmin();

  const resource = getResource(resourceKey);
  if (!resource) return;
  if (!resource.canDelete) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(resource.table).delete().eq("id", id);

  if (error) {
    console.error(`[inovexa:admin:delete:${resource.table}]`, error);
  }

  revalidateResource(resource);
  redirect(`/admin/${resource.key}?deleted=1`);
}

/**
 * Publish toggle used by the list view. Kept as a separate action from the edit
 * form so flipping a record live is one click from the list.
 */
export async function togglePublished(resourceKey: string, id: string, next: boolean) {
  await requireAdmin();

  const resource = getResource(resourceKey);
  if (!resource || !resource.publishable) return;

  const supabase = await createSupabaseServerClient();
  const patch: Record<string, unknown> = { published: next };

  // Stamp the publish date the first time something goes live.
  if (next) {
    const { data } = await supabase
      .from(resource.table)
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    if (data && !(data as { published_at: string | null }).published_at) {
      patch.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from(resource.table).update(patch).eq("id", id);
  if (error) console.error(`[inovexa:admin:toggle:${resource.table}]`, error);

  revalidateResource(resource);
  revalidatePath(`/admin/${resource.key}`);
}

/** Sign out of the admin session. */
export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
