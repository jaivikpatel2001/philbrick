import { ABOUT_MILESTONES } from "@/data/company";
import styles from "./HistoryTimeline.module.css";

/**
 * Graphical company history — a vertical timeline with a central spine and
 * alternating milestone cards on desktop, collapsing to a single left-aligned
 * rail on mobile. Theme-aware via tokens, reveal-animated, and fed by the
 * concise `ABOUT_MILESTONES` summaries (data/company.ts).
 */
export function HistoryTimeline() {
  return (
    <ol className={styles.timeline}>
      {ABOUT_MILESTONES.map((m, i) => (
        <li
          key={m.year + m.title}
          className={styles.item}
          data-reveal="up"
          style={{ transitionDelay: `${(i % 2) * 80}ms` }}
        >
          <span className={styles.node} aria-hidden />
          <div className={styles.card}>
            <span className={styles.year}>{m.year}</span>
            <h3 className={styles.title}>{m.title}</h3>
            <p className={styles.summary}>{m.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
