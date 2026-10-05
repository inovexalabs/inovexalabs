import { Plus } from "lucide-react";
import { JsonLd, faqJsonLd } from "@/lib/seo/json-ld";

export interface FaqEntry {
  id?: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqEntry[];
  /** Heading shown beside the list. Omit to render only the list. */
  title?: string;
  id?: string;
  /** Publish FAQPage structured data (only where questions are shown as an FAQ). */
  structuredData?: boolean;
}

/**
 * Accessible disclosure list built on native <details>: it works without
 * JavaScript, with the keyboard and with screen readers.
 */
export function FaqAccordion({ faqs, title, id = "faq", structuredData = false }: FaqAccordionProps) {
  if (faqs.length === 0) return null;

  const headingId = `${id}-title`;
  const list = (
    <div className={title ? "lg:col-span-8" : "w-full"}>
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((faq, index) => (
          <details key={faq.id ?? `${faq.question}-${index}`} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-xs py-5 text-left font-display text-h4 text-fg [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-fg-muted transition-transform duration-300 ease-premium group-open:rotate-45"
              >
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="max-w-[44rem] pb-6 pr-14 text-fg-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {structuredData && faqs.length > 0 ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      {title ? (
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <h2 id={headingId} className="font-display text-h2 text-fg lg:col-span-4">
            {title}
          </h2>
          <div aria-labelledby={headingId} className="lg:col-span-8">
            {list}
          </div>
        </div>
      ) : (
        list
      )}
    </>
  );
}
