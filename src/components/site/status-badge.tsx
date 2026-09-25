import { STATUS_META, type ProductStatus } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Product lifecycle indicator. The dot pulses only while something is actually
 * in motion — a settled state should not beg for attention.
 */
export function StatusBadge({
  status,
  className,
  pulse,
  size = "md",
}: {
  status: ProductStatus;
  className?: string;
  /** Override the default pulsing behaviour. */
  pulse?: boolean;
  size?: "sm" | "md";
}) {
  const meta = STATUS_META[status] ?? STATUS_META.idea;
  const shouldPulse = pulse ?? (status === "in_development" || status === "experiment");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-carbon/80 font-mono font-medium uppercase backdrop-blur-sm",
        size === "sm"
          ? "px-2 py-0.5 text-[0.625rem] tracking-[0.14em]"
          : "px-2.5 py-1 text-[0.6875rem] tracking-[0.14em]",
        meta.ring,
        meta.text,
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className={cn("absolute inset-0 rounded-full", meta.dot, shouldPulse && "animate-pulse-dot")} />
      </span>
      {meta.label}
    </span>
  );
}
