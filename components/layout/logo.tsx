import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface LogoMarkProps {
  className?: string;
  /** Unique per instance when the mark appears more than once on a page. */
  gradientId?: string;
}

/** The crossing-strokes "X" mark. Replace with the final brand SVG when it is supplied. */
export function LogoMark({ className, gradientId = "inovexa-mark-gradient" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4D8DFF" />
          <stop offset="0.55" stopColor="#7357D9" />
          <stop offset="1" stopColor="#A879FF" />
        </linearGradient>
      </defs>
      <path d="M7 5.5c6.5 5 11.5 15.5 18 21" stroke={`url(#${gradientId})`} strokeWidth="4.5" strokeLinecap="round" />
      <path
        d="M25 5.5c-6.5 5-11.5 15.5-18 21"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.82"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  gradientId?: string;
  /** Logo uploaded in /admin/settings. Without it, the built-in mark and name render. */
  logoUrl?: string | null;
  /** Company name from site settings, used for the link label and the image alt text. */
  siteName?: string | null;
}

export function Logo({ className, gradientId, logoUrl, siteName }: LogoProps) {
  const name = siteName?.trim() || "Inovexa Labs";

  if (logoUrl) {
    return (
      <Link href={ROUTES.home} className={cn("inline-flex shrink-0 items-center rounded-md", className)}>
        <Image
          src={logoUrl}
          alt={`${name} home`}
          width={320}
          height={80}
          sizes="10rem"
          priority
          className="h-8 w-auto max-w-[10rem] object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.home}
      aria-label={`${name} home`}
      className={cn("inline-flex shrink-0 items-center gap-2.5 rounded-md", className)}
    >
      <LogoMark className="size-8" gradientId={gradientId} />
      <span className="font-display text-[1.1875rem] font-semibold leading-none tracking-[-0.02em] text-fg">
        Inovexa<span className="font-normal text-fg-muted"> Labs</span>
      </span>
    </Link>
  );
}
