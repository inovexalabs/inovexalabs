import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface FormSectionProps {
  id: string;
  title: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled group of related fields in an admin form. */
export function FormSection({ id, title, description, className, children }: FormSectionProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn("rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6", className)}
    >
      <h2 id={`${id}-title`} className="font-display text-h4 text-fg">
        {title}
      </h2>
      {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
