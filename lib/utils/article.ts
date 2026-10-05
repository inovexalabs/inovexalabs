/**
 * Article markup parser for blog content.
 *
 * The admin writes a deliberately small syntax:
 *
 *   ## Heading          → section heading (used by the table of contents)
 *   ### Subheading
 *   - bullet item
 *   1. numbered item
 *   > quote
 *   ```lang … ```       → code block
 *   **bold**  *italic*  `code`  [label](https://…)
 *
 * Anything that looks like raw HTML is treated as plain text, and the renderer
 * only ever produces React text nodes — so a post can never inject markup or
 * scripts into the page (no dangerouslySetInnerHTML anywhere in the pipeline).
 */

export type InlineToken =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "italic"; value: string }
  | { kind: "code"; value: string }
  | { kind: "link"; value: string; href: string };

export type ArticleBlock =
  | { kind: "heading"; level: 2 | 3; text: string; id: string }
  | { kind: "paragraph"; tokens: InlineToken[] }
  | { kind: "list"; ordered: boolean; items: InlineToken[][] }
  | { kind: "quote"; tokens: InlineToken[] }
  | { kind: "code"; language: string; code: string };

const EXTERNAL_HREF = /^(https:\/\/|mailto:|tel:|\/|#)/;

/** URL is kept only when it is clearly safe; anything else renders as plain text. */
function safeHref(value: string): string | null {
  const href = value.trim();
  return EXTERNAL_HREF.test(href) ? href : null;
}

/** Anchor id for a heading: lowercase, hyphenated, unique enough for deep links. */
export function headingId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "section"
  );
}

/**
 * Splits one line of inline markup into tokens. Bold is matched before italic
 * so "**a*b**" does not mis-nest; unmatched markers stay literal.
 */
export function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  const pushText = (value: string) => {
    if (!value) return;
    const previous = tokens[tokens.length - 1];
    if (previous && previous.kind === "text") previous.value += value;
    else tokens.push({ kind: "text", value });
  };

  while ((match = pattern.exec(input)) !== null) {
    pushText(input.slice(cursor, match.index));
    cursor = match.index + match[0].length;
    const raw = match[0];

    if (raw.startsWith("**")) {
      tokens.push({ kind: "bold", value: raw.slice(2, -2) });
    } else if (raw.startsWith("`")) {
      tokens.push({ kind: "code", value: raw.slice(1, -1) });
    } else if (raw.startsWith("[")) {
      const split = raw.indexOf("](");
      const label = raw.slice(1, split);
      const href = safeHref(raw.slice(split + 2, -1));
      if (href) tokens.push({ kind: "link", value: label, href });
      else pushText(raw);
    } else {
      tokens.push({ kind: "italic", value: raw.slice(1, -1) });
    }
  }

  pushText(input.slice(cursor));
  return tokens;
}

/** Parses the full article body into renderable blocks. */
export function parseArticle(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();

    if (trimmed === "") {
      index += 1;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || "text";
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        body.push(lines[index] ?? "");
        index += 1;
      }
      index += 1; // closing fence (or end of input)
      blocks.push({ kind: "code", language: language.slice(0, 24), code: body.join("\n") });
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1]?.length === 2 ? 2 : 3;
      const text = (heading[2] ?? "").replace(/\s*#+\s*$/, "").trim();
      if (text) blocks.push({ kind: "heading", level, text, id: headingId(text) });
      index += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const body: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith(">")) {
        body.push((lines[index] ?? "").trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ kind: "quote", tokens: parseInline(body.join(" ")) });
      continue;
    }

    const bullet = /^[-*]\s+/.test(trimmed);
    const ordered = /^\d+[.)]\s+/.test(trimmed);
    if (bullet || ordered) {
      const items: InlineToken[][] = [];
      while (index < lines.length) {
        const current = (lines[index] ?? "").trim();
        const isBullet = /^[-*]\s+/.test(current);
        const isOrdered = /^\d+[.)]\s+/.test(current);
        if (!isBullet && !isOrdered) break;
        const markerLength = isOrdered ? (current.match(/^\d+[.)]\s+/)?.[0].length ?? 2) : 2;
        items.push(parseInline(current.slice(markerLength)));
        index += 1;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    // Paragraph: consecutive plain lines
    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = (lines[index] ?? "").trim();
      if (
        current === "" ||
        current.startsWith("#") ||
        current.startsWith("```") ||
        current.startsWith(">") ||
        /^[-*]\s+/.test(current) ||
        /^\d+[.)]\s+/.test(current)
      ) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }
    blocks.push({ kind: "paragraph", tokens: parseInline(paragraph.join(" ")) });
  }

  return blocks;
}

/** Level-2 headings, for the table of contents. */
export function articleToc(blocks: ArticleBlock[]): { id: string; text: string }[] {
  return blocks
    .filter((block): block is Extract<ArticleBlock, { kind: "heading" }> => block.kind === "heading" && block.level === 2)
    .map((block) => ({ id: block.id, text: block.text }));
}
