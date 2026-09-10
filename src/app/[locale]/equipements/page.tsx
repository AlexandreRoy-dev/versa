import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EquipmentExplorer } from "@/components/equipment/explorer";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { getDictionary, hasLocale } from "@/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/equipements">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.equipment.heading,
    description: dict.equipment.body,
  };
}

export default async function EquipmentPage({
  params,
}: PageProps<"/[locale]/equipements">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.equipment.eyebrow}
        heading={dict.equipment.heading}
        body={dict.equipment.body}
      />

      <Section tone="white">
        <EquipmentExplorer dict={dict} />
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
