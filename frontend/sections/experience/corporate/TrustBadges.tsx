import { TRUST_BADGES } from "./corporateData";
import styles from "./corporate.module.css";

/* Shared trust row for the corporate hero variants. `className` lets each
   variant attach its own load-animation delay. */
export function TrustBadges({ className }: { className?: string }) {
  return (
    <dl className={`${styles.trust} ${className ?? ""}`}>
      {TRUST_BADGES.map((b) => (
        <div key={b.stat} className={styles.badge}>
          <dt className={styles.badgeStat}>{b.stat}</dt>
          <dd className={styles.badgeLabel}>{b.label}</dd>
        </div>
      ))}
    </dl>
  );
}
