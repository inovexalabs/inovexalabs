import { Lock } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Logo } from "@/components/layout/logo";

/** Shown to signed-in users without an admin_users membership. */
export function AccessDenied({ email }: { email: string | undefined }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-gutter py-16">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 shadow-md">
        <Logo />
        <span className="mt-8 grid size-11 place-items-center rounded-full bg-amber-500/10 text-amber-700">
          <Lock aria-hidden="true" className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-h3 text-fg">This account can&apos;t access the admin</h1>
        <p className="mt-3 text-fg-muted">
          {email ? (
            <>
              You&apos;re signed in as <span className="font-medium text-fg">{email}</span>, which isn&apos;t an admin.
            </>
          ) : (
            "You're signed in with an account that isn't an admin."
          )}{" "}
          Ask the site owner to grant access, or sign in with a different account.
        </p>
        <SignOutButton className="mt-6 -ml-3" />
      </div>
    </main>
  );
}
