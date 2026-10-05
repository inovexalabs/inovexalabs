"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { FormProvider, get, useForm, type FieldPath } from "react-hook-form";
import { toast } from "sonner";
import { FormSection } from "@/components/admin/forms/form-section";
import { ImageField, imageActionFor, type ImageState } from "@/components/admin/forms/image-field";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ENTITY_FORMS, type AdminEntityKey } from "@/lib/admin/entity-forms";
import type { ActionResult } from "@/lib/utils/action-result";
import { CONTENT_STATUS_LABELS, contentStatusSchema } from "@/lib/validations/common";

type SaveAction = (formData: FormData) => Promise<ActionResult<{ id: string }>>;
type FormValues = Record<string, unknown>;

interface ContentFormShellProps {
  entity: AdminEntityKey;
  mode: "create" | "edit";
  action: SaveAction;
  defaultValues: FormValues;
  /** Image stored on the record, if the entity uses one. */
  currentImageUrl?: string | null;
  /** Live page URL when the record is published. */
  publicUrl?: string | null;
  listPath: string;
  /** Entity-specific fields, rendered inside the form context. */
  fields: ReactNode;
}

/**
 * Shared frame for every registry-backed admin form: validation, unsaved
 * changes guard, server error mapping, the publishing/image/SEO sidebar and
 * the mobile save bar. Entity-specific fields render inside it and read the
 * form context themselves.
 */
export function ContentFormShell({
  entity,
  mode,
  action,
  defaultValues,
  currentImageUrl = null,
  publicUrl,
  listPath,
  fields,
}: ContentFormShellProps) {
  const config = ENTITY_FORMS[entity];
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const [confirmLeave, setConfirmLeave] = useState(false);

  const usesImage = Boolean(config.image);
  const hasSeo = "seo_title" in defaultValues;
  const hasFeatured = "featured" in defaultValues;
  const hasOrder = "sort_order" in defaultValues;
  const hasStatus = "status" in defaultValues;

  const [image, setImage] = useState<ImageState>(
    usesImage && currentImageUrl ? { kind: "current", url: currentImageUrl } : { kind: "none" },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(config.schema),
    defaultValues,
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = form;

  const hasImage = image.kind === "current" || image.kind === "new";
  const hasChanges = isDirty || image.kind === "new" || image.kind === "removed";

  useEffect(() => {
    if (!hasChanges || isSaving) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSaving]);

  const err = (path: string) => get(errors, `${path}.message`) as string | undefined;

  function applyServerErrors(result: Extract<ActionResult<unknown>, { ok: false }>) {
    setFormError(result.error);
    for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
      if (path === "image") setImageError(message);
      else if (path !== "form") setError(path as FieldPath<FormValues>, { message }, { shouldFocus: true });
    }
  }

  const onValid = (values: FormValues) => {
    setFormError(null);
    setImageError(undefined);

    if (usesImage && hasImage) {
      const altField = config.image?.altField;
      const alt = altField ? values[altField] : "";
      if (typeof alt !== "string" || alt.trim() === "") {
        const message = "Describe the image for people who can't see it.";
        if (altField) setError(altField as FieldPath<FormValues>, { message }, { shouldFocus: true });
        setFormError("Some fields need attention. They're highlighted below.");
        return;
      }
    }

    const formData = new FormData();
    formData.set("payload", JSON.stringify(values));
    if (usesImage) {
      formData.set("imageAction", imageActionFor(image));
      if (image.kind === "new") formData.set("image", image.file);
    }

    startSaving(async () => {
      try {
        const result = await action(formData);
        if (!result.ok) {
          applyServerErrors(result);
          toast.error(result.error);
          return;
        }
        toast.success(result.message);
        if (mode === "create") router.push(listPath);
        else router.refresh();
      } catch (error) {
        console.error(`[${entity}] save failed`, error);
        const message = "The connection dropped before saving finished. Check your connection and try again.";
        setFormError(message);
        toast.error(message);
      }
    });
  };

  const onInvalid = () => setFormError("Some fields need attention. They're highlighted below.");

  function handleCancel() {
    if (hasChanges) setConfirmLeave(true);
    else router.push(listPath);
  }

  const saveLabel = mode === "create" ? `Create ${config.singular.toLowerCase()}` : "Save changes";
  const savingLabel = mode === "create" ? "Creating…" : "Saving…";

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="pb-28 xl:pb-0">
        {formError ? (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-rose-700"
          >
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <p>{formError}</p>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <div className="space-y-6">{fields}</div>

          <aside className="space-y-6 xl:sticky xl:top-6" aria-label="Publishing and media">
            <FormSection id="publishing" title="Publishing">
              {hasStatus ? (
                <FormField id="status" label="Status" hint="Only published records appear on the site." error={err("status")}>
                  <Select {...fieldA11y("status", { hint: true, error: err("status") })} {...register("status")}>
                    {contentStatusSchema.options.map((status) => (
                      <option key={status} value={status}>
                        {CONTENT_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </Select>
                </FormField>
              ) : null}

              {hasFeatured ? (
                <FormField id="featured" label="Featured" hint="Featured records are shown in the homepage sections." error={err("featured")}>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      className="size-4 rounded-xs border border-line-strong accent-iris-600"
                      {...fieldA11y("featured", { hint: true, error: err("featured") })}
                      {...register("featured")}
                    />
                    <span className="text-sm text-fg-muted">Show this record in featured lists</span>
                  </label>
                </FormField>
              ) : null}

              {hasOrder ? (
                <FormField id="sort_order" label="Order" hint="Lower numbers appear first." error={err("sort_order")}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    {...fieldA11y("sort_order", { hint: true, error: err("sort_order") })}
                    {...register("sort_order", { setValueAs: (value: unknown) => Number(value) })}
                  />
                </FormField>
              ) : null}

              {publicUrl ? (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  View live page
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}

              <div className="hidden gap-2 xl:grid">
                <Button type="submit" isLoading={isSaving} loadingText={savingLabel} fullWidth>
                  {saveLabel}
                </Button>
                <Button variant="ghost" onClick={handleCancel} disabled={isSaving} fullWidth>
                  Cancel
                </Button>
                <p aria-live="polite" className="text-center text-sm text-fg-muted">
                  {hasChanges ? "You have unsaved changes." : " "}
                </p>
              </div>
            </FormSection>

            {usesImage ? (
              <FormSection id="image-section" title="Image">
                <ImageField
                  id={`${entity}-image`}
                  originalUrl={currentImageUrl}
                  value={image}
                  onChange={(next) => {
                    setImage(next);
                    setImageError(undefined);
                  }}
                  error={imageError}
                />
                {hasImage && config.image ? (
                  <FormField
                    id={config.image.altField}
                    label="Image description"
                    hint="Describe what the image shows, for people using screen readers."
                    error={err(config.image.altField)}
                  >
                    <Input
                      {...fieldA11y(config.image.altField, { hint: true, error: err(config.image.altField) })}
                      {...register(config.image.altField)}
                    />
                  </FormField>
                ) : null}
              </FormSection>
            ) : null}

            {hasSeo ? (
              <FormSection id="seo" title="Search and sharing" description="Leave blank to use the title and summary.">
                <FormField id="seo_title" label="SEO title" optional error={err("seo_title")}>
                  <Input {...fieldA11y("seo_title", { error: err("seo_title") })} {...register("seo_title")} />
                </FormField>
                <FormField id="seo_description" label="SEO description" optional error={err("seo_description")}>
                  <Input
                    {...fieldA11y("seo_description", { error: err("seo_description") })}
                    {...register("seo_description")}
                  />
                </FormField>
              </FormSection>
            ) : null}
          </aside>
        </div>

        {/* Save bar for phones and tablets */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-gutter py-3 shadow-[0_-8px_24px_-16px_rgb(7_19_47/0.25)] backdrop-blur xl:hidden">
          <div className="mx-auto flex max-w-content items-center justify-between gap-3">
            <p aria-live="polite" className="hidden text-sm text-fg-muted sm:block">
              {hasChanges ? "You have unsaved changes." : "All changes saved."}
            </p>
            <div className="flex flex-1 justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving} loadingText={savingLabel}>
                {saveLabel}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmLeave}
        title="Discard unsaved changes?"
        description={`Your edits to this ${config.singular.toLowerCase()} haven't been saved. Leaving now discards them.`}
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        tone="danger"
        onConfirm={() => {
          setConfirmLeave(false);
          router.push(listPath);
        }}
        onCancel={() => setConfirmLeave(false)}
      />
    </FormProvider>
  );
}
