import Image from "next/image";
import { Reveal } from "@/components/animations/reveal";
import { cn } from "@/lib/utils/cn";
import type { Technology, TechnologyGroup } from "@/lib/supabase/queries/technologies";

/**
 * Pill for a single technology. Renders the admin-uploaded logo when one
 * exists and initials otherwise — no third-party logos are bundled or fetched.
 */
export function TechnologyBadge({ technology, className }: { technology: Technology; className?: string }) {
  const initials = technology.name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mark = technology.logo ? (
    <Image
      src={technology.logo.url}
      alt={technology.logo.alt}
      width={20}
      height={20}
      className="size-5 rounded-[4px] object-contain"
    />
  ) : (
    <span aria-hidden="true" className="grid size-5 place-items-center text-[0.65rem] font-bold text-iris-600">
      {initials}
    </span>
  );

  const content = (
    <>
      {mark}
      <span>{technology.name}</span>
    </>
  );

  const className_ = cn(
    "inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg shadow-xs",
    technology.website && "transition-colors duration-200 hover:border-line-strong hover:bg-surface-muted",
    className,
  );

  if (technology.website) {
    return (
      <a
        href={technology.website}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={className_}
        title={`${technology.name} website (opens in a new tab)`}
      >
        {content}
      </a>
    );
  }

  return <span className={className_}>{content}</span>;
}

interface TechnologyGridProps {
  groups: TechnologyGroup[];
}

/** Technology ecosystem grouped by category. Only admin-published entries appear. */
export function TechnologyGrid({ groups }: TechnologyGridProps) {
  if (groups.length === 0) return null;

  return (
    <div className="mt-10 space-y-8 sm:mt-12">
      {groups.map((group, groupIndex) => (
        <Reveal key={group.category} delay={groupIndex * 0.05}>
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted lg:col-span-2 lg:pt-3">
              {group.label}
            </h3>
            <ul role="list" className="flex flex-wrap gap-2.5 lg:col-span-10">
              {group.items.map((technology) => (
                <li key={technology.slug}>
                  <TechnologyBadge technology={technology} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
