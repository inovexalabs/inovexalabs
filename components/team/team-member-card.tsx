import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/lib/supabase/queries/team";

/** One person: photo (or initials), role, bio, skills and profile links. Used on /about and /team. */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card as="article" padding="lg" radius="xl" className="h-full w-full">
      {member.photo ? (
        <div className="relative size-20 overflow-hidden rounded-full border border-line bg-surface-muted">
          <Image
            src={member.photo.url}
            alt={member.photo.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-20 place-items-center rounded-full brand-gradient-soft font-display text-xl font-semibold text-iris-700"
        >
          {member.name
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}

      <h3 className="mt-5 font-display text-h4 text-fg">{member.name}</h3>
      <p className="text-sm text-accent">{member.role}</p>
      {member.bio ? <p className="mt-3 text-fg-muted">{member.bio}</p> : null}

      {member.skills.length > 0 ? (
        <ul aria-label={`Skills of ${member.name}`} className="mt-4 flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-fg-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      {member.social.length > 0 ? (
        <ul aria-label={`${member.name} on the web`} className="mt-4 flex flex-wrap gap-2">
          {member.social.map((link) => (
            <li key={`${link.label}-${link.url}`}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center rounded-full border border-line px-3 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
