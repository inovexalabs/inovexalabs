import type { BadgeVariant } from "@/components/ui/badge";
import type { Enums } from "@/types/database";

/** Lead pipeline stages. Keep in sync with the `lead_status` enum in supabase/migrations. */
export const LEAD_STATUSES: Record<Enums<"lead_status">, { label: string; variant: BadgeVariant }> = {
  new: { label: "New", variant: "blue" },
  contacted: { label: "Contacted", variant: "purple" },
  qualified: { label: "Qualified", variant: "brand" },
  proposal: { label: "Proposal", variant: "warning" },
  negotiation: { label: "Negotiation", variant: "warning" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "danger" },
  archived: { label: "Archived", variant: "neutral" },
};

export const LEAD_STATUS_KEYS = Object.keys(LEAD_STATUSES) as Enums<"lead_status">[];

/** Priority labels. Keep in sync with the `lead_priority` enum. */
export const LEAD_PRIORITIES: Record<Enums<"lead_priority">, { label: string; variant: BadgeVariant }> = {
  low: { label: "Low", variant: "neutral" },
  normal: { label: "Normal", variant: "blue" },
  high: { label: "High", variant: "warning" },
  urgent: { label: "Urgent", variant: "danger" },
};

export const LEAD_PRIORITY_KEYS = Object.keys(LEAD_PRIORITIES) as Enums<"lead_priority">[];

/** Newsletter subscription states. Keep in sync with `subscriber_status`. */
export const SUBSCRIBER_STATUSES = {
  active: { label: "Active", variant: "success" },
  unsubscribed: { label: "Unsubscribed", variant: "neutral" },
} as const;
