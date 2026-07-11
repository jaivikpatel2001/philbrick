"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRY_IMG } from "@/data/images";
import { cn } from "@/utils/cn";
import styles from "./IndustriesShowcase.module.css";

/* Application sectors elevators (and Philbrick components) serve. */
const INDUSTRIES = [
  { name: "Residential", tagline: "Homes, villas & residential towers", img: INDUSTRY_IMG.residential },
  { name: "Commercial", tagline: "Offices, retail & mixed use", img: INDUSTRY_IMG.commercial },
  { name: "Healthcare", tagline: "Hospitals, clinics & critical care", img: INDUSTRY_IMG.healthcare },
  { name: "Hospitality", tagline: "Hotels, resorts & leisure", img: INDUSTRY_IMG.hospitality },
  { name: "Industrial", tagline: "Warehouses, plants & logistics", img: INDUSTRY_IMG.industrial },
  { name: "Institutional", tagline: "Schools, campuses & public buildings", img: INDUSTRY_IMG.institutional },
  { name: "Transit", tagline: "Stations, metros & transport hubs", img: INDUSTRY_IMG.transit },
];

export function IndustriesShowcase() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scrollByCards(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollByCards(-1); }
  };

  return (
    <section id="industries" className="section">
      <div className="container--wide">
        <SectionHeader
          eyebrow="04 Applications"
          title="Components for every kind of building."
          description="From homes and offices to hospitals and industrial sites, Philbrick components go into the elevators that serve every kind of building."
          action={
            <div className={styles.arrows} role="group" aria-label="Carousel controls">
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollByCards(-1)}
                disabled={!canPrev}
                aria-label="Previous applications"
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollByCards(1)}
                disabled={!canNext}
                aria-label="Next applications"
              >
                <FiChevronRight />
              </button>
            </div>
          }
        />
      </div>

      <ul
        ref={trackRef}
        className={styles.track}
        aria-label="Application sectors"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {INDUSTRIES.map((it, i) => (
          <li key={it.name} className={styles.card} data-card>
            <Link href="/products" className={styles.link}>
              <Image
                src={it.img}
                alt={it.name}
                fill
                sizes="(max-width: 640px) 78vw, 340px"
                className={styles.img}
              />
              <span className={styles.shade} aria-hidden />
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.body}>
                <span className={styles.name}>{it.name}</span>
                <span className={styles.tagline}>{it.tagline}</span>
                <span className={styles.cta}>
                  Explore solutions <FiArrowUpRight />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
