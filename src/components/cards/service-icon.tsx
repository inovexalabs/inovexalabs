import {
  BarChart3,
  BookOpen,
  Calculator,
  ClipboardList,
  Flame,
  Globe,
  Layers,
  LayoutGrid,
  PenTool,
  Server,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` string stored on a service (or feature) to a real icon.
 * Kept as an explicit whitelist so an editor can never inject arbitrary markup,
 * and so unused icons are tree-shaken out of the bundle.
 */
const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  layers: Layers,
  smartphone: Smartphone,
  sparkles: Sparkles,
  workflow: Workflow,
  server: Server,
  "shopping-bag": ShoppingBag,
  "pen-tool": PenTool,
  "clipboard-list": ClipboardList,
  "layout-grid": LayoutGrid,
  flame: Flame,
  "book-open": BookOpen,
  calculator: Calculator,
  "bar-chart-3": BarChart3,
};

export function ServiceIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && ICONS[name]) || Layers;
  return <Icon className={className ?? "size-[1.125rem]"} aria-hidden />;
}
