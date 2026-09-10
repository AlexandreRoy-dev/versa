import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone, Timer } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHero, Section } from "@/components/site/section";
import { contact, getDictionary, hasLocale } from "@/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.contact.heading, description: dict.contact.body };
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        heading={dict.contact.heading}
        body={dict.contact.body}
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="space-y-8">
            <Reveal>
              <a
                href={contact.phoneHref}
                className="group border-border hover:border-navy-700 block rounded-2xl border p-6 transition-colors duration-500 ease-brand"
              >
                <span className="eyebrow text-brand-600 flex items-center gap-2">
                  <Phone className="size-3.5" aria-hidden />
                  {dict.contact.phoneLabel}
                </span>
                <span className="font-heading text-navy-900 group-hover:text-brand-600 mt-3 block text-2xl font-semibold transition-colors duration-500 ease-brand">
                  {contact.phone}
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.12}>
              <a
                href={contact.emailHref}
                className="group border-border hover:border-navy-700 block rounded-2xl border p-6 transition-colors duration-500 ease-brand"
              >
                <span className="eyebrow text-brand-600 flex items-center gap-2">
                  <Mail className="size-3.5" aria-hidden />
                  {dict.contact.emailLabel}
                </span>
                <span className="text-navy-900 group-hover:text-brand-600 mt-3 block text-lg font-medium transition-colors duration-500 ease-brand">
                  {contact.email}
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="bg-sand-100 space-y-6 rounded-2xl p-6">
                <div>
                  <span className="eyebrow text-brand-600 flex items-center gap-2">
                    <MapPin className="size-3.5" aria-hidden />
                    {dict.contact.officeLabel}
                  </span>
                  <p className="text-navy-800 mt-3 text-sm leading-relaxed whitespace-pre-line">
                    {dict.contact.office}
                  </p>
                </div>
                <div className="border-t border-black/10 pt-6">
                  <span className="eyebrow text-brand-600 flex items-center gap-2">
                    <Clock className="size-3.5" aria-hidden />
                    {dict.contact.hoursLabel}
                  </span>
                  <p className="text-navy-800 mt-3 text-sm">
                    {dict.contact.hours}
                  </p>
                </div>
                <div className="border-t border-black/10 pt-6">
                  <span className="eyebrow text-brand-600 flex items-center gap-2">
                    <Timer className="size-3.5" aria-hidden />
                    {dict.contact.responseLabel}
                  </span>
                  <p className="text-navy-800 mt-3 text-sm">
                    {dict.contact.response}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="border-border rounded-2xl border bg-white p-8 md:p-10">
              <p className="eyebrow text-brand-600">{dict.form.eyebrow}</p>
              <h2 className="text-navy-900 mt-3 text-2xl font-semibold md:text-3xl">
                {dict.form.heading}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {dict.form.body}
              </p>
              <div className="mt-8">
                <LeadForm dict={dict} />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
