"use client";

import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";
import {
  get,
  useFieldArray,
  useFormContext,
  type ArrayPath,
  type FieldArray,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ItemFieldConfig {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
}

interface ItemListFieldProps<TValues extends FieldValues> {
  name: ArrayPath<TValues>;
  /** Singular noun for one entry, e.g. "Step" or "Question". */
  itemLabel: string;
  max: number;
  /** Two or three fields per entry (e.g. title + description, or metric + label + description). */
  fields: readonly [ItemFieldConfig, ItemFieldConfig, ...ItemFieldConfig[]] | readonly [ItemFieldConfig];
  emptyText: string;
}

/**
 * Editable, reorderable list of two-field items (title + description,
 * question + answer). Removal is instant with an Undo toast; nothing is
 * stored until the form is saved.
 */
export function ItemListField<TValues extends FieldValues>({
  name,
  itemLabel,
  max,
  fields: config,
  emptyText,
}: ItemListFieldProps<TValues>) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<TValues>();
  const { fields, append, insert, remove, move } = useFieldArray<TValues>({ control, name });

  const lowerLabel = itemLabel.toLowerCase();
  const listError = (get(errors, `${name}.message`) ?? get(errors, `${name}.root.message`)) as string | undefined;
  const atLimit = fields.length >= max;

  function emptyItem() {
    return Object.fromEntries(config.map((item) => [item.key, ""])) as FieldArray<TValues, ArrayPath<TValues>>;
  }

  function handleAdd() {
    append(emptyItem(), { focusName: `${name}.${fields.length}.${config[0].key}` });
  }

  function handleRemove(index: number) {
    const removed = getValues(`${name}.${index}` as FieldPath<TValues>) as FieldArray<TValues, ArrayPath<TValues>>;
    remove(index);
    toast(`${itemLabel} ${index + 1} removed.`, {
      action: { label: "Undo", onClick: () => insert(index, removed) },
    });
  }

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-fg-muted">
          {emptyText}
        </p>
      ) : (
        <ol className="space-y-3">
          {fields.map((field, index) => (
            <li key={field.id} className="rounded-lg border border-line bg-surface-muted/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-fg">
                  {itemLabel} {index + 1}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    aria-label={`Move ${lowerLabel} ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUp aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    aria-label={`Move ${lowerLabel} ${index + 1} down`}
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDown aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 text-rose-600 hover:bg-rose-500/10"
                    aria-label={`Remove ${lowerLabel} ${index + 1}`}
                    onClick={() => handleRemove(index)}
                  >
                    <Trash aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid gap-4">
                {config.map((item) => {
                  const path = `${name}.${index}.${item.key}` as FieldPath<TValues>;
                  const id = `${name}-${index}-${item.key}`;
                  const error = get(errors, `${path}.message`) as string | undefined;
                  return (
                    <FormField key={item.key} id={id} label={item.label} error={error}>
                      {item.multiline ? (
                        <Textarea
                          rows={3}
                          placeholder={item.placeholder}
                          {...fieldA11y(id, { error })}
                          {...register(path)}
                        />
                      ) : (
                        <Input placeholder={item.placeholder} {...fieldA11y(id, { error })} {...register(path)} />
                      )}
                    </FormField>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      )}

      {listError ? <p className="text-sm text-rose-600">{listError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={handleAdd} disabled={atLimit}>
          <Plus aria-hidden="true" />
          Add {lowerLabel}
        </Button>
        <p className="text-sm text-fg-muted">
          {fields.length} of {max}
          {atLimit ? " — the limit for this list" : ""}
        </p>
      </div>
    </div>
  );
}
