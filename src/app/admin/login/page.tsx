import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { LabMark } from "@/components/site/logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Sign in",
  robots: "noindex,nofollow",
};

const ERROR_COPY: Record<string, string> = {
  not_authorised:
    "That account is not on the admin allowlist. Ask an operator to add it to ADMIN_ALLOWED_EMAILS or insert a row into admin_users.",
  link_expired: "That sign-in link has expired or was already used. Request a new one.",
  missing_code: "That link was incomplete. Request a new sign-in link.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const configured = isSupabaseConfigured;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16">
      <div aria-hidden className="lab-grid lab-grid-mask pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="lab-vignette pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mono-label inline-flex items-center gap-2 text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-3" />
          Back to the site
        </Link>

        <div className="panel mt-8 p-7 sm:p-9">
          <LabMark className="size-9" />
          <h1 className="mt-6 font-display text-2xl font-medium tracking-tight text-bone">
            Control room access
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ash">
            Sign in to manage products, client work, services, experiments, insights and
            inquiries. Authorisation is enforced in the database, not just here.
          </p>

          {error && ERROR_COPY[error] ? (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-red-500/40 bg-red-500/[0.07] p-4 text-sm leading-relaxed text-red-200"
            >
              {ERROR_COPY[error]}
            </p>
          ) : null}

          {!configured ? (
            <div className="mt-6 rounded-xl border border-ember/40 bg-ember/[0.07] p-4">
              <p className="mono-label text-ember">Setup required</p>
              <p className="mt-2.5 text-sm leading-relaxed text-bone-dim">
                Supabase is not configured, so sign-in is unavailable. Set
                <code className="mx-1 rounded border border-steel bg-carbon px-1.5 py-0.5 font-mono text-[0.75em] text-signal">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>
                and
                <code className="mx-1 rounded border border-steel bg-carbon px-1.5 py-0.5 font-mono text-[0.75em] text-signal">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>
                in <code className="font-mono text-[0.85em] text-bone">.env.local</code>, then run the
                migrations in <code className="font-mono text-[0.85em] text-bone">supabase/migrations</code>.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <LoginForm next={next?.startsWith("/admin") ? next : "/admin"} />
            </div>
          )}
        </div>

        <p className="mt-6 flex items-start gap-2.5 text-xs leading-relaxed text-ash-deep">
          <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0 text-signal" />
          The service-role key is never sent to the browser. Every write is checked against Row
          Level Security policies on the database.
        </p>
      </div>
    </main>
  );
}
