"use client";

import { Archive, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteLead, updateLead } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface LeadDangerZoneProps {
  id: string;
  referenceId: string;
  name: string;
  status: string;
}

/** Archive and permanently delete a lead, both behind confirmations. */
export function LeadDangerZone({ id, referenceId, name, status }: LeadDangerZoneProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const archived = status === "archived";

  function run(action: () => Promise<{ ok: boolean; error?: string; message?: string }>, success?: string) {
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) {
          toast.error(result.error ?? "That change couldn't be saved.");
          return;
        }
        toast.success(success ?? result.message ?? "Saved.");
        router.refresh();
      } catch (error) {
        console.error("[lead danger zone] failed", error);
        toast.error("That change couldn't be saved. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {archived ? (
        <p className="text-sm text-fg-muted">
          This lead is archived. Set it back to a pipeline stage above to reopen it.
        </p>
      ) : (
        <Button
          variant="outline"
          fullWidth
          disabled={isPending}
          onClick={() =>
            run(
              () => updateLead(id, { status: "archived", priority: "normal" }),
              `${referenceId} archived.`,
            )
          }
        >
          <Archive aria-hidden="true" />
          Archive lead
        </Button>
      )}

      <Button
        variant="danger"
        fullWidth
        disabled={isPending}
        onClick={() => setConfirmDelete(true)}
      >
        <Trash aria-hidden="true" />
        Delete permanently
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${referenceId}?`}
        description={
          <>
            This permanently deletes the enquiry from <strong>{name}</strong>, together with every note attached to
            it. There is no undo and no backup copy in the app.
          </>
        }
        confirmLabel="Delete lead"
        pendingLabel="Deleting…"
        tone="danger"
        isPending={isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          startTransition(async () => {
            try {
              const result = await deleteLead(id);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success(result.message);
              router.push("/admin/leads");
            } catch (error) {
              console.error("[lead delete] failed", error);
              toast.error("The lead couldn't be deleted. Check your connection and try again.");
            }
          });
        }}
      />
    </div>
  );
}
