import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section";
import type { Dictionary } from "@/content";

export function Why({ dict }: { dict: Dictionary }) {
  return (
    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
      <SectionHeading
        eyebrow={dict.why.eyebrow}
        heading={dict.why.heading}
        body={dict.why.body}
      />

      <ul className="grid gap-px sm:grid-cols-2">
        {dict.why.points.map((point, index) => (
          <Reveal key={point.title} delay={index * 0.15} className="h-full">
            <li className="group bg-border/60 relative h-full p-px">
              <div className="hover:border-brand-300 relative h-full border border-transparent bg-white p-7 transition-colors duration-500 ease-brand">
                <span className="font-heading text-brand-300 group-hover:text-brand-500 text-sm font-semibold tabular-nums transition-colors duration-500 ease-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-navy-900 mt-4 text-lg leading-snug font-semibold">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-pretty-vc mt-3 text-sm leading-relaxed">
                  {point.body}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
