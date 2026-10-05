const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Keyboard-focusable descendants in DOM order, skipping inert or hidden subtrees. */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.closest("[inert]") && element.getClientRects().length > 0,
  );
}

/** Arrow/Home/End roving focus across a list of elements. Returns true when it handled the key. */
export function moveFocusWithKeys(key: string, items: HTMLElement[]): boolean {
  if (items.length === 0) return false;
  const current = items.indexOf(document.activeElement as HTMLElement);
  let next: number;

  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      next = current < 0 ? 0 : (current + 1) % items.length;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = items.length - 1;
      break;
    default:
      return false;
  }

  items[next]?.focus();
  return true;
}
