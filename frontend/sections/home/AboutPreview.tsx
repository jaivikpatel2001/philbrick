import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { MISC } from "@/data/images";
import styles from "./AboutPreview.module.css";

export function AboutPreview() {
  return (
    <section className="section">
      <div className="container--wide">
        <span className="eyebrow" data-reveal="up">
          01 Who we are
        </span>
        <h2 className={styles.statement} data-reveal="up">
          Engineering elevator
          <br />
          <em>solutions</em> since 1992.
        </h2>

        <div className={styles.grid}>
          <div className={styles.content}>
            <p className={styles.text} data-reveal="up">
              Philbrick Technologies began in Ahmedabad with a focus on the
              systems that make an elevator work: control, safety, doors and
              signalling. Three decades on, we manufacture a complete range of
              elevator components in-house and supply them across India and
              export markets.
            </p>

            <div className={styles.stats} data-reveal="up">
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  <Counter value={30} suffix="+" />
                </span>
                <span className={styles.statLabel}>Years of engineering</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  <Counter value={14} />
                </span>
                <span className={styles.statLabel}>Product categories</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  <Counter value={5} />
                </span>
                <span className={styles.statLabel}>In-house units</span>
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
              src={MISC.factory}
              alt="Philbrick engineering facility"
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
              className={styles.img}
            />
            <figcaption className={styles.caption}>
              Philbrick · engineering since 1992
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
