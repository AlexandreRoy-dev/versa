import type { Locale, ProductSlug } from "@/content";

/*
  The live site serves French slugs on its English pages too
  (for example /en/questions-frequemment-posees/), so we keep one slug set
  for both locales rather than maintaining a translated routing table.
*/
export const routes = {
  home: (locale: Locale) => `/${locale}`,
  solutions: (locale: Locale) => `/${locale}/solutions`,
  product: (locale: Locale, slug: ProductSlug) =>
    `/${locale}/solutions/${slug}`,
  equipment: (locale: Locale) => `/${locale}/equipements`,
  about: (locale: Locale) => `/${locale}/cabinet`,
  faq: (locale: Locale) => `/${locale}/faq`,
  contact: (locale: Locale) => `/${locale}/contact`,
} as const;

/** Swaps the locale segment while keeping the visitor on the same page. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${next}`;
  segments[0] = next;
  return `/${segments.join("/")}`;
}

export function mainNav(locale: Locale) {
  return [
    { key: "solutions" as const, href: routes.solutions(locale) },
    { key: "equipment" as const, href: routes.equipment(locale) },
    { key: "about" as const, href: routes.about(locale) },
    { key: "faq" as const, href: routes.faq(locale) },
    { key: "contact" as const, href: routes.contact(locale) },
  ];
}
