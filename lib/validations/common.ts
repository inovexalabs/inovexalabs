import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Images accepted by every upload field, and the size limit enforced client- and server-side. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

/** Splits plain text into paragraphs on blank lines. */
export function toParagraphs(value: string): string[] {
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Trimmed text with human-readable length messages. */
export function text(label: string, min: number, max: number) {
  return z
    .string()
    .trim()
    .min(min, min === 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
}

/** Optional text: empty input is allowed and stored as null. */
export function optionalText(label: string, max: number) {
  return z.string().trim().max(max, `${label} must be ${max} characters or fewer.`);
}

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters.")
  .max(80, "Slug must be 80 characters or fewer.")
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens, e.g. web-development.");

/** Internal path, in-page anchor or https URL — mirrors the *_href_format DB constraints. */
export const hrefSchema = z
  .string()
  .trim()
  .regex(
    /^(\/[^\s]*|#[A-Za-z][A-Za-z0-9_-]*|https:\/\/[^\s]+)$/,
    "Use a path like /contact, an anchor like #faq, or a full https:// address.",
  );

export const contentStatusSchema = z.enum(["draft", "published", "archived"], {
  error: "Choose a status.",
});

export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const uuidSchema = z.uuid();

/** Parses a JSONB list from the database, dropping it (and logging) if it no longer matches the schema. */
export function parseList<T>(schema: z.ZodType<T>, value: unknown, context: string): T[] {
  const result = z.array(schema).safeParse(value);
  if (result.success) return result.data;
  console.error(`[parseList] ${context} has invalid data:`, z.prettifyError(result.error));
  return [];
}
