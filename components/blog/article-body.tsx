import Link from "next/link";
import { Fragment } from "react";
import { articleToc, parseArticle, type InlineToken } from "@/lib/utils/article";

/** Renders inline tokens as React elements. Text only — never raw HTML. */
function Inline({ tokens }: { tokens: InlineToken[] }) {
  return (
    <>
      {tokens.map((token, index) => {
        switch (token.kind) {
          case "bold":
            return <strong key={index}>{token.value}</strong>;
          case "italic":
            return <em key={index}>{token.value}</em>;
          case "code":
            return (
              <code
                key={index}
                className="rounded-[4px] border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em]"
              >
                {token.value}
              </code>
            );
          case "link":
            return token.href.startsWith("/") ? (
              <Link key={index} href={token.href} className="text-accent underline-offset-4 hover:underline">
                {token.value}
              </Link>
            ) : (
              <a
                key={index}
                href={token.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-accent underline-offset-4 hover:underline"
              >
                {token.value}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            );
          default:
            return <Fragment key={index}>{token.value}</Fragment>;
        }
      })}
    </>
  );
}

interface ArticleBodyProps {
  content: string;
  className?: string;
}

/**
 * Renders a blog post's markup as semantic HTML: h2/h3 headings with anchors,
 * paragraphs, lists, blockquotes and code blocks — all as React elements.
 */
export function ArticleBody({ content, className }: ArticleBodyProps) {
  const blocks = parseArticle(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return block.level === 2 ? (
              <h2 key={index} id={block.id} className="mt-12 scroll-mt-32 font-display text-h3 text-fg first:mt-0">
                {block.text}
              </h2>
            ) : (
              <h3 key={index} id={block.id} className="mt-8 scroll-mt-32 font-display text-h4 text-fg">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={index} className="mt-5 text-fg-muted">
                <Inline tokens={block.tokens} />
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={index} className="mt-5 list-decimal space-y-2 pl-6 text-fg-muted marker:font-medium marker:text-accent">
                {block.items.map((tokens, itemIndex) => (
                  <li key={itemIndex}>
                    <Inline tokens={tokens} />
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="mt-5 list-disc space-y-2 pl-6 text-fg-muted marker:text-accent">
                {block.items.map((tokens, itemIndex) => (
                  <li key={itemIndex}>
                    <Inline tokens={tokens} />
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={index} className="mt-6 border-l-2 border-iris-500 pl-5 italic text-fg">
                <Inline tokens={block.tokens} />
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={index}
                className="mt-6 overflow-x-auto rounded-xl border border-line bg-navy-950 p-5 text-sm leading-relaxed text-[#e6ebf8]"
              >
                <code data-language={block.language}>{block.code}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}

interface ArticleTocProps {
  content: string;
}

/** In-page table of contents built from the post's ## headings. Hidden when there are none. */
export function ArticleToc({ content }: ArticleTocProps) {
  const entries = articleToc(parseArticle(content));
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">On this page</p>
      <ol className="mt-3 space-y-2 text-sm">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} className="text-fg-muted transition-colors hover:text-fg">
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
