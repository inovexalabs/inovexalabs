import { slugify } from "@/lib/utils";
import type { FieldDef, ResourceDef } from "@/lib/admin/resources";

/**
 * Converts raw FormData into a row shaped for Postgres, driven entirely by the
 * resource registry.
 *
 * This runs on the server. Anything the browser sent is treated as untrusted:
 * values are trimmed, length-capped, type-checked and dropped when they do not
 * match the field definition. Unknown keys are never written, so a crafted
 * request cannot set a column the registry does not expose.
 */

const MAX_TEXT = 8000;
const MAX_LONG = 200_000;

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function cap(value: string, limit: number) {
  return value.length > limit ? value.slice(0, limit) : value;
}

function toArray(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export interface CoerceResult {
  row: Record<string, unknown>;
  errors: Record<string, string>;
}

export function coerceForm(
  resource: ResourceDef,
  fields: FieldDef[],
  formData: FormData,
  { isCreate }: { isCreate: boolean },
): CoerceResult {
  const row: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    // On create, a slug is generated from the title rather than typed.
    if (field.name === "slug" && isCreate) continue;

    const raw = formData.get(field.name);

    switch (field.type) {
      case "boolean": {
        // An unchecked checkbox is simply absent from FormData.
        row[field.name] = formData.get(field.name) === "on" || formData.get(field.name) === "true";
        break;
      }

      case "number": {
        const text = str(raw).trim();
        if (text === "") {
          row[field.name] = field.name === "progress" ? 0 : null;
          break;
        }
        const parsed = Number(text);
        if (!Number.isFinite(parsed)) {
          errors[field.name] = "Enter a number.";
          break;
        }
        if (field.name === "progress") {
          row[field.name] = Math.min(100, Math.max(0, Math.round(parsed)));
        } else {
          row[field.name] = Math.round(parsed);
        }
        break;
      }

      case "date": {
        const text = str(raw).trim();
        if (!text) {
          row[field.name] = null;
          break;
        }
        const parsed = new Date(text);
        if (Number.isNaN(parsed.getTime())) {
          errors[field.name] = "Enter a valid date.";
          break;
        }
        row[field.name] = parsed.toISOString();
        break;
      }

      case "list": {
        row[field.name] = toArray(cap(str(raw), MAX_LONG));
        break;
      }

      case "json": {
        const text = str(raw).trim();
        if (!text) {
          row[field.name] = field.name === "social_links" ? {} : [];
          break;
        }
        try {
          row[field.name] = JSON.parse(text);
        } catch {
          errors[field.name] = "That is not valid JSON.";
        }
        break;
      }

      case "select": {
        const text = cap(str(raw).trim(), 80);
        if (text && field.options && !field.options.includes(text)) {
          errors[field.name] = "Choose one of the available options.";
          break;
        }
        row[field.name] = text || (field.required ? "" : null);
        break;
      }

      default: {
        const limit = field.type === "textarea" || field.type === "markdown" ? MAX_LONG : MAX_TEXT;
        const text = cap(str(raw).trim(), limit);
        if (field.required && !text) {
          errors[field.name] = `${field.label} is required.`;
          break;
        }
        row[field.name] = text || null;
        break;
      }
    }
  }

  // Every publishable entity gets its slug on create.
  if (isCreate && fields.some((f) => f.name === "slug")) {
    const titleSource = row[resource.titleField];
    const base = typeof titleSource === "string" && titleSource ? titleSource : "";
    const slug = slugify(base);
    if (!slug) {
      errors.slug = "Could not generate a slug — set a title first.";
    } else {
      row.slug = slug;
    }
  }

  // Publishing without a date should still record when it went live.
  if (resource.publishable && row.published === true && !row.published_at) {
    row.published_at = new Date().toISOString();
  }

  return { row, errors };
}
