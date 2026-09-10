"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import { Chevron } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/content";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function EquipmentExplorer({ dict }: { dict: Dictionary }) {
  const [sector, setSector] = useState<string>("__all");
  const [query, setQuery] = useState("");
  const categories = dict.equipment.categories;

  const sectors = useMemo(
    () => Array.from(new Set(categories.map((item) => item.sector))).sort(),
    [categories],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return categories.filter((item) => {
      const matchesSector = sector === "__all" || item.sector === sector;
      const matchesQuery =
        needle.length === 0 ||
        item.name.toLowerCase().includes(needle) ||
        item.examples.toLowerCase().includes(needle) ||
        item.sector.toLowerCase().includes(needle);
      return matchesSector && matchesQuery;
    });
  }, [categories, sector, query]);

  const countLabel =
    filtered.length === 1
      ? dict.equipment.countOne
      : dict.equipment.countMany.replace("{n}", String(filtered.length));

  return (
    <div>
      <Reveal>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={dict.equipment.filterLabel}
          >
            <FilterChip
              active={sector === "__all"}
              onClick={() => setSector("__all")}
            >
              {dict.equipment.filterAll}
            </FilterChip>
            {sectors.map((item) => (
              <FilterChip
                key={item}
                active={sector === item}
                onClick={() => setSector(item)}
              >
                {item}
              </FilterChip>
            ))}
          </div>

          <div className="relative lg:w-72">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.equipment.searchPlaceholder}
              aria-label={dict.equipment.searchPlaceholder}
              className="h-11 pl-10"
            />
          </div>
        </div>
      </Reveal>

      <p
        className="text-muted-foreground mt-6 text-sm tabular-nums"
        aria-live="polite"
      >
        {countLabel}
      </p>

      {filtered.length === 0 ? (
        <div className="border-border mt-8 rounded-2xl border border-dashed px-8 py-16 text-center">
          <p className="text-navy-900 font-medium">{dict.equipment.empty}</p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              setQuery("");
              setSector("__all");
            }}
          >
            {dict.equipment.filterAll}
          </Button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <li key={item.slug}>
              <Reveal delay={Math.min(index, 5) * 0.09} className="h-full">
                <article className="group border-border hover:border-navy-700 relative h-full overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-500 ease-brand hover:-translate-y-1 hover:shadow-[0_16px_44px_-24px_rgba(19,55,86,0.4)]">
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 opacity-0 transition-opacity duration-700 ease-brand group-hover:opacity-[0.07]"
                    aria-hidden
                  >
                    <Chevron className="h-40 w-auto" />
                  </div>
                  <div className="relative">
                    <span className="eyebrow text-brand-600">
                      {item.sector}
                    </span>
                    <h3 className="text-navy-900 mt-3 text-lg leading-snug font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                      {item.examples}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <Reveal delay={0.1}>
        <div className="border-border mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed px-7 py-6">
          <p className="text-navy-900 text-sm font-medium">
            {dict.equipment.notListed}
          </p>
          <Button asChild variant="outline" className="hover:border-navy-700">
            <Link href={routes.contact(dict.locale)}>
              {dict.equipment.notListedCta}
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-brand",
        active
          ? "border-navy-800 bg-navy-800 text-white"
          : "border-border text-muted-foreground hover:border-navy-700 hover:text-navy-900 bg-white",
      )}
    >
      {children}
    </button>
  );
}
