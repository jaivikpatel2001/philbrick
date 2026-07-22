"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
 * Lenis smooth scroll wired into the GSAP ticker + ScrollTrigger.
 * Respects prefers-reduced-motion (falls back to native scroll).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

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
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Reset scroll position + refresh triggers on route change.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  /* Framer animations across the app respect prefers-reduced-motion (transform
     + layout). Height-based collapses are handled explicitly via lib/motion. */
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
