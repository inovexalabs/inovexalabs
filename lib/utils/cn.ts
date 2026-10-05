import { extendTailwindMerge, type ClassNameValue } from "tailwind-merge";

/**
 * tailwind-merge taught about the design-system tokens declared in
 * app/globals.css, so `cn("text-h2", "text-fg")` keeps both (size + colour)
 * and `cn("py-section", "py-section-sm")` keeps only the last.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["lead", "h4", "h3", "h2", "h1", "display"],
      shadow: ["glow-blue", "glow-purple", "glow-violet", "glow-brand"],
      "text-shadow": ["glow"],
      spacing: ["gutter", "section-sm", "section", "section-lg", "header"],
      container: ["reading", "narrow", "content", "wide"],
      font: ["display"],
      ease: ["premium", "glide"],
      animate: ["border-spin", "orb-drift", "rise-in", "fade-up", "data-flow", "spin-slow", "float", "bob", "halo", "build", "twinkle", "scan", "beam"],
      breakpoint: ["xs"],
    },
  },
});

export function cn(...inputs: ClassNameValue[]): string {
  return twMerge(...inputs);
}
