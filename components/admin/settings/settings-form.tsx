"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormProvider, get, useForm, type FieldPath } from "react-hook-form";
import { toast } from "sonner";
import { saveSettings } from "@/app/admin/settings/actions";
import { FormSection } from "@/components/admin/forms/form-section";
import { ImageField, imageActionFor, type ImageState } from "@/components/admin/forms/image-field";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/utils/action-result";
import { settingsFormSchema, type SettingsFormValues } from "@/lib/validations/settings";

interface SettingsFormProps {
  defaultValues: SettingsFormValues;
  /** Public URLs of the saved brand images, if any. */
  logoUrl: string | null;
  faviconUrl: string | null;
}

const initialImage = (url: string | null): ImageState => (url ? { kind: "current", url } : { kind: "none" });

const SOCIAL_FIELDS: { name: keyof SettingsFormValues; label: string; placeholder: string }[] = [
  { name: "social_github", label: "GitHub", placeholder: "https://github.com/inovexalabs" },
  { name: "social_linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/company/inovexa" },
  { name: "social_twitter", label: "X (Twitter)", placeholder: "https://x.com/inovexalabs" },
  { name: "social_youtube", label: "YouTube", placeholder: "https://www.youtube.com/@inovexalabs" },
  { name: "social_instagram", label: "Instagram", placeholder: "https://www.instagram.com/inovexalabs" },
  { name: "social_discord", label: "Discord", placeholder: "https://discord.gg/inovexa" },
];

/**
 * The whole site_settings form: one payload posted to a Server Action that
 * re-validates with the same schema and writes the singleton row.
 */
export function SettingsForm({ defaultValues, logoUrl, faviconUrl }: SettingsFormProps) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [logo, setLogo] = useState<ImageState>(() => initialImage(logoUrl));
  const [favicon, setFavicon] = useState<ImageState>(() => initialImage(faviconUrl));
  const [imageErrors, setImageErrors] = useState<{ logo?: string; favicon?: string }>({});

  // After a save, router.refresh() brings new URLs: show what is now stored.
  useEffect(() => setLogo(initialImage(logoUrl)), [logoUrl]);
  useEffect(() => setFavicon(initialImage(faviconUrl)), [faviconUrl]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
    mode: "onTouched",
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = form;

  const imagesChanged = imageActionFor(logo) !== "keep" || imageActionFor(favicon) !== "keep";
  const hasChanges = isDirty || imagesChanged;

  useEffect(() => {
    if (!hasChanges || isSaving) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSaving]);

  const err = (path: string) => get(errors, `${path}.message`) as string | undefined;

  const onValid = (values: SettingsFormValues) => {
    setFormError(null);
    setImageErrors({});
    const formData = new FormData();
    formData.set("payload", JSON.stringify(values));
    formData.set("logoAction", imageActionFor(logo));
    if (logo.kind === "new") formData.set("logo", logo.file);
    formData.set("faviconAction", imageActionFor(favicon));
    if (favicon.kind === "new") formData.set("favicon", favicon.file);

    startSaving(async () => {
      try {
        const result: ActionResult = await saveSettings(formData);
        if (!result.ok) {
          setFormError(result.error);
          for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
            if (path === "logo" || path === "favicon") setImageErrors((current) => ({ ...current, [path]: message }));
            else if (path !== "form") setError(path as FieldPath<SettingsFormValues>, { message }, { shouldFocus: true });
          }
          toast.error(result.error);
          return;
        }
        toast.success(result.message);
        form.reset(values);
        router.refresh();
      } catch (error) {
        console.error("[settings] save failed", error);
        const message = "The connection dropped before saving finished. Check your connection and try again.";
        setFormError(message);
        toast.error(message);
      }
    });
  };

  const onInvalid = () => setFormError("Some fields need attention. They're highlighted below.");

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

        <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
          <div className="space-y-6">
            <FormSection id="identity" title="Company" description="Name and the one-line statement about the studio.">
              <FormField id="site_name" label="Company name" error={err("site_name")}>
                <Input {...fieldA11y("site_name", { error: err("site_name") })} {...register("site_name")} />
              </FormField>
              <FormField
                id="studio_statement"
                label="Studio statement"
                optional
                hint="Shown under the company name in the footer. Up to 280 characters."
                count={{ length: form.watch("studio_statement").length, max: 280 }}
                error={err("studio_statement")}
              >
                <Textarea
                  rows={3}
                  {...fieldA11y("studio_statement", { hint: true, error: err("studio_statement") })}
                  {...register("studio_statement")}
                />
              </FormField>
            </FormSection>

            <FormSection
              id="branding"
              title="Branding"
              description="Leave either one empty to use the built-in Inovexa Labs logo and mark."
            >
              <div>
                <p id="logo-label" className="text-sm font-medium text-fg">
                  Logo
                </p>
                <p className="mt-1 text-sm text-fg-muted">
                  Replaces the Inovexa Labs logo in the header, footer and admin. The company name above is used as its alt text.
                </p>
                <div className="mt-3" role="group" aria-labelledby="logo-label">
                  <ImageField
                    id="logo"
                    originalUrl={logoUrl}
                    value={logo}
                    onChange={(next) => {
                      setLogo(next);
                      setImageErrors((current) => ({ ...current, logo: undefined }));
                    }}
                    error={imageErrors.logo}
                    subject="logo"
                    fit="contain"
                    hint="PNG or WebP with a transparent background, about 320×80 px. Up to 5 MB."
                  />
                </div>
              </div>
              <div>
                <p id="favicon-label" className="text-sm font-medium text-fg">
                  Favicon
                </p>
                <p className="mt-1 text-sm text-fg-muted">The small icon in browser tabs and bookmarks.</p>
                <div className="mt-3" role="group" aria-labelledby="favicon-label">
                  <ImageField
                    id="favicon"
                    originalUrl={faviconUrl}
                    value={favicon}
                    onChange={(next) => {
                      setFavicon(next);
                      setImageErrors((current) => ({ ...current, favicon: undefined }));
                    }}
                    error={imageErrors.favicon}
                    subject="favicon"
                    fit="contain"
                    hint="A square PNG, 512×512 px works best. Up to 5 MB."
                  />
                </div>
              </div>
            </FormSection>

            <FormSection id="hero" title="Homepage hero" description="The first thing every visitor reads.">
              <FormField
                id="hero_headline"
                label="Headline"
                count={{ length: form.watch("hero_headline").length, max: 160 }}
                error={err("hero_headline")}
              >
                <Input {...fieldA11y("hero_headline", { error: err("hero_headline") })} {...register("hero_headline")} />
              </FormField>
              <FormField
                id="hero_subheadline"
                label="Supporting text"
                count={{ length: form.watch("hero_subheadline").length, max: 320 }}
                error={err("hero_subheadline")}
              >
                <Textarea
                  rows={3}
                  {...fieldA11y("hero_subheadline", { error: err("hero_subheadline") })}
                  {...register("hero_subheadline")}
                />
              </FormField>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id="hero_primary_cta_label" label="Primary button" error={err("hero_primary_cta_label")}>
                  <Input
                    {...fieldA11y("hero_primary_cta_label", { error: err("hero_primary_cta_label") })}
                    {...register("hero_primary_cta_label")}
                  />
                </FormField>
                <FormField
                  id="hero_primary_cta_href"
                  label="Primary button link"
                  hint="A path like /contact, or a full https:// address."
                  error={err("hero_primary_cta_href")}
                >
                  <Input
                    {...fieldA11y("hero_primary_cta_href", { hint: true, error: err("hero_primary_cta_href") })}
                    {...register("hero_primary_cta_href")}
                  />
                </FormField>
                <FormField id="hero_secondary_cta_label" label="Secondary button" error={err("hero_secondary_cta_label")}>
                  <Input
                    {...fieldA11y("hero_secondary_cta_label", { error: err("hero_secondary_cta_label") })}
                    {...register("hero_secondary_cta_label")}
                  />
                </FormField>
                <FormField
                  id="hero_secondary_cta_href"
                  label="Secondary button link"
                  hint="A path like /projects, or a full https:// address."
                  error={err("hero_secondary_cta_href")}
                >
                  <Input
                    {...fieldA11y("hero_secondary_cta_href", { hint: true, error: err("hero_secondary_cta_href") })}
                    {...register("hero_secondary_cta_href")}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection id="final-cta" title="Closing section" description="The call to action at the end of the homepage.">
              <FormField id="final_cta_title" label="Heading" error={err("final_cta_title")}>
                <Input {...fieldA11y("final_cta_title", { error: err("final_cta_title") })} {...register("final_cta_title")} />
              </FormField>
              <FormField
                id="final_cta_description"
                label="Text"
                count={{ length: form.watch("final_cta_description").length, max: 280 }}
                error={err("final_cta_description")}
              >
                <Textarea
                  rows={3}
                  {...fieldA11y("final_cta_description", { error: err("final_cta_description") })}
                  {...register("final_cta_description")}
                />
              </FormField>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id="final_cta_label" label="Button" error={err("final_cta_label")}>
                  <Input {...fieldA11y("final_cta_label", { error: err("final_cta_label") })} {...register("final_cta_label")} />
                </FormField>
                <FormField
                  id="final_cta_href"
                  label="Button link"
                  hint="A path like /contact, or a full https:// address."
                  error={err("final_cta_href")}
                >
                  <Input {...fieldA11y("final_cta_href", { hint: true, error: err("final_cta_href") })} {...register("final_cta_href")} />
                </FormField>
              </div>
            </FormSection>
          </div>

          <div className="space-y-6">
            <FormSection id="contact" title="Contact details" description="Used in the footer, contact page and structured data.">
              <FormField id="contact_email" label="Email" optional error={err("contact_email")}>
                <Input type="email" {...fieldA11y("contact_email", { error: err("contact_email") })} {...register("contact_email")} />
              </FormField>
              <FormField id="contact_phone" label="Phone" optional error={err("contact_phone")}>
                <Input type="tel" {...fieldA11y("contact_phone", { error: err("contact_phone") })} {...register("contact_phone")} />
              </FormField>
              <FormField id="contact_address" label="Address" optional error={err("contact_address")}>
                <Input {...fieldA11y("contact_address", { error: err("contact_address") })} {...register("contact_address")} />
              </FormField>
            </FormSection>

            <FormSection id="social" title="Social links" description="Leave a field empty to hide that network.">
              {SOCIAL_FIELDS.map((field) => (
                <FormField key={field.name} id={String(field.name)} label={field.label} optional error={err(String(field.name))}>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder={field.placeholder}
                    {...fieldA11y(String(field.name), { error: err(String(field.name)) })}
                    {...register(field.name)}
                  />
                </FormField>
              ))}
            </FormSection>

            <FormSection id="seo" title="Search defaults" description="Used when a page doesn't set its own.">
              <FormField id="seo_title" label="SEO title" optional hint="Around 60 characters reads best." error={err("seo_title")}>
                <Input {...fieldA11y("seo_title", { hint: true, error: err("seo_title") })} {...register("seo_title")} />
              </FormField>
              <FormField
                id="seo_description"
                label="SEO description"
                optional
                hint="The snippet search engines show. Around 160 characters."
                count={{ length: form.watch("seo_description").length, max: 170 }}
                error={err("seo_description")}
              >
                <Textarea
                  rows={3}
                  {...fieldA11y("seo_description", { hint: true, error: err("seo_description") })}
                  {...register("seo_description")}
                />
              </FormField>
            </FormSection>

            <FormSection id="footer" title="Footer and analytics">
              <FormField
                id="footer_text"
                label="Footer note"
                optional
                hint="Short line under the footer navigation. 10–280 characters."
                count={{ length: form.watch("footer_text").length, max: 280 }}
                error={err("footer_text")}
              >
                <Textarea
                  rows={2}
                  {...fieldA11y("footer_text", { hint: true, error: err("footer_text") })}
                  {...register("footer_text")}
                />
              </FormField>
              <FormField
                id="analytics_id"
                label="Analytics ID"
                optional
                hint="e.g. G-XXXXXXXXXX. The analytics script loads only when this is set."
                error={err("analytics_id")}
              >
                <Input {...fieldA11y("analytics_id", { hint: true, error: err("analytics_id") })} {...register("analytics_id")} />
              </FormField>
            </FormSection>
          </div>
        </div>

        {/* Save bar for phones and tablets */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-gutter py-3 shadow-[0_-8px_24px_-16px_rgb(7_19_47/0.25)] backdrop-blur xl:hidden">
          <div className="mx-auto flex max-w-content items-center justify-between gap-3">
            <p aria-live="polite" className="hidden text-sm text-fg-muted sm:block">
              {hasChanges ? "You have unsaved changes." : "All changes saved."}
            </p>
            <div className="flex flex-1 justify-end gap-2">
              <Button type="submit" isLoading={isSaving} loadingText="Saving…">
                Save settings
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 hidden gap-3 xl:flex xl:items-center">
          <Button type="submit" isLoading={isSaving} loadingText="Saving…">
            Save settings
          </Button>
          <p aria-live="polite" className="text-sm text-fg-muted">
            {hasChanges ? "You have unsaved changes." : "All changes saved."}
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
