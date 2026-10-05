"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  /** Label while the action runs, e.g. "Deleting…". */
  pendingLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal confirmation built on the native <dialog>: focus is trapped and
 * restored by the browser, Escape and the backdrop cancel, and the safe
 * choice (Cancel) is focused first. Cannot be dismissed while pending.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  cancelLabel = "Cancel",
  tone = "default",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-line bg-surface p-0 text-fg shadow-xl",
        "backdrop:bg-navy-950/45 backdrop:backdrop-blur-[2px]",
      )}
    >
      <div className="p-6">
        <h2 id={titleId} className="font-display text-h4 text-fg">
          {title}
        </h2>
        <div id={descriptionId} className="mt-2 text-fg-muted">
          {description}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isPending} autoFocus>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isPending}
            loadingText={pendingLabel}
            variant={tone === "danger" ? "danger" : "primary"}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
