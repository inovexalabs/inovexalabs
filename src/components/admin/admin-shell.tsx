"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Beaker,
  Building2,
  Briefcase,
  Cpu,
  FlaskConical,
  Inbox,
  LayoutDashboard,
  Layers,
  Menu,
  MessageSquareQuote,
  PenLine,
  Settings,
  Users,
  X,
  ExternalLink,
} from "lucide-react";
import { Wordmark } from "@/components/site/logo";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "flask-conical": FlaskConical,
  briefcase: Briefcase,
  layers: Layers,
  beaker: Beaker,
  "pen-line": PenLine,
  cpu: Cpu,
  users: Users,
  "building-2": Building2,
  "message-square-quote": MessageSquareQuote,
  menu: Menu,
  inbox: Inbox,
};

export interface AdminNavItem {
  key: string;
  label: string;
  icon: string;
  count?: number;
}

export function AdminShell({
  nav,
  userEmail,
  children,
  signOutAction,
}: {
  nav: AdminNavItem[];
  userEmail: string;
  children: React.ReactNode;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-dvh bg-void">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-steel bg-carbon transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-steel px-5">
          <Link href="/admin" className="rounded-lg" aria-label="Inovexa admin home">
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="flex size-9 items-center justify-center rounded-full border border-steel text-bone lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav aria-label="Admin sections" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            <li>
              <SidebarLink href="/admin" active={isActive("/admin")} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="size-4" />
                Dashboard
              </SidebarLink>
            </li>

            <li className="mt-4 px-3 pb-2">
              <span className="mono-label text-ash-deep">Content</span>
            </li>

            {nav.map((item) => {
              const Icon = ICONS[item.icon] ?? Layers;
              return (
                <li key={item.key}>
                  <SidebarLink
                    href={`/admin/${item.key}`}
                    active={isActive(`/admin/${item.key}`)}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1">{item.label}</span>
                    {typeof item.count === "number" ? (
                      <span className="font-mono text-[0.625rem] text-ash-deep">{item.count}</span>
                    ) : null}
                  </SidebarLink>
                </li>
              );
            })}

            <li className="mt-4 px-3 pb-2">
              <span className="mono-label text-ash-deep">Site</span>
            </li>
            <li>
              <SidebarLink
                href="/admin/settings"
                active={isActive("/admin/settings")}
                onClick={() => setMobileOpen(false)}
              >
                <Settings className="size-4" />
                Settings
              </SidebarLink>
            </li>
            <li>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bone-dim transition-colors hover:bg-graphite hover:text-bone"
              >
                <ExternalLink className="size-4 shrink-0" />
                View site
              </a>
            </li>
          </ul>
        </nav>

        <div className="border-t border-steel p-3">
          <p className="truncate px-3 pb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash-deep">
            {userEmail}
          </p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-bone-dim transition-colors hover:bg-graphite hover:text-bone"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-void/70 lg:hidden"
        />
      ) : null}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="lab-glass sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-steel px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex size-9 items-center justify-center rounded-full border border-steel text-bone lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <p className="mono-label text-signal">Inovexa control room</p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash transition-colors hover:text-bone"
          >
            View live site ↗
          </a>
        </header>

        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-signal/[0.09] text-bone"
          : "text-bone-dim hover:bg-graphite hover:text-bone",
      )}
    >
      {children}
    </Link>
  );
}
