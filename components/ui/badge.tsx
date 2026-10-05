import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "neutral" | "brand" | "blue" | "purple" | "success" | "warning" | "danger" | "outline";
export type BadgeSize = "sm" | "md";

const variants: Record<BadgeVariant, string> = {
  neutral: "border-line bg-fg/[0.05] text-fg-muted",
  brand: "border-iris-500/20 brand-gradient-soft text-accent",
  blue: "border-electric-500/25 bg-electric-500/10 text-electric-700 on-dark:text-electric-300",
  purple: "border-iris-500/25 bg-iris-500/10 text-iris-700 on-dark:text-iris-200",
  success: "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 on-dark:text-emerald-300",
  warning: "border-amber-600/25 bg-amber-500/10 text-amber-800 on-dark:text-amber-300",
  danger: "border-rose-600/20 bg-rose-500/10 text-rose-700 on-dark:text-rose-300",
  outline: "border-line-strong bg-transparent text-fg",
};

const sizes: Record<BadgeSize, string> = {
  sm: "h-6 gap-1.5 px-2.5 text-xs",
  md: "h-7 gap-2 px-3 text-sm",
};

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Leading status dot in the badge's text colour. */
  dot?: boolean;
}

export function Badge({ variant = "neutral", size = "sm", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center whitespace-nowrap rounded-full border font-medium [&_svg]:size-3.5",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
