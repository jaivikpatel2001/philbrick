import { TRUST_BADGES } from "./corporateData";
import styles from "./corporate.module.css";

/* Trust row for the homepage hero (Variant18Hero). `className` attaches the
   hero's load-animation delay; `only` shows a subset (by `stat`) without
   forking the shared data — the hero runs just two badges on client direction. */
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
