"use client";
import dynamic from "next/dynamic";
import styles from "./ElevatorScene.module.css";

/**
 * Client-only, code-split entry point for the Three.js hero.
 *
 * The scene pulls in three.js + a stack of postprocessing passes — by far the
 * largest client chunk on the site. Loading it with next/dynamic (ssr: false)
 * keeps that chunk OFF the initial critical JS: it streams in behind the
 * elevator preloader instead of blocking first paint. The experience itself is
 * unchanged; only its loading strategy is optimised.
 *
 * A reserved 100vh shell (matching the hero's night background) prevents layout
 * shift while the chunk loads.
 */
const ElevatorScene = dynamic(
  () => import("./ElevatorScene").then((m) => m.ElevatorScene),
  { ssr: false, loading: () => <div className={styles.heroLoading} aria-hidden /> }
);

export function ElevatorHero() {
  return <ElevatorScene />;
}
