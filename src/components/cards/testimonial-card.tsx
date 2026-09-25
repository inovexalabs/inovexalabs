import Image from "next/image";
import { Quote } from "lucide-react";
import { initials, formatDate } from "@/lib/utils";
import type { Testimonial } from "@/types/content";

/**
 * Only real, published testimonials render here. Each one can carry a source
 * URL so a claim is verifiable rather than asserted.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="panel flex h-full flex-col p-6">
      <Quote aria-hidden className="size-5 text-signal/60" />

      <blockquote className="mt-5 flex-1">
        <p className="text-base leading-relaxed text-bone-dim">“{testimonial.quote}”</p>
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3.5 border-t border-steel pt-5">
        {testimonial.author_image_url ? (
          <Image
            src={testimonial.author_image_url}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-steel bg-graphite font-mono text-[0.6875rem] text-bone-dim"
          >
            {initials(testimonial.author_name)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-bone">{testimonial.author_name}</p>
          <p className="truncate text-xs text-ash">
            {[testimonial.author_role, testimonial.author_company].filter(Boolean).join(", ")}
          </p>
        </div>

        {testimonial.company_logo_url ? (
          <Image
            src={testimonial.company_logo_url}
            alt={testimonial.author_company ?? ""}
            width={72}
            height={24}
            className="h-6 w-auto shrink-0 object-contain opacity-70"
          />
        ) : null}
      </figcaption>

      {(testimonial.given_on || testimonial.source_url) && (
        <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
          {testimonial.given_on ? <time dateTime={testimonial.given_on}>{formatDate(testimonial.given_on)}</time> : null}
          {testimonial.source_url ? (
            <>
              {testimonial.given_on ? " · " : ""}
              <a
                href={testimonial.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-signal"
              >
                Source
              </a>
            </>
          ) : null}
        </p>
      )}
    </figure>
  );
}
