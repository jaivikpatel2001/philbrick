import Link from "next/link";
import { cn } from "@/utils/cn";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

/** VERTIQ wordmark with an elevator-shaft mark. Inherits currentColor. */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(styles.logo, className)}
      aria-label="VERTIQ, home"
    >
      <svg
        className={styles.mark}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="9"
          className={styles.markFrame}
        />
        <rect x="9" y="7" width="3" height="18" rx="1.5" className={styles.shaft} />
        <rect x="14.5" y="7" width="3" height="18" rx="1.5" className={styles.shaft} />
        <rect
          x="20"
          y="7"
          width="3"
          height="18"
          rx="1.5"
          className={styles.car}
        />
        <rect
          x="20"
          y="11"
          width="3"
          height="6"
          rx="1.5"
          className={styles.carLit}
        />
      </svg>
      {!compact && (
        <span className={styles.word}>
          VERTI<span className={styles.q}>Q</span>
        </span>
      )}
    </Link>
  );
}
