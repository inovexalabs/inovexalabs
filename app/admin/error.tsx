"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="rounded-xl border border-rose-500/30 bg-surface p-8 shadow-xs">
      <span className="grid size-11 place-items-center rounded-full bg-rose-500/10 text-rose-600">
        <TriangleAlert aria-hidden="true" className="size-5" />
      </span>
      <h1 className="mt-4 font-display text-h3 text-fg">This page didn&apos;t load</h1>
      <p className="mt-2 max-w-reading text-fg-muted">
        Something went wrong while loading admin data. Your saved content is not affected. Try again.
      </p>
      <Button onClick={reset} className="mt-6">
        <RotateCcw aria-hidden="true" />
        Try again
      </Button>
      {error.digest ? <p className="mt-6 text-sm text-fg-muted">Reference: {error.digest}</p> : null}
    </div>
  );
}
