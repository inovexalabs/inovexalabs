import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type GradientTextElement = "span" | "strong" | "em" | "p" | "h1" | "h2" | "h3";

interface GradientTextProps {
  as?: GradientTextElement;
  className?: string;
  children: ReactNode;
}

/**
 * Brand gradient clipped to text. Adapts to light and dark tones.
 * Reserve for display sizes (24px+): the gradient's lightest stop only meets
 * the 3:1 contrast required for large text.
 */
export function GradientText({ as: Component = "span", className, children }: GradientTextProps) {
  return <Component className={cn("gradient-text", className)}>{children}</Component>;
}
