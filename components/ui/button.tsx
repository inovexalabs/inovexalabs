import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const base =
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
  "transition-[background-color,background-position,border-color,color,box-shadow,scale] duration-300 ease-premium " +
  "disabled:pointer-events-none disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55 " +
  "[&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "brand-gradient-strong text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.22),0_8px_24px_-10px_rgb(77_141_255/0.6),0_6px_18px_-8px_rgb(115_87_217/0.55)] " +
    "hover:bg-right hover:shadow-glow-brand active:scale-[0.98]",
  secondary: "bg-solid text-solid-fg shadow-sm hover:bg-solid-hover active:scale-[0.98]",
  outline:
    "border border-line-strong bg-transparent text-fg hover:border-fg/30 hover:bg-fg/[0.04] active:scale-[0.98]",
  ghost: "text-fg hover:bg-fg/[0.06] active:scale-[0.98]",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]",
  link: "rounded-xs text-accent underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
  icon: "size-11",
};

/** Class builder shared by Button, ButtonLink and MagneticButton. */
export function buttonStyles({ variant = "primary", size = "md", fullWidth = false, className }: ButtonStyleOptions = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], fullWidth && "w-full", className);
}

export interface ButtonProps extends ComponentProps<"button">, Omit<ButtonStyleOptions, "className"> {
  isLoading?: boolean;
  /** Replaces the label while loading, e.g. "Sending…". */
  loadingText?: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  isLoading = false,
  loadingText,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export interface ButtonLinkProps extends ComponentProps<typeof Link>, Omit<ButtonStyleOptions, "className"> {
  /** Opens in a new tab with safe rel attributes and an announced hint. */
  external?: boolean;
}

export function ButtonLink({ variant, size, fullWidth, external = false, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </Link>
  );
}
