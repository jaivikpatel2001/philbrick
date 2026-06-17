import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import type { Service } from "@/types";
import { getIcon } from "@/lib/icons";
import styles from "./ServiceCard.module.css";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = getIcon(service.iconName);
  return (
    <Link
      href={`/services/${service.slug}`}
      className={styles.card}
      data-reveal="up"
    >
      <div className={styles.top}>
        <span className={styles.icon}>
          <Icon />
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
      <span className={styles.cta}>
        Learn more <FiArrowRight />
      </span>
    </Link>
  );
}
