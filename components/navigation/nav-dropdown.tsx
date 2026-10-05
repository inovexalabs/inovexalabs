"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ActiveIndicator, navItemClassName } from "@/components/navigation/nav-item";
import { cn } from "@/lib/utils/cn";
import { getFocusableElements, moveFocusWithKeys } from "@/lib/utils/focus";

const HOVER_OPEN_DELAY = 90;
const HOVER_CLOSE_DELAY = 180;

type OpenSource = "hover" | "click" | "keyboard";

interface NavDropdownProps {
  label: string;
  /** Current route belongs to this menu's section. */
  active: boolean;
  /** Panel content, rendered on the server. */
  children: ReactNode;
}

/**
 * Disclosure-pattern menu (button + aria-expanded + aria-controls) for site
 * navigation. Opens on click, keyboard, or mouse hover with intent delay.
 * A click while hover-opened pins it open. Closes on Escape, outside click,
 * focus leaving, or choosing a link.
 */
export function NavDropdown({ label, active, children }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const openedBy = useRef<OpenSource | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const show = useCallback(
    (source: OpenSource) => {
      clearHoverTimer();
      openedBy.current = source;
      setOpen(true);
    },
    [clearHoverTimer],
  );

  const close = useCallback(
    (restoreFocus = false) => {
      clearHoverTimer();
      openedBy.current = null;
      setOpen(false);
      if (restoreFocus) triggerRef.current?.focus();
    },
    [clearHoverTimer],
  );

  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const focusInside = rootRef.current?.contains(document.activeElement) ?? false;
      close(focusInside);
    }

    function handlePointerDown(event: globalThis.PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) close();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, close]);

  const panelItems = () => getFocusableElements(panelRef.current);

  function handleTriggerClick() {
    if (open && openedBy.current !== "hover") {
      close();
    } else {
      show("click");
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const toLast = event.key === "ArrowUp";
    show("keyboard");
    // The panel's `inert` is lifted during the synchronous commit of this event.
    window.requestAnimationFrame(() => {
      const items = panelItems();
      (toLast ? items.at(-1) : items[0])?.focus();
    });
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (moveFocusWithKeys(event.key, panelItems())) event.preventDefault();
  }

  function handlePanelClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("a")) close();
  }

  function handlePointerEnter(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType !== "mouse") return;
    clearHoverTimer();
    if (!open) hoverTimer.current = window.setTimeout(() => show("hover"), HOVER_OPEN_DELAY);
  }

  function handlePointerLeave(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType !== "mouse") return;
    clearHoverTimer();
    if (openedBy.current === "hover") hoverTimer.current = window.setTimeout(() => close(), HOVER_CLOSE_DELAY);
  }

  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    // relatedTarget is null for clicks on non-focusable areas; outside clicks are handled by pointerdown.
    const next = event.relatedTarget as Node | null;
    if (open && next && !rootRef.current?.contains(next)) close();
  }

  return (
    <li
      ref={rootRef}
      data-nav-open={open}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className={navItemClassName}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform duration-300 ease-premium", open && "rotate-180")}
        />
        {active ? <ActiveIndicator /> : null}
      </button>

      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        onKeyDown={handlePanelKeyDown}
        onClick={handlePanelClick}
        className={cn(
          "absolute left-1/2 top-full w-[min(56rem,calc(100vw-2rem))] -translate-x-1/2 pt-2",
          "duration-200 ease-premium",
          // Visibility only transitions on close; on open it must flip immediately so focus() can land.
          open
            ? "visible translate-y-0 opacity-100 transition-[opacity,translate]"
            : "invisible -translate-y-1.5 opacity-0 transition-[opacity,translate,visibility]",
        )}
      >
        {children}
      </div>
    </li>
  );
}
