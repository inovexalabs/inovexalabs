import { LabMark } from "@/components/site/logo";

/**
 * Route-level loading state. Deliberately calm — a short signal readout rather
 * than a spinner, so a slow connection still feels like a working instrument.
 */
export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[86rem] items-center justify-center edge-x">
      <div className="flex flex-col items-center gap-5">
        <LabMark className="size-9 animate-pulse" />
        <p className="mono-label flex items-center gap-2.5 text-ash">
          <span aria-hidden className="inline-block size-1.5 animate-pulse-dot rounded-full bg-signal" />
          Loading
        </p>
        <span className="sr-only">Loading page content</span>
      </div>
    </div>
  );
}
