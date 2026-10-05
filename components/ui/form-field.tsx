import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** ARIA wiring for a control inside FormField: invalid state plus hint/error descriptions. */
export function fieldA11y(id: string, { hint, error }: { hint?: boolean; error?: string }) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;
}

interface FormFieldProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  /** Live character count, e.g. { length: 120, max: 160 }. */
  count?: { length: number; max: number };
  className?: string;
  children: ReactNode;
}

/** Label, optional hint, control and error message. Pair the control with fieldA11y(id, …). */
export function FormField({ id, label, hint, error, optional = false, count, className, children }: FormFieldProps) {
  const overLimit = count ? count.length > count.max : false;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
          {optional ? <span className="font-normal text-fg-muted"> (optional)</span> : null}
        </label>
        {count ? (
          <span className={cn("text-xs tabular-nums", overLimit ? "font-medium text-rose-600" : "text-fg-muted")}>
            {count.length}/{count.max}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-fg-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
