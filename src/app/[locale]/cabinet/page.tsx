import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Chevron } from "@/components/brand/logo";
import { Proof } from "@/components/home/proof";
import { Process } from "@/components/home/process";
import { Reveal } from "@/components/motion/reveal";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { getDictionary, hasLocale } from "@/content";
import { routes } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cabinet">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.about.heading, description: dict.about.body };
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/cabinet">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.about.eyebrow}
        heading={dict.about.heading}
        body={dict.about.body}
      />

      <Section tone="white">
        <SectionHeading
          eyebrow={dict.about.eyebrow}
          heading={dict.about.valuesHeading}
          className="mb-14"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {dict.about.values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.15} className="h-full">
              <article className="border-border relative h-full overflow-hidden rounded-2xl border bg-white p-8">
                <Chevron className="h-5 w-auto" />
                <h3 className="text-navy-900 mt-6 text-xl font-semibold">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-pretty-vc mt-3 text-sm leading-relaxed">
                  {value.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <Proof dict={dict} />
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left">
            <div>
              <h2 className="text-navy-900 text-2xl leading-tight font-semibold md:text-3xl">
                {dict.about.teamHeading}
              </h2>
              <p className="text-muted-foreground text-pretty-vc mt-5 leading-relaxed">
                {dict.about.teamBody}
              </p>
            </div>
          </Reveal>
          <Reveal variant="right" delay={0.15}>
            <div className="bg-sand-100 rounded-2xl p-8 md:p-10">
              <h2 className="text-navy-900 text-2xl leading-tight font-semibold">
                {dict.about.sisterHeading}
              </h2>
              <p className="text-muted-foreground text-pretty-vc mt-5 leading-relaxed">
                {dict.about.sisterBody}
              </p>
              <Button
                asChild
                variant="outline"
                className="hover:border-navy-700 mt-7 bg-white"
              >
                <Link href={routes.equipment(locale)}>
                  {dict.nav.equipment}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand">
        <Process dict={dict} />
      </Section>
    </>
  );
}
