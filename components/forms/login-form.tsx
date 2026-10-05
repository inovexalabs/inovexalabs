"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { fieldA11y, FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";

export function LoginForm({ next }: { next: string }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      try {
        // Success redirects into the admin; only failures return a result.
        const result = await signIn(values, next);
        if (!result.ok) {
          setFormError(result.error);
          for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
            if (field === "email" || field === "password") setError(field, { message });
          }
        }
      } catch (error) {
        console.error("[LoginForm]", error);
        setFormError("Sign-in couldn't reach the server. Check your connection and try again.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{formError}</p>
        </div>
      ) : null}

      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          inputMode="email"
          autoFocus
          {...fieldA11y("email", { error: errors.email?.message })}
          {...register("email")}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input
          type="password"
          autoComplete="current-password"
          {...fieldA11y("password", { error: errors.password?.message })}
          {...register("password")}
        />
      </FormField>

      <Button type="submit" size="lg" fullWidth isLoading={isPending} loadingText="Signing in…">
        Sign in
      </Button>
    </form>
  );
}
