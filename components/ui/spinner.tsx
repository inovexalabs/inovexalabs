import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  className?: string;
  /** When set, the spinner announces itself as a live status region. */
  label?: string;
}

export function Spinner({ className, label }: SpinnerProps) {
  const icon = <LoaderCircle aria-hidden="true" className={cn("size-4 animate-spin", className)} />;

  if (!label) return icon;

  return (
    <span role="status" className="inline-flex items-center gap-2">
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}
