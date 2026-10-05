"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  ENTITY_CACHE_TAG,
  getEntityConfig,
  publicPathsFor,
  type AdminEntityKey,
  type EntityConfig,
} from "@/lib/admin/entities";
import { getAdminSession } from "@/lib/supabase/auth";
import { removeImages, uploadImage, validateImageFile, isMediaFolder } from "@/lib/supabase/media";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { mediaUrl } from "@/lib/utils/storage-url";
import { uuidSchema } from "@/lib/validations/common";
import type { Database } from "@/types/database";

type ImageAction = "keep" | "remove" | "replace";

const NOT_ALLOWED = "Your account doesn't have permission to manage content.";

/**
 * `config.table` is a union of table names, which collapses Supabase's column
 * types to `never`. Re-anchoring the builder on one concrete table keeps the
 * builder methods usable — the runtime query still uses the configured table.
 * Rows are read as `EntityRow` because the registry spans every content table.
 */
function entityBuilder(supabase: SupabaseClient<Database>, table: keyof Database["public"]["Tables"]) {
  return supabase.from(table as "services");
}

/**
 * A stored row from any of the registry's tables, read without a fixed shape.
 * Every value a Supabase row can carry is spelled out — no `any`.
 */
type EntityRowValue = string | number | boolean | null | undefined | EntityRowValue[] | { [key: string]: EntityRowValue };
type EntityRow = Record<string, EntityRowValue>;

async function readRow(
  supabase: SupabaseClient<Database>,
  table: keyof Database["public"]["Tables"],
  id: string,
): Promise<{ row: EntityRow | null; error: { code?: string; message: string } | null }> {
  const { data, error } = await entityBuilder(supabase, table).select("*").eq("id", id).maybeSingle();
  if (error) return { row: null, error };
  return { row: (data as EntityRow | null) ?? null, error: null };
}

interface ParsedSubmission {
  values: Record<string, unknown>;
  imageAction: ImageAction;
  file: File | null;
}

type ResolveResult = { ok: true; config: EntityConfig } | { ok: false; failure: ActionResult<never> };

function resolve(entity: string): ResolveResult {
  const config = getEntityConfig(entity);
  if (!config) return { ok: false, failure: actionError("That content section does not exist.") };
  return { ok: true, config };
}

/** Reads the multipart submission: JSON payload, image action and optional file. */
function parseSubmission(formData: FormData, config: EntityConfig): ActionResult<ParsedSubmission> {
  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") return actionError("The form could not be read. Reload the page and try again.");

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return actionError("The form could not be read. Reload the page and try again.");
  }

  const parsed = config.schema.safeParse(payload);
  if (!parsed.success) return actionError("Some fields need attention.", toFieldErrors(parsed.error));

  const imageAction = z.enum(["keep", "remove", "replace"]).catch("keep").parse(formData.get("imageAction"));
  const file = formData.get("image");

  if (imageAction === "replace") {
    if (!(file instanceof File) || file.size === 0) {
      return actionError("Choose an image to upload.", { image: "Choose an image to upload." });
    }
    const problem = validateImageFile(file);
    if (problem) return actionError(problem, { image: problem });
    return { ok: true, data: { values: parsed.data, imageAction, file }, message: "" };
  }

  return { ok: true, data: { values: parsed.data, imageAction, file: null }, message: "" };
}

/** The image path must carry alt text before it can be stored. */
function requireAlt(config: EntityConfig, values: Record<string, unknown>): ActionResult<never> | null {
  if (!config.image) return null;
  const alt = values[config.image.altField];
  if (typeof alt === "string" && alt.trim().length > 0) return null;
  const message = "Describe the image for people who can't see it.";
  return actionError(message, { [config.image.altField]: message });
}

function databaseError(error: { code?: string; message: string }, label: string): ActionResult<never> {
  if (error.code === "23505") {
    return actionError("Another record already uses this slug.", {
      slug: "Another record already uses this slug. Choose a different one.",
    });
  }
  if (error.code === "23514") {
    console.error(`[${label}] check constraint failed:`, error.message);
    return actionError("Some content is outside the allowed limits. Check lengths and list items, then try again.");
  }
  if (error.code === "42501") return actionError(NOT_ALLOWED);
  console.error(`[${label}] database error:`, error.code, error.message);
  return actionError("The record could not be saved. Try again in a moment.");
}

function revalidateEntity(entity: AdminEntityKey, rows: Record<string, unknown>[]) {
  revalidateTag(ENTITY_CACHE_TAG[entity]);
  revalidatePath("/admin", "layout");
  for (const row of rows) {
    for (const path of publicPathsFor(entity, row)) revalidatePath(path);
  }
}

/** Human label for toast messages, derived from the submitted values. */
function displayTitle(values: Record<string, unknown>): string {
  const candidate = values.title ?? values.name ?? values.label ?? values.question;
  return typeof candidate === "string" && candidate.trim() ? `“${candidate}”` : "Record";
}

export async function createRecord(entityKey: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const resolved = resolve(entityKey);
  if (!resolved.ok) return resolved.failure;
  const config = resolved.config;
  const entity = config.key;

  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);

  const submission = parseSubmission(formData, config);
  if (!submission.ok) return submission;
  const { values, imageAction, file } = submission.data;

  let imagePath: string | null = null;
  if (imageAction === "replace" && file) {
    const missingAlt = requireAlt(config, values);
    if (missingAlt) return missingAlt;

    const supabase = await createClient();
    const upload = await uploadImage(supabase, config.image?.folder ?? "site", file);
    if ("error" in upload) return actionError(upload.error);
    imagePath = upload.path;
  }

  const supabase = await createClient();
  const row = config.toRow(values, imagePath);
  const { data, error } = await entityBuilder(supabase, config.table)
    .insert(row as never)
    .select("id")
    .single();

  if (error) {
    if (imagePath) await removeImages(supabase, [imagePath]);
    return databaseError(error, entity);
  }

  revalidateEntity(entity, [{ ...values, ...row }]);
  return { ok: true, data: { id: data.id as string }, message: `${displayTitle(values)} was created.` };
}

export async function updateRecord(entityKey: string, id: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const resolved = resolve(entityKey);
  if (!resolved.ok) return resolved.failure;
  const config = resolved.config;
  const entity = config.key;

  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("This record could not be found.");

  const submission = parseSubmission(formData, config);
  if (!submission.ok) return submission;
  const { values, imageAction, file } = submission.data;

  const supabase = await createClient();
  const { row: existing, error: readError } = await readRow(supabase, config.table, id);
  if (readError) return databaseError(readError, entity);
  if (!existing) return actionError("This record no longer exists. It may have been deleted.");

  const keepPath =
    imageAction === "keep" || !config.image
      ? (existing[config.image?.pathField ?? ""] as string | null) ?? null
      : null;

  const requiresAlt = imageAction === "replace" || keepPath !== null;
  if (requiresAlt) {
    const missingAlt = requireAlt(config, values);
    if (missingAlt) return missingAlt;
  }

  let uploadedPath: string | null = null;
  if (imageAction === "replace" && file) {
    const upload = await uploadImage(supabase, config.image?.folder ?? "site", file);
    if ("error" in upload) return actionError(upload.error);
    uploadedPath = upload.path;
  }

  const nextImage = config.image
    ? {
        [config.image.pathField]: uploadedPath ?? keepPath,
        [config.image.altField]: uploadedPath || keepPath ? (values[config.image.altField] as string) : null,
      }
    : {};

  const row = { ...config.toRow(values, uploadedPath ?? keepPath), ...nextImage };

  // Blog: stamp the publication date the first time a post goes live.
  if (entity === "blog") {
    const publishedNow = String(values.status) === "published" && !existing.published_at;
    if (publishedNow) Object.assign(row, { published_at: new Date().toISOString() });
    if (String(values.status) !== "published" && existing.published_at) {
      Object.assign(row, { published_at: existing.published_at });
    }
  }

  const { error } = await entityBuilder(supabase, config.table)    .update(row as never).eq("id", id);
  if (error) {
    if (uploadedPath) await removeImages(supabase, [uploadedPath]);
    return databaseError(error, entity);
  }

  // Gallery: drop images the record no longer references.
  const cleanup: string[] = [];
  if (imageAction === "remove" || uploadedPath) cleanup.push(existing[config.image?.pathField ?? ""] as string);
  if (entity === "projects") {
    const previous = Array.isArray(existing.gallery)
      ? (existing.gallery as { path?: string | null }[]).map((entry) => entry.path)
      : [];
    const next = Array.isArray(values.gallery)
      ? (values.gallery as { path?: string | null }[]).map((entry) => entry.path)
      : [];
    for (const path of previous) {
      if (path && !next.includes(path)) cleanup.push(path);
    }
  }
  await removeImages(supabase, cleanup);

  revalidateEntity(entity, [{ ...values, ...row }]);
  return { ok: true, data: { id }, message: "Changes saved." };
}

export async function deleteRecord(entityKey: string, id: string): Promise<ActionResult> {
  const resolved = resolve(entityKey);
  if (!resolved.ok) return resolved.failure;
  const config = resolved.config;

  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("This record could not be found.");

  const supabase = await createClient();
  const { data: deleted, error } = await entityBuilder(supabase, config.table)
    .delete()
    .eq("id", id)
    .select("*")
    .maybeSingle();
  const data = deleted as EntityRow | null;

  if (error) return databaseError(error, config.key);
  if (!data) return actionError("This record was already deleted.");

  const images: (string | null)[] = [];
  if (config.image) images.push(data[config.image.pathField] as string | null);
  if (config.key === "projects" && Array.isArray(data.gallery)) {
    for (const entry of data.gallery as { path?: string | null }[]) images.push(entry.path ?? null);
  }
  await removeImages(supabase, images);

  revalidateEntity(config.key, [data]);
  const title = String(data.title ?? data.name ?? data.label ?? data.question ?? "Record");
  return { ok: true, data: null, message: `“${title}” was deleted.` };
}

const toggleSchema = z.object({ field: z.enum(["status", "featured"]), value: z.string().min(1).max(20) });

/** Publish/unpublish or feature/unfeature from the list. */
export async function setRecordState(entityKey: string, id: string, input: unknown): Promise<ActionResult> {
  const resolved = resolve(entityKey);
  if (!resolved.ok) return resolved.failure;
  const config = resolved.config;

  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("This record could not be found.");

  const parsed = toggleSchema.safeParse(input);
  if (!parsed.success) return actionError("That change is not valid.");

  const { field, value } = parsed.data;
  const patch: Record<string, unknown> =
    field === "featured"
      ? { featured: value === "true" }
      : { status: value };

  const supabase = await createClient();

  if (config.key === "blog" && field === "status") {
    const { row: current } = await readRow(supabase, config.table, id);
    if (value === "published" && current && !current.published_at) {
      patch.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await entityBuilder(supabase, config.table)
    .update(patch as never)
    .eq("id", id)
    .select("id, slug, status, featured")
    .maybeSingle();

  if (error) return databaseError(error, config.key);
  if (!data) return actionError("This record no longer exists.");

  revalidateTag(ENTITY_CACHE_TAG[config.key]);
  revalidatePath("/", "layout");

  const label = field === "featured" ? (value === "true" ? "Featured" : "Unfeatured") : `Status: ${value}`;
  return { ok: true, data: null, message: `${label}.` };
}

/** Moves a record one position up or down within its sort order. */
export async function moveRecord(entityKey: string, id: string, direction: 1 | -1): Promise<ActionResult> {
  const resolved = resolve(entityKey);
  if (!resolved.ok) return resolved.failure;
  const config = resolved.config;

  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("This record could not be found.");
  if (config.orderBy !== "sort_order") return actionError("This list is ordered automatically.");

  const supabase = await createClient();
  const { data: rows, error } = await entityBuilder(supabase, config.table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) return databaseError(error, config.key);

  const list = (rows ?? []) as { id: string; sort_order: number | null }[];
  const index = list.findIndex((row) => row.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= list.length) {
    return { ok: true, data: null, message: "Already at the end of the list." };
  }

  const current = list[index];
  const other = list[target];
  const currentOrder = current?.sort_order ?? 0;
  const otherOrder = other?.sort_order ?? 0;

  const updates =
    currentOrder === otherOrder
      ? [
          { id, sort_order: direction === 1 ? otherOrder + 1 : Math.max(0, otherOrder - 1) },
          { id: other?.id, sort_order: otherOrder },
        ]
      : [
          { id, sort_order: otherOrder },
          { id: other?.id, sort_order: currentOrder },
        ];

  for (const update of updates) {
    const { error: updateError } = await entityBuilder(supabase, config.table)
      .update({ sort_order: update.sort_order })
      .eq("id", update.id as string);
    if (updateError) return databaseError(updateError, config.key);
  }

  revalidateTag(ENTITY_CACHE_TAG[config.key]);
  revalidatePath("/", "layout");
  return { ok: true, data: null, message: direction === 1 ? "Moved down." : "Moved up." };
}

/**
 * Standalone image upload for the project gallery: one image per request keeps
 * the payload well inside server-action body limits.
 */
export async function uploadMediaImage(formData: FormData): Promise<ActionResult<{ path: string; url: string }>> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);

  const folder = formData.get("folder");
  const file = formData.get("image");
  if (typeof folder !== "string" || !isMediaFolder(folder)) {
    return actionError("That upload location is not allowed.");
  }
  if (!(file instanceof File) || file.size === 0) {
    return actionError("Choose an image to upload.", { image: "Choose an image to upload." });
  }

  const supabase = await createClient();
  const upload = await uploadImage(supabase, folder, file);
  if ("error" in upload) return actionError(upload.error, { image: upload.error });

  return { ok: true, data: { path: upload.path, url: mediaUrl(upload.path) }, message: "Image uploaded." };
}

/** Deletes a gallery image that was uploaded but is no longer wanted. */
export async function discardMediaImage(path: string): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (typeof path !== "string" || !path.includes("/") || path.includes("..")) {
    return actionError("That image could not be removed.");
  }

  const supabase = await createClient();
  await removeImages(supabase, [path]);
  return { ok: true, data: null, message: "Image removed." };
}
