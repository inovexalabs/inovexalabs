"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitInquiry } from "@/actions/contact";
import { FORM_STATE_IDLE } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUDGET_RANGES, PROJECT_TYPES, REFERRAL_SOURCES, TIMELINES } from "@/config/site";
import { cn } from "@/lib/utils";

const DESCRIPTION_HINT = "What are you trying to solve, who is it for, and what have you tried?";

export function ContactForm({ defaultProjectType }: { defaultProjectType?: string }) {
  const [state, formAction, pending] = useActionState(submitInquiry, FORM_STATE_IDLE);
  const [renderedAt, setRenderedAt] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  // Timestamp used by the server to reject instant bot submissions.
  useEffect(() => {
    setRenderedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="panel flex flex-col items-start gap-5 p-8 sm:p-10"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl border border-signal/40 bg-signal/10 text-signal">
          <CheckCircle2 className="size-6" />
        </span>
        <h2 className="font-display text-2xl font-medium tracking-tight text-bone">
          Message received.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-bone-dim">
          {state.message} A real person on the team reads every inquiry and replies within one
          business day — usually with a straight answer about whether we are the right fit.
        </p>
        <p className="max-w-md text-sm leading-relaxed text-ash">
          In the meantime, our products and experiments show how we work in practice.
        </p>
      </div>
    );
  }

  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="panel p-6 sm:p-8" noValidate>
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-7 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/[0.07] p-4"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
          <p className="text-sm leading-relaxed text-red-200">{state.message}</p>
        </div>
      ) : null}

      {/* Spam gates — hidden from humans, irresistible to bots. */}
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Do not fill this in</label>
        <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <fieldset disabled={pending} className="contents">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" name="name" required error={errors.name}>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              defaultValue={values.name ?? ""}
              aria-invalid={Boolean(errors.name)}
              placeholder="Ada Lovelace"
            />
          </Field>

          <Field label="Email" name="email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              defaultValue={values.email ?? ""}
              aria-invalid={Boolean(errors.email)}
              placeholder="you@company.com"
            />
          </Field>

          <Field label="Company" name="company" error={errors.company}>
            <Input
              id="company"
              name="company"
              autoComplete="organization"
              defaultValue={values.company ?? ""}
              placeholder="Optional"
            />
          </Field>

          <Field label="Phone" name="phone" error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={values.phone ?? ""}
              placeholder="Optional"
            />
          </Field>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <SelectField
            label="Project type"
            name="projectType"
            options={PROJECT_TYPES}
            defaultValue={defaultProjectType ?? values.projectType ?? ""}
            placeholder="Select…"
          />
          <SelectField
            label="Budget range"
            name="budgetRange"
            options={BUDGET_RANGES}
            defaultValue={values.budgetRange ?? ""}
            placeholder="Select…"
          />
          <SelectField
            label="Timeline"
            name="timeline"
            options={TIMELINES}
            defaultValue={values.timeline ?? ""}
            placeholder="Select…"
          />
        </div>

        <div className="mt-6">
          <Field
            label="Project description"
            name="description"
            required
            error={errors.description}
            hint={DESCRIPTION_HINT}
          >
            <Textarea
              id="description"
              name="description"
              required
              minLength={30}
              defaultValue={values.description ?? ""}
              aria-invalid={Boolean(errors.description)}
              placeholder="We run a distribution business with 40 field staff and our stock reconciliation takes two days a week…"
              className="min-h-40"
            />
          </Field>
        </div>

        <div className="mt-6">
          <SelectField
            label="How did you hear about us?"
            name="referralSource"
            options={REFERRAL_SOURCES}
            defaultValue={values.referralSource ?? ""}
            placeholder="Optional"
          />
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-4 border-t border-steel pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-ash-deep">
          We reply within one business day. Your details are stored securely and never shared or
          used for marketing.
        </p>
        <Button type="submit" size="lg" disabled={pending} className="shrink-0">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send inquiry
              <Send className="size-4" />
            </>
          )}
        </Button>
      </div>

      {/* Fieldset is disabled while pending, so announce the state for screen readers. */}
      <p aria-live="polite" className="sr-only">
        {pending ? "Sending your inquiry" : ""}
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={name} className={cn(error && "text-red-300")}>
        {label}
        {required ? <span className="ml-1 text-signal">*</span> : null}
      </Label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-ash-deep">{hint}</p> : null}
      <FieldError>{error}</FieldError>
    </div>
  );
}

/**
 * Radix Select for a real, accessible listbox. A hidden input carries the value
 * into the FormData the Server Action receives.
 */
function SelectField({
  label,
  name,
  options,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <input type="hidden" name={name} value={value} />
      <Select value={value || undefined} onValueChange={setValue}>
        <SelectTrigger id={name} aria-label={label}>
          <SelectValue placeholder={placeholder ?? "Select…"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
