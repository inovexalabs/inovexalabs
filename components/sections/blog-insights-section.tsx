import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { PostCard } from "@/components/cards/post-card";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/lib/constants/routes";
import { getLatestPosts } from "@/lib/supabase/queries/blog";

const HEADING_ID = "insights-title";

/** Homepage "Insights": the three most recent published articles. */
export async function BlogInsightsSection() {
  const { data: posts, error } = await getLatestPosts(3);

  if (posts !== null && posts.length === 0) return null;

  return (
    <Section tone="muted" labelledBy={HEADING_ID} container="wide">
      <SectionHeading
        id={HEADING_ID}
        title="Insights"
        description="Notes from the work: engineering decisions, security practices and things we learned the hard way."
        actions={
          <ButtonLink href={ROUTES.blog} variant="outline" className="group/all">
            All articles
            <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-0.5" />
          </ButtonLink>
        }
      />

      {posts === null ? (
        <p role="status" className="mt-12 rounded-lg border border-line bg-surface px-5 py-4 text-fg-muted">
          {error} Refresh the page to try again.
        </p>
      ) : (
        <ul role="list" className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={index * 0.08} className="flex">
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  );
}
