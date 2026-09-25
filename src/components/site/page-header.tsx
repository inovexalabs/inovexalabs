import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";
import { Eyebrow } from "@/components/site/section";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  lede,
  trail,
  meta,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  trail?: Crumb[];
  /** Small monospace facts row — status, dates, categories. */
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden border-b border-steel/80", className)}>
      <div aria-hidden className="lab-grid lab-grid-mask pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="lab-vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[86rem] edge-x pb-14 pt-28 sm:pb-16 sm:pt-36">
        {trail ? <Breadcrumbs trail={trail} className="mb-8" /> : null}

        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="display-lg mt-5 text-bone">{title}</h1>
          {lede ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">
              {lede}
            </p>
          ) : null}
        </div>

        {meta ? <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">{meta}</div> : null}
        {children}
      </div>
    </header>
  );
}
