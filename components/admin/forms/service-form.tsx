"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, get, useForm, useWatch, type FieldPath } from "react-hook-form";
import { toast } from "sonner";
import { FormSection } from "@/components/admin/forms/form-section";
import { ImageField, imageActionFor, type ImageState } from "@/components/admin/forms/image-field";
import { ItemListField } from "@/components/admin/forms/item-list-field";
import { TagListField } from "@/components/admin/forms/tag-list-field";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getServiceIcon, SERVICE_ICON_KEYS, SERVICE_ICON_LABELS } from "@/lib/constants/service-icons";
import type { ActionResult } from "@/lib/utils/action-result";
import { slugify } from "@/lib/utils/slugify";
import { CONTENT_STATUS_LABELS, contentStatusSchema } from "@/lib/validations/common";
import {
  serviceFormSchema,
  SERVICE_LIST_LIMITS,
  type ServiceFormInput,
  type ServiceFormValues,
} from "@/lib/validations/service";

const LIST_PATH = "/admin/services";

type SaveServiceAction = (formData: FormData) => Promise<ActionResult<{ id: string }>>;

interface ServiceFormProps {
  mode: "create" | "edit";
  action: SaveServiceAction;
  defaultValues: ServiceFormValues;
  currentImageUrl: string | null;
  /** Live page URL when the service is published. */
  publicUrl?: string | null;
}

const titled = (title: string, description: string) =>
  [
    { key: "title", label: title },
    { key: "description", label: description, multiline: true },
  ] as const;

export function ServiceForm({ mode, action, defaultValues, currentImageUrl, publicUrl }: ServiceFormProps) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [image, setImage] = useState<ImageState>(
    currentImageUrl ? { kind: "current", url: currentImageUrl } : { kind: "none" },
  );
  const slugEdited = useRef(mode === "edit");

  const form = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
    mode: "onTouched",
  });
  const {
    register,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isSubmitted },
  } = form;

  const [summary, seoTitle, seoDescription, icon] = useWatch({
    control,
    name: ["summary", "seo_title", "seo_description", "icon"],
  });
  const IconPreview = getServiceIcon(icon ?? "sparkles");
  const hasImage = image.kind === "current" || image.kind === "new";
  const hasChanges = isDirty || image.kind === "new" || image.kind === "removed";

  // Warn before closing the tab or reloading with unsaved edits.
  useEffect(() => {
    if (!hasChanges || isSaving) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSaving]);

  function applyServerErrors(result: Extract<ActionResult<unknown>, { ok: false }>) {
    setFormError(result.error);
    for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
      if (path === "image") setImageError(message);
      else if (path !== "form") setError(path as FieldPath<ServiceFormInput>, { message }, { shouldFocus: true });
    }
  }

  const onValid = (values: ServiceFormValues) => {
    setFormError(null);
    setImageError(undefined);

    if (hasImage && !values.cover_image_alt) {
      setError("cover_image_alt", { message: "Describe the image for people who can't see it." }, { shouldFocus: true });
      setFormError("Some fields need attention. They're highlighted below.");
      return;
    }

    const formData = new FormData();
    formData.set("payload", JSON.stringify(values));
    formData.set("imageAction", imageActionFor(image));
    if (image.kind === "new") formData.set("image", image.file);

    startSaving(async () => {
      try {
        const result = await action(formData);
        if (!result.ok) {
          applyServerErrors(result);
          toast.error(result.error);
          return;
        }
        toast.success(result.message);
        if (mode === "create") {
          router.push(LIST_PATH);
        } else {
          // The page re-renders with the saved record; its key remounts this form with fresh values.
          router.refresh();
        }
      } catch (error) {
        console.error("[ServiceForm] save failed", error);
        const message = "The connection dropped before saving finished. Check your connection and try again.";
        setFormError(message);
        toast.error(message);
      }
    });
  };

  const onInvalid = () => setFormError("Some fields need attention. They're highlighted below.");

  function handleCancel() {
    if (hasChanges) setConfirmLeave(true);
    else router.push(LIST_PATH);
  }

  const titleField = register("title", {
    onChange: (event: { target: { value: string } }) => {
      if (!slugEdited.current) setValue("slug", slugify(event.target.value), { shouldValidate: isSubmitted });
    },
  });
  const slugField = register("slug", {
    onChange: () => {
      slugEdited.current = true;
    },
  });

  const saveLabel = mode === "create" ? "Create service" : "Save changes";
  const savingLabel = mode === "create" ? "Creating…" : "Saving…";
  const err = (path: FieldPath<ServiceFormInput>) => get(errors, `${path}.message`) as string | undefined;

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
          <div className="space-y-6">
            <FormSection id="basics" title="Basics" description="How the service is named and introduced everywhere on the site.">
              <FormField id="title" label="Title" error={err("title")}>
                <Input {...fieldA11y("title", { error: err("title") })} {...titleField} autoComplete="off" />
              </FormField>
              <FormField
                id="slug"
                label="Slug"
                hint={
                  mode === "edit"
                    ? "Part of the page address: /services/your-slug. Changing it breaks existing links."
                    : "Part of the page address: /services/your-slug. Filled in from the title."
                }
                error={err("slug")}
              >
                <Input {...fieldA11y("slug", { hint: true, error: err("slug") })} {...slugField} autoComplete="off" spellCheck={false} />
              </FormField>
              <FormField
                id="summary"
                label="Short description"
                hint="Shown on service cards, the Solutions menu and at the top of the service page."
                error={err("summary")}
                count={{ length: summary?.length ?? 0, max: 200 }}
              >
                <Textarea rows={3} {...fieldA11y("summary", { hint: true, error: err("summary") })} {...register("summary")} />
              </FormField>
              <FormField
                id="overview"
                label="Full description"
                hint="The Overview section. Leave a blank line between paragraphs."
                error={err("overview")}
                optional
              >
                <Textarea rows={8} {...fieldA11y("overview", { hint: true, error: err("overview") })} {...register("overview")} />
              </FormField>
            </FormSection>

            <FormSection id="problems" title="Problems we solve" description="The situations that bring clients to this service.">
              <ItemListField<ServiceFormInput>
                name="problems"
                itemLabel="Problem"
                max={SERVICE_LIST_LIMITS.problems}
                fields={titled("Problem", "How it shows up")}
                emptyText="No problems added. This section is hidden on the page until you add one."
              />
            </FormSection>

            <FormSection id="features" title="Capabilities" description="What the team delivers within this service.">
              <ItemListField<ServiceFormInput>
                name="features"
                itemLabel="Capability"
                max={SERVICE_LIST_LIMITS.features}
                fields={titled("Capability", "Description")}
                emptyText="No capabilities added. This section is hidden on the page until you add one."
              />
            </FormSection>

            <FormSection id="technologies" title="Technologies" description="Languages, frameworks and platforms used for this service.">
              <TagListField<ServiceFormInput>
                name="technologies"
                label="Technologies"
                max={SERVICE_LIST_LIMITS.technologies}
                maxLength={40}
                placeholder="e.g. TypeScript"
              />
            </FormSection>

            <FormSection id="process" title="Process" description="The steps of an engagement, in order. Steps are numbered on the page.">
              <ItemListField<ServiceFormInput>
                name="process"
                itemLabel="Step"
                max={SERVICE_LIST_LIMITS.process}
                fields={titled("Step name", "What happens")}
                emptyText="No steps added. This section is hidden on the page until you add one."
              />
            </FormSection>

            <FormSection id="outcomes" title="Expected outcomes" description="What clients can expect once the work is done.">
              <ItemListField<ServiceFormInput>
                name="outcomes"
                itemLabel="Outcome"
                max={SERVICE_LIST_LIMITS.outcomes}
                fields={titled("Outcome", "Description")}
                emptyText="No outcomes added. This section is hidden on the page until you add one."
              />
            </FormSection>

            <FormSection id="faqs" title="FAQ" description="Questions prospects ask before starting. Also published as FAQ structured data.">
              <ItemListField<ServiceFormInput>
                name="faqs"
                itemLabel="Question"
                max={SERVICE_LIST_LIMITS.faqs}
                fields={[
                  { key: "question", label: "Question" },
                  { key: "answer", label: "Answer", multiline: true },
                ]}
                emptyText="No questions added. This section is hidden on the page until you add one."
              />
            </FormSection>

            <FormSection id="cta" title="Call to action" description="The closing banner at the bottom of the service page.">
              <FormField id="cta_title" label="Heading" error={err("cta_title")}>
                <Input {...fieldA11y("cta_title", { error: err("cta_title") })} {...register("cta_title")} />
              </FormField>
              <FormField id="cta_description" label="Text" error={err("cta_description")}>
                <Textarea rows={3} {...fieldA11y("cta_description", { error: err("cta_description") })} {...register("cta_description")} />
              </FormField>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id="cta_label" label="Button label" error={err("cta_label")}>
                  <Input {...fieldA11y("cta_label", { error: err("cta_label") })} {...register("cta_label")} />
                </FormField>
                <FormField id="cta_href" label="Button link" hint="e.g. /contact or https://…" error={err("cta_href")}>
                  <Input
                    {...fieldA11y("cta_href", { hint: true, error: err("cta_href") })}
                    {...register("cta_href")}
                    spellCheck={false}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection id="seo" title="Search and sharing" description="Leave blank to use the title and short description.">
              <FormField
                id="seo_title"
                label="SEO title"
                optional
                error={err("seo_title")}
                count={{ length: seoTitle?.length ?? 0, max: 70 }}
              >
                <Input {...fieldA11y("seo_title", { error: err("seo_title") })} {...register("seo_title")} />
              </FormField>
              <FormField
                id="seo_description"
                label="SEO description"
                optional
                error={err("seo_description")}
                count={{ length: seoDescription?.length ?? 0, max: 170 }}
              >
                <Textarea rows={3} {...fieldA11y("seo_description", { error: err("seo_description") })} {...register("seo_description")} />
              </FormField>
            </FormSection>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6" aria-label="Publishing and media">
            <FormSection id="publishing" title="Publishing">
              <FormField
                id="status"
                label="Status"
                hint="Only published services appear on the site."
                error={err("status")}
              >
                <Select {...fieldA11y("status", { hint: true, error: err("status") })} {...register("status")}>
                  {contentStatusSchema.options.map((status) => (
                    <option key={status} value={status}>
                      {CONTENT_STATUS_LABELS[status]}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="sort_order" label="Order" hint="Lower numbers appear first." error={err("sort_order")}>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  {...fieldA11y("sort_order", { hint: true, error: err("sort_order") })}
                  {...register("sort_order", { valueAsNumber: true })}
                />
              </FormField>
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
                  {hasChanges ? "You have unsaved changes." : " "}
                </p>
              </div>
            </FormSection>

            <FormSection id="icon-section" title="Icon">
              <div className="flex items-end gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-md border border-iris-500/15 brand-gradient-soft text-iris-600"
                >
                  <IconPreview className="size-5" />
                </span>
                <FormField id="icon" label="Icon" error={err("icon")} className="flex-1">
                  <Select {...fieldA11y("icon", { error: err("icon") })} {...register("icon")}>
                    {SERVICE_ICON_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {SERVICE_ICON_LABELS[key]}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
            </FormSection>

            <FormSection id="image-section" title="Image" description="Shown beside the title at the top of the service page.">
              <ImageField
                id="cover_image"
                originalUrl={currentImageUrl}
                value={image}
                onChange={(next) => {
                  setImage(next);
                  setImageError(undefined);
                }}
                error={imageError}
              />
              {hasImage ? (
                <FormField
                  id="cover_image_alt"
                  label="Image description"
                  hint="Describe what the image shows, for people using screen readers."
                  error={err("cover_image_alt")}
                >
                  <Input
                    {...fieldA11y("cover_image_alt", { hint: true, error: err("cover_image_alt") })}
                    {...register("cover_image_alt")}
                  />
                </FormField>
              ) : null}
            </FormSection>
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
        description="Your edits to this service haven't been saved. Leaving now discards them."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        tone="danger"
        onConfirm={() => {
          setConfirmLeave(false);
          router.push(LIST_PATH);
        }}
        onCancel={() => setConfirmLeave(false)}
      />
    </FormProvider>
  );
}

