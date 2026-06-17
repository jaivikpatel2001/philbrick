import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className="container--narrow">
        <span className="eyebrow">Error 404</span>
        <h1 className={styles.title}>This floor doesn&apos;t exist.</h1>
        <p className={styles.text}>
          The page you&apos;re looking for may have moved or never existed.
          Let&apos;s get you back on track.
        </p>
        <div className={styles.actions}>
          <Button href="/" withArrow>
            Back to home
          </Button>
          <Button href="/products" variant="secondary">
            Browse products
          </Button>
        </div>
      </div>
    </section>
  );
}
