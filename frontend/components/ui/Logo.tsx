import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
  /** Show only the emblem mark (no wordmark) — for tight spaces. */
  compact?: boolean;
  /** Prioritise loading (use in the navbar). */
  priority?: boolean;
}

/**
 * Philbrick brand lockup. Uses the official logo (transparent PNG) so the
 * blue wordmark + red emblem read correctly on both light and dark themes.
 * `compact` renders just the emblem mark.
 */
export function Logo({ className, compact = false, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(styles.logo, className)}
      aria-label="Philbrick, home"
    >
      {compact ? (
        <Image
          src="/brand/philbrick-mark.png"
          alt="Philbrick"
          width={330}
          height={282}
          className={styles.mark}
          priority={priority}
        />
      ) : (
        <Image
          src="/brand/logo.png"
          alt="Philbrick, Providing Elevator Solutions"
          width={1277}
          height={286}
          className={styles.full}
          priority={priority}
        />
      )}
    </Link>
  );
}
