import type { Locale, ProductSlug } from "@/content";

/*
  Illustrative annual rates used only by the on-page estimator. They are not
  quotes: real pricing comes back from the institutions once a broker submits
  a file. Leasing sits lowest because the asset secures it; refinancing runs
  higher because the equipment is already owned and older on average.
*/
export const ILLUSTRATIVE_RATES: Record<ProductSlug, number> = {
  "credit-bail": 0.079,
  "pret-a-terme": 0.089,
  refinancement: 0.109,
  affacturage: 0.129,
};

export const ESTIMATOR_BOUNDS = {
  minAmount: 10_000,
  maxAmount: 750_000,
  amountStep: 5_000,
  terms: [12, 24, 36, 48, 60, 72, 84],
  defaultAmount: 125_000,
  defaultTerm: 48,
} as const;

/**
 * Standard amortized payment. Falls back to straight division when the rate
 * rounds to zero so the figure never becomes NaN.
 */
export function monthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (months <= 0) return 0;
  const monthlyRate = annualRate / 12;
  if (monthlyRate <= 0) return principal / months;
  const growth = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  options: { decimals?: boolean } = {},
): string {
  const { decimals = false } = options;
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA").format(
    value,
  );
}

export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
