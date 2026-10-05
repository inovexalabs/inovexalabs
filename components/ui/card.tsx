import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type CardVariant = "surface" | "elevated" | "outline" | "muted" | "glass";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardRadius = "lg" | "xl" | "2xl";
type CardElement = "div" | "article" | "li" | "section" | "aside";

const variants: Record<CardVariant, string> = {
  surface: "border border-line bg-surface shadow-sm",
  elevated: "border border-line bg-surface shadow-md",
  outline: "border border-line-strong bg-transparent",
  muted: "border border-transparent bg-surface-muted",
  glass: "glass",
};

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const radii: Record<CardRadius, string> = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  /** Lifts on hover/focus. Use with a CardTitle `href` so the whole card is one link. */
  interactive?: boolean;
}

export function Card({
  as: Component = "div",
  variant = "surface",
  padding = "md",
  radius = "lg",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "relative",
        variants[variant],
        paddings[padding],
        radii[radius],
        interactive &&
          "transition-[translate,box-shadow,border-color] duration-300 ease-premium hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg focus-within:-translate-y-0.5 focus-within:shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

interface CardTitleProps {
  as?: "h2" | "h3" | "h4";
  /** Lets the card reference its title, e.g. <Card aria-labelledby={id}>. */
  id?: string;
  /** Turns the title into a link whose hit area covers the whole card. */
  href?: string;
  className?: string;
  children: ReactNode;
}

export function CardTitle({ as: Heading = "h3", id, href, className, children }: CardTitleProps) {
  return (
    <Heading id={id} className={cn("text-h4 text-fg", className)}>
      {href ? (
        <Link
          href={href}
          className="rounded-xs after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </Heading>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return <p className={cn("mt-2 text-sm text-fg-muted sm:text-base", className)}>{children}</p>;
}
