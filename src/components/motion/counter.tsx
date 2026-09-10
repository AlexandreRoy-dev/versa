"use client";

import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/content";
import { formatNumber } from "@/lib/finance";
import { cn } from "@/lib/utils";

/**
 * Counts up once the figure scrolls into view. The live site ships these as a
 * static 0, which reads as "no partners" rather than as a proof point, so the
 * final value is always rendered on the server and the animation only
 * replaces it after mount.
 */
export function Counter({
  value,
  locale,
  suffix = "",
  duration = 1600,
  className,
  /** Years and similar identifiers should not be grouped as thousands. */
  plain = false,
}: {
  value: number;
  locale: Locale;
  suffix?: string;
  duration?: number;
  className?: string;
  plain?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let frame = 0;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        // easeOutQuad, matching the entrance easing's deceleration.
        const eased = 1 - (1 - progress) * (1 - progress);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            setDisplay(0);
            run();
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {plain ? display : formatNumber(display, locale)}
      {suffix}
    </span>
  );
}
