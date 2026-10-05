"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { signOut } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await signOut();
        // Success redirects to /login; only failures return here.
        if (!result.ok) toast.error(result.error);
      } catch (error) {
        console.error("[SignOutButton]", error);
        toast.error("You couldn't be signed out. Check your connection and try again.");
      }
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} isLoading={isPending} loadingText="Signing out…" className={className}>
      <LogOut aria-hidden="true" />
      Sign out
    </Button>
  );
}
