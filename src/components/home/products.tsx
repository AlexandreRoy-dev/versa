import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";

import { Chevron } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section";
import { contact, type Dictionary } from "@/content";
import { routes } from "@/lib/routes";

export function Products({ dict }: { dict: Dictionary }) {
  const locale = dict.locale;

  return (
    <>
      <SectionHeading
        eyebrow={dict.products.eyebrow}
        heading={dict.products.heading}
        body={dict.products.body}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {dict.products.items.map((product, index) => (
          <Reveal key={product.slug} delay={index * 0.15} className="h-full">
            <Link
              href={routes.product(locale, product.slug)}
              className="group border-border hover:border-navy-700 relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-8 transition-all duration-500 ease-brand hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(19,55,86,0.35)]"
            >
              <div
                className="pointer-events-none absolute -top-16 -right-16 opacity-0 transition-opacity duration-700 ease-brand group-hover:opacity-[0.06]"
                aria-hidden
              >
                <Chevron className="h-56 w-auto" />
              </div>

              <div className="relative flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-navy-900 text-xl font-semibold">
                    {product.name}
                  </h3>
                  <ArrowUpRight className="text-brand-500 size-5 shrink-0 transition-transform duration-500 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="text-muted-foreground text-pretty-vc mt-3 text-sm leading-relaxed">
                  {product.summary}
                </p>

                <div className="border-border/70 mt-6 border-t pt-5">
                  <p className="eyebrow text-brand-600">
                    {dict.products.bestForLabel}
                  </p>
                  <p className="text-navy-800 mt-2 text-sm leading-relaxed">
                    {product.bestFor}
                  </p>
                </div>

                <ul className="mt-6 space-y-2">
                  {product.benefits.slice(0, 3).map((benefit) => (
                    <li
                      key={benefit}
                      className="text-muted-foreground flex gap-2.5 text-sm leading-relaxed"
                    >
                      <span className="bg-brand-500 mt-[0.45rem] size-1.5 shrink-0 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <span className="text-navy-800 group-hover:text-brand-600 mt-7 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-500 ease-brand">
                  {dict.products.learnMore}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="border-border mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed px-7 py-6">
          <p className="text-navy-900 text-sm font-medium">
            {dict.products.lineOfCredit}
          </p>
          <a
            href={contact.phoneHref}
            className="text-brand-600 hover:text-navy-800 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ease-brand"
          >
            <Phone className="size-3.5" aria-hidden />
            {contact.phone}
          </a>
        </div>
      </Reveal>
    </>
  );
}
