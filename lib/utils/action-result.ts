import type { z } from "zod";

/** Return shape of every Server Action: never throws for expected failures. */
export type ActionResult<T = null> =
  | { ok: true; data: T; message: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Flattens Zod issues into "path.to.field" → first message, for react-hook-form's setError. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "form";
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

export function actionError(error: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}
