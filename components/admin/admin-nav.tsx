"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, ADMIN_NAV_GROUPS } from "@/lib/constants/admin-nav";
import { cn } from "@/lib/utils/cn";
import { isActivePath } from "@/lib/utils/nav";

interface AdminNavProps {
  orientation: "vertical" | "horizontal";
}

export function AdminNav({ orientation }: AdminNavProps) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    cn(
      "flex h-10 items-center gap-3 whitespace-nowrap rounded-md px-3 text-[0.9375rem] font-medium transition-colors",
      active ? "bg-iris-500/10 text-iris-700" : "text-fg-muted hover:bg-fg/[0.05] hover:text-fg",
    );

  if (orientation === "horizontal") {
    return (
      <nav aria-label="Admin">
        <ul className="flex gap-1 overflow-x-auto">
          {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                  <Icon aria-hidden="true" className="size-4.5" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Admin">
      <ul className="space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => (
          <li key={group.label}>
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">{group.label}</p>
            <ul className="grid gap-1">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = isActivePath(pathname, href);
                return (
                  <li key={href}>
                    <Link href={href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                      <Icon aria-hidden="true" className="size-4.5" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
