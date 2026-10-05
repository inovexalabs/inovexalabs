"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import { Button, ButtonLink, type ButtonLinkProps, type ButtonProps } from "@/components/ui/button";
import { SPRING_SOFT } from "@/lib/constants/motion";
import { cn } from "@/lib/utils/cn";

interface MagneticOptions {
  /** Share of the pointer's distance from centre the button follows (0–1). */
  strength?: number;
  /** Upper bound on travel in pixels, keeps the effect subtle. */
  maxOffset?: number;
  wrapperClassName?: string;
}

type MagneticButtonAsButton = MagneticOptions & ButtonProps & { href?: undefined };
type MagneticButtonAsLink = MagneticOptions & ButtonLinkProps;
export type MagneticButtonProps = MagneticButtonAsButton | MagneticButtonAsLink;

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

/**
 * Button or link that leans toward a mouse pointer. Touch, pen and
 * reduced-motion users get a normal, static button.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING_SOFT);
  const y = useSpring(useMotionValue(0), SPRING_SOFT);
  const { strength = 0.3, maxOffset = 8, wrapperClassName, ...controlProps } = props;

  function handlePointerMove(event: PointerEvent<HTMLSpanElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(clamp((event.clientX - (rect.left + rect.width / 2)) * strength, maxOffset));
    y.set(clamp((event.clientY - (rect.top + rect.height / 2)) * strength, maxOffset));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const control =
    controlProps.href !== undefined ? <ButtonLink {...controlProps} /> : <Button {...controlProps} />;

  return (
    <motion.span
      className={cn("inline-flex", wrapperClassName)}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {control}
    </motion.span>
  );
}
