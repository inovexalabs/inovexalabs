"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateLead } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";
import { FormField, fieldA11y } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { LEAD_PRIORITIES, LEAD_PRIORITY_KEYS, LEAD_STATUSES, LEAD_STATUS_KEYS } from "@/lib/constants/leads";
import type { ActionResult } from "@/lib/utils/action-result";

interface LeadPipelineFormProps {
  id: string;
  status: string;
  priority: string;
}

/** Status + priority selects for one lead. Saves through a Server Action. */
export function LeadPipelineForm({ id, status, priority }: LeadPipelineFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState(status);
  const [nextPriority, setNextPriority] = useState(priority);

  const dirty = nextStatus !== status || nextPriority !== priority;

  function save() {
    startTransition(async () => {
      try {
        const result: ActionResult = await updateLead(id, { status: nextStatus, priority: nextPriority });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message);
        router.refresh();
      } catch (error) {
        console.error("[lead pipeline] save failed", error);
        toast.error("That change couldn't be saved. Check your connection and try again.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <FormField id="lead-status" label="Pipeline status" hint="Only “New” leads are new enquiries.">
        <Select
          {...fieldA11y("lead-status", { hint: true })}
          value={nextStatus}
          disabled={isPending}
          onChange={(event) => setNextStatus(event.target.value)}
        >
          {LEAD_STATUS_KEYS.map((key) => (
            <option key={key} value={key}>
              {LEAD_STATUSES[key].label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField id="lead-priority" label="Priority">
        <Select
          {...fieldA11y("lead-priority", {})}
          value={nextPriority}
          disabled={isPending}
          onChange={(event) => setNextPriority(event.target.value)}
        >
          {LEAD_PRIORITY_KEYS.map((key) => (
            <option key={key} value={key}>
              {LEAD_PRIORITIES[key].label}
            </option>
          ))}
        </Select>
      </FormField>

      <Button onClick={save} isLoading={isPending} loadingText="Saving…" disabled={!dirty} fullWidth>
        {dirty ? "Save pipeline" : "Saved"}
      </Button>
      <p aria-live="polite" className="text-center text-xs text-fg-muted">
        {dirty ? "Unsaved pipeline change." : "Pipeline is up to date."}
      </p>
    </div>
  );
}
