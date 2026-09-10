export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export type ProductSlug =
  | "credit-bail"
  | "affacturage"
  | "refinancement"
  | "pret-a-terme";

export type Product = {
  slug: ProductSlug;
  name: string;
  /** One-line plain description used in cards and page intros. */
  summary: string;
  /** Two or three sentences of substance, adapted from their live copy. */
  body: string;
  benefits: string[];
  bestFor: string;
  /** Shown in the estimator so the payment figure has context. */
  estimatorNote: string;
};

export type EquipmentCategory = {
  slug: string;
  name: string;
  /** Concrete assets so the list reads as real work, not taxonomy. */
  examples: string;
  sector: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ProcessStep = {
  title: string;
  body: string;
};

export type Dictionary = {
  locale: Locale;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    solutions: string;
    equipment: string;
    about: string;
    faq: string;
    contact: string;
    callUs: string;
    apply: string;
    menu: string;
    close: string;
    switchTo: string;
    switchLabel: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    stats: { value: string; label: string }[];
    scrollHint: string;
  };
  marquee: string[];
  why: {
    eyebrow: string;
    heading: string;
    body: string;
    points: { title: string; body: string }[];
  };
  products: {
    eyebrow: string;
    heading: string;
    body: string;
    lineOfCredit: string;
    lineOfCreditCta: string;
    learnMore: string;
    bestForLabel: string;
    items: Product[];
  };
  estimator: {
    eyebrow: string;
    heading: string;
    body: string;
    amountLabel: string;
    termLabel: string;
    productLabel: string;
    months: string;
    resultLabel: string;
    perMonth: string;
    totalLabel: string;
    rateLabel: string;
    rateNote: string;
    disclaimer: string;
    cta: string;
  };
  proof: {
    eyebrow: string;
    heading: string;
    body: string;
    stats: { value: number; suffix: string; label: string; note: string }[];
  };
  process: {
    eyebrow: string;
    heading: string;
    body: string;
    steps: ProcessStep[];
  };
  equipment: {
    eyebrow: string;
    heading: string;
    body: string;
    filterAll: string;
    filterLabel: string;
    searchPlaceholder: string;
    empty: string;
    /** Dictionaries stay serializable, so pluralization uses a {n} token. */
    countOne: string;
    countMany: string;
    notListed: string;
    notListedCta: string;
    categories: EquipmentCategory[];
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
    valuesHeading: string;
    values: { title: string; body: string }[];
    teamHeading: string;
    teamBody: string;
    sisterHeading: string;
    sisterBody: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    body: string;
    items: FaqItem[];
    stillHave: string;
    stillHaveCta: string;
  };
  form: {
    eyebrow: string;
    heading: string;
    body: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    amount: string;
    amountPlaceholder: string;
    service: string;
    servicePlaceholder: string;
    comments: string;
    commentsPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    successAgain: string;
    /* Shown instead of successBody on the static demo build, which has no API. */
    demoBody: string;
    errorTitle: string;
    errorBody: string;
    required: string;
    invalidEmail: string;
    privacy: string;
    amountRanges: string[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    body: string;
    phoneLabel: string;
    emailLabel: string;
    officeLabel: string;
    office: string;
    hoursLabel: string;
    hours: string;
    responseLabel: string;
    response: string;
  };
  footer: {
    tagline: string;
    blurb: string;
    solutionsHeading: string;
    companyHeading: string;
    contactHeading: string;
    rights: string;
    hosted: string;
    prototypeNotice: string;
  };
};
