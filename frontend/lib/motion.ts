/* =============================================================================
   SHARED MOTION TIMING
   One source of truth for open/close interaction timing so every accordion,
   dropdown and collapsible panel feels consistent and premium (no random
   per-component durations). Pairs with the CSS tokens in styles/tokens.css.
   ========================================================================== */

/** Premium ease-out (matches CSS --ease-out). No bounce/overshoot. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Accordion / collapse open-close duration (seconds). */
export const ACCORDION_DURATION = 0.3;

/**
 * Framer transition for height+opacity collapse. Pass the value from
 * `useReducedMotion()` so the animation becomes instant when the user prefers
 * reduced motion (functionality is preserved, motion is removed).
 */
export function collapseTransition(reduce: boolean | null) {
  return { duration: reduce ? 0 : ACCORDION_DURATION, ease: EASE_OUT };
}

/** Standard collapse animation props for a Framer Motion element. */
export const collapseMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto" as const, opacity: 1 },
  exit: { height: 0, opacity: 0 },
};
