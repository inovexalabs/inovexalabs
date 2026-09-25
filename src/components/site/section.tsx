import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  bordered = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article" | "aside";
  bordered?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative edge-x py-20 sm:py-24 lg:py-32",
        bordered && "border-t border-steel/70",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[86rem]">{children}</div>
    </Tag>
  );
}

/** Small monospace label that opens most sections — the lab's instrument readout. */
export function Eyebrow({
  children,
  className,
  marker = true,
}: {
  children: ReactNode;
  className?: string;
  marker?: boolean;
}) {
  return (
    <p className={cn("mono-label flex items-center gap-2.5 text-signal", className)}>
      {marker ? (
        <span aria-hidden className="inline-block size-1.5 rounded-full bg-signal" />
      ) : null}
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  action,
  className,
  id,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  action?: { label: string; href: string };
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow ? <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow> : null}
        <h2 id={id} className="display-lg mt-5 text-bone">
          {title}
        </h2>
        {lede ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">{lede}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-steel px-5 py-2.5 text-sm text-bone-dim transition-colors hover:border-signal/50 hover:text-bone md:self-auto"
        >
          {action.label}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}
