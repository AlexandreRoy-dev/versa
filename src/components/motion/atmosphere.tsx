"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The quiet perpetual layer behind the page. Two slow-drifting washes plus a
 * drifting grain, transform and opacity only. The pointer response is heavily
 * eased and capped at a few dozen pixels so it reads as atmosphere rather
 * than parallax.
 */
export function Atmosphere({
  className,
  tone = "light",
  /** Drops to a single wash. Used on plain white sections so the page keeps
   *  a sense of presence without stacking blurred layers on every band. */
  subtle = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  subtle?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      // Normalized to roughly -1..1, then capped to 26px of travel.
      target.x = (event.clientX / window.innerWidth - 0.5) * 2 * 26;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2 * 26;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.028;
      current.y += (target.y - current.y) * 0.028;
      node.style.setProperty("--pointer-x", `${current.x.toFixed(2)}px`);
      node.style.setProperty("--pointer-y", `${current.y.toFixed(2)}px`);
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const isDark = tone === "dark";

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ "--pointer-x": "0px", "--pointer-y": "0px" }}
    >
      <div
        className="atmosphere-orb absolute -top-[18%] -left-[10%] h-[46rem] w-[46rem] rounded-full blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(27,165,222,0.30) 0%, rgba(27,165,222,0) 68%)"
            : "radial-gradient(circle, rgba(27,165,222,0.16) 0%, rgba(27,165,222,0) 68%)",
          translate: "var(--pointer-x) var(--pointer-y)",
          "--orb-duration": "34s",
        }}
      />
      {subtle ? null : (
        <>
          <div
            className="atmosphere-orb absolute top-[22%] -right-[14%] h-[40rem] w-[40rem] rounded-full blur-3xl"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(20,70,124,0.42) 0%, rgba(20,70,124,0) 70%)"
                : "radial-gradient(circle, rgba(151,211,242,0.28) 0%, rgba(151,211,242,0) 70%)",
              translate:
                "calc(var(--pointer-x) * -0.6) calc(var(--pointer-y) * -0.6)",
              "--orb-duration": "27s",
              "--orb-delay": "-9s",
            }}
          />
          <div
            className="atmosphere-sheen absolute bottom-[-20%] left-[18%] h-[34rem] w-[54rem] rounded-full blur-3xl"
            style={{
              background: isDark
                ? "radial-gradient(ellipse, rgba(24,93,164,0.34) 0%, rgba(24,93,164,0) 72%)"
                : "radial-gradient(ellipse, rgba(221,238,250,0.75) 0%, rgba(221,238,250,0) 72%)",
            }}
          />
          <div
            className="atmosphere-grain absolute -inset-[15%] opacity-[0.16] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
            }}
          />
        </>
      )}
    </div>
  );
}
