"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const SCROLL_THRESHOLD = 8;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getScrolled = () => window.scrollY > SCROLL_THRESHOLD;
const getServerScrolled = () => false;

/**
 * Sticky header that overlaps the hero (negative bottom margin of its own
 * height) and stays transparent at the top of the page. It gains the glass
 * surface once the page scrolls or any menu inside it is open.
 * Re-renders only when the scrolled state flips, not on every scroll event.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-50 -mb-header h-header border-b border-transparent",
        "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-premium",
        "data-[scrolled=true]:nav-surface has-[[data-nav-open=true]]:nav-surface",
      )}
    >
      {children}
    </header>
  );
}
