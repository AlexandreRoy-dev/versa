import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { PageHero, Section } from "@/components/site/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { contact, getDictionary, hasLocale } from "@/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.faq.heading, description: dict.faq.body };
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.faq.eyebrow}
        heading={dict.faq.heading}
        body={dict.faq.body}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Accordion type="single" collapsible className="w-full">
              {dict.faq.items.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-navy-900 text-left text-base font-medium hover:no-underline sm:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-pretty-vc text-sm leading-relaxed sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="bg-navy-900 mt-14 flex flex-col items-start gap-5 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between md:p-10">
              <div>
                <p className="font-heading text-xl font-semibold text-white">
                  {dict.faq.stillHave}
                </p>
                <p className="mt-2 text-sm text-white/55">
                  {dict.contact.response}
                </p>
              </div>
              <a
                href={contact.phoneHref}
                className="bg-brand-500 text-navy-950 hover:bg-brand-400 font-heading inline-flex shrink-0 items-center gap-2.5 rounded-full px-6 py-3 font-semibold transition-colors duration-300 ease-brand"
              >
                <Phone className="size-4" aria-hidden />
                {contact.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
