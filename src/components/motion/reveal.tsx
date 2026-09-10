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

/**
 * Wraps a group so its children enter one after another. The house stagger is
 * 0.3s; tighter values suit long lists where 0.3s would drag.
 */
export function RevealGroup({
  children,
  className,
  itemClassName,
  stagger = 0.3,
  variant = "up",
  startDelay = 0,
  as: Tag = "div",
}: {
  children: ReactNode[];
  className?: string;
  /** Applied to each wrapper, which becomes the grid or flex item. */
  itemClassName?: string;
  stagger?: number;
  variant?: RevealVariant;
  startDelay?: number;
  as?: ElementType;
}) {
  return (
    <Tag className={className}>
      {children.map((child, index) => (
        <Reveal
          key={index}
          className={itemClassName}
          variant={variant}
          delay={startDelay + index * stagger}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
