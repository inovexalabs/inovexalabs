"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const GLOW_SIZE = 576;
const FOLLOW_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };

/**
 * Soft light that trails the pointer across the hero ([data-hero] ancestor).
 * Hidden until a mouse moves; absent on touch devices and with reduced motion.
 * Moves via transform only (no layout or paint of the content around it).
 */
export function HeroPointerGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const visibility = useMotionValue(0);
  const smoothX = useSpring(x, FOLLOW_SPRING);
  const smoothY = useSpring(y, FOLLOW_SPRING);
  const opacity = useSpring(visibility, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const found = ref.current?.closest<HTMLElement>("[data-hero]");
    if (!found || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const stage: HTMLElement = found;

    function handleMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const rect = stage.getBoundingClientRect();
      x.set(event.clientX - rect.left - GLOW_SIZE / 2);
      y.set(event.clientY - rect.top - GLOW_SIZE / 2);
      visibility.set(1);
    }

    function handleLeave() {
      visibility.set(0);
    }

    stage.addEventListener("pointermove", handleMove, { passive: true });
    stage.addEventListener("pointerleave", handleLeave);
    return () => {
      stage.removeEventListener("pointermove", handleMove);
      stage.removeEventListener("pointerleave", handleLeave);
    };
  }, [reduceMotion, x, y, visibility]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ x: smoothX, y: smoothY, opacity, width: GLOW_SIZE, height: GLOW_SIZE }}
      className="pointer-events-none absolute left-0 top-0 rounded-full bg-[radial-gradient(closest-side,rgb(115_87_217/0.16),rgb(77_141_255/0.08)_55%,transparent)]"
    />
  );
}
