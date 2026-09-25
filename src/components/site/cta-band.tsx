import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

/**
 * The end of the journey. Every route ends here so the path from reading to
 * starting a project is always one click away.
 */
export function CtaBand({
  eyebrow = "Start your own project",
  title = "Have an idea worth building?",
  body = "Tell us the problem you are solving. We will reply with a straight assessment, a realistic shape for the work, and a clear next step — or tell you honestly if software is not the answer.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-steel/80">
      <div aria-hidden className="lab-grid lab-grid-mask absolute inset-0 opacity-70" />
      <div aria-hidden className="lab-vignette absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[86rem] edge-x py-24 sm:py-32">
        <Reveal className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="display-lg mt-5 text-bone">{title}</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">{body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                Start a Project
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/work">See how we work</Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
            {[
              { dt: "Response", dd: "Within one business day" },
              { dt: "First step", dd: "A short discovery call" },
              { dt: "No pressure", dd: "We will say if it is not a fit" },
            ].map((item) => (
              <div key={item.dt} className="border-t border-steel pt-3">
                <dt className="mono-label text-ash-deep">{item.dt}</dt>
                <dd className="mt-1.5 text-sm text-bone-dim">{item.dd}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
