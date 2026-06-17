"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useLockBody } from "@/hooks/useLockBody";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./ImageGallery.module.css";

export function ImageGallery({
  images,
  altPrefix = "Gallery image",
}: {
  images: string[];
  altPrefix?: string;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  useLockBody(lightbox !== null);

  return (
    <>
      <div className={styles.gallery}>
        <Swiper
          modules={[Navigation, Keyboard, A11y]}
          navigation={{
            prevEl: `.${styles.prev}`,
            nextEl: `.${styles.next}`,
          }}
          keyboard
          slidesPerView={1.05}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 1.4, spaceBetween: 24 },
            1200: { slidesPerView: 1.6, spaceBetween: 28 },
          }}
          centeredSlides
          loop
          className={styles.swiper}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              <button
                className={styles.imgBtn}
                onClick={() => setLightbox(i)}
                aria-label={`Open ${altPrefix} ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${altPrefix} ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={styles.img}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.controls}>
          <button className={styles.prev} aria-label="Previous">
            <FiChevronLeft />
          </button>
          <button className={styles.next} aria-label="Next">
            <FiChevronRight />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className={styles.close} aria-label="Close">
              <FiX />
            </button>
            <motion.div
              className={styles.lightImg}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
            >
              <Image
                src={images[lightbox]}
                alt={`${altPrefix} ${lightbox + 1}`}
                fill
                sizes="90vw"
                className={styles.img}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
