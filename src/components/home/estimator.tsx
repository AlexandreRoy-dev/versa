"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Dictionary, ProductSlug } from "@/content";
import {
  ESTIMATOR_BOUNDS,
  ILLUSTRATIVE_RATES,
  formatCurrency,
  formatPercent,
  monthlyPayment,
} from "@/lib/finance";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Estimator({ dict }: { dict: Dictionary }) {
  const locale = dict.locale;
  const [amount, setAmount] = useState<number>(ESTIMATOR_BOUNDS.defaultAmount);
  const [termIndex, setTermIndex] = useState<number>(
    ESTIMATOR_BOUNDS.terms.indexOf(ESTIMATOR_BOUNDS.defaultTerm),
  );
  const [product, setProduct] = useState<ProductSlug>("credit-bail");

  const term = ESTIMATOR_BOUNDS.terms[termIndex];
  const rate = ILLUSTRATIVE_RATES[product];

  const { payment, total } = useMemo(() => {
    const value = monthlyPayment(amount, rate, term);
    return { payment: value, total: value * term };
  }, [amount, rate, term]);

  const activeProduct = dict.products.items.find(
    (item) => item.slug === product,
  );

  // Factoring is priced off receivables, so an amortized figure would mislead.
  const showsPayment = product !== "affacturage";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div>
        <div className="space-y-9">
          <Reveal>
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <Label className="text-navy-900 text-sm font-medium">
                  {dict.estimator.amountLabel}
                </Label>
                <output className="font-heading text-navy-900 text-xl font-semibold tabular-nums">
                  {formatCurrency(amount, locale)}
                </output>
              </div>
              <Slider
                className="mt-5"
                value={[amount]}
                min={ESTIMATOR_BOUNDS.minAmount}
                max={ESTIMATOR_BOUNDS.maxAmount}
                step={ESTIMATOR_BOUNDS.amountStep}
                onValueChange={([next]) => setAmount(next)}
                aria-label={dict.estimator.amountLabel}
              />
              <div className="text-muted-foreground mt-2 flex justify-between text-xs tabular-nums">
                <span>{formatCurrency(ESTIMATOR_BOUNDS.minAmount, locale)}</span>
                <span>{formatCurrency(ESTIMATOR_BOUNDS.maxAmount, locale)}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <Label className="text-navy-900 text-sm font-medium">
                  {dict.estimator.termLabel}
                </Label>
                <output className="font-heading text-navy-900 text-xl font-semibold tabular-nums">
                  {term} {dict.estimator.months}
                </output>
              </div>
              <Slider
                className="mt-5"
                value={[termIndex]}
                min={0}
                max={ESTIMATOR_BOUNDS.terms.length - 1}
                step={1}
                onValueChange={([next]) => setTermIndex(next)}
                aria-label={dict.estimator.termLabel}
              />
              <div className="text-muted-foreground mt-2 flex justify-between text-xs tabular-nums">
                <span>
                  {ESTIMATOR_BOUNDS.terms[0]} {dict.estimator.months}
                </span>
                <span>
                  {ESTIMATOR_BOUNDS.terms[ESTIMATOR_BOUNDS.terms.length - 1]}{" "}
                  {dict.estimator.months}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div>
              <Label className="text-navy-900 text-sm font-medium">
                {dict.estimator.productLabel}
              </Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {dict.products.items.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setProduct(item.slug)}
                    aria-pressed={product === item.slug}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-brand",
                      product === item.slug
                        ? "border-navy-800 bg-navy-800 text-white"
                        : "border-border text-muted-foreground hover:border-navy-700 hover:text-navy-900 bg-white",
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.18} variant="scale">
        <div className="bg-navy-900 relative isolate overflow-hidden rounded-2xl p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            aria-hidden
            style={{
              background:
                "radial-gradient(120% 80% at 100% 0%, rgba(27,165,222,0.55) 0%, rgba(27,165,222,0) 60%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow text-brand-300">
              {dict.estimator.resultLabel}
            </p>

            {showsPayment ? (
              <>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
                  <span className="font-heading text-5xl font-semibold text-white tabular-nums md:text-6xl">
                    {formatCurrency(payment, locale, { decimals: false })}
                  </span>
                  <span className="text-base text-white/50">
                    {dict.estimator.perMonth}
                  </span>
                </p>

                <dl className="mt-9 space-y-4 border-t border-white/10 pt-7 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-white/50">
                      {dict.estimator.totalLabel}
                    </dt>
                    <dd className="font-medium text-white tabular-nums">
                      {formatCurrency(total, locale)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-white/50">
                      {dict.estimator.rateLabel}
                    </dt>
                    <dd className="font-medium text-white tabular-nums">
                      {formatPercent(rate, locale)}
                      <span className="ml-2 text-xs font-normal text-white/35">
                        {dict.estimator.rateNote}
                      </span>
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="font-heading mt-5 text-2xl leading-snug text-white">
                {activeProduct?.estimatorNote}
              </p>
            )}

            {showsPayment && activeProduct ? (
              <p className="mt-6 text-sm leading-relaxed text-white/45">
                {activeProduct.estimatorNote}
              </p>
            ) : null}

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-white/5 p-4">
              <Info
                className="text-brand-300 mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              <p className="text-xs leading-relaxed text-white/50">
                {dict.estimator.disclaimer}
              </p>
            </div>

            <Button
              asChild
              className="bg-brand-500 text-navy-950 hover:bg-brand-400 group mt-7 h-11 w-full"
            >
              <Link href={routes.contact(locale)}>
                {dict.estimator.cta}
                <ArrowRight className="ml-1 size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
