"use client";

import { LayoutGroup } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NavDropdown } from "@/components/navigation/nav-dropdown";
import { ActiveIndicator, navItemClassName } from "@/components/navigation/nav-item";
import { PRIMARY_NAV } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { isActivePath } from "@/lib/utils/nav";

interface DesktopNavProps {
  /** Server-rendered Solutions panel. */
  solutionsMenu: ReactNode;
  className?: string;
}

export function DesktopNav({ solutionsMenu, className }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("hidden lg:block", className)}>
      <LayoutGroup id="desktop-nav">
        <ul className="flex items-center gap-0.5 xl:gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);

            if (item.menu === "solutions") {
              return (
                <NavDropdown key={item.href} label={item.label} active={active}>
                  {solutionsMenu}
                </NavDropdown>
              );
            }

            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? "page" : undefined} className={navItemClassName}>
                  {item.label}
                  {active ? <ActiveIndicator /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
