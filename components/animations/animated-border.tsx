import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type AnimatedBorderElement = "div" | "li" | "article";
type AnimatedBorderRadius = "lg" | "xl" | "2xl" | "full";

const radii: Record<AnimatedBorderRadius, string> = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export interface AnimatedBorderProps extends HTMLAttributes<HTMLElement> {
  as?: AnimatedBorderElement;
  /** Must match the radius of the wrapped element. */
  radius?: AnimatedBorderRadius;
  /** `hover` keeps the ring hidden until hover or keyboard focus inside. */
  trigger?: "always" | "hover";
  width?: 1 | 2;
}

/**
 * A light arc travelling around the border of its child. Pure CSS: no client
 * JavaScript. The inside stays transparent, so it works around glass cards.
 * With reduced motion it becomes a static gradient border.
 * Use on one highlighted element per view, not on every card.
 */
export function AnimatedBorder({
  as: Component = "div",
  radius = "xl",
  trigger = "always",
  width = 1,
  className,
  ...props
}: AnimatedBorderProps) {
  return (
    <Component
      data-trigger={trigger}
      className={cn("animated-border", radii[radius], width === 2 && "[--ab-width:2px]", className)}
      {...props}
    />
  );
}
