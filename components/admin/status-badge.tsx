import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { CONTENT_STATUS_LABELS, type ContentStatus } from "@/lib/validations/common";

const VARIANTS: Record<ContentStatus, BadgeVariant> = {
  draft: "warning",
  published: "success",
  archived: "neutral",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge variant={VARIANTS[status]} dot>
      {CONTENT_STATUS_LABELS[status]}
    </Badge>
  );
}
