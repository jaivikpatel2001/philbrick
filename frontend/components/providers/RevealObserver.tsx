"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global IntersectionObserver that reveals any [data-reveal] element when it
 * enters the viewport. Cheap, dependency-free progressive enhancement that
 * works for server-rendered markup across every page.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
    );

    if (reduced) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    // Slight delay so freshly-navigated DOM is painted before observing.
    const id = window.setTimeout(() => {
      els.forEach((el) => observer.observe(el));
    }, 60);

    return () => {
      window.clearTimeout(id);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
