import type { Service } from "@/types";
import styles from "./ServiceCard.module.css";

/**
 * Lifecycle-support row (installation / maintenance / modernization / AMC) —
 * an indexed editorial entry on a hairline, not a boxed card. Used by the home
 * ServiceEcosystem section. Non-linking: there is no dedicated services route —
 * enquiries route through Contact.
 */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className={styles.row} data-reveal="up" style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}>
      <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.main}>
        <h3 className={styles.title}>{service.shortName}</h3>
        <p className={styles.desc}>{service.tagline}</p>
      </div>
      <ul className={styles.list}>
        {service.benefits.slice(0, 3).map((b) => (
          <li key={b.title}>{b.title}</li>
        ))}
      </ul>
    </article>
  );
}
