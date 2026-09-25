import { BookOpen } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { PostCard } from "@/components/cards/post-card";
import { Reveal } from "@/components/site/reveal";
import { getBlogPosts } from "@/lib/queries/content";

export async function InsightsSection() {
  const posts = (await getBlogPosts()).slice(0, 3);

  return (
    <Section id="insights" bordered>
      <SectionHeading
        eyebrow="Insights"
        title="Writing from the work."
        lede="Practical notes on software, applied AI and building technology businesses — written after shipping something, not to fill a content calendar."
        action={{ label: "All insights", href: "/insights" }}
      />

      <div className="mt-14">
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 90}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="size-5" />}
            title="Nothing published yet."
            body="We would rather write nothing than pad this section with thin articles. When something worth reading goes up, it appears here."
            action={{ label: "See our services instead", href: "/services" }}
          />
        )}
      </div>
    </Section>
  );
}
