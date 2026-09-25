import { cn } from "@/lib/utils";

/**
 * The Inovexa mark: a signal aperture — an outer ring with an offset node
 * entering it, and a calibrated tick at each quadrant. Drawn rather than
 * imported so it stays crisp at every size and costs no extra request.
 */
export function LabMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      <rect
        x="1.25"
        y="1.25"
        width="25.5"
        height="25.5"
        rx="7.5"
        className="stroke-steel-bright"
        strokeWidth="1"
      />
      <circle cx="14" cy="14" r="5.4" className="stroke-signal" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="1.9" className="fill-signal" />
      <path d="M14 2.6v3.1M14 22.3v3.1M2.6 14h3.1M22.3 14h3.1" className="stroke-signal/55" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="22.2" cy="6.4" r="1.7" className="fill-plasma" />
    </svg>
  );
}

export function Wordmark({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      {showMark ? (
        <LabMark className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[8deg]" />
      ) : null}
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.9375rem] font-semibold tracking-[0.16em] text-bone">
          INOVEXA
        </span>
        <span className="mt-0.5 font-mono text-[0.5625rem] font-medium tracking-[0.36em] text-signal">
          LABS
        </span>
      </span>
    </span>
  );
}
