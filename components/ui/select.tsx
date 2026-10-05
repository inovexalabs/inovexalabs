import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { controlClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

/** Native select (best keyboard and mobile support) with the design-system look. */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(controlClassName, "h-11 appearance-none pl-3.5 pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
      />
    </div>
  );
}
