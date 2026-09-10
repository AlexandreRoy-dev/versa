"use client";

import type { ElementType, ReactNode } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "left" | "right" | "scale" | "fade";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Direction the element travels from. Defaults to the house fade-up. */
  variant?: RevealVariant;
  /** Seconds of delay, used to stagger members of a group. */
  delay?: number;
  as?: ElementType;
};

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn("anim-in", className)}
      data-reveal={variant}
      style={delay ? { "--reveal-delay": `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
