import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/content";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/*
  Sourced from the logo file Versa Capital published with their January 2026
  identity. The navy field was keyed out so the mark can sit on any surface;
  the dark variant recolours the wordmark for light backgrounds.
*/
const ASPECT = 2074 / 558;

export function Logo({
  locale,
  tone = "light",
  className,
  height = 34,
}: {
  locale: Locale;
  tone?: "light" | "dark";
  className?: string;
  height?: number;
}) {
  return (
    <Link
      href={routes.home(locale)}
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity duration-300 ease-brand hover:opacity-80",
        className,
      )}
      aria-label="Versa Capital"
    >
      <Image
        src={
          tone === "light"
            ? "/brand/versa-logo-light.png"
            : "/brand/versa-logo-dark.png"
        }
        alt="Versa Capital"
        width={Math.round(height * ASPECT)}
        height={height}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}

/**
 * The four-step chevron pulled off the logo, reused as a section marker and
 * as large-scale background geometry.
 */
export function Chevron({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  // Stripes shift right as they descend, matching the slant of the logo mark.
  const WIDTH = 13;
  const SLANT = 22;
  const HEIGHT = 60;
  const fills = [
    "var(--vc-blue-300)",
    "var(--vc-blue-500)",
    "var(--vc-blue-600)",
    "var(--vc-navy-700)",
  ];

  return (
    <svg
      viewBox={`0 0 ${fills.length * WIDTH + SLANT} ${HEIGHT}`}
      aria-hidden
      className={cn("block", className)}
      fill="none"
    >
      {fills.map((fill, index) => {
        const left = index * WIDTH;
        const right = left + WIDTH;
        return (
          <path
            key={fill}
            d={`M${left} 0 H${right} L${right + SLANT} ${HEIGHT} H${left + SLANT} Z`}
            fill={fill}
            className={animate ? "anim-in" : undefined}
            data-reveal={animate ? "up" : undefined}
            data-reveal-follow={animate ? "" : undefined}
            style={
              animate
                ? ({
                    "--reveal-delay": `${index * 0.09}s`,
                  } as React.CSSProperties)
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}
