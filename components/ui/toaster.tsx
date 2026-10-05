"use client";

import { Toaster as SonnerToaster } from "sonner";

/** App-wide toast region. Toast text names the outcome of an action ("Changes saved."). */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "font-sans rounded-lg",
          title: "font-medium",
        },
      }}
    />
  );
}
