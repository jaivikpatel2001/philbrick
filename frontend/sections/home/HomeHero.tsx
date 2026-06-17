"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight, FiActivity, FiZap, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { HERO } from "@/data/images";
import styles from "./HomeHero.module.css";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const CHIPS = [
  { icon: FiActivity, label: "Pulse™ live", value: "1.2M sensors" },
  { icon: FiZap, label: "Energy use", value: "−50%" },
  { icon: FiShield, label: "Fleet uptime", value: "99.9%" },
];

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(`.${styles.bg}`, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: `.${styles.hero}`,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(`.${styles.glow}`, {
        yPercent: 40,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: `.${styles.hero}`,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section className={styles.hero} ref={root}>
      <Image
        src={HERO.home}
        alt="A modern skyscraper rising into the sky"
        fill
        priority
        quality={90}
        sizes="100vw"
        className={styles.bg}
      />
      <div className={styles.scrim} />
      <div className={styles.mesh} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <div className={`container--wide ${styles.inner}`}>
        <motion.div
          className={styles.content}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className={`eyebrow ${styles.eyebrow}`} variants={item}>
            <span className={styles.pulse} /> Intelligent vertical mobility
          </motion.span>

          <motion.h1 className={styles.title} variants={item}>
            Move people.
            <br />
            <span className="text-accent-gradient">Elevate cities.</span>
          </motion.h1>

          <motion.p className={styles.lead} variants={item}>
            VERTIQ designs, builds and maintains the intelligent elevators and
            escalators inside the world&apos;s most ambitious buildings — quieter,
            greener and endlessly connected.
          </motion.p>

          <motion.div className={styles.actions} variants={item}>
            <Button href="/products" size="lg" withArrow>
              Explore products
            </Button>
            <Button href="/technology" size="lg" variant="secondary">
              Our technology
            </Button>
          </motion.div>

          <motion.div className={styles.chips} variants={item}>
            {CHIPS.map((c) => (
              <div key={c.label} className={styles.chip}>
                <span className={styles.chipIcon}>
                  <c.icon />
                </span>
                <span>
                  <span className={styles.chipValue}>{c.value}</span>
                  <span className={styles.chipLabel}>{c.label}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <a href="#trust" className={styles.scroll} aria-label="Scroll to explore">
        <span>Scroll</span>
        <span className={styles.scrollLine} />
        <FiArrowRight className={styles.scrollArrow} />
      </a>
    </section>
  );
}
