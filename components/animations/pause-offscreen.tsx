"use client";

import { useEffect, useRef, type HTMLAttributes, type RefObject } from "react";

/**
 * Sets data-animations="paused" | "running" on an element as it leaves and
 * enters the viewport. A global rule in globals.css pauses every CSS
 * animation inside a paused element, so ambient loops cost nothing off-screen.
 *
 * @param scope Optional ancestor selector to toggle instead (e.g. "[data-hero]").
 */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>, scope?: string) {
  useEffect(() => {
    const element = ref.current;
    const target = (scope ? element?.closest<HTMLElement>(scope) : null) ?? element;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      target.dataset.animations = entry?.isIntersecting ? "running" : "paused";
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [ref, scope]);
}

type PauseOffscreenElement = "div" | "ol" | "ul";

interface PauseOffscreenProps extends HTMLAttributes<HTMLElement> {
  as?: PauseOffscreenElement;
}

/** Wrapper form of usePauseOffscreen for server-rendered animated content. */
export function PauseOffscreen({ as: Component = "div", ...props }: PauseOffscreenProps) {
  const ref = useRef<HTMLElement | null>(null);
  usePauseOffscreen(ref);

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      {...props}
    />
  );
}
