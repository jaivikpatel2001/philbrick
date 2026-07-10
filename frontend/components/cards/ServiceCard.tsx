import { createElement } from "react";
import { FiCheck } from "react-icons/fi";
import type { Service } from "@/types";
import { getIcon } from "@/lib/icons";
import styles from "./ServiceCard.module.css";

/**
 * Presentational lifecycle-support card (installation / maintenance /
 * modernization / AMC). Used by the home ServiceEcosystem section. Non-linking:
 * there is no dedicated services route — enquiries route through Contact.
 */
export function ServiceCard({ service }: { service: Service }) {
  const icon = getIcon(service.iconName);
  return (
    <article className={styles.card} data-reveal="up">
      <div className={styles.top}>
        <span className={styles.icon}>
          {createElement(icon)}
        </span>
        <h3 className={styles.title}>{service.shortName}</h3>
      </div>
      <p className={styles.desc}>{service.tagline}</p>
      <ul className={styles.list}>
        {service.benefits.slice(0, 3).map((b) => (
          <li key={b.title}>
            <FiCheck className={styles.check} />
            {b.title}
          </li>
        ))}
      </ul>
    </article>
  );
}
