import {
  Brain,
  Cloud,
  CodeXml,
  Cpu,
  Database,
  Globe,
  Layers,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons an admin can assign to a service. Keep the keys in sync with the
 * `services_icon_check` constraint in supabase/migrations.
 */
export const SERVICE_ICONS = {
  code: CodeXml,
  globe: Globe,
  smartphone: Smartphone,
  brain: Brain,
  shield: ShieldCheck,
  workflow: Workflow,
  cloud: Cloud,
  database: Database,
  cpu: Cpu,
  layers: Layers,
  "shopping-cart": ShoppingCart,
  sparkles: Sparkles,
  palette: Palette,
} as const satisfies Record<string, LucideIcon>;

export type ServiceIconKey = keyof typeof SERVICE_ICONS;

export const SERVICE_ICON_KEYS = Object.keys(SERVICE_ICONS) as ServiceIconKey[];

/** Names shown in the admin icon picker. */
export const SERVICE_ICON_LABELS: Record<ServiceIconKey, string> = {
  code: "Code",
  globe: "Globe",
  smartphone: "Smartphone",
  brain: "Brain",
  shield: "Shield",
  workflow: "Workflow",
  cloud: "Cloud",
  database: "Database",
  cpu: "Processor",
  layers: "Layers",
  "shopping-cart": "Shopping cart",
  sparkles: "Sparkles",
  palette: "Palette",
};

export function isServiceIconKey(value: string): value is ServiceIconKey {
  return Object.hasOwn(SERVICE_ICONS, value);
}

export function getServiceIcon(key: string): LucideIcon {
  return isServiceIconKey(key) ? SERVICE_ICONS[key] : Sparkles;
}
