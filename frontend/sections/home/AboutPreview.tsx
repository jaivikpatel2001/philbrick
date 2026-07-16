import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { SECTION } from "@/data/images";
import styles from "./AboutPreview.module.css";

export function AboutPreview() {
  return (
    <section className="section">
      <div className="container--wide">
        <div className={styles.intro}>
          <span className="eyebrow" data-reveal="up">
            01 Who we are
          </span>
          <h2 className={styles.statement} data-reveal="up">
            Engineering elevator
            <br />
            <em>solutions</em> since 1992.
          </h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.content}>
            <p className={styles.text} data-reveal="up">
              Philbrick Controls India was founded in 1992 in Ahmedabad with a
              main focus on providing automation solutions by research and
              development and production of Control Instruments and Control
              Panels. We have a dedicated team with a special focus on Elevator
              Industry for providing Smarter, Safer and Simpler Control Panels
              and various accessories for the passenger lift.
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
              src={SECTION.whoWeAre}
              alt="Philbrick engineer assembling a stainless steel car operating panel"
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
