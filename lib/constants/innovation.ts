import { Blocks, Bot, Brain, CodeXml, Palette, ShieldCheck, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import type { BadgeVariant } from "@/components/ui/badge";
import type { Enums } from "@/types/database";

/**
 * Innovation Lab categories. Keep in sync with the
 * `innovation_category` enum in supabase/migrations.
 */
export const INNOVATION_CATEGORIES: Record<Enums<"innovation_category">, string> = {
  ai: "AI",
  cybersecurity: "Cybersecurity",
  web3: "Web3",
  robotics: "Robotics",
  automation: "Automation",
  "developer-tools": "Developer Tools",
  "experimental-interfaces": "Experimental Interfaces",
  other: "Other",
};

export const INNOVATION_CATEGORY_KEYS = Object.keys(INNOVATION_CATEGORIES) as Enums<"innovation_category">[];

const CATEGORY_ICONS: Record<Enums<"innovation_category">, LucideIcon> = {
  ai: Brain,
  cybersecurity: ShieldCheck,
  web3: Blocks,
  robotics: Bot,
  automation: Workflow,
  "developer-tools": CodeXml,
  "experimental-interfaces": Palette,
  other: Sparkles,
};

export function getInnovationIcon(category: Enums<"innovation_category">): LucideIcon {
  return CATEGORY_ICONS[category] ?? Sparkles;
}

/**
 * Experiment stages. Keep in sync with the `lab_stage` enum in
 * supabase/migrations. Each stage gets a badge colour and an icon — the label
 * always carries the meaning, never the colour alone.
 */
export const LAB_STAGES: Record<Enums<"lab_stage">, { label: string; variant: BadgeVariant }> = {
  research: { label: "Research", variant: "blue" },
  prototype: { label: "Prototype", variant: "purple" },
  building: { label: "Building", variant: "brand" },
  testing: { label: "Testing", variant: "warning" },
  live: { label: "Live", variant: "success" },
  archived: { label: "Archived", variant: "neutral" },
};

export const LAB_STAGE_KEYS = Object.keys(LAB_STAGES) as Enums<"lab_stage">[];

export function labStageLabel(stage: Enums<"lab_stage">): string {
  return LAB_STAGES[stage]?.label ?? stage;
}
