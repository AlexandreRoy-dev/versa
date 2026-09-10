import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";

import { Chevron } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/section";
import { contact, getDictionary, hasLocale } from "@/content";
import { routes } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/solutions">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.products.heading,
    description: dict.products.body,
  };
}

export default async function SolutionsPage({
  params,
}: PageProps<"/[locale]/solutions">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.products.eyebrow}
        heading={dict.products.heading}
        body={dict.products.body}
      />

      <Section tone="white">
        <div className="space-y-20 md:space-y-28">
          {dict.products.items.map((product, index) => (
            <div
              key={product.slug}
              id={product.slug}
              className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
            >
              <Reveal variant={index % 2 === 0 ? "left" : "up"}>
                <div className="lg:sticky lg:top-28">
                  <div className="flex items-center gap-3">
                    <Chevron className="h-4 w-auto" />
                    <span className="eyebrow text-brand-600 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="text-navy-900 mt-5 text-3xl leading-tight font-semibold md:text-4xl">
                    {product.name}
                  </h2>
                  <p className="text-navy-800 mt-4 text-lg leading-relaxed">
                    {product.summary}
                  </p>
                  <div className="bg-brand-50 mt-7 rounded-xl p-5">
                    <p className="eyebrow text-brand-600">
                      {dict.products.bestForLabel}
                    </p>
                    <p className="text-navy-800 mt-2 text-sm leading-relaxed">
                      {product.bestFor}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="hover:border-navy-700 mt-7"
                  >
                    <Link href={routes.product(locale, product.slug)}>
                      {dict.products.learnMore}
                      <ArrowRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="border-border rounded-2xl border bg-white p-8 md:p-10">
                  <p className="text-muted-foreground text-pretty-vc leading-relaxed">
                    {product.body}
                  </p>
                  <ul className="mt-8 space-y-3.5">
                    {product.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3">
                        <span className="bg-brand-100 text-brand-600 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                          <Check className="size-3" aria-hidden />
                        </span>
                        <span className="text-navy-800 text-sm leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="border-border mt-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed px-7 py-6">
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
      </Section>
    </>
  );
}
