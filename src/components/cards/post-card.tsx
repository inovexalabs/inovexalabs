import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import type { BlogPostDetail } from "@/types/content";

export function PostCard({
  post,
  className,
  compact = false,
}: {
  post: BlogPostDetail;
  className?: string;
  compact?: boolean;
}) {
  return (
    <article className={cn("h-full", className)}>
      <Link
        href={`/insights/${post.slug}`}
        className="panel panel-interactive group flex h-full flex-col overflow-hidden"
      >
        {!compact && post.cover_image_url ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-steel bg-graphite">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? post.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </div>
        ) : null}

        <div className={cn("flex flex-1 flex-col", compact ? "p-5" : "p-6")}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {post.category ? (
              <span className="mono-label text-signal">{post.category.name}</span>
            ) : null}
            <span className="mono-label text-ash-deep">
              {post.reading_minutes ?? 5} min read
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <h3
              className={cn(
                "font-display font-medium tracking-tight text-bone",
                compact ? "text-base" : "text-xl",
              )}
            >
              {post.title}
            </h3>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-ash-deep transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
          </div>

          {post.excerpt ? (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ash">{post.excerpt}</p>
          ) : null}

          <div className="mt-auto flex items-center gap-3 pt-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
            {post.author ? <span className="text-ash">{post.author.name}</span> : null}
            <span aria-hidden className="size-1 rounded-full bg-steel" />
            <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}
