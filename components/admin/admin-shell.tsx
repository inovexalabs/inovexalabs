import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Logo } from "@/components/layout/logo";
import type { AdminSession } from "@/lib/supabase/auth";

const ROLE_LABELS = { owner: "Owner", editor: "Editor" } as const;

/** Admin frame: sidebar on desktop, compact top bar with horizontal nav on smaller screens. */
interface AdminShellProps {
  session: AdminSession;
  /** Logo and company name from site settings, so the admin matches the public site. */
  brand: { logoUrl: string | null; siteName: string | null };
  children: ReactNode;
}

export function AdminShell({ session, brand, children }: AdminShellProps) {
  const account = (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-fg">{session.user.email}</p>
      <p className="text-xs text-fg-muted">{ROLE_LABELS[session.role]}</p>
    </div>
  );

  const viewSite = (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-fg/[0.05] hover:text-fg"
    >
      <ExternalLink aria-hidden="true" className="size-4" />
      View site
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-solid focus:px-5 focus:font-medium focus:text-solid-fg"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo logoUrl={brand.logoUrl} siteName={brand.siteName} />
          <p className="mt-2 text-xs font-medium text-fg-muted">Content admin</p>
        </div>
        <div className="mt-8 flex-1">
          <AdminNav orientation="vertical" />
        </div>
        <div className="space-y-3 border-t border-line pt-4">
          {viewSite}
          <div className="px-3">{account}</div>
          <SignOutButton className="w-full justify-start" />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-gutter">
            <Logo logoUrl={brand.logoUrl} siteName={brand.siteName} />
            <SignOutButton />
          </div>
          <div className="flex items-center gap-2 border-t border-line px-gutter py-2">
            <div className="min-w-0 flex-1">
              <AdminNav orientation="horizontal" />
            </div>
            {viewSite}
          </div>
        </header>

        <main id="admin-main" tabIndex={-1} className="mx-auto max-w-content px-gutter py-8 outline-none lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
