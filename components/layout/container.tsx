import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ContainerSize = "reading" | "narrow" | "content" | "wide" | "full";
type ContainerElement = "div" | "section" | "header" | "footer" | "nav" | "article";

const sizes: Record<ContainerSize, string> = {
  reading: "max-w-reading",
  narrow: "max-w-narrow",
  content: "max-w-content",
  wide: "max-w-wide",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ContainerElement;
  size?: ContainerSize;
}

/** Centred column with the fluid page gutter (16px on phones, up to 40px). */
export function Container({ as: Component = "div", size = "content", className, ...props }: ContainerProps) {
  return <Component className={cn("mx-auto w-full px-gutter", sizes[size], className)} {...props} />;
}
