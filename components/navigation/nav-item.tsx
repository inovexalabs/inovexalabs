"use client";

import { motion } from "framer-motion";
import { SPRING_SNAPPY } from "@/lib/constants/motion";

/** Shared look for top-level desktop links and menu triggers. */
export const navItemClassName =
  "relative inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-[0.9375rem] font-medium text-fg-muted " +
  "transition-colors duration-200 hover:bg-fg/[0.05] hover:text-fg " +
  "aria-[current=page]:text-fg aria-expanded:bg-fg/[0.05] aria-expanded:text-fg";

/**
 * Gradient underline marking the current section. A shared layoutId makes it
 * glide between items on navigation (instant with reduced motion).
 */
export function ActiveIndicator() {
  return (
    <motion.span
      layoutId="nav-active-indicator"
      aria-hidden="true"
      className="absolute inset-x-3.5 bottom-1 h-0.5 rounded-full brand-gradient"
      transition={SPRING_SNAPPY}
    />
  );
}
