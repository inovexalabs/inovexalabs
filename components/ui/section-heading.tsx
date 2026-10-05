import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type HeadingLevel = 1 | 2 | 3;
type HeadingSize = "sm" | "md" | "lg" | "display";

const sizes: Record<HeadingSize, string> = {
  sm: "text-h3",
  md: "text-h2",
  lg: "text-h1",
  display: "text-display",
};

export interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  /** Short context line above the title, e.g. the parent area ("Innovation Lab"). */
  eyebrow?: ReactNode;
  align?: "start" | "center";
  level?: HeadingLevel;
  size?: HeadingSize;
  /** Use with a Section's `labelledBy` so the landmark gets an accessible name. */
  id?: string;
  /** Right-aligned actions on wide screens, e.g. a "See all projects" link. Start alignment only. */
  actions?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = "start",
  level = 2,
  size = "md",
  id,
  actions,
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;
  const centered = align === "center";

  const heading = (
    <hgroup className={cn("flex flex-col", centered ? "items-center text-center" : "items-start")}>
      {eyebrow ? (
        <p className="mb-4 inline-flex items-center gap-2.5 text-sm font-medium text-accent">
          <span aria-hidden="true" className="h-px w-6 brand-gradient" />
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className={cn(sizes[size], "font-display text-fg")}>
        {title}
      </Heading>
      {description ? (
        <p className={cn("mt-4 max-w-reading text-lead text-fg-muted sm:mt-5", centered && "mx-auto")}>{description}</p>
      ) : null}
    </hgroup>
  );

  if (actions && !centered) {
    return (
      <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
        {heading}
        <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
      </div>
    );
  }

  return <div className={cn(centered && "mx-auto max-w-narrow", className)}>{heading}</div>;
}
