"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE_PREMIUM } from "@/lib/constants/motion";

const elements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as const;

type RevealElement = keyof typeof elements;

export interface RevealProps {
  children: ReactNode;
  as?: RevealElement;
  /** Seconds. Stagger siblings by passing index * 0.08. */
  delay?: number;
  /** Pixels travelled upward while fading in. */
  distance?: number;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
  className?: string;
  id?: string;
}

/**
 * One-time entrance as the element scrolls into view. Children stay server
 * rendered. Reduced motion (via MotionProvider) keeps the fade, drops the
 * movement. Without JavaScript the root layout's <noscript> rule shows it.
 */
export function Reveal({ children, as = "div", delay = 0, distance = 16, amount = 0.25, className, id }: RevealProps) {
  const Component = elements[as];

  return (
    <Component
      id={id}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DURATION.slow, delay, ease: EASE_PREMIUM }}
    >
      {children}
    </Component>
  );
}
