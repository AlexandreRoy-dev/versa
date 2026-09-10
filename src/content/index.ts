import { en } from "./en";
import { fr } from "./fr";
import { hasLocale, locales, type Dictionary, type Locale } from "./types";

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Shared business facts that read the same in both languages. */
export const contact = {
  phone: "1-833-508-3772",
  phoneHref: "tel:+18335083772",
  email: "info@versacapital.ca",
  emailHref: "mailto:info@versacapital.ca",
} as const;

export { hasLocale, locales };
export type { Dictionary, Locale };
export type {
  EquipmentCategory,
  FaqItem,
  ProcessStep,
  Product,
  ProductSlug,
} from "./types";
