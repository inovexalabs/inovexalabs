"use client";

import { ImagePlus, RotateCcw, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validations/service";

export type ImageState =
  | { kind: "none" }
  | { kind: "current"; url: string }
  | { kind: "new"; file: File; previewUrl: string }
  | { kind: "removed" };

/** What the save action should do with the stored image. */
export function imageActionFor(state: ImageState): "keep" | "remove" | "replace" {
  if (state.kind === "new") return "replace";
  if (state.kind === "removed") return "remove";
  return "keep";
}

interface ImageFieldProps {
  id: string;
  /** Image already saved on the record, if any. */
  originalUrl: string | null;
  value: ImageState;
  onChange: (next: ImageState) => void;
  error?: string;
  /** What the image is, for the preview's alt text, e.g. "logo". */
  subject?: string;
  /** Size and format guidance under the drop zone. */
  hint?: string;
  /** "contain" shows the whole image (logos, icons); "cover" fills a 16:9 frame. */
  fit?: "cover" | "contain";
}

/** Image picker: click or drop to choose, preview, replace, remove with undo. */
export function ImageField({
  id,
  originalUrl,
  value,
  onChange,
  error,
  subject = "cover image",
  hint = "JPG, PNG, WebP or AVIF, up to 5 MB. 16:9 works best.",
  fit = "cover",
}: ImageFieldProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const latest = useRef(value);

  useEffect(() => {
    latest.current = value;
  }, [value]);

  // Release the object URL of an unsaved preview when the field unmounts.
  useEffect(() => {
    return () => {
      if (latest.current.kind === "new") URL.revokeObjectURL(latest.current.previewUrl);
    };
  }, []);

  function update(next: ImageState) {
    if (value.kind === "new") URL.revokeObjectURL(value.previewUrl);
    onChange(next);
  }

  function accept(file: File | undefined) {
    if (!file) return;
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setLocalError("Use a JPG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setLocalError(`This image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Images must be 5 MB or smaller.`);
      return;
    }
    setLocalError(null);
    update({ kind: "new", file, previewUrl: URL.createObjectURL(file) });
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    accept(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  }

  function handleRemove() {
    setLocalError(null);
    update(originalUrl ? { kind: "removed" } : { kind: "none" });
  }

  const previewUrl = value.kind === "new" ? value.previewUrl : value.kind === "current" ? value.url : null;
  const message = localError ?? error;
  const errorId = `${id}-error`;

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleInput}
        aria-describedby={message ? errorId : undefined}
        aria-invalid={message ? true : undefined}
        className="sr-only"
      />

      {previewUrl ? (
        <div className="space-y-3">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-line bg-surface-muted",
              fit === "contain" ? "aspect-[3/1]" : "aspect-video",
            )}
          >
            <Image
              src={previewUrl}
              alt={value.kind === "new" ? `Preview of the selected ${subject}` : `Current ${subject}`}
              fill
              unoptimized
              sizes="20rem"
              className={fit === "contain" ? "object-contain p-4" : "object-cover"}
            />
          </div>
          {value.kind === "new" ? (
            <p className="truncate text-sm text-fg-muted">
              New image: {value.file.name}. It uploads when you save.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <ImagePlus aria-hidden="true" />
              Replace
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-500/10" onClick={handleRemove}>
              <Trash aria-hidden="true" />
              Remove
            </Button>
            {value.kind === "new" && originalUrl ? (
              <Button variant="ghost" size="sm" onClick={() => update({ kind: "current", url: originalUrl })}>
                <RotateCcw aria-hidden="true" />
                Keep current image
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label
            htmlFor={id}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
              dragging ? "border-electric-500 bg-electric-500/5" : "border-line-strong hover:border-fg/30 hover:bg-fg/[0.02]",
              message && "border-rose-500",
            )}
          >
            <ImagePlus aria-hidden="true" className="size-6 text-fg-muted" />
            <span className="font-medium text-fg">Choose an image or drop it here</span>
            <span className="text-sm text-fg-muted">{hint}</span>
          </label>
          {value.kind === "removed" && originalUrl ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              The current image will be removed when you save.
              <Button variant="link" size="sm" onClick={() => update({ kind: "current", url: originalUrl })}>
                Undo
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {message ? (
        <p id={errorId} className="mt-2 text-sm text-rose-600">
          {message}
        </p>
      ) : null}
    </div>
  );
}
