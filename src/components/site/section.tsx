import type { ReactNode } from "react";

import { Chevron } from "@/components/brand/logo";
import { Atmosphere } from "@/components/motion/atmosphere";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Eyebrow, heading and supporting line, staggered on the house timing. */
export function SectionHeading({
  eyebrow,
  heading,
  body,
  tone = "light",
  align = "left",
  as: Heading = "h2",
  className,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <Reveal>
        <p
          className={cn(
            "eyebrow flex items-center gap-2.5",
            align === "center" && "justify-center",
            isDark ? "text-brand-300" : "text-brand-600",
          )}
        >
          <Chevron className="h-3 w-auto" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <Heading
          className={cn(
            "text-balance-vc mt-4 text-3xl leading-[1.12] font-semibold sm:text-4xl md:text-[2.6rem]",
            isDark ? "text-white" : "text-navy-900",
          )}
        >
          {heading}
        </Heading>
      </Reveal>
      {body ? (
        <Reveal delay={0.24}>
          <p
            className={cn(
              "text-pretty-vc mt-5 text-base leading-relaxed sm:text-lg",
              isDark ? "text-white/65" : "text-muted-foreground",
            )}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * Navy masthead used at the top of every inner page. The fixed header renders
 * light-on-dark, so each page needs a dark band behind it.
 */
export function PageHero({
  eyebrow,
  heading,
  body,
  children,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-navy-900 relative isolate overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <Atmosphere tone="dark" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
      >
        <Chevron className="absolute -top-10 right-[-4%] h-[26rem] w-auto" />
      </div>
      <div className="container-vc relative">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          body={body}
          tone="dark"
          as="h1"
        />
        {children}
      </div>
    </section>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "white" | "sand" | "navy";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-28",
        tone === "sand" && "bg-sand-100",
        tone === "navy" && "bg-navy-900 text-white",
        className,
      )}
    >
      <Atmosphere
        tone={tone === "navy" ? "dark" : "light"}
        subtle={tone === "white"}
      />
      <div className="container-vc relative">{children}</div>
    </section>
  );
}
