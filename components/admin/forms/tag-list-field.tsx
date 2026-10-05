"use client";

import { Plus, X } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { get, useController, useFormContext, type FieldPathByValue, type FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

interface TagListFieldProps<TValues extends FieldValues> {
  name: FieldPathByValue<TValues, string[]>;
  label: string;
  hint?: string;
  max: number;
  maxLength: number;
  placeholder?: string;
}

/**
 * Short labels (e.g. technologies) added with Enter, a comma-separated paste
 * or the Add button. Duplicates are ignored case-insensitively.
 */
export function TagListField<TValues extends FieldValues>({
  name,
  label,
  hint,
  max,
  maxLength,
  placeholder,
}: TagListFieldProps<TValues>) {
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const {
    control,
    formState: { errors },
  } = useFormContext<TValues>();
  const { field } = useController({ control, name });
  const tags: string[] = Array.isArray(field.value) ? field.value : [];

  const fieldError =
    (get(errors, `${name}.message`) as string | undefined) ??
    tags.map((_, index) => get(errors, `${name}.${index}.message`) as string | undefined).find(Boolean);
  const error = notice ?? fieldError;

  function addFromDraft() {
    const candidates = draft
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (candidates.length === 0) return;

    const tooLong = candidates.find((value) => value.length > maxLength);
    if (tooLong) {
      setNotice(`“${tooLong.slice(0, 24)}…” is longer than ${maxLength} characters.`);
      return;
    }

    const existing = new Set(tags.map((tag) => tag.toLowerCase()));
    const additions: string[] = [];
    for (const value of candidates) {
      const key = value.toLowerCase();
      if (!existing.has(key)) {
        existing.add(key);
        additions.push(value);
      }
    }

    if (tags.length + additions.length > max) {
      setNotice(`You can add up to ${max}. Remove one to add another.`);
      return;
    }

    setNotice(additions.length === 0 ? "That's already in the list." : null);
    if (additions.length > 0) field.onChange([...tags, ...additions]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addFromDraft();
    }
  }

  function removeTag(tag: string) {
    field.onChange(tags.filter((item) => item !== tag));
    setNotice(null);
  }

  return (
    <FormField
      id={inputId}
      label={label}
      hint={hint ?? `Press Enter to add. Paste a comma-separated list to add several. Up to ${max}.`}
      error={error}
    >
      <div className="flex gap-2">
        <Input
          {...fieldA11y(inputId, { hint: true, error })}
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={field.onBlur}
          disabled={tags.length >= max}
        />
        <Button variant="outline" onClick={addFromDraft} disabled={tags.length >= max || draft.trim() === ""}>
          <Plus aria-hidden="true" />
          Add
        </Button>
      </div>

      {tags.length > 0 ? (
        <ul aria-label={`${label}, ${tags.length} added`} className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-line-strong bg-surface pl-3 pr-1 text-sm text-fg"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="grid size-6 place-items-center rounded-full text-fg-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-fg-muted">None added yet.</p>
      )}
    </FormField>
  );
}
