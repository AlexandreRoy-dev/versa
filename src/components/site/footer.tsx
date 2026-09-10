import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Chevron, Logo } from "@/components/brand/logo";
import { contact, type Dictionary } from "@/content";
import { routes } from "@/lib/routes";

export function Footer({ dict }: { dict: Dictionary }) {
  const locale = dict.locale;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 relative mt-auto overflow-hidden text-white">
      <div className="pointer-events-none absolute -top-24 right-[-6%] opacity-[0.07]">
        <Chevron className="h-72 w-auto" />
      </div>

      <div className="container-vc relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo locale={locale} tone="light" height={32} />
            <p className="font-heading mt-6 max-w-xs text-lg leading-snug text-white">
              {dict.footer.tagline}
            </p>
            <p className="text-pretty-vc mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {dict.footer.blurb}
            </p>
          </div>

          <div>
            <h2 className="eyebrow text-brand-300">
              {dict.footer.solutionsHeading}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {dict.products.items.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={routes.product(locale, product.slug)}
                    className="text-white/65 transition-colors duration-300 ease-brand hover:text-white"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-brand-300">
              {dict.footer.companyHeading}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href={routes.about(locale)}
                  className="text-white/65 transition-colors duration-300 ease-brand hover:text-white"
                >
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.equipment(locale)}
                  className="text-white/65 transition-colors duration-300 ease-brand hover:text-white"
                >
                  {dict.nav.equipment}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.faq(locale)}
                  className="text-white/65 transition-colors duration-300 ease-brand hover:text-white"
                >
                  {dict.nav.faq}
                </Link>
              </li>
              <li>
                <Link
                  href={routes.contact(locale)}
                  className="text-white/65 transition-colors duration-300 ease-brand hover:text-white"
                >
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-brand-300">
              {dict.footer.contactHeading}
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={contact.phoneHref}
                  className="font-heading flex items-center gap-3 text-lg text-white transition-colors duration-300 ease-brand hover:text-brand-300"
                >
                  <Phone className="size-4 shrink-0 text-brand-500" aria-hidden />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="flex items-center gap-3 text-white/65 transition-colors duration-300 ease-brand hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-brand-500" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3 text-white/55">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                <span className="whitespace-pre-line leading-relaxed">
                  {dict.contact.office}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {dict.footer.rights} — {dict.footer.hosted}
          </p>
          <p className="text-white/30">{dict.footer.prototypeNotice}</p>
        </div>
      </div>
    </footer>
  );
}
