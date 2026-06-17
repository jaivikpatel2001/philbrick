"use client";
import { useEffect } from "react";

/** Lock body scroll while a modal/drawer is open (compensates scrollbar). */
export function useLockBody(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const scrollBarComp =
      window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollBarComp > 0) body.style.paddingRight = `${scrollBarComp}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [locked]);
}
