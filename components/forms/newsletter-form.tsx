"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Send, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { subscribeNewsletter } from "@/app/(site)/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { ActionResult } from "@/lib/utils/action-result";
import { newsletterFormSchema, type NewsletterFormValues } from "@/lib/validations/contact";

interface NewsletterFormProps {
  /** Heading rendered above the form; omit when the context is obvious. */
  title?: string;
  description?: string;
}

/** Email signup with validation, consent, loading, success and error states. */
export function NewsletterForm({ title, description }: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "", consent: false, website: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      try {
        const result: ActionResult<{ subscribed: boolean }> = await subscribeNewsletter(values);
        if (!result.ok) {
          setFormError(result.error);
          for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
            if (field === "email" || field === "consent") setError(field, { message });
          }
          return;
        }
        reset();
        setDone(true);
      } catch (error) {
        console.error("[NewsletterForm]", error);
        setFormError("Subscribing couldn't reach the server. Check your connection and try again.");
      }
    });
  });

  if (done) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        <p className="text-sm text-emerald-700 on-dark:text-emerald-300">
          You&apos;re on the list. We&apos;ll only email when there is something worth reading.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="@container space-y-3">
      {title ? <p className="font-display text-h4 text-fg">{title}</p> : null}
      {description ? <p className="text-sm text-fg-muted">{description}</p> : null}

      {formError ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-rose-500" />
          <p className="text-sm text-rose-600 on-dark:text-rose-300">{formError}</p>
        </div>
      ) : null}

      <FormField id="newsletter-email" label="Email address" error={errors.email?.message}>
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...fieldA11y("newsletter-email", { error: errors.email?.message })}
          {...register("email")}
        />
      </FormField>

      <div>
        <div className="flex items-start gap-2.5">
          <Checkbox
            {...fieldA11y("newsletter-consent", { error: errors.consent?.message })}
            {...register("consent")}
          />
          <label htmlFor="newsletter-consent" className="cursor-pointer text-sm text-fg-muted">
            I agree to receive occasional emails. Unsubscribe any time.
          </label>
        </div>
        {errors.consent?.message ? (
          <p id="newsletter-consent-error" className="mt-1.5 text-sm text-rose-600 on-dark:text-rose-300">
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {/* Full width in narrow spots (the footer column), natural width where there is room. */}
      <Button type="submit" isLoading={isPending} loadingText="Subscribing…" className="w-full @sm:w-auto">
        <Send aria-hidden="true" />
        Subscribe
      </Button>

      {/* Spam trap: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="newsletter-website">Leave this field empty</label>
        <input id="newsletter-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
    </form>
  );
}
