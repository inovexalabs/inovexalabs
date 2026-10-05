"use client";

import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type Dispatch, type DragEvent, type SetStateAction } from "react";
import { discardMediaImage, uploadMediaImage } from "@/app/admin/[entity]/actions";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validations/common";

export interface GalleryItem {
  /** Stored path once uploaded; null while the upload is still running. */
  path: string;
  url: string;
  alt: string;
}

interface GalleryFieldProps {
  value: GalleryItem[];
  onChange: Dispatch<SetStateAction<GalleryItem[]>>;
  folder: string;
  error?: string;
}

/**
 * Project gallery editor. Images upload one at a time (a single request per
 * image keeps the payload far below server-action body limits) and only the
 * final {path, alt} list is written with the record. Removed images that were
 * already stored are deleted from the bucket as soon as the admin drops them.
 */
export function GalleryField({ value, onChange, folder, error }: GalleryFieldProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Release object URLs of unsaved previews when the field unmounts.
  useEffect(() => {
    const previews = value.filter((item) => item.url.startsWith("blob:"));
    return () => {
      for (const item of previews) URL.revokeObjectURL(item.url);
    };
    // The list is captured once per mount; uploads replace previews anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    const item = value[index];
    if (!item) return;
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
    if (item.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url);
    } else if (item.path) {
      void discardMediaImage(item.path).catch((failure) => {
        console.error("[GalleryField] discard failed", failure);
      });
    }
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setLocalError(null);

    const room = 8 - value.length;
    const selected = Array.from(files).slice(0, Math.max(0, room));
    if (selected.length < files.length) {
      setLocalError("A gallery can hold up to 8 images.");
    }
    if (selected.length === 0) return;

    for (const file of selected) {
      if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        setLocalError("Use JPG, PNG, WebP or AVIF images.");
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setLocalError(`${file.name} is larger than 5 MB and was skipped.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const placeholder: GalleryItem = { path: "", url: previewUrl, alt: "" };
      setUploading((count) => count + 1);
      // Insert a placeholder immediately so the admin sees the slot fill in.
      onChange((latest) => [...latest, placeholder]);

      try {
        const formData = new FormData();
        formData.set("folder", folder);
        formData.set("image", file);
        const result = await uploadMediaImage(formData);

        if (!result.ok) {
          URL.revokeObjectURL(previewUrl);
          setLocalError(result.error);
          onChange((latest) => latest.filter((item) => item !== placeholder));
          continue;
        }

        const uploaded: GalleryItem = { path: result.data.path, url: result.data.url, alt: placeholder.alt };
        onChange((latest) => latest.map((item) => (item === placeholder ? uploaded : item)));
        URL.revokeObjectURL(previewUrl);
      } catch (failure) {
        console.error("[GalleryField] upload failed", failure);
        URL.revokeObjectURL(previewUrl);
        setLocalError("The upload failed. Check your connection and try again.");
        onChange((latest) => latest.filter((item) => item !== placeholder));
      } finally {
        setUploading((count) => Math.max(0, count - 1));
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    void uploadFiles(event.dataTransfer.files);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    void uploadFiles(event.target.files);
  }

  const message = localError ?? error;
  const altError = value.find((item) => !item.alt.trim() && !item.url.startsWith("blob:"));

  return (
    <div>
      <label
        htmlFor="gallery-input"
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-7 text-center transition-colors",
          dragging ? "border-electric-500 bg-electric-500/5" : "border-line-strong hover:border-fg/30 hover:bg-fg/[0.02]",
          message && "border-rose-500",
        )}
      >
        {uploading > 0 ? (
          <Spinner label="Uploading images" />
        ) : (
          <ImagePlus aria-hidden="true" className="size-6 text-fg-muted" />
        )}
        <span className="font-medium text-fg">
          {uploading > 0 ? "Uploading…" : "Add images or drop them here"}
        </span>
        <span className="text-sm text-fg-muted">JPG, PNG, WebP or AVIF, up to 5 MB each. 8 images maximum.</span>
      </label>
      <input
        ref={inputRef}
        id="gallery-input"
        type="file"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleInput}
        aria-describedby={message ? "gallery-error" : undefined}
        className="sr-only"
      />

      {message ? (
        <p id="gallery-error" className="mt-2 text-sm text-rose-600">
          {message}
        </p>
      ) : null}
      {altError ? (
        <p className="mt-2 text-sm text-rose-600">Every gallery image needs a description before saving.</p>
      ) : null}

      {value.length > 0 ? (
        <ul role="list" className="mt-4 space-y-3">
          {value.map((item, index) => {
            const fieldId = `gallery-alt-${index}`;
            return (
              <li key={item.path || item.url} className="rounded-lg border border-line bg-surface-muted/60 p-3">
                <div className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
                    <Image src={item.url} alt="" fill unoptimized sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor={fieldId} className="text-sm font-medium text-fg">
                      Image {index + 1} description
                    </label>
                    <input
                      id={fieldId}
                      type="text"
                      value={item.alt}
                      maxLength={200}
                      placeholder="Describe what this image shows"
                      onChange={(event) => updateItem(index, { alt: event.target.value })}
                      className="mt-1.5 block w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus-visible:border-electric-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-500/15"
                    />
                    {!item.path ? (
                      <p className="mt-1 text-xs text-fg-muted">Uploading…</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="grid size-9 shrink-0 place-items-center self-start rounded-md text-rose-600 transition-colors hover:bg-rose-500/10"
                  >
                    <Trash aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-fg-muted">No gallery images yet. The gallery section stays hidden on the page.</p>
      )}

      {value.length >= 8 ? <p className="mt-2 text-sm text-fg-muted">The gallery is full (8 images).</p> : null}
    </div>
  );
}
