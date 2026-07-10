"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { PROJECT_IMG } from "@/data/images";
import styles from "./Projects.module.css";

const PROJECTS = [
  {
    title: "Lodha Marquise",
    location: "Mumbai, Maharashtra",
    sector: "Supertall Residential",
    year: "2024",
    units: "42 cars · 8 m/s",
    img: PROJECT_IMG.one,
  },
  {
    title: "Prestige Financial Hub",
    location: "Bengaluru, Karnataka",
    sector: "Commercial",
    year: "2023",
    units: "36 cars · destination dispatch",
    img: PROJECT_IMG.two,
  },
  {
    title: "Taj Skyline",
    location: "Hyderabad, Telangana",
    sector: "Hospitality",
    year: "2023",
    units: "18 cars · panoramic glass",
    img: PROJECT_IMG.three,
  },
  {
    title: "Apollo Medicity",
    location: "Chennai, Tamil Nadu",
    sector: "Healthcare",
    year: "2022",
    units: "24 cars · medical priority",
    img: PROJECT_IMG.four,
  },
];

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray<HTMLElement>(`.${styles.media} img`).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(`.${styles.row}`),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="projects" className={`section ${styles.section}`} ref={root}>
      <div className="container--wide">
        <header className={styles.head} data-reveal>
          <span className="eyebrow">04 — Projects</span>
          <h2 className={styles.title}>
            The buildings that{" "}
            <span className="text-accent-gradient">define skylines.</span>
          </h2>
        </header>

        <div className={styles.list}>
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className={styles.row}
              data-reveal={i % 2 === 0 ? "right" : "left"}
            >
              <div className={styles.media}>
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
                <span className={styles.index}>0{i + 1}</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.projTitle}>{p.title}</h3>
                <p className={styles.sector}>{p.sector}</p>
                <dl className={styles.meta}>
                  <div>
                    <dt>Location</dt>
                    <dd>{p.location}</dd>
                  </div>
                  <div>
                    <dt>Delivered</dt>
                    <dd>{p.year}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{p.units}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.foot} data-reveal>
          <Button href="/contact" size="lg" withArrow>
            Start your project
          </Button>
        </div>
      </div>
    </section>
  );
}
