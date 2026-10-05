import { cn } from "@/lib/utils/cn";

interface SectionDividerProps {
  className?: string;
}

/**
 * Hairline between sections. The track draws outward from a centre node as it
 * scrolls into view (CSS scroll-driven animation where supported) and a soft
 * beam of light travels along it. Decorative, so hidden from assistive tech;
 * static with reduced motion.
 */
export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div aria-hidden="true" className={cn("mx-auto w-full max-w-wide px-gutter", className)}>
      <div className="divider-draw relative h-px">
        <div className="absolute inset-0 overflow-hidden">
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-line-strong to-transparent" />
          <span className="absolute inset-y-0 left-0 w-1/3 animate-beam bg-linear-to-r motion-reduce:hidden from-transparent via-electric-500/80 to-transparent" />
        </div>
        <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 animate-halo rounded-full border border-iris-500/60 motion-reduce:hidden" />
        <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] brand-gradient shadow-glow-violet" />
      </div>
    </div>
  );
}
