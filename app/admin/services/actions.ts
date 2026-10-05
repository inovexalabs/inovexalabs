"use server";

import type { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { getAdminSession } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { actionError, toFieldErrors, type ActionResult } from "@/lib/utils/action-result";
import { MEDIA_BUCKET } from "@/lib/utils/storage-url";
import { uuidSchema } from "@/lib/validations/common";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  serviceFormSchema,
  type ServiceFormValues,
} from "@/lib/validations/service";
import type { TablesInsert } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type ImageAction = "keep" | "remove" | "replace";

const NOT_ALLOWED = "Your account doesn't have permission to manage services.";
const IMAGE_EXTENSIONS: Record<(typeof ACCEPTED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

interface ParsedSubmission {
  values: ServiceFormValues;
  imageAction: ImageAction;
  file: File | null;
}

/** Reads the multipart submission: a JSON payload, an image action and an optional file. */
function parseSubmission(formData: FormData): ActionResult<ParsedSubmission> {
  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") return actionError("The form could not be read. Reload the page and try again.");

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return actionError("The form could not be read. Reload the page and try again.");
  }

  const parsed = serviceFormSchema.safeParse(payload);
  if (!parsed.success) return actionError("Some fields need attention.", toFieldErrors(parsed.error));

  const imageAction = z.enum(["keep", "remove", "replace"]).catch("keep").parse(formData.get("imageAction"));
  const file = formData.get("image");

  if (imageAction === "replace") {
    if (!(file instanceof File) || file.size === 0) {
      return actionError("Choose an image to upload.", { image: "Choose an image to upload." });
    }
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return actionError("Use a JPG, PNG, WebP or AVIF image.", { image: "Use a JPG, PNG, WebP or AVIF image." });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return actionError("Images must be 5 MB or smaller.", { image: "Images must be 5 MB or smaller." });
    }
    return { ok: true, data: { values: parsed.data, imageAction, file }, message: "" };
  }

  return { ok: true, data: { values: parsed.data, imageAction, file: null }, message: "" };
}

function requireAltText(values: ServiceFormValues): ActionResult<never> | null {
  if (values.cover_image_alt) return null;
  const message = "Describe the image for people who can't see it.";
  return actionError(message, { cover_image_alt: message });
}

async function uploadImage(supabase: SupabaseServerClient, file: File): Promise<string | null> {
  const extension = IMAGE_EXTENSIONS[file.type as keyof typeof IMAGE_EXTENSIONS];
  const path = `services/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("[services] image upload failed:", error.message);
    return null;
  }
  return path;
}

async function removeImage(supabase: SupabaseServerClient, path: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  // Not fatal for the user: the row is already correct; log the orphan for cleanup.
  if (error) console.error(`[services] could not remove image ${path}:`, error.message);
}

/** Maps the form values to database columns. Empty optional text becomes null. */
function toRow(values: ServiceFormValues, imagePath: string | null) {
  return {
    title: values.title,
    slug: values.slug,
    summary: values.summary,
    overview: values.overview,
    icon: values.icon,
    status: values.status,
    sort_order: values.sort_order,
    cover_image_path: imagePath,
    cover_image_alt: imagePath ? values.cover_image_alt : null,
    problems: values.problems,
    features: values.features,
    technologies: values.technologies,
    process: values.process,
    outcomes: values.outcomes,
    faqs: values.faqs,
    cta_title: values.cta_title,
    cta_description: values.cta_description,
    cta_label: values.cta_label,
    cta_href: values.cta_href,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
  } satisfies TablesInsert<"services">;
}

function databaseError(error: PostgrestError): ActionResult<never> {
  if (error.code === "23505") {
    return actionError("Another service already uses this slug.", {
      slug: "Another service already uses this slug. Choose a different one.",
    });
  }
  if (error.code === "23514") {
    console.error("[services] check constraint failed:", error.message);
    return actionError("Some content is outside the allowed limits. Check list items and lengths, then try again.");
  }
  if (error.code === "42501") return actionError(NOT_ALLOWED);
  console.error("[services] database error:", error.code, error.message);
  return actionError("The service could not be saved. Try again in a moment.");
}

function revalidateServices(slugs: string[]) {
  revalidateTag(CACHE_TAGS.services);
  revalidatePath("/admin/services");
  for (const slug of slugs) revalidatePath(`/services/${slug}`);
}

export async function createService(formData: FormData): Promise<ActionResult<{ id: string }>> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);

  const submission = parseSubmission(formData);
  if (!submission.ok) return submission;
  const { values, imageAction, file } = submission.data;

  if (imageAction === "replace") {
    const missingAlt = requireAltText(values);
    if (missingAlt) return missingAlt;
  }

  const supabase = await createClient();
  let imagePath: string | null = null;
  if (imageAction === "replace" && file) {
    imagePath = await uploadImage(supabase, file);
    if (!imagePath) return actionError("The image could not be uploaded. Try again, or save without an image.");
  }

  const { data, error } = await supabase.from("services").insert(toRow(values, imagePath)).select("id").single();
  if (error) {
    await removeImage(supabase, imagePath);
    return databaseError(error);
  }

  revalidateServices([values.slug]);
  return { ok: true, data: { id: data.id }, message: `“${values.title}” was created.` };
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("This service could not be found.");

  const submission = parseSubmission(formData);
  if (!submission.ok) return submission;
  const { values, imageAction, file } = submission.data;

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("services")
    .select("slug, cover_image_path")
    .eq("id", id)
    .maybeSingle();

  if (readError) return databaseError(readError);
  if (!existing) return actionError("This service no longer exists. It may have been deleted.");

  const keepsImage = imageAction === "keep" && existing.cover_image_path !== null;
  if (imageAction === "replace" || keepsImage) {
    const missingAlt = requireAltText(values);
    if (missingAlt) return missingAlt;
  }

  let imagePath = imageAction === "keep" ? existing.cover_image_path : null;
  let uploadedPath: string | null = null;
  if (imageAction === "replace" && file) {
    uploadedPath = await uploadImage(supabase, file);
    if (!uploadedPath) return actionError("The image could not be uploaded. Try again, or keep the current image.");
    imagePath = uploadedPath;
  }

  const { error } = await supabase.from("services").update(toRow(values, imagePath)).eq("id", id);
  if (error) {
    await removeImage(supabase, uploadedPath);
    return databaseError(error);
  }

  if (imageAction !== "keep") await removeImage(supabase, existing.cover_image_path);

  revalidateServices([existing.slug, values.slug]);
  return { ok: true, data: { id }, message: "Changes saved." };
}

export async function deleteService(id: string): Promise<ActionResult> {
  if (!(await getAdminSession())) return actionError(NOT_ALLOWED);
  if (!uuidSchema.safeParse(id).success) return actionError("This service could not be found.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .select("slug, title, cover_image_path")
    .maybeSingle();

  if (error) return databaseError(error);
  if (!data) return actionError("This service was already deleted.");

  await removeImage(supabase, data.cover_image_path);
  revalidateServices([data.slug]);
  return { ok: true, data: null, message: `“${data.title}” was deleted.` };
}
