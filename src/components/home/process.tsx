import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section";
import type { Dictionary } from "@/content";

export function Process({ dict }: { dict: Dictionary }) {
  return (
    <>
      <SectionHeading
        eyebrow={dict.process.eyebrow}
        heading={dict.process.heading}
        body={dict.process.body}
      />

      <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {dict.process.steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.15}>
            <li className="relative">
              {/* Connector, drawn in rather than dropped in. */}
              <div className="mb-6 flex items-center gap-3">
                <span className="bg-navy-800 font-heading flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white tabular-nums">
                  {index + 1}
                </span>
                <span
                  className="anim-wipe from-border h-px flex-1 bg-gradient-to-r to-transparent"
                  data-reveal-follow=""
                  style={{ "--reveal-delay": "0.35s" }}
                  aria-hidden
                />
              </div>
              <h3 className="text-navy-900 text-base leading-snug font-semibold">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-pretty-vc mt-3 text-sm leading-relaxed">
                {step.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </>
  );
}
