import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section";
import type { Dictionary } from "@/content";

export function Proof({ dict }: { dict: Dictionary }) {
  return (
    <>
      <SectionHeading
        eyebrow={dict.proof.eyebrow}
        heading={dict.proof.heading}
        body={dict.proof.body}
        tone="dark"
      />

      <dl className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {dict.proof.stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.15}>
            <div className="border-t border-white/15 pt-6">
              <dt className="font-heading text-4xl font-semibold text-white md:text-5xl">
                <Counter
                  value={stat.value}
                  locale={dict.locale}
                  suffix={stat.suffix}
                  plain={stat.value > 1900}
                />
              </dt>
              <dd className="mt-3">
                <span className="block text-sm font-medium text-white">
                  {stat.label}
                </span>
                <span className="mt-1 block text-sm text-white/45">
                  {stat.note}
                </span>
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </>
  );
}
