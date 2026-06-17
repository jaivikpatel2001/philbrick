"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import type { Testimonial } from "@/types";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./TestimonialsCarousel.module.css";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className={styles.wrap}>
      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        slidesPerView={1}
        spaceBetween={24}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        breakpoints={{
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        className={styles.swiper}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i} className={styles.slide}>
            <TestimonialCard testimonial={t} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
