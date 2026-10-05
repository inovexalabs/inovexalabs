"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ButtonLink } from "@/components/ui/button";
import { PRIMARY_CTA, PRIMARY_NAV, ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { getFocusableElements } from "@/lib/utils/focus";
import { isActivePath } from "@/lib/utils/nav";

const DESKTOP_QUERY = "(min-width: 64rem)";

const subscribeNoop = () => () => {};

interface MobileNavProps {
  /** Server-rendered Solutions list. */
  solutionsMenu: ReactNode;
}

/**
 * Hamburger toggle plus a drawer below the sticky header. While open: page
 * scroll is locked, content behind is inert, focus cycles between the toggle
 * and the drawer, and Escape, the backdrop, a link, a route change or
 * widening to desktop closes it.
 */
export function MobileNav({ solutionsMenu }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Start expanded when the visitor is already inside a service page.
  const [solutionsOpen, setSolutionsOpen] = useState(() => isActivePath(pathname, ROUTES.services));
  const [lastPathname, setLastPathname] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerId = useId();
  const solutionsId = useId();
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);

  // Close when navigation completes (covers back/forward as well as link clicks).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const background = Array.from(document.querySelectorAll<HTMLElement>("[data-inert-when-nav-open]"));
    for (const element of background) element.inert = true;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", handleBreakpoint);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;

      const toggle = toggleRef.current;
      const focusables = [...(toggle ? [toggle] : []), ...getFocusableElements(drawerRef.current)];
      const first = focusables[0];
      const last = focusables.at(-1);
      if (!first || !last) return;

      const active = document.activeElement as HTMLElement | null;
      if (!active || !focusables.includes(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    const frame = window.requestAnimationFrame(() => getFocusableElements(drawerRef.current)[0]?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      root.style.overflow = previousOverflow;
      for (const element of background) element.inert = false;
      desktop.removeEventListener("change", handleBreakpoint);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  function handleDrawerClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("a")) setOpen(false);
  }

  const drawer = (
    <div className="lg:hidden">
      <div
        aria-hidden="true"
        onClick={() => close(true)}
        className={cn(
          "fixed inset-x-0 bottom-0 top-header z-40 bg-navy-950/30 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ease-premium",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      />
      <div
        ref={drawerRef}
        id={drawerId}
        inert={!open}
        onClick={handleDrawerClick}
        className={cn(
          "fixed bottom-0 right-0 top-header z-40 flex w-full flex-col overflow-y-auto overscroll-contain border-l border-line bg-surface shadow-xl sm:max-w-sm",
          "duration-[400ms] ease-premium",
          // Visibility only transitions on close; on open it must flip immediately so focus() can land.
          open ? "visible translate-x-0 transition-[translate]" : "invisible translate-x-full transition-[translate,visibility]",
        )}
      >
        <nav aria-label="Main" className="flex-1 px-gutter pb-6 pt-4">
          <ul className="divide-y divide-line">
            {PRIMARY_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);

              if (item.menu === "solutions") {
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      aria-expanded={solutionsOpen}
                      aria-controls={solutionsId}
                      onClick={() => setSolutionsOpen((value) => !value)}
                      className="flex min-h-14 w-full items-center justify-between gap-4 text-left font-display text-h4 text-fg"
                    >
                      <span className="flex items-center gap-3">
                        {active ? <ActiveDot /> : null}
                        {item.label}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-5 text-fg-muted transition-transform duration-300 ease-premium",
                          solutionsOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      id={solutionsId}
                      inert={!solutionsOpen}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-premium",
                        solutionsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">{solutionsMenu}</div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-14 items-center gap-3 font-display text-h4 text-fg"
                  >
                    {active ? <ActiveDot /> : null}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sticky bottom-0 border-t border-line bg-surface px-gutter py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ButtonLink href={PRIMARY_CTA.href} size="lg" fullWidth>
            {PRIMARY_CTA.label}
          </ButtonLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        data-nav-open={open}
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label="Main menu"
        onClick={() => setOpen((value) => !value)}
        className="group relative inline-flex size-11 items-center justify-center rounded-full text-fg transition-colors duration-200 hover:bg-fg/[0.06] lg:hidden"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-[translate,rotate] duration-300 ease-premium group-aria-expanded:translate-y-1.5 group-aria-expanded:rotate-45" />
          <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-[opacity,scale] duration-200 ease-premium group-aria-expanded:scale-x-0 group-aria-expanded:opacity-0" />
          <span className="absolute left-0 top-3 h-0.5 w-5 rounded-full bg-current transition-[translate,rotate] duration-300 ease-premium group-aria-expanded:-translate-y-1.5 group-aria-expanded:-rotate-45" />
        </span>
      </button>
      {isClient ? createPortal(drawer, document.body) : null}
    </>
  );
}

function ActiveDot() {
  return <span aria-hidden="true" className="size-2 shrink-0 rounded-full brand-gradient" />;
}
