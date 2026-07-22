"use client";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { scrollToTop } from "@/components/providers/SmoothScroll";
import styles from "./FloatingActions.module.css";

/* =============================================================================
   FLOATING ACTION BUTTON (bottom-right)

   Scroll to top — appears once the visitor is past one viewport, and returns to
   the top through Lenis so the motion matches the rest of the site.

   There is no chat button here any more: the site used to draw its own and hide
   Tawk's, but on client direction Tawk's own launcher is now the chat control.
   That also removed the reason for the drag behaviour, which only ever existed
   to let the visitor park the site's chat button.
   ========================================================================== */

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  /* Reveal past one viewport height. */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.dock}>
      <button
        type="button"
        className={`${styles.fab} ${styles.top} ${showTop ? styles.visible : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
      >
        <FiArrowUp aria-hidden />
      </button>
    </div>
  );
}
