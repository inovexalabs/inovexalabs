"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addLeadNote, deleteLeadNote } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils/format";

interface LeadNotesProps {
  leadId: string;
  notes: { id: string; note: string; created_at: string }[];
}

/** Add and remove internal notes on a lead. Notes are never public. */
export function LeadNotes({ leadId, notes }: LeadNotesProps) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("note", value);
    setError(null);

    startSaving(async () => {
      try {
        const result = await addLeadNote(leadId, formData);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        toast.success(result.message);
        setValue("");
        router.refresh();
      } catch (err) {
        console.error("[lead notes] save failed", err);
        setError("The note couldn't be saved. Check your connection and try again.");
      }
    });
  }

  function confirmDelete() {
    const noteId = pendingDelete;
    if (!noteId) return;
    setPendingDelete(null);

    startSaving(async () => {
      try {
        const result = await deleteLeadNote(noteId);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message);
        router.refresh();
      } catch (err) {
        console.error("[lead notes] delete failed", err);
        toast.error("That note couldn't be deleted. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} noValidate>
        <FormField
          id="lead-note"
          label="Add a note"
          hint="Internal only — visitors never see notes."
          error={error ?? undefined}
        >
          <Textarea
            rows={3}
            value={value}
            disabled={isSaving}
            placeholder="Called the client, sending a proposal Friday…"
            {...fieldA11y("lead-note", { hint: true, error: error ?? undefined })}
            onChange={(event) => setValue(event.target.value)}
          />
        </FormField>
        <Button
          type="submit"
          variant="outline"
          className="mt-3"
          isLoading={isSaving}
          loadingText="Saving…"
          disabled={value.trim().length < 2}
        >
          Add note
        </Button>
      </form>

      {notes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-fg-muted">
          No notes yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-line bg-surface-muted/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">{entry.note}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-rose-600 hover:bg-rose-500/10"
                  aria-label="Delete this note"
                  disabled={isSaving}
                  onClick={() => setPendingDelete(entry.id)}
                >
                  Delete
                </Button>
              </div>
              <p className="mt-2 text-xs text-fg-muted">Admin · {formatDate(entry.created_at)}</p>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this note?"
        description="The note is removed permanently. This can't be undone."
        confirmLabel="Delete note"
        pendingLabel="Deleting…"
        tone="danger"
        isPending={isSaving}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
