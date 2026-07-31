"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { EffectCoverflow, Pagination, Keyboard, A11y, Autoplay, Mousewheel } from "swiper/modules";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRY_IMG } from "@/data/images";
import styles from "./IndustriesShowcase.module.css";

import "swiper/css";
import "swiper/css/effect-coverflow";

/* Application sectors elevators (and philbrick components) serve. */
const INDUSTRIES = [
  { name: "Residential", tagline: "Homes, villas & residential towers", img: INDUSTRY_IMG.residential, alt: "Modern Indian residential high-rise apartment tower" },
  { name: "Commercial", tagline: "Offices, retail & mixed use", img: INDUSTRY_IMG.commercial, alt: "Sleek glass and steel commercial office tower" },
  { name: "Healthcare", tagline: "Hospitals, clinics & critical care", img: INDUSTRY_IMG.healthcare, alt: "Bright modern hospital corridor with a wide elevator lobby" },
  { name: "Hospitality", tagline: "Hotels, resorts & leisure", img: INDUSTRY_IMG.hospitality, alt: "Elegant modern Indian hotel lobby with a premium elevator entrance" },
  { name: "Industrial", tagline: "Warehouses, plants & logistics", img: INDUSTRY_IMG.industrial, alt: "Warehouse with a heavy-duty goods elevator and pallet racking" },
  { name: "Institutional", tagline: "Schools, campuses & public buildings", img: INDUSTRY_IMG.institutional, alt: "Modern institutional building with an accessible elevator lobby" },
  { name: "Transit", tagline: "Stations, metros & transport hubs", img: INDUSTRY_IMG.transit, alt: "Metro station concourse with escalators and a public elevator" },
];

/**
 * Applications showcase — a coverflow carousel (Swiper).
 *
 * The active application sits centre stage at full size and brightness; its
 * neighbours rotate back, shrink and dim, so the eye is led to the middle card.
 * Dots below and the flanking arrows drive it, alongside drag, trackpad/touch
 * swipe, keyboard arrows and a gentle autoplay that pauses on hover and is
 * switched off entirely under prefers-reduced-motion.
 *
 * The arrows call `slidePrev`/`slideNext` on the stored Swiper instance rather
 * than going through Swiper's Navigation module: the buttons live OUTSIDE
 * <Swiper>, and wiring external nav elements through the module (onBeforeInit or
 * element refs) bound unreliably here. Driving the instance directly is simpler
 * and always works; with loop enabled there are no disabled end-states to track.
 */
export function IndustriesShowcase() {
  const swiperRef = useRef<SwiperClass | null>(null);

  // Autoplay is configured ON in the Swiper props below so it actually STARTS at
  // init (enabling it later via a prop flip does not start Swiper's autoplay —
  // that was the bug). Here we only STOP it for visitors who asked for reduced
  // motion. Autoplay is a runtime behaviour, so the exported HTML is unaffected.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swiperRef.current?.autoplay?.stop();
    }
  }, []);

  return (
    <section id="industries" className="section">
      <div className="container--wide">
        <SectionHeader
          eyebrow="04 Applications"
          title="Components for every kind of building."
          description="From homes and offices to hospitals and industrial sites, philbrick components go into the elevators that serve every kind of building."
        />
      </div>

      <div className={styles.carousel}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          aria-label="Previous application"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <FiChevronLeft />
        </button>

        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          modules={[EffectCoverflow, Pagination, Keyboard, A11y, Autoplay, Mousewheel]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView={1.15}
          spaceBetween={14}
          coverflowEffect={{
            rotate: 6,
            stretch: 0,
            depth: 150,
            modifier: 1.9,
            scale: 0.9,
            slideShadows: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1.6, spaceBetween: 18 },
            1024: { slidesPerView: 2.2, spaceBetween: 22 },
            1440: { slidesPerView: 2.5, spaceBetween: 24 },
          }}
          pagination={{ el: `.${styles.dots}`, clickable: true }}
          keyboard={{ enabled: true }}
          /* Horizontal trackpad / wheel gestures scroll the carousel;
             `forceToAxis` keeps VERTICAL page scrolling working normally over it
             (so the carousel never traps the page's scroll). */
          mousewheel={{ forceToAxis: true }}
          /* Continuous 3s auto-advance that survives user interaction. Not paused
             on hover, per the client's request for a constant loop. Stopped only
             for reduced-motion users (see the effect above). */
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
          a11y={{
            prevSlideMessage: "Previous application",
            nextSlideMessage: "Next application",
          }}
          className={styles.swiper}
        >
          {INDUSTRIES.map((it, i) => (
            <SwiperSlide key={it.name} className={styles.slide}>
              <Link href="/products" className={styles.link}>
                <Image
                  src={it.img}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 640px) 82vw, 420px"
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
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          aria-label="Next application"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <FiChevronRight />
        </button>

        {/* Pagination lives here, BELOW the cards, rather than inside <Swiper>:
            Swiper's default in-container dots overlapped the card's CTA because
            the content-box wrapper ignores reserved bottom padding. Swiper fills
            this element with the bullets via the `el` selector above. */}
        <div className={styles.dots} />
      </div>
    </section>
  );
}
