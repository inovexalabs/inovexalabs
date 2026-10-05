import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Closing tile for service grids: fills the gap an incomplete last row would
 * leave with a useful next step. Uses theme tokens, so it works on light and
 * dark sections alike.
 */
export function ServiceCtaCard({ headingLevel: Heading = "h3" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <Link
      href={ROUTES.contact}
      className="group/cta flex w-full flex-col justify-between gap-6 rounded-xl border border-dashed border-line-strong p-6 transition-colors hover:border-iris-400/60 hover:bg-fg/[0.03]"
    >
      <span>
        <Heading className="font-display text-h4 text-fg">Not sure which you need?</Heading>
        <span className="mt-2 block text-sm text-fg-muted">
          Describe the problem and we will suggest the right mix of services.
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Talk to us
        <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
      </span>
    </Link>
  );
}
