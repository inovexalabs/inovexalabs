import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  {
    variants: {
      variant: {
        /** The single brand action. */
        primary:
          "bg-signal text-void hover:bg-signal-dim hover:-translate-y-0.5 active:translate-y-0 shadow-[0_10px_36px_-14px_rgba(196,242,76,0.55)]",
        secondary:
          "border border-steel bg-graphite/60 text-bone hover:border-steel-bright hover:bg-slate-panel",
        outline:
          "border border-steel text-bone-dim hover:border-signal/50 hover:text-bone",
        ghost: "text-bone-dim hover:bg-graphite hover:text-bone",
        link: "text-signal underline-offset-4 hover:underline rounded-none px-0",
        danger:
          "border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem] [&_svg]:size-3.5",
        md: "h-11 px-6 text-sm [&_svg]:size-4",
        lg: "h-13 px-7 text-[0.9375rem] [&_svg]:size-4",
        icon: "size-10 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
