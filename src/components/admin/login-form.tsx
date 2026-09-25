"use client";

import { useActionState, useState } from "react";
import { AlertCircle, KeyRound, Loader2, Mail, LogIn } from "lucide-react";
import { sendMagicLink, signInWithPassword } from "@/actions/auth";
import { AUTH_IDLE } from "@/lib/admin/form-state";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [state, formAction, pending] = useActionState(
    mode === "password" ? signInWithPassword : sendMagicLink,
    AUTH_IDLE,
  );

  return (
    <div>
      <div className="mb-7 flex rounded-full border border-steel bg-carbon p-1">
        {(
          [
            { id: "password", label: "Password", icon: KeyRound },
            { id: "magic", label: "Email link", icon: Mail },
          ] as const
        ).map((option) => {
          const Icon = option.icon;
          const active = mode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              aria-pressed={active}
              className={
                active
                  ? "flex flex-1 items-center justify-center gap-2 rounded-full bg-signal/[0.12] px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-signal"
                  : "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash transition-colors hover:text-bone"
              }
            >
              <Icon className="size-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/[0.07] p-4 text-sm leading-relaxed text-red-200"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
          {state.message}
        </p>
      ) : null}

      {state.status === "magic_link_sent" && state.message ? (
        <p
          role="status"
          className="mb-6 rounded-xl border border-signal/40 bg-signal/[0.07] p-4 text-sm leading-relaxed text-bone"
        >
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next} />

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@inovexalabs.com"
          />
        </div>

        {mode === "password" ? (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
        ) : null}

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {mode === "password" ? "Signing in…" : "Sending link…"}
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              {mode === "password" ? "Sign in" : "Send sign-in link"}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
