import type { CSSProperties } from "react";
import type { TimelineItem } from "@/types";
import { cn } from "@/utils/cn";
import styles from "./Timeline.module.css";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(styles.item, item.milestone && styles.milestone)}
          data-reveal="left"
          style={{ "--reveal-delay": `${i * 0.05}s` } as CSSProperties}
        >
          <div className={styles.marker}>
            <span className={styles.dot} />
          </div>
          <div className={styles.content}>
            <span className={styles.year}>{item.year}</span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.desc}>{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
