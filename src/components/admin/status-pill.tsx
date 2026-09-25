import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  live: "border-status-live/40 bg-status-live/10 text-status-live",
  in_development: "border-status-development/40 bg-status-development/10 text-status-development",
  experiment: "border-status-experiment/40 bg-status-experiment/10 text-status-experiment",
  idea: "border-status-idea/40 bg-status-idea/10 text-status-idea",
  archived: "border-status-archived/40 bg-status-archived/10 text-status-archived",
  new: "border-signal/40 bg-signal/10 text-signal",
  read: "border-steel bg-graphite text-bone-dim",
  in_discussion: "border-plasma/40 bg-plasma/10 text-plasma",
  won: "border-status-live/40 bg-status-live/10 text-status-live",
  spam: "border-red-500/40 bg-red-500/10 text-red-300",
};

export function StatusPill({
  label,
  active,
}: {
  label?: string;
  active?: boolean;
}) {
  if (typeof active === "boolean") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em]",
          active
            ? "border-signal/40 bg-signal/10 text-signal"
            : "border-steel bg-carbon text-ash-deep",
        )}
      >
        <span aria-hidden className={cn("size-1.5 rounded-full", active ? "bg-signal" : "bg-ash-deep")} />
        {active ? "Live" : "Draft"}
      </span>
    );
  }

  const key = (label ?? "").toLowerCase().replace(/\s+/g, "_");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em]",
        TONES[key] ?? "border-steel bg-graphite text-bone-dim",
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
