import { cn } from "@/lib/utils/cn";

export type GlowOrbColor = "blue" | "purple" | "violet" | "brand";
export type GlowOrbSize = "sm" | "md" | "lg" | "xl";
export type GlowOrbIntensity = "soft" | "medium" | "strong";

const colors: Record<GlowOrbColor, string> = {
  blue: "bg-[radial-gradient(closest-side,rgb(77_141_255/0.55),rgb(77_141_255/0.18)_55%,transparent)]",
  purple: "bg-[radial-gradient(closest-side,rgb(115_87_217/0.55),rgb(115_87_217/0.18)_55%,transparent)]",
  violet: "bg-[radial-gradient(closest-side,rgb(168_121_255/0.55),rgb(168_121_255/0.18)_55%,transparent)]",
  brand: "bg-[radial-gradient(closest-side,rgb(115_87_217/0.5),rgb(77_141_255/0.22)_55%,transparent)]",
};

const sizes: Record<GlowOrbSize, string> = {
  sm: "size-48",
  md: "size-80",
  lg: "size-[32rem]",
  xl: "size-[44rem]",
};

const intensities: Record<GlowOrbIntensity, string> = {
  soft: "opacity-40",
  medium: "opacity-70",
  strong: "opacity-100",
};

export interface GlowOrbProps {
  color?: GlowOrbColor;
  size?: GlowOrbSize;
  intensity?: GlowOrbIntensity;
  /** Very slow ambient drift. Disabled automatically for reduced motion. */
  drift?: boolean;
  /** Positioning, e.g. "-top-40 left-1/4". The orb is absolutely positioned. */
  className?: string;
}

/** Decorative light source. Place inside a Section `background` or any positioned parent. */
export function GlowOrb({ color = "brand", size = "lg", intensity = "medium", drift = false, className }: GlowOrbProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute block rounded-full",
        colors[color],
        sizes[size],
        intensities[intensity],
        drift && "motion-safe:animate-orb-drift",
        className,
      )}
    />
  );
}
