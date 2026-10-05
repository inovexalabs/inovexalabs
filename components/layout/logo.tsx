import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import markImage from "@/public/brand/inovexa-mark.png";

/** The purple "X" from the Inovexa wordmark. Decorative: pair it with visible text or a label. */
export function LogoMark({ className }: { className?: string }) {
  return <Image src={markImage} alt="" aria-hidden="true" sizes="6rem" className={cn("h-auto", className)} />;
}

/** Rendered size of the lockup, in CSS pixels. public/brand/header holds a file per screen density. */
const LOGO_WIDTH = 113;
const LOGO_HEIGHT = 44;
const DENSITIES = [1, 1.25, 1.5, 2, 3] as const;

/**
 * Pre-sized PNGs for every common device pixel ratio. The browser picks one that matches the
 * screen exactly, so the logo is never resampled, which is what blurred it inside the
 * header's frosted-glass layer.
 */
function lockupSrcSet(variant: "light" | "on-dark") {
  const name = variant === "light" ? "inovexa-labs-logo" : "inovexa-labs-logo-on-dark";
  return DENSITIES.map((density) => `/brand/header/${name}-h${Math.round(LOGO_HEIGHT * density)}.png ${density}x`).join(
    ", ",
  );
}

interface LogoProps {
  className?: string;
  /** Logo uploaded in /admin/settings. Without it, the built-in Inovexa Labs lockup renders. */
  logoUrl?: string | null;
  /** Company name from site settings, used for the image alt text. */
  siteName?: string | null;
}

export function Logo({ className, logoUrl, siteName }: LogoProps) {
  const name = siteName?.trim() || "Inovexa Labs";
  const alt = `${name} home`;

  return (
    <Link href={ROUTES.home} className={cn("inline-flex shrink-0 items-center rounded-md", className)}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={alt}
          width={320}
          height={80}
          sizes="10rem"
          priority
          className="h-11 w-auto max-w-[10rem] object-contain"
        />
      ) : (
        <>
          {/* Plain <img>: these files are already optimised to exact sizes, so next/image would only resample them. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/brand/header/inovexa-labs-logo-h${LOGO_HEIGHT}.png`}
            srcSet={lockupSrcSet("light")}
            alt={alt}
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            fetchPriority="high"
            decoding="async"
            className="block on-dark:hidden"
          />
          {/* Lightened ink for dark sections such as the footer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/brand/header/inovexa-labs-logo-on-dark-h${LOGO_HEIGHT}.png`}
            srcSet={lockupSrcSet("on-dark")}
            alt={alt}
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            loading="lazy"
            decoding="async"
            className="hidden on-dark:block"
          />
        </>
      )}
    </Link>
  );
}
