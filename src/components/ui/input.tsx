import * as React from "react";
import { cn } from "@/lib/utils";

const baseField =
  "w-full rounded-xl border border-steel bg-carbon px-4 text-sm text-bone placeholder:text-ash-deep transition-colors outline-none hover:border-steel-bright focus:border-signal/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500/60";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        baseField,
        "h-11 file:mr-3 file:rounded-full file:border-0 file:bg-graphite file:px-3 file:py-1 file:text-xs file:font-medium file:text-bone-dim",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(baseField, "min-h-32 resize-y py-3 leading-relaxed", className)} {...props} />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-2 block font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ash",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 font-mono text-[0.6875rem] text-red-400">
      {children}
    </p>
  );
}

export { baseField };
