import { cn } from "@/utils/cn";
import styles from "./LogoMarquee.module.css";

export function LogoMarquee({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn(styles.marquee, className)}>
      <div className={styles.track}>
        {row.map((name, i) => (
          <span key={i} className={styles.logo} aria-hidden={i >= items.length}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
