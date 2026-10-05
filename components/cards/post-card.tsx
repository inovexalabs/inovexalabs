import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import type { PostSummary } from "@/lib/supabase/queries/blog";
import { formatDate } from "@/lib/utils/format";

interface PostCardProps {
  post: PostSummary;
  headingLevel?: "h2" | "h3";
}

/** Article card with cover, category, excerpt and publication metadata. */
export function PostCard({ post, headingLevel = "h3" }: PostCardProps) {
  return (
    <Card as="article" padding="none" radius="xl" interactive className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-premium group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 hero-wash">
            <div className="absolute inset-0 grid-lines" />
          </div>
        )}
        <div className="absolute left-4 top-4">
          <Badge variant="brand" className="bg-surface/90 backdrop-blur">
            {post.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <CardTitle as={headingLevel} href={ROUTES.blogPost(post.slug)}>
          {post.title}
        </CardTitle>
        <CardDescription className="flex-1">{post.excerpt}</CardDescription>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-sm text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-4" />
            <time dateTime={post.publishedAt.slice(0, 10)}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-4" />
            {post.readingTime} min read
          </span>
          <span aria-hidden="true" className="ml-auto inline-flex items-center gap-1.5 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Read
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Card>
  );
}
