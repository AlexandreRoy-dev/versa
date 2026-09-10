"use client";

import { useEffect, useRef } from "react";

/**
 * Releases an element's entrance once it is meaningfully in view.
 *
 * The house threshold is 0.5, which works for normal blocks but never fires
 * for anything taller than half the viewport. For those we scale the
 * threshold down to whatever fraction of the element can actually be on
 * screen at once, so tall sections still animate.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /*
      Descendants marked data-reveal-follow ride along with their container,
      which lets a single observer drive nested pieces such as the chevron
      stripes or a connector line without giving each one its own observer.
    */
    const release = (target: Element) => {
      target.classList.add("is-revealed");
      target
        .querySelectorAll("[data-reveal-follow]")
        .forEach((child) => child.classList.add("is-revealed"));
    };

    if (typeof IntersectionObserver === "undefined") {
      release(node);
      return;
    }

    const viewport = window.innerHeight || 1;
    const height = node.getBoundingClientRect().height || 1;
    const threshold = Math.min(0.5, (viewport / height) * 0.4);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            release(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: Math.max(0.01, threshold) },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
