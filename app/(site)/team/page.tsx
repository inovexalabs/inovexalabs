import { ArrowRight, TriangleAlert, Users } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/animations/reveal";
import { PageHero } from "@/components/content/page-hero";
import { Section } from "@/components/layout/section";
import { TeamMemberCard } from "@/components/team/team-member-card";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { getTeam } from "@/lib/supabase/queries/team";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  return buildMetadata({
    title: "Team",
    description:
      "Meet the designers, engineers and researchers at Inovexa Labs — the people who scope, build and support every product we ship.",
    path: ROUTES.team,
    siteName: settings?.site_name,
  });
}

export default async function TeamPage() {
  const { data: team, error } = await getTeam();
  const count = team?.length ?? 0;

  return (
    <>
      <PageHero
        id="team-title"
        eyebrow="Our people"
        title="The team behind the work"
        description="A small group of designers, engineers and researchers. The people you talk to on day one are the people who build your product."
        breadcrumbs={[{ name: "Home", path: ROUTES.home }, { name: "Team", path: ROUTES.team }]}
        actions={
          count > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-fg-muted">
              <Users aria-hidden="true" className="size-4 text-accent" />
              {count} {count === 1 ? "person" : "people"}
            </span>
          ) : undefined
        }
      />

      <Section spacing="md" container="wide" labelledBy="team-title" className="pt-section-sm">
        {team === null ? (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 px-5 py-4 text-rose-700">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <p>{error} Reload the page to try again.</p>
          </div>
        ) : team.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full brand-gradient-soft text-iris-600">
              <Users aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-h4 text-fg">Team profiles are on the way</h2>
            <p className="mx-auto mt-2 max-w-md text-fg-muted">
              We are writing up who does what. In the meantime, tell us about your project — you will hear back from the
              people who would build it.
            </p>
            <ButtonLink href={ROUTES.contact} className="mt-6">
              Start a project
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        ) : (
          <ul role="list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal as="li" key={member.slug} delay={(index % 3) * 0.07} className="flex">
                <TeamMemberCard member={member} />
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
