import { env } from "@/lib/env";

export const MEDIA_BUCKET = "media";

/** Public URL of an object in the media bucket. */
export function mediaUrl(path: string): string {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${encoded}`;
}
