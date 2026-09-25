import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * A deliberately small markdown renderer.
 *
 * Editorial content is stored as markdown in Supabase. Rather than shipping a
 * parser plus a sanitiser to the browser, this renders on the server and emits
 * plain HTML — zero client JavaScript, and no `dangerouslySetInnerHTML`, so
 * there is no HTML-injection surface at all.
 *
 * Supported: ## / ### headings, paragraphs, unordered and ordered lists,
 * blockquotes, horizontal rules, fenced code, **bold**, *italic*, `code`,
 * and [links](https://example.com).
 */

interface InlineToken {
  type: "text" | "bold" | "italic" | "code" | "link";
  value: string;
  href?: string;
}

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)\s]+\))|(\*[^*\n]+\*)/g;

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    const raw = match[0];

    if (raw.startsWith("**")) {
      tokens.push({ type: "bold", value: raw.slice(2, -2) });
    } else if (raw.startsWith("`")) {
      tokens.push({ type: "code", value: raw.slice(1, -1) });
    } else if (raw.startsWith("[")) {
      const split = raw.indexOf("](");
      tokens.push({
        type: "link",
        value: raw.slice(1, split),
        href: raw.slice(split + 2, -1),
      });
    } else {
      tokens.push({ type: "italic", value: raw.slice(1, -1) });
    }

    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return parseInline(text).map((token, i) => {
    const key = `${keyPrefix}-i${i}`;
    switch (token.type) {
      case "bold":
        return (
          <strong key={key} className="font-semibold text-bone">
            {token.value}
          </strong>
        );
      case "italic":
        return (
          <em key={key} className="italic text-bone-dim">
            {token.value}
          </em>
        );
      case "code":
        return (
          <code
            key={key}
            className="rounded border border-steel bg-graphite px-1.5 py-0.5 font-mono text-[0.85em] text-signal"
          >
            {token.value}
          </code>
        );
      case "link": {
        const href = token.href ?? "#";
        const isInternal = href.startsWith("/");
        return isInternal ? (
          <Link key={key} href={href} className="text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal">
            {token.value}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal"
          >
            {token.value}
          </a>
        );
      }
      default:
        return <Fragment key={key}>{token.value}</Fragment>;
    }
  });
}

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "hr" }
  | { type: "code"; text: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];
  let fence: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: list.kind, items: list.items });
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ type: "quote", text: quote.join(" ") });
      quote = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      if (fence) {
        blocks.push({ type: "code", text: fence.join("\n") });
        fence = null;
      } else {
        flushAll();
        fence = [];
      }
      continue;
    }
    if (fence) {
      fence.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      flushAll();
      blocks.push({ type: "hr" });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushAll();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushAll();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      quote.push(trimmed.slice(2));
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(trimmed);
    if (ul) {
      flushParagraph();
      flushQuote();
      const item = ul[1] ?? "";
      if (list?.kind === "ul") list.items.push(item);
      else {
        flushList();
        list = { kind: "ul", items: [item] };
      }
      continue;
    }
    const ol = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (ol) {
      flushParagraph();
      flushQuote();
      const item = ol[1] ?? "";
      if (list?.kind === "ol") list.items.push(item);
      else {
        flushList();
        list = { kind: "ol", items: [item] };
      }
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(trimmed);
  }

  if (fence) blocks.push({ type: "code", text: fence.join("\n") });
  flushAll();
  return blocks;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `b${index}`;
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={key}
                id={block.text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}
                className="mt-14 mb-4 scroll-mt-28 font-display text-2xl font-medium tracking-tight text-bone sm:text-[1.75rem]"
              >
                {renderInline(block.text, key)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} className="mt-10 mb-3 font-display text-xl font-medium text-bone">
                {renderInline(block.text, key)}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="my-8 border-l-2 border-signal/50 bg-graphite/60 py-3 pl-5 pr-4 text-bone-dim italic"
              >
                {renderInline(block.text, key)}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key} className="my-5 space-y-2.5">
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`} className="relative pl-6 text-bone-dim">
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-signal/70"
                    />
                    {renderInline(item, `${key}-${i}`)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="my-5 space-y-2.5">
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`} className="relative pl-8 text-bone-dim">
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 font-mono text-xs text-signal/80"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {renderInline(item, `${key}-${i}`)}
                  </li>
                ))}
              </ol>
            );
          case "hr":
            return <hr key={key} className="hairline my-12 border-0" />;
          case "code":
            return (
              <pre
                key={key}
                className="my-7 overflow-x-auto rounded-xl border border-steel bg-carbon p-4 font-mono text-[0.8rem] leading-relaxed text-bone-dim"
              >
                <code>{block.text}</code>
              </pre>
            );
          default:
            return (
              <p key={key} className="my-5 leading-[1.75] text-bone-dim">
                {renderInline(block.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
