"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** Pause/resume the global smooth scroll (used by Drawer / Modal). */
export function stopLenis() {
  lenisInstance?.stop();
}
export function startLenis() {
  lenisInstance?.start();
}

/**
 * Scroll the page back to the top. Uses Lenis when it is running so the motion
 * matches the rest of the site, and falls back to native smooth scrolling when
 * Lenis is disabled (reduced motion) or not yet mounted.
 */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.1 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Lenis smooth scroll, driven by Lenis's own requestAnimationFrame loop
 * (`autoRaf`). Respects prefers-reduced-motion (falls back to native scroll).
 *
 * PERFORMANCE NOTE (2026-07-25): this used to run the Lenis frame through the
 * GSAP ticker and push every scroll event into `ScrollTrigger.update()`. No
 * ScrollTrigger animation was ever registered anywhere in the app, so GSAP core
 * + the ScrollTrigger plugin (~60 KB gzip) shipped on every page purely to host
 * a rAF callback that Lenis already provides. Same scroll feel, no GSAP.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      anchors: true,
      autoRaf: true,
    });
    lenisInstance = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Reset scroll position on route change.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
  }, [pathname]);

  /* Framer animations across the app respect prefers-reduced-motion (transform
     + layout). Height-based collapses are handled explicitly via lib/motion. */
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
