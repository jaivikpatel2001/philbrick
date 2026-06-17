import type { ElementType, CSSProperties } from "react";
import { cn } from "@/utils/cn";

type RevealVariant = "up" | "fade" | "left" | "right" | "scale";

interface RevealProps {
  children: React.ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * SSR-friendly scroll reveal. Emits a `[data-reveal]` element that the global
 * RevealObserver animates into view. No client JS shipped per-instance.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  style,
}: RevealProps) {
  return (
    <Tag
      data-reveal={variant}
      className={cn(className)}
      style={{ ...style, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
