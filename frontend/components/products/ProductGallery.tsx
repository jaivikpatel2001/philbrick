"use client";
/* =============================================================================
   PRODUCT GALLERY

   The client's product photography ranges from a single studio shot to fifteen
   (COP/LOP has nine, Blower Fan fifteen), so the component adapts:
     1 image   -> plain framed image, no thumbnail strip, still zoomable
     2+ images -> main image + thumbnail strip with smooth cross-fade

   Interaction:
     • click / arrow keys move between shots
     • click the main image (or press Enter) opens a lightbox
     • lightbox traps focus, closes on Escape or backdrop click, and restores
       focus to the trigger

   All motion is guarded by prefers-reduced-motion.
   ========================================================================== */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";
import styles from "./ProductGallery.module.css";

interface Props {
  images: string[];
  /** Product name — drives the alt text, which must describe the product. */
  name: string;
  /** Only the first image of the first gallery on a page should be priority. */
  priority?: boolean;
}

export function ProductGallery({ images, name, priority = false }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const mainRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();

  const count = images.length;
  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + count) % count),
    [count]
  );

  /* lightbox: escape to close, arrows to page, focus moved to the close button */
  useEffect(() => {
    if (!zoomed) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomed, go]);

  /* returning from the lightbox puts focus back where it started */
  useEffect(() => {
    if (!zoomed) mainRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomed]);

  if (count === 0) return null;

  const alt = (i: number) =>
    count > 1 ? `${name} — view ${i + 1} of ${count}` : name;

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <button
          type="button"
          ref={mainRef}
          className={styles.mainButton}
          onClick={() => setZoomed(true)}
          aria-label={`Enlarge image of ${name}`}
        >
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === active ? alt(i) : ""}
              fill
              sizes="(max-width: 900px) 92vw, 46vw"
              priority={priority && i === 0}
              className={`${styles.mainImage} ${i === active ? styles.mainImageActive : ""}`}
              aria-hidden={i !== active}
            />
          ))}
          <span className={styles.zoomHint} aria-hidden>
            <FiMaximize2 />
          </span>
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={() => go(1)}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className={styles.thumbs} aria-label={`${name} images`}>
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === active}
              >
                <Image src={src} alt="" width={120} height={120} className={styles.thumbImage} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomed && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomed(false);
          }}
        >
          <p id={labelId} className={styles.lightboxTitle}>
            {name}
            {count > 1 && <span className={styles.lightboxCount}>{active + 1} / {count}</span>}
          </p>
          <button
            type="button"
            ref={closeRef}
            className={styles.lightboxClose}
            onClick={() => setZoomed(false)}
            aria-label="Close image viewer"
          >
            <FiX />
          </button>
          <div className={styles.lightboxStage}>
            <Image
              src={images[active]}
              alt={alt(active)}
              fill
              sizes="90vw"
              className={styles.lightboxImage}
            />
          </div>
          {count > 1 && (
            <>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev} ${styles.arrowLight}`}
                onClick={() => go(-1)}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext} ${styles.arrowLight}`}
                onClick={() => go(1)}
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
