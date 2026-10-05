"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteSubscriber, setSubscriberStatus } from "@/app/admin/newsletter/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SubscriberControlsProps {
  id: string;
  email: string;
  status: string;
}

/** Reactivate/unsubscribe and remove one newsletter subscriber. */
export function SubscriberControls({ id, email, status }: SubscriberControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const active = status === "active";

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
        console.error("[subscriber controls] failed", error);
        toast.error("That change couldn't be saved. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="text-fg-muted hover:bg-fg/[0.06] hover:text-fg"
        disabled={isPending}
        onClick={() =>
          run(
            () => setSubscriberStatus(id, active ? "unsubscribed" : "active"),
            active ? `${email} unsubscribed.` : `${email} re-activated.`,
          )
        }
      >
        {active ? "Unsubscribe" : "Re-activate"}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-rose-600 hover:bg-rose-500/10"
        aria-label={`Remove ${email} from the newsletter`}
        title="Remove subscriber"
        disabled={isPending}
        onClick={() => setConfirmDelete(true)}
      >
        <Trash aria-hidden="true" />
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        title="Remove this subscriber?"
        description={
          <>
            <strong>{email}</strong> is removed from the newsletter list permanently. They can subscribe again from
            the site at any time.
          </>
        }
        confirmLabel="Remove"
        pendingLabel="Removing…"
        tone="danger"
        isPending={isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          run(() => deleteSubscriber(id));
        }}
      />
    </div>
  );
}
