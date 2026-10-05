import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: ReactNode;
  /** Parent page, rendered as a back link above the title. */
  back?: { href: string; label: string };
  actions?: ReactNode;
}

export function AdminPageHeader({ title, description, back, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="-ml-1 mb-3 inline-flex items-center gap-1 rounded-xs text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            {back.label}
          </Link>
        ) : null}
        <h1 className="font-display text-h2 text-fg">{title}</h1>
        {description ? <p className="mt-2 max-w-reading text-fg-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
