import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validations/common";

/** Storage bucket shared by every CMS image. Written only by admins. */
export const MEDIA_BUCKET = "media";

/** Folders inside the bucket, one per content type. */
export const MEDIA_FOLDERS = [
  "services",
  "projects",
  "innovation",
  "blog",
  "team",
  "testimonials",
  "technologies",
  "site",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export function isMediaFolder(value: string): value is MediaFolder {
  return (MEDIA_FOLDERS as readonly string[]).includes(value);
}

const IMAGE_EXTENSIONS: Record<(typeof ACCEPTED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Rejects anything that is not a supported image within the size limit. */
export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Use a JPG, PNG, WebP or AVIF image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Images must be 5 MB or smaller.";
  }
  return null;
}

/**
 * Uploads one image to `folder/<uuid>.<ext>` and returns its storage path, or
 * null when the upload failed (the failure is logged for the operator).
 */
export async function uploadImage(
  supabase: SupabaseClient,
  folder: MediaFolder,
  file: File,
): Promise<{ path: string } | { error: string }> {
  const problem = validateImageFile(file);
  if (problem) return { error: problem };

  const extension = IMAGE_EXTENSIONS[file.type as keyof typeof IMAGE_EXTENSIONS];
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    console.error(`[media] upload to ${folder} failed:`, error.message);
    return { error: "The image could not be uploaded. Try again, or save without an image." };
  }

  return { path };
}

/** Removes stored images. Failures are logged, never fatal for the caller. */
export async function removeImages(supabase: SupabaseClient, paths: (string | null | undefined)[]): Promise<void> {
  const targets = paths.filter((path): path is string => typeof path === "string" && path.length > 0);
  if (targets.length === 0) return;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(targets);
  if (error) console.error(`[media] could not remove ${targets.length} image(s):`, error.message);
}
