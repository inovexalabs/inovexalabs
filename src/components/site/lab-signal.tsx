import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LabSignal as LabSignalData } from "@/lib/queries/metrics";

/**
 * LAB SIGNAL — the site's signature element.
 *
 * A live readout of what the lab is currently working on, counted from the
 * database. When the lab is genuinely quiet it says so instead of inventing
 * activity. Clicking it always lands on the Lab.
 */
export function LabSignal({
  signal,
  className,
}: {
  signal: LabSignalData;
  className?: string;
}) {
  const copy = signalCopy(signal);

  return (
    <Link
      href={copy.href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full border border-steel bg-carbon/70 py-1.5 pl-2.5 pr-3.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] backdrop-blur-sm transition-colors duration-300",
        copy.href ? "hover:border-signal/50" : "pointer-events-none",
        className,
      )}
      aria-label={`Lab signal: ${copy.text}`}
    >
      <span className={cn("mono-label hidden text-ash-deep lg:inline", "text-[0.5625rem] tracking-[0.2em]")}>
        Lab signal
      </span>
      <span aria-hidden className="hidden h-3 w-px bg-steel lg:block" />
      <span className="relative flex size-1.5">
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            copy.tone === "signal" && "bg-signal animate-pulse-dot",
            copy.tone === "plasma" && "bg-plasma animate-pulse-dot",
            copy.tone === "muted" && "bg-ash-deep",
          )}
        />
      </span>
      <span className={cn(copy.tone === "muted" ? "text-ash" : "text-bone-dim group-hover:text-bone")}>
        {copy.text}
      </span>
    </Link>
  );
}

function signalCopy(signal: LabSignalData) {
  if (signal.kind === "experiments") {
    return {
      text: `${String(signal.count).padStart(2, "0")} experiments active`,
      href: "/lab",
      tone: "plasma" as const,
    };
  }
  if (signal.kind === "products") {
    return {
      text: `${String(signal.count).padStart(2, "0")} products in development`,
      href: "/products",
      tone: "signal" as const,
    };
  }
  return { text: "Lab idle", href: "", tone: "muted" as const };
}
