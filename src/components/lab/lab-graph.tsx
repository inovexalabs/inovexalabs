"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LabNode {
  id: string;
  label: string;
  detail: string;
  href: string;
  /** Percentage position inside the diagram box. */
  x: number;
  y: number;
  tone: "signal" | "plasma" | "ember" | "bone";
}

const NODES: LabNode[] = [
  {
    id: "ideas",
    label: "Ideas",
    detail: "Problems worth solving, written down and triaged before anyone opens an editor.",
    href: "/lab",
    x: 50,
    y: 7,
    tone: "ember",
  },
  {
    id: "custom-software",
    label: "Custom software",
    detail: "Client systems engineered end to end — web, mobile, backend and applied AI.",
    href: "/services",
    x: 87,
    y: 27,
    tone: "signal",
  },
  {
    id: "experiments",
    label: "Experiments",
    detail: "Cheap, fast tests of technology we are not yet sure deserves a product.",
    href: "/lab",
    x: 13,
    y: 27,
    tone: "plasma",
  },
  {
    id: "products",
    label: "Products",
    detail: "Software we build for ourselves and own all the way to production.",
    href: "/products",
    x: 82,
    y: 76,
    tone: "signal",
  },
  {
    id: "clients",
    label: "Clients",
    detail: "The businesses running the systems we shipped, in production, every day.",
    href: "/work",
    x: 18,
    y: 76,
    tone: "bone",
  },
];

const TONE_DOT: Record<LabNode["tone"], string> = {
  signal: "bg-signal",
  plasma: "bg-plasma",
  ember: "bg-ember",
  bone: "bg-bone",
};

const TONE_TEXT: Record<LabNode["tone"], string> = {
  signal: "text-signal",
  plasma: "text-plasma",
  ember: "text-ember",
  bone: "text-bone",
};

export function LabGraph() {
  const [activeId, setActiveId] = useState<string>("custom-software");
  const active = NODES.find((n) => n.id === activeId) ?? NODES[0]!;

  return (
    <div className="w-full">
      {/* ---------------- Desktop: the live diagram ---------------- */}
      <div className="hidden lg:block">
        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          {/* Orbit rings */}
          <div aria-hidden className="absolute inset-[9%] rounded-full border border-steel/60" />
          <div
            aria-hidden
            className="animate-lab-orbit absolute inset-[22%] rounded-full border border-dashed border-steel/70"
          />
          <div aria-hidden className="lab-grid-fine absolute inset-0 rounded-full opacity-40" />

          {/* Connections */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {NODES.map((node) => {
              const isActive = node.id === activeId;
              return (
                <line
                  key={node.id}
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke={isActive ? "var(--color-signal)" : "var(--color-steel)"}
                  strokeWidth={isActive ? 1.4 : 1}
                  vectorEffect="non-scaling-stroke"
                  className="transition-[stroke] duration-500"
                  strokeDasharray={isActive ? undefined : "3 4"}
                />
              );
            })}
            <circle
              cx="50"
              cy="50"
              r="27"
              fill="none"
              stroke="var(--color-steel)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="animate-lab-dash opacity-60"
            />
          </svg>

          {/* Centre: the lab itself */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex size-40 flex-col items-center justify-center rounded-full border border-signal/35 bg-void/90 text-center backdrop-blur-sm glow-signal">
              <span aria-hidden className="absolute inset-0 rounded-full bg-signal/5" />
              <span className="relative font-display text-[0.9375rem] font-semibold leading-tight tracking-[0.14em] text-bone">
                INOVEXA
                <br />
                LAB
              </span>
              <span className="relative mt-2 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-signal">
                online
              </span>
            </div>
          </div>

          {/* Nodes */}
          {NODES.map((node) => {
            const isActive = node.id === activeId;
            return (
              <button
                key={node.id}
                type="button"
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onClick={() => setActiveId(node.id)}
                aria-pressed={isActive}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={cn(
                  "absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3.5 py-2 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive
                    ? "border-signal/60 bg-signal/10 text-bone -translate-y-[calc(50%+2px)]"
                    : "border-steel bg-carbon/85 text-ash hover:border-steel-bright hover:text-bone-dim",
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className={cn("size-1.5 rounded-full", TONE_DOT[node.tone], isActive && "animate-pulse-dot")} />
                  {node.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Readout */}
        <div className="mt-4 min-h-[6.5rem] rounded-[var(--radius-panel)] border border-steel bg-carbon/70 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="mono-label text-ash-deep">Node readout</span>
            <span className="mono-label text-ash-deep">{activeId.replace("-", "_")}</span>
          </div>
          <p className={cn("mt-3 font-display text-lg tracking-tight", TONE_TEXT[active.tone])}>
            {active.label}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-bone-dim">{active.detail}</p>
          <Link
            href={active.href}
            className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-signal"
          >
            Open
            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* ---------------- Mobile / tablet: no hover dependency ---------------- */}
      <div className="lg:hidden">
        <ul className="flex flex-col gap-2.5">
          {NODES.map((node, index) => (
            <li key={node.id}>
              <Link
                href={node.href}
                className="panel panel-interactive group flex items-start gap-4 p-4"
              >
                <span className="mt-0.5 font-mono text-[0.625rem] text-ash-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[node.tone])} />
                    <span className={cn("font-display text-base tracking-tight", TONE_TEXT[node.tone])}>
                      {node.label}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ash">{node.detail}</span>
                </span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-ash-deep transition-colors group-hover:text-signal" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
