import Link from "next/link";
import { ArrowRight, MoveDown } from "lucide-react";

import { Chevron } from "@/components/brand/logo";
import { Atmosphere } from "@/components/motion/atmosphere";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/content";
import { routes } from "@/lib/routes";

export function Hero({ dict }: { dict: Dictionary }) {
  const locale = dict.locale;

  return (
    <section className="bg-navy-900 relative isolate flex min-h-[92svh] flex-col justify-center overflow-hidden pt-32 pb-0">
      <Atmosphere tone="dark" />

      {/* Oversized chevron geometry lifted from the logo mark. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Reveal
          variant="fade"
          className="absolute -top-[6%] right-[-12%] opacity-[0.13] sm:right-[-4%]"
        >
          <Chevron animate className="h-[46rem] w-auto" />
        </Reveal>
        <div className="from-navy-900 via-navy-900/40 absolute inset-0 bg-gradient-to-r to-transparent" />
      </div>

      <div className="container-vc relative py-14">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow text-brand-300 flex items-center gap-2.5">
              <Chevron className="h-3 w-auto" />
              {dict.hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <h1 className="text-balance-vc mt-6 text-[2.4rem] leading-[1.06] font-semibold text-white sm:text-5xl lg:text-[3.7rem]">
              {dict.hero.heading}
            </h1>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="text-pretty-vc mt-7 max-w-xl text-lg leading-relaxed text-white/70">
              {dict.hero.body}
            </p>
          </Reveal>

          <Reveal delay={0.54}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-brand-500 text-navy-950 hover:bg-brand-400 group h-12 px-6 text-[0.95rem]"
              >
                <Link href={routes.contact(locale)}>
                  {dict.hero.primaryCta}
                  <ArrowRight className="ml-1 size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-6 text-[0.95rem] text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={routes.solutions(locale)}>
                  {dict.hero.secondaryCta}
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.72}>
            <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
              {dict.hero.stats.map((stat) => (
                <div key={stat.label} className="min-w-24">
                  <dt className="font-heading text-3xl font-semibold text-white tabular-nums">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm text-white/50">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Perpetual sector marquee: quiet, continuous, never loops the UI. */}
      <div className="relative mt-10 border-y border-white/10 py-4">
        <div className="flex overflow-hidden">
          <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
            {[...dict.marquee, ...dict.marquee].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="font-heading flex shrink-0 items-center gap-10 text-sm tracking-[0.14em] whitespace-nowrap text-white/35 uppercase"
              >
                {item}
                <span className="bg-brand-500/50 size-1 rounded-full" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-vc relative py-5">
        <a
          href="#pourquoi"
          className="hover:text-brand-300 inline-flex items-center gap-2 text-xs tracking-[0.16em] text-white/30 uppercase transition-colors duration-300 ease-brand"
        >
          <MoveDown className="size-3.5" aria-hidden />
          {dict.hero.scrollHint}
        </a>
      </div>
    </section>
  );
}
