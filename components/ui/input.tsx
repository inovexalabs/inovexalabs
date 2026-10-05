import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/** Shared control styling for inputs, textareas and selects. Errors come from aria-invalid. */
export const controlClassName =
  "block w-full rounded-md border border-line-strong bg-surface text-fg shadow-xs " +
  "transition-[border-color,box-shadow] duration-200 placeholder:text-fg-subtle " +
  "hover:border-fg/30 focus-visible:border-electric-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-500/15 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "aria-invalid:border-rose-500 aria-invalid:focus-visible:ring-rose-500/15";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClassName, "h-11 px-3.5", className)} {...props} />;
}
