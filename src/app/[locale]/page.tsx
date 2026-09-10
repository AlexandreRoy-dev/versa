import { notFound } from "next/navigation";

import { LeadForm } from "@/components/forms/lead-form";
import { Estimator } from "@/components/home/estimator";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { Products } from "@/components/home/products";
import { Proof } from "@/components/home/proof";
import { Why } from "@/components/home/why";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { getDictionary, hasLocale } from "@/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict} />

      <Section tone="white">
        <Why dict={dict} />
      </Section>

      <Section tone="sand" id="solutions">
        <Products dict={dict} />
      </Section>

      <Section tone="white" id="estimateur">
        <SectionHeading
          eyebrow={dict.estimator.eyebrow}
          heading={dict.estimator.heading}
          body={dict.estimator.body}
          className="mb-14"
        />
        <Estimator dict={dict} />
      </Section>

      <Section tone="navy">
        <Proof dict={dict} />
      </Section>

      <Section tone="white">
        <Process dict={dict} />
      </Section>

      <Section tone="sand" id="demande">
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
