import type { ComponentProps } from "react";
import { controlClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(controlClassName, "min-h-24 resize-y px-3.5 py-2.5 leading-relaxed", className)} {...props} />;
}
