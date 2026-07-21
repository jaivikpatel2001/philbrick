import { TRUST_BADGES } from "./corporateData";
import styles from "./corporate.module.css";

/* Shared trust row for the corporate hero variants. `className` lets each
   variant attach its own load-animation delay; `only` lets a variant show a
   subset (by `stat`) without forking the shared data — variant16 runs just two
   badges on client direction. */
export function TrustBadges({
  className,
  only,
}: {
  className?: string;
  only?: readonly string[];
}) {
  const badges = only
    ? TRUST_BADGES.filter((b) => only.includes(b.stat))
    : TRUST_BADGES;

  return (
    <dl className={`${styles.trust} ${className ?? ""}`}>
      {badges.map((b) => (
        <div key={b.stat} className={styles.badge}>
          <dt className={styles.badgeStat}>{b.stat}</dt>
          <dd className={styles.badgeLabel}>{b.label}</dd>
        </div>
      ))}
    </dl>
  );
}
