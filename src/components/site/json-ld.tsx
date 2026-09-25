/**
 * Emits a JSON-LD graph into the server-rendered HTML so crawlers see
 * structured data without executing any JavaScript.
 */
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Content is built server-side from typed data, never from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
