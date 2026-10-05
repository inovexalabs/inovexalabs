"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, RotateCcw, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitContactForm } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUDGET_RANGES, PROJECT_TYPES, SERVICE_INTERESTS, TIMELINES } from "@/lib/constants/contact";
import type { ActionResult } from "@/lib/utils/action-result";
import { contactFormSchema, emptyContactValues, type ContactFormValues } from "@/lib/validations/contact";

/**
 * Project intake form. Client-side validation first (instant feedback), then
 * the Server Action validates again before writing to contact_leads.
 * States: idle → submitting → success (with a reference) or error.
 */
export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: emptyContactValues(),
    mode: "onTouched",
  });

  const services = watch("services");

  function toggleService(value: (typeof SERVICE_INTERESTS)[number], checked: boolean) {
    const current = watch("services") ?? [];
    const next = checked ? [...current, value] : current.filter((item) => item !== value);
    setValue("services", next, { shouldValidate: isSubmitted, shouldDirty: true });
  }

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      try {
        const result: ActionResult<{ reference: string }> = await submitContactForm(values);
        if (!result.ok) {
          setFormError(result.error);
          for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
            if (field !== "form" && field !== "website") {
              setError(field as keyof ContactFormValues, { message });
            }
          }
          return;
        }
        setReference(result.data.reference);
        reset(emptyContactValues());
      } catch (error) {
        console.error("[ContactForm] submit failed", error);
        setFormError("The connection dropped before your message was sent. Check your connection and try again.");
      }
    });
  });

  if (reference) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-700">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </span>
        <h2 className="mt-5 font-display text-h3 text-fg">Message received</h2>
        <p className="mt-3 max-w-prose text-fg-muted">
          Thanks for reaching out. We read every enquiry and reply within two working days — usually with a couple of
          questions before anything else.
        </p>
        <p className="mt-4 text-sm text-fg-muted">
          Your reference: <span className="font-semibold tabular-nums text-fg">{reference}</span>
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setReference(null);
            setFormError(null);
          }}
        >
          <RotateCcw aria-hidden="true" />
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError ? (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-rose-600" />
          <p className="text-sm text-rose-700">{formError}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label="Name" error={errors.name?.message}>
          <Input autoComplete="name" {...fieldA11y("contact-name", { error: errors.name?.message })} {...register("name")} />
        </FormField>

        <FormField id="contact-email" label="Email" error={errors.email?.message}>
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            {...fieldA11y("contact-email", { error: errors.email?.message })}
            {...register("email")}
          />
        </FormField>

        <FormField id="contact-phone" label="Phone" optional error={errors.phone?.message}>
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...fieldA11y("contact-phone", { error: errors.phone?.message })}
            {...register("phone")}
          />
        </FormField>

        <FormField id="contact-company" label="Company" optional error={errors.company?.message}>
          <Input autoComplete="organization" {...fieldA11y("contact-company", { error: errors.company?.message })} {...register("company")} />
        </FormField>

        <FormField id="contact-project-type" label="Project type" error={errors.project_type?.message}>
          <Select {...fieldA11y("contact-project-type", { error: errors.project_type?.message })} {...register("project_type")}>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="contact-budget" label="Budget range" error={errors.budget?.message}>
          <Select {...fieldA11y("contact-budget", { error: errors.budget?.message })} {...register("budget")}>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="contact-timeline" label="Timeline" error={errors.timeline?.message}>
          <Select {...fieldA11y("contact-timeline", { error: errors.timeline?.message })} {...register("timeline")}>
            {TIMELINES.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="contact-source" label="How did you hear about us?" error={errors.source?.message}>
          <Select {...fieldA11y("contact-source", { error: errors.source?.message })} {...register("source")}>
            <option value="contact-form">Search engine</option>
            <option value="referral">Someone recommended you</option>
            <option value="social">Social media</option>
            <option value="other">Somewhere else</option>
          </Select>
        </FormField>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-fg">Services you need</legend>
        <p className="mt-1 text-sm text-fg-muted">Pick as many as apply — or none, if you are not sure yet.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICE_INTERESTS.map((service) => {
            const checked = services.includes(service);
            return (
              <label
                key={service}
                className={
                  checked
                    ? "inline-flex cursor-pointer items-center gap-2 rounded-full border border-iris-500/40 brand-gradient-soft px-4 py-2 text-sm font-medium text-iris-700"
                    : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-fg/30 hover:text-fg"
                }
              >
                <Checkbox
                  type="checkbox"
                  value={service}
                  checked={checked}
                  onChange={(event) => toggleService(service, event.target.checked)}
                  className="sr-only"
                />
                {checked ? <CheckCircle2 aria-hidden="true" className="size-4" /> : null}
                {service}
              </label>
            );
          })}
        </div>
        {errors.services?.message ? (
          <p className="mt-2 text-sm text-rose-600">{errors.services.message}</p>
        ) : null}
      </fieldset>

      <FormField
        id="contact-description"
        label="Project description"
        hint="What are you trying to build or fix? The more context, the better our first reply."
        error={errors.description?.message}
        count={{ length: watch("description")?.length ?? 0, max: 5000 }}
      >
        <Textarea rows={7} {...fieldA11y("contact-description", { hint: true, error: errors.description?.message })} {...register("description")} />
      </FormField>

      <div>
        <div className="flex items-start gap-3">
          <Checkbox {...fieldA11y("contact-consent", { error: errors.consent?.message })} {...register("consent")} />        <label htmlFor="contact-consent" className="cursor-pointer text-sm text-fg-muted">
          I agree that Inovexa Labs may store these details to respond to my enquiry.
        </label>
        </div>
        <p className="mt-1.5 pl-7 text-sm text-fg-muted">
          See how we handle your data in the{" "}
          <a href="/privacy" className="text-accent underline-offset-4 hover:underline">
            privacy policy
          </a>
          .
        </p>
        {errors.consent?.message ? (
          <p id="contact-consent-error" className="mt-1.5 text-sm text-rose-600">
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {/* Spam trap: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <Button type="submit" size="lg" isLoading={isPending} loadingText="Sending…">
          Send message
        </Button>
        <p className="text-sm text-fg-muted">We reply within two working days.</p>
      </div>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Sending your message" : ""}
      </p>
    </form>
  );
}
