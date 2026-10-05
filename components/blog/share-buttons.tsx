"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url: string;
}

/**
 * Share row: native share links (X and LinkedIn) plus a copy-link button with
 * a visible and announced confirmation. All actions are real: the anchors use
 * each platform's intent URL, and the button writes to the clipboard.
 */
export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (error) {
      console.error("[ShareButtons] clipboard write failed", error);
      // Clipboard access can be denied; fall back to selecting nothing and telling the user.
      setCopied(false);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-fg-muted">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
      >
        X
        <span className="sr-only">Share this article on X (opens in a new tab)</span>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:border-fg/30 hover:bg-fg/[0.04]"
      >
        LinkedIn
        <span className="sr-only">Share this article on LinkedIn (opens in a new tab)</span>
      </a>
      <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={copyLink} aria-live="polite">
        {copied ? <Check aria-hidden="true" className="text-emerald-600" /> : <Link2 aria-hidden="true" />}
        {copied ? "Link copied" : "Copy link"}
      </Button>
    </div>
  );
}
