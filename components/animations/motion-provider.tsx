"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Honours prefers-reduced-motion for every Framer Motion component:
 * transform and layout animations are skipped, opacity still fades.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
