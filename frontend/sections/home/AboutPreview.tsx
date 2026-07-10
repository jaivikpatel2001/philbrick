import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { HERO } from "@/data/images";
import styles from "./AboutPreview.module.css";

export function AboutPreview() {
  return (
    <section className="section">
      <div className="container--wide">
        <span className="eyebrow" data-reveal="up">
          01 — Who we are
        </span>
        <h2 className={styles.statement} data-reveal="up">
          Fifty-seven years of moving
          <br />
          the world <em>upward.</em>
        </h2>

        <div className={styles.grid}>
          <div className={styles.content}>
            <p className={styles.text} data-reveal="up">
              VERTIQ began with one conviction: that the elevator, the most
              used vehicle on earth, deserved to be engineered like the most
              advanced one. Today our systems carry millions of people every
              day, from family homes to the country&apos;s tallest towers.
            </p>

            <div className={styles.stats} data-reveal="up">
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  <Counter value={1.4} decimals={1} suffix="M" />
                </span>
                <span className={styles.statLabel}>Units in service</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  <Counter value={40} suffix="+" />
                </span>
                <span className={styles.statLabel}>Countries</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  <Counter value={1200} suffix="+" />
                </span>
                <span className={styles.statLabel}>Engineers</span>
              </div>
            </div>

            <div data-reveal="up">
              <Button href="/about" variant="secondary" withArrow>
                Our story
              </Button>
            </div>
          </div>

          <figure className={styles.media} data-reveal="right">
            <Image
              src={HERO.about}
              alt="VERTIQ engineering, a luminous building atrium"
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
              className={styles.img}
            />
            <figcaption className={styles.caption}>
              VERTIQ works · engineering since 1968
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
