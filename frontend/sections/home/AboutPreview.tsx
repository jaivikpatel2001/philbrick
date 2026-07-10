import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { HERO, MISC } from "@/data/images";
import styles from "./AboutPreview.module.css";

export function AboutPreview() {
  return (
    <section className="section">
      <div className={`container--wide ${styles.grid}`}>
        <div className={styles.media} data-reveal="left">
          <Image
            src={HERO.about}
            alt="VERTIQ engineering, a luminous building atrium"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.img}
          />
          <div className={styles.floatCard}>
            <Image src={MISC.factory} alt="" fill sizes="220px" className={styles.floatImg} />
            <div className={styles.floatBody}>
              <span className={styles.floatValue}>
                <Counter value={1968} />
              </span>
              <span className={styles.floatLabel}>Engineering since</span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <span className="eyebrow" data-reveal="up">
            Who we are
          </span>
          <h2 className={styles.title} data-reveal="up">
            Fifty-seven years of moving the world upward.
          </h2>
          <p className={styles.text} data-reveal="up">
            VERTIQ began with one conviction: that the elevator, the most used
            vehicle on earth, deserved to be engineered like the most advanced
            one. Today our systems carry millions of people every day, from
            family homes to the world&apos;s tallest towers.
          </p>

          <div className={styles.miniStats} data-reveal="up">
            <div>
              <span className={styles.miniValue}>
                <Counter value={1.4} decimals={1} suffix="M" />
              </span>
              <span className={styles.miniLabel}>Units in service</span>
            </div>
            <div>
              <span className={styles.miniValue}>
                <Counter value={40} suffix="+" />
              </span>
              <span className={styles.miniLabel}>Countries</span>
            </div>
            <div>
              <span className={styles.miniValue}>
                <Counter value={1200} suffix="+" />
              </span>
              <span className={styles.miniLabel}>Engineers</span>
            </div>
          </div>

          <div data-reveal="up">
            <Button href="/about" variant="secondary" withArrow>
              Our story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
