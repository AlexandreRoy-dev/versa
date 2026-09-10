import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Phone } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import {
  contact,
  getDictionary,
  hasLocale,
  locales,
  type ProductSlug,
} from "@/content";
import { ILLUSTRATIVE_RATES } from "@/lib/finance";
import { routes } from "@/lib/routes";

const PRODUCT_SLUGS = Object.keys(ILLUSTRATIVE_RATES) as ProductSlug[];

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PRODUCT_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/solutions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const product = getDictionary(locale).products.items.find(
    (item) => item.slug === slug,
  );
  if (!product) return {};
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({
  params,
}: PageProps<"/[locale]/solutions/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const product = dict.products.items.find((item) => item.slug === slug);
  if (!product) notFound();

  const others = dict.products.items.filter((item) => item.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow={dict.products.eyebrow}
        heading={product.name}
        body={product.summary}
      >
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-brand-500 text-navy-950 hover:bg-brand-400 group h-11"
            >
              <Link href={routes.contact(locale)}>
                {dict.hero.primaryCta}
                <ArrowRight className="ml-1 size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={routes.solutions(locale)}>
                <ArrowLeft className="mr-1 size-4" />
                {dict.nav.solutions}
              </Link>
            </Button>
          </div>
        </Reveal>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="text-navy-800 text-pretty-vc text-lg leading-relaxed">
                {product.body}
              </p>

              <h2 className="text-navy-900 mt-12 text-xl font-semibold">
                {dict.products.bestForLabel}
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {product.bestFor}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} variant="scale">
            <div className="bg-sand-100 rounded-2xl p-8">
              <h2 className="text-navy-900 text-lg font-semibold">
                {dict.products.eyebrow}
              </h2>
              <ul className="mt-6 space-y-3.5">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="bg-brand-500 text-navy-950 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                      <Check className="size-3" aria-hidden />
                    </span>
                    <span className="text-navy-800 text-sm leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={contact.phoneHref}
                className="text-navy-900 hover:text-brand-600 mt-8 flex items-center gap-2.5 border-t border-black/10 pt-6 text-sm font-semibold transition-colors duration-300 ease-brand"
              >
                <Phone className="text-brand-500 size-4" aria-hidden />
                {contact.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          eyebrow={dict.products.eyebrow}
          heading={dict.products.heading}
          className="mb-12"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {others.map((other, index) => (
            <Reveal key={other.slug} delay={index * 0.15} className="h-full">
              <Link
                href={routes.product(locale, other.slug)}
                className="group border-border hover:border-navy-700 flex h-full flex-col rounded-2xl border bg-white p-6 transition-all duration-500 ease-brand hover:-translate-y-1"
              >
                <h3 className="text-navy-900 font-semibold">{other.name}</h3>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  {other.summary}
                </p>
                <span className="text-brand-600 mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                  {dict.products.learnMore}
                  <ArrowRight className="size-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="white" id="demande">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow={dict.form.eyebrow}
            heading={dict.form.heading}
            body={dict.form.body}
          />
          <Reveal delay={0.15}>
            <LeadForm dict={dict} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
