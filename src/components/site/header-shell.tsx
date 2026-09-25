"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";
import { Wordmark, LabMark } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { LabSignal } from "@/components/site/lab-signal";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/content";

export function HeaderShell({
  items,
  signal,
}: {
  items: NavigationItem[];
  signal: { kind: string; count: number };
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled
          ? "lab-glass border-b border-steel/80"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center gap-4 edge-x sm:h-[4.5rem]">
        <Link
          href="/"
          aria-label="Inovexa Labs — home"
          className="shrink-0 rounded-lg"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-300",
                    isActive(item.href)
                      ? "text-bone"
                      : "text-ash hover:text-bone",
                  )}
                >
                  {item.title}
                  {isActive(item.href) ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 -bottom-px h-px bg-signal/70"
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden xl:block">
            <LabSignal signal={signal as never} />
          </div>

          <Link
            href="/search"
            aria-label="Search the site"
            className="hidden size-10 items-center justify-center rounded-full border border-steel text-ash transition-colors hover:border-signal/50 hover:text-bone sm:flex"
          >
            <Search className="size-4" />
          </Link>

          <Button asChild size="sm" variant="primary" className="hidden sm:inline-flex">
            <Link href="/contact">Start a Project</Link>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="flex size-10 items-center justify-center rounded-full border border-steel text-bone transition-colors hover:border-signal/50 lg:hidden"
              >
                <Menu className="size-4.5" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content
                className={cn(
                  "fixed inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col border-l border-steel bg-carbon",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-400",
                )}
              >
                <div className="flex items-center justify-between border-b border-steel/70 px-6 py-5">
                  <Dialog.Title asChild>
                    <span>
                      <LabMark />
                    </span>
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Site navigation for Inovexa Labs
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="flex size-10 items-center justify-center rounded-full border border-steel text-bone transition-colors hover:border-signal/50"
                    >
                      <X className="size-4.5" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
                  <ul className="flex flex-col">
                    {[...items, { id: "contact", title: "Contact", href: "/contact", description: null, location: "header", parent_id: null, display_order: 99, published: true } as NavigationItem].map(
                      (item, index) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            className={cn(
                              "group flex items-baseline justify-between gap-4 rounded-xl px-4 py-4 transition-colors",
                              isActive(item.href) ? "bg-graphite" : "hover:bg-graphite/70",
                            )}
                          >
                            <span className="flex items-baseline gap-3">
                              <span className="font-mono text-[0.625rem] text-ash-deep">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span
                                className={cn(
                                  "font-display text-2xl tracking-tight",
                                  isActive(item.href) ? "text-bone" : "text-bone-dim group-hover:text-bone",
                                )}
                              >
                                {item.title}
                              </span>
                            </span>
                            <ArrowUpRight className="size-4 shrink-0 translate-y-1 text-ash-deep transition-transform duration-300 group-hover:-translate-y-0 group-hover:translate-x-0.5 group-hover:text-signal" />
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </nav>

                <div className="border-t border-steel/70 px-6 py-6">
                  <LabSignal signal={signal as never} />
                  <Button asChild size="lg" className="mt-4 w-full">
                    <Link href="/contact">Start a Project</Link>
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
