"use client";

import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, Pencil, Star, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteRecord, moveRecord, setRecordState } from "@/app/admin/[entity]/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { AdminEntityKey } from "@/lib/admin/entity-forms";
import type { ActionResult } from "@/lib/utils/action-result";

interface RecordControlsProps {
  entity: AdminEntityKey;
  id: string;
  /** Display name used in confirmations and toasts. */
  title: string;
  status: string;
  featured: boolean;
  hasFeatured: boolean;
  orderable: boolean;
  editHref: string;
  publicHref: string | null;
  deleteHint: string;
}

const ICON =
  "grid size-9 place-items-center rounded-md text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Row controls: edit, view, publish/unpublish, feature, reorder and delete.
 * Every control calls a real Server Action and reports the outcome in a toast.
 */
export function RecordControls({
  entity,
  id,
  title,
  status,
  featured,
  hasFeatured,
  orderable,
  editHref,
  publicHref,
  deleteHint,
}: RecordControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function run(action: () => Promise<ActionResult>, success?: string) {
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(success ?? result.message);
        router.refresh();
      } catch (error) {
        console.error(`[${entity}] control failed`, error);
        toast.error("That change couldn't be saved. Check your connection and try again.");
      }
    });
  }

  const published = status === "published";

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-fg-muted hover:bg-fg/[0.06] hover:text-fg"
        aria-label={published ? `Unpublish ${title}` : `Publish ${title}`}
        title={published ? "Unpublish" : "Publish"}
        disabled={isPending}
        onClick={() => run(() => setRecordState(entity, id, { field: "status", value: published ? "draft" : "published" }))}
      >
        {published ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
      </Button>

      {hasFeatured ? (
        <Button
          variant="ghost"
          size="icon"
          className={`size-9 ${featured ? "text-amber-500 hover:bg-amber-500/10" : "text-fg-muted hover:bg-fg/[0.06] hover:text-fg"}`}
          aria-label={featured ? `Unfeature ${title}` : `Feature ${title}`}
          aria-pressed={featured}
          title={featured ? "Remove from featured" : "Feature on the homepage"}
          disabled={isPending}
          onClick={() => run(() => setRecordState(entity, id, { field: "featured", value: featured ? "false" : "true" }))}
        >
          <Star aria-hidden="true" className={featured ? "fill-current" : ""} />
        </Button>
      ) : null}

      {orderable ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-fg-muted hover:bg-fg/[0.06] hover:text-fg"
            aria-label={`Move ${title} up`}
            title="Move up"
            disabled={isPending}
            onClick={() => run(() => moveRecord(entity, id, -1))}
          >
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-fg-muted hover:bg-fg/[0.06] hover:text-fg"
            aria-label={`Move ${title} down`}
            title="Move down"
            disabled={isPending}
            onClick={() => run(() => moveRecord(entity, id, 1))}
          >
            <ArrowDown aria-hidden="true" />
          </Button>
        </>
      ) : null}

      <Link href={editHref} className={ICON} aria-label={`Edit ${title}`} title="Edit">
        <Pencil aria-hidden="true" className="size-4" />
      </Link>

      {published && publicHref ? (
        <a
          href={publicHref}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON}
          aria-label={`View ${title} on the site (opens in a new tab)`}
          title="View on site"
        >
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      ) : null}

      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-rose-600 hover:bg-rose-500/10"
        aria-label={`Delete ${title}`}
        title="Delete"
        onClick={() => setConfirmDelete(true)}
      >
        <Trash aria-hidden="true" />
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete “${title}”?`}
        description={deleteHint}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        tone="danger"
        isPending={isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          run(() => deleteRecord(entity, id), `“${title}” was deleted.`);
        }}
      />
    </div>
  );
}
