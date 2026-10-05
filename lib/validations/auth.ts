import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password.").max(128, "Password is too long."),
});

export type SignInValues = z.infer<typeof signInSchema>;

/** Only same-site admin paths are allowed after sign-in (prevents open redirects). */
export function safeAdminRedirect(next: unknown): string {
  if (typeof next !== "string") return "/admin";
  return /^\/admin(\/[A-Za-z0-9/_-]*)?$/.test(next) ? next : "/admin";
}
