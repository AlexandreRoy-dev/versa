"use client";

import { useEffect } from "react";

const DURATION = 800;
const HEADER_OFFSET = 88;

/**
 * In-page anchor navigation, eased over ~800ms with a header offset so the
 * target does not land underneath the fixed bar. Native smooth scrolling is
 * left alone when the visitor asks for reduced motion.
 */
export function SmoothAnchor() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      const start = window.scrollY;
      const end =
        target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: end });
        return;
      }

      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / DURATION);
        // easeInOutCubic keeps long jumps from feeling abrupt at either end.
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo({ top: start + (end - start) * eased });
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
