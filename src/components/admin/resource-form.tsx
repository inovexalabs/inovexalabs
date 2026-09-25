"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import type { AdminActionState } from "@/lib/admin/form-state";
import { ADMIN_IDLE } from "@/lib/admin/form-state";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FieldDef } from "@/lib/admin/resources";

export interface FormGroup {
  title: string;
  items: FieldDef[];
}

export function ResourceForm({
  action,
  groups,
  defaults,
  isCreate,
  cancelHref,
  publicHref,
}: {
  action: (prev: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  groups: FormGroup[];
  defaults: Record<string, unknown>;
  isCreate: boolean;
  cancelHref: string;
  publicHref?: string | null;
}) {
  const [state, formAction, pending] = useActionState(action, ADMIN_IDLE);

  const errorFor = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="pb-24" noValidate>
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-7 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/[0.07] p-4"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
          <p className="text-sm leading-relaxed text-red-200">{state.message}</p>
        </div>
      ) : null}

      {state.status === "success" && state.message ? (
        <div
          role="status"
          className="mb-7 flex items-start gap-3 rounded-xl border border-signal/40 bg-signal/[0.07] p-4"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal" />
          <p className="text-sm leading-relaxed text-bone">{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-2">
        {groups.map((group) => (
          <section
            key={group.title}
            className={cn(
              "panel p-6",
              group.title === "SEO" && "border-signal/25",
            )}
          >
            <h2
              className={cn(
                "mono-label",
                group.title === "SEO" ? "text-signal" : "text-ash-deep",
              )}
            >
              {group.title}
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {group.items.map((field) => {
                const error = errorFor(field.name);
                const value = defaults[field.name];

                return (
                  <div
                    key={field.name}
                    className={field.colSpan === 2 ? "sm:col-span-2" : undefined}
                  >
                    {field.type === "boolean" ? (
                      <BooleanField field={field} checked={Boolean(value)} />
                    ) : (
                      <>
                        <Label htmlFor={field.name} className={cn(error && "text-red-300")}>
                          {field.label}
                          {field.required ? <span className="ml-1 text-signal">*</span> : null}
                        </Label>
                        <FieldInput field={field} value={value} error={Boolean(error)} />
                        {field.help && !error ? (
                          <p className="mt-1.5 text-xs leading-relaxed text-ash-deep">{field.help}</p>
                        ) : null}
                        <FieldError>{error}</FieldError>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky action bar: always reachable on a long form. */}
      <div className="lab-glass fixed inset-x-0 bottom-0 z-30 border-t border-steel px-4 py-4 sm:px-6 lg:pl-[17rem]">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" />
                {isCreate ? "Create" : "Save changes"}
              </>
            )}
          </Button>

          <Button asChild variant="secondary">
            <Link href={cancelHref}>Cancel</Link>
          </Button>

          {publicHref ? (
            <a
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash transition-colors hover:text-signal"
            >
              Preview on site ↗
            </a>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function BooleanField({ field, checked }: { field: FieldDef; checked: boolean }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-steel bg-carbon p-4 transition-colors hover:border-steel-bright">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={checked}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-signal)]"
        />
        <span>
          <span className="block text-sm font-medium text-bone">{field.label}</span>
          {field.help ? (
            <span className="mt-1 block text-xs leading-relaxed text-ash">{field.help}</span>
          ) : null}
        </span>
      </label>
    </div>
  );
}

function FieldInput({
  field,
  value,
  error,
}: {
  field: FieldDef;
  value: unknown;
  error: boolean;
}) {
  const common = {
    id: field.name,
    name: field.name,
    "aria-invalid": error || undefined,
    required: field.required,
  };

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          {...common}
          defaultValue={asString(value)}
          placeholder={field.placeholder}
          className="min-h-28"
        />
      );

    case "markdown":
      return (
        <>
          <Textarea
            {...common}
            defaultValue={asString(value)}
            placeholder={field.placeholder}
            className="min-h-72 font-mono text-[0.8125rem] leading-relaxed"
            spellCheck={false}
          />
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ash-deep">
            <span>## heading</span>
            <span>**bold**</span>
            <span>- list</span>
            <span>[link](url)</span>
            <span>&gt; quote</span>
          </p>
        </>
      );

    case "list":
      return (
        <Textarea
          {...common}
          defaultValue={asListString(value)}
          placeholder={field.placeholder}
          className="min-h-28 font-mono text-[0.8125rem]"
          spellCheck={false}
        />
      );

    case "json":
      return (
        <Textarea
          {...common}
          defaultValue={asJsonString(value)}
          placeholder={field.placeholder}
          className="min-h-28 font-mono text-[0.8125rem]"
          spellCheck={false}
        />
      );

    case "number":
      return (
        <Input
          {...common}
          type="number"
          defaultValue={value === null || value === undefined ? "" : String(value)}
          placeholder={field.placeholder}
        />
      );

    case "date":
      return (
        <Input
          {...common}
          type="date"
          defaultValue={asDateInput(value)}
          placeholder={field.placeholder}
        />
      );

    case "url":
      return (
        <Input
          {...common}
          type="url"
          inputMode="url"
          defaultValue={asString(value)}
          placeholder={field.placeholder ?? "https://…"}
        />
      );

    case "select":
      return (
        <select
          {...common}
          defaultValue={asString(value)}
          className="h-11 w-full rounded-xl border border-steel bg-carbon px-4 text-sm text-bone outline-none transition-colors hover:border-steel-bright focus:border-signal/60 aria-[invalid=true]:border-red-500/60"
        >
          <option value="">{field.required ? "Select…" : "None"}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      );

    default:
      return (
        <Input
          {...common}
          type="text"
          defaultValue={asString(value)}
          placeholder={field.placeholder}
        />
      );
  }
}

function asString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function asListString(value: unknown) {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") return value;
  return "";
}

function asJsonString(value: unknown) {
  if (value === null || value === undefined) return "";
  try {
    const serialised = JSON.stringify(value, null, 2);
    // An empty array or object is better represented as a blank field.
    return serialised === "[]" || serialised === "{}" ? "" : serialised;
  } catch {
    return "";
  }
}

function asDateInput(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
