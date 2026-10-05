import { Card, type CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type GlassGlow = "none" | "blue" | "purple" | "violet" | "brand";

const glows: Record<GlassGlow, string> = {
  none: "",
  blue: "[--glass-glow:var(--shadow-glow-blue)]",
  purple: "[--glass-glow:var(--shadow-glow-purple)]",
  violet: "[--glass-glow:var(--shadow-glow-violet)]",
  brand: "[--glass-glow:var(--shadow-glow-brand)]",
};

export interface GlassCardProps extends Omit<CardProps, "variant"> {
  /** Coloured halo layered on top of the glass shadow. Best on dark sections. */
  glow?: GlassGlow;
  /** More opaque surface for menus and text-heavy panels. */
  strong?: boolean;
  /** Luminous hairline along the top edge. */
  edge?: boolean;
}

export function GlassCard({ glow = "none", strong = false, edge = true, radius = "xl", className, ...props }: GlassCardProps) {
  return (
    <Card
      variant="glass"
      radius={radius}
      className={cn(strong && "glass-strong", edge && "glass-edge", glows[glow], className)}
      {...props}
    />
  );
}
