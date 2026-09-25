import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-steel bg-graphite text-bone-dim",
        signal: "border-signal/40 bg-signal/10 text-signal",
        outline: "border-steel text-ash",
        plasma: "border-plasma/40 bg-plasma/10 text-plasma",
        ember: "border-ember/40 bg-ember/10 text-ember",
        muted: "border-steel/60 bg-carbon text-ash-deep",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
