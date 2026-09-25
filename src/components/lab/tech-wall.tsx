"use client";

import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import type { Technology } from "@/types/content";

const PROFICIENCY_LABEL: Record<string, string> = {
  core: "Core — used on most projects",
  working: "Working — used regularly",
  exploring: "Exploring — in the lab",
};

const PROFICIENCY_DOT: Record<string, string> = {
  core: "bg-signal",
  working: "bg-plasma",
  exploring: "bg-ember",
};

/**
 * The technology wall.
 *
 * Every entry carries the reason we use it, so the wall is an explanation of
 * the stack rather than a decorative logo parade. Categories come from the
 * database and each tab is a real, keyboard-navigable tab panel.
 */
export function TechWall({ technologies }: { technologies: Technology[] }) {
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const tech of technologies) {
      if (!seen.includes(tech.category)) seen.push(tech.category);
    }
    return seen;
  }, [technologies]);

  const [active, setActive] = useState(categories[0] ?? "");

  if (technologies.length === 0 || categories.length === 0) return null;

  return (
    <Tabs.Root value={active} onValueChange={setActive} className="w-full">
      <Tabs.List
        aria-label="Technology categories"
        className="flex flex-wrap gap-2 border-b border-steel pb-3"
      >
        {categories.map((category) => (
          <Tabs.Trigger
            key={category}
            value={category}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
              "data-[state=active]:border-signal/55 data-[state=active]:bg-signal/10 data-[state=active]:text-signal",
              "border-steel text-ash hover:border-steel-bright hover:text-bone-dim",
            )}
          >
            {category}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {categories.map((category) => (
        <Tabs.Content
          key={category}
          value={category}
          className="mt-8 outline-none focus-visible:outline-none"
        >
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-2 lg:grid-cols-3">
            {technologies
              .filter((tech) => tech.category === category)
              .map((tech) => (
                <li
                  key={tech.id}
                  className="group relative bg-carbon p-5 transition-colors duration-500 hover:bg-graphite"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base font-medium tracking-tight text-bone">
                      {tech.name}
                    </h3>
                    <span
                      className="flex items-center gap-1.5"
                      title={PROFICIENCY_LABEL[tech.proficiency ?? "working"]}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rounded-full transition-all duration-500 group-hover:scale-125",
                          PROFICIENCY_DOT[tech.proficiency ?? "working"],
                        )}
                      />
                      <span className="sr-only">
                        {PROFICIENCY_LABEL[tech.proficiency ?? "working"]}
                      </span>
                    </span>
                  </div>
                  {tech.description ? (
                    <p className="mt-2.5 text-sm leading-relaxed text-ash">{tech.description}</p>
                  ) : null}
                </li>
              ))}
          </ul>
        </Tabs.Content>
      ))}

      <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
        {(["core", "working", "exploring"] as const).map((level) => (
          <span key={level} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-1.5 rounded-full", PROFICIENCY_DOT[level])} />
            {level}
          </span>
        ))}
      </p>
    </Tabs.Root>
  );
}
