import { LogoMarquee } from "@/components/ui/LogoMarquee";
import styles from "./ClientMarquee.module.css";

export function ClientMarquee({
  label = "Trusted by the world's leading developers, operators and architects",
  items,
}: {
  label?: string;
  items: readonly string[];
}) {
  return (
    <section className={styles.wrap}>
      <div className="container--wide">
        <p className={styles.label} data-reveal="fade">
          {label}
        </p>
        <LogoMarquee items={items} />
      </div>
    </section>
  );
}
