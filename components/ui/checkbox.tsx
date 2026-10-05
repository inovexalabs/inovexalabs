import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Native checkbox with the design-system accent colour. Using the platform
 * control keeps keyboard, screen reader and mobile behaviour intact.
 */
export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 shrink-0 cursor-pointer rounded-xs border border-line-strong bg-surface accent-iris-600 " +
          "transition-[border-color,box-shadow] duration-200 hover:border-fg/30 " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
          "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
