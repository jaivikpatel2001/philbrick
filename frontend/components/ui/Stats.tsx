import type { Stat } from "@/types";
import { Counter } from "./Counter";
import { cn } from "@/utils/cn";
import styles from "./Stats.module.css";

interface StatsProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "bordered" | "bare";
  className?: string;
}

export function Stats({
  stats,
  columns = 4,
  variant = "default",
  className,
}: StatsProps) {
  return (
    <div
      className={cn(styles.grid, styles[variant], className)}
      data-cols={columns}
      data-reveal="up"
    >
      {stats.map((s, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.value}>
            <Counter
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              decimals={s.decimals}
            />
          </div>
          <div className={styles.label}>{s.label}</div>
          {s.description && (
            <p className={styles.desc}>{s.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
