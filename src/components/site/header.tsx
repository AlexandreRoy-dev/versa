"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { contact, type Dictionary } from "@/content";
import { mainNav, routes, switchLocalePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Header({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const locale = dict.locale;
  const nav = mainNav(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const otherLocale = locale === "fr" ? "en" : "fr";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-brand",
        scrolled
          ? "bg-navy-900/92 border-b border-white/10 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-vc flex h-18 items-center justify-between gap-6 md:h-20">
        <Logo locale={locale} tone="light" height={30} />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ease-brand",
                  active
                    ? "text-white"
                    : "text-white/70 hover:text-white",
                )}
              >
                {dict.nav[item.key]}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-brand-500 transition-transform duration-300 ease-brand",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchLocalePath(pathname, otherLocale)}
            aria-label={dict.nav.switchLabel}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors duration-300 ease-brand hover:border-white/50 hover:text-white"
          >
            {dict.nav.switchTo}
          </Link>

          <a
            href={contact.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition-colors duration-300 ease-brand hover:text-white xl:flex"
          >
            <Phone className="size-3.5" aria-hidden />
            {dict.nav.callUs}
          </a>

          <Button
            asChild
            className="hidden bg-brand-500 text-navy-950 hover:bg-brand-400 sm:inline-flex"
          >
            <Link href={routes.contact(locale)}>{dict.hero.primaryCta}</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 ease-brand hover:border-white/50 lg:hidden"
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "bg-navy-950/98 overflow-hidden backdrop-blur-xl transition-[max-height,opacity] duration-500 ease-brand lg:hidden",
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container-vc flex flex-col gap-1 py-5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-heading rounded-lg px-3 py-3 text-lg transition-colors duration-300 ease-brand",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:bg-white/5 hover:text-white",
              )}
            >
              {dict.nav[item.key]}
            </Link>
          ))}
          <a
            href={contact.phoneHref}
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 text-lg text-brand-300"
          >
            <Phone className="size-4" aria-hidden />
            {dict.nav.callUs}
          </a>
        </nav>
      </div>
    </header>
  );
}
