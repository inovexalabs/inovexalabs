"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Testimonial } from "@/lib/supabase/queries/testimonials";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

/**
 * Testimonial carousel.
 *
 * - Horizontal scroll-snap track: swipe works natively on touch devices.
 * - Prev/next buttons and pagination dots (real buttons, labelled).
 * - Arrow keys move between slides when the region has focus.
 * - Autoplay advances every 7 seconds, pauses on hover/focus, and is disabled
 *   entirely when the visitor prefers reduced motion.
 */
export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const regionId = useId();
  const trackRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const count = testimonials.length;
  const last = count - 1;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const scrollTo = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), last);
      const card = cardRefs.current[clamped];
      card?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "start",
        block: "nearest",
      });
      setIndex(clamped);
    },
    [last, reducedMotion],
  );

  // Autoplay: stops for reduced motion, while hovered, while focused, and at
  // the end of the list (the last slide is left on screen).
  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = current >= last ? 0 : current + 1;
        const card = cardRefs.current[next];
        card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        return next;
      });
    }, 7000);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion, last]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollTo(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollTo(last);
    }
  }

  return (
    <div
      className="mt-12 sm:mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        id={regionId}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        className="relative"
      >
        <ol
          ref={trackRef}
          tabIndex={0}
          aria-label="Testimonials, use the left and right arrow keys to move between slides"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line-strong"
        >
          {testimonials.map((testimonial, itemIndex) => (
            <li
              key={testimonial.id}
              ref={(element) => {
                cardRefs.current[itemIndex] = element;
              }}
              aria-label={`Testimonial ${itemIndex + 1} of ${count}`}
              className="w-[min(88%,26rem)] shrink-0 snap-start sm:w-[min(70%,26rem)] lg:w-[min(46%,26rem)]"
            >
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-7">
                <Quote aria-hidden="true" className="size-6 text-iris-500/70" />
                <blockquote className="mt-4 flex-1 text-fg">{testimonial.testimonial}</blockquote>

                <div className="mt-5 flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star
                      key={star}
                      aria-hidden="true"
                      className={cn("size-4", star < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-line-strong")}
                    />
                  ))}
                </div>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-5">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar.url}
                      alt={testimonial.avatar.alt}
                      width={44}
                      height={44}
                      loading="lazy"
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-full brand-gradient-soft font-display text-sm font-semibold text-iris-700"
                    >
                      {testimonial.name
                        .split(/\s+/)
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-fg">{testimonial.name}</span>
                    <span className="block truncate text-sm text-fg-muted">
                      {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        {count > 1 ? (
          <div className="mt-6 flex items-center justify-between gap-4">
            <ul className="flex items-center gap-2">
              {testimonials.map((testimonial, itemIndex) => (
                <li key={testimonial.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(itemIndex)}
                    aria-label={`Go to testimonial ${itemIndex + 1}`}
                    aria-current={itemIndex === index ? "true" : undefined}
                    className={cn(
                      "h-2.5 rounded-full transition-[width,background-color] duration-300",
                      itemIndex === index ? "w-7 brand-gradient" : "w-2.5 bg-line-strong hover:bg-fg-subtle",
                    )}
                  />
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full"
                aria-label="Previous testimonial"
                onClick={() => scrollTo(index - 1)}
                disabled={index === 0}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full"
                aria-label="Next testimonial"
                onClick={() => scrollTo(index + 1)}
                disabled={index === last}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        Testimonial {index + 1} of {count}
      </p>
    </div>
  );
}
