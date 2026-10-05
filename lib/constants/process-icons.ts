import { CircleCheck, Compass, Hammer, Layers, PenTool, Rocket, Search, type LucideIcon } from "lucide-react";

/**
 * Icons an admin can assign to a process step. Keep the keys in sync with the
 * `process_steps_icon_check` constraint in supabase/migrations.
 */
export const PROCESS_ICONS = {
  compass: Compass,
  search: Search,
  layers: Layers,
  "pen-tool": PenTool,
  hammer: Hammer,
  check: CircleCheck,
  rocket: Rocket,
} as const satisfies Record<string, LucideIcon>;

export type ProcessIconKey = keyof typeof PROCESS_ICONS;

export const PROCESS_ICON_KEYS = Object.keys(PROCESS_ICONS) as ProcessIconKey[];

/** Names shown in the admin icon picker. */
export const PROCESS_ICON_LABELS: Record<ProcessIconKey, string> = {
  compass: "Compass",
  search: "Search",
  layers: "Layers",
  "pen-tool": "Pen",
  hammer: "Hammer",
  check: "Checkmark",
  rocket: "Rocket",
};

export function isProcessIconKey(value: string): value is ProcessIconKey {
  return Object.hasOwn(PROCESS_ICONS, value);
}

export function getProcessIcon(key: string): LucideIcon {
  return isProcessIconKey(key) ? PROCESS_ICONS[key] : Compass;
}
