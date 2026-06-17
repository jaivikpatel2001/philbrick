"use client";
import { useEffect, useRef, useState } from "react";

interface Options {
  duration?: number;
  decimals?: number;
  start?: boolean;
}

/** Animate a number from 0 → target with an ease-out curve, once `start` is true. */
export function useCountUp(
  target: number,
  { duration = 1800, decimals = 0, start = true }: Options = {}
): string {
  const [value, setValue] = useState(0);
  const frame = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    if (!start || done.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      done.current = true;
      return;
    }
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        done.current = true;
      }
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, start]);

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
