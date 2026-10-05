"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteService } from "@/app/admin/services/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteServiceButtonProps {
  id: string;
  title: string;
  /** Where to go after deleting; defaults to refreshing the current page. */
  redirectTo?: string;
  compact?: boolean;
}

export function DeleteServiceButton({ id, title, redirectTo, compact = false }: DeleteServiceButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        const result = await deleteService(id);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message);
        setOpen(false);
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      } catch (error) {
        console.error("[DeleteServiceButton]", error);
        toast.error("The service couldn't be deleted. Check your connection and try again.");
      }
    });
  }

  return (
    <>
      {compact ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-rose-600 hover:bg-rose-500/10"
          aria-label={`Delete ${title}`}
          onClick={() => setOpen(true)}
        >
          <Trash aria-hidden="true" />
        </Button>
      ) : (
        <Button variant="outline" className="text-rose-600 hover:border-rose-500/40 hover:bg-rose-500/5" onClick={() => setOpen(true)}>
          <Trash aria-hidden="true" />
          Delete
        </Button>
      )}

      <ConfirmDialog
        open={open}
        title={`Delete “${title}”?`}
        description="The service, its page and its image are removed permanently. Links to its page will stop working. To hide it instead, set its status to Archived."
        confirmLabel="Delete service"
        pendingLabel="Deleting…"
        tone="danger"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
