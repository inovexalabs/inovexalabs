import type { HTMLAttributes, ReactNode } from "react";
import { Container, type ContainerSize } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";

export type SectionTone = "light" | "muted" | "dark";
export type SectionSpacing = "none" | "sm" | "md" | "lg";
type SectionElement = "section" | "div" | "header" | "aside";

const tones: Record<SectionTone, string> = {
  light: "",
  muted: "bg-bg",
  dark: "navy-gradient",
};

const spacings: Record<SectionSpacing, string> = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
};

/** Same rhythm plus the sticky header's height, for the first section on a page. */
const underHeaderSpacings: Record<SectionSpacing, string> = {
  none: "pt-header",
  sm: "pt-[calc(var(--header-h)+var(--spacing-section-sm))]",
  md: "pt-[calc(var(--header-h)+var(--spacing-section))]",
  lg: "pt-[calc(var(--header-h)+var(--spacing-section-lg))]",
};

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "aria-labelledby"> {
  as?: SectionElement;
  tone?: SectionTone;
  spacing?: SectionSpacing;
  /** Wraps children in a Container of this size. `false` renders children edge to edge. */
  container?: ContainerSize | false;
  /** First section on a page: the sticky header overlaps it, so it adds the header height. */
  underHeader?: boolean;
  /** id of the heading that names this landmark. */
  labelledBy?: string;
  /** Decorative layer (GlowOrb, grid) clipped to the section and hidden from assistive tech. */
  background?: ReactNode;
}

export function Section({
  as: Component = "section",
  tone = "light",
  spacing = "md",
  container = "content",
  underHeader = false,
  labelledBy,
  background,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cn("relative isolate", tones[tone], spacings[spacing], underHeader && underHeaderSpacings[spacing], className)}
      {...props}
    >
      {background ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {background}
        </div>
      ) : null}
      {container ? <Container size={container}>{children}</Container> : children}
    </Component>
  );
}
