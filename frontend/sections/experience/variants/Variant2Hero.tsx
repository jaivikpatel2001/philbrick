"use client";
import dynamic from "next/dynamic";
import styles from "./variants.module.css";

/* Client-only, code-split entry for the Variant 2 Three.js hero (same loading
   strategy as ElevatorHero: the WebGL chunk stays off the critical JS path). */
const Variant2Scene = dynamic(
  () => import("./Variant2Scene").then((m) => m.Variant2Scene),
  { ssr: false, loading: () => <div className={styles.loadingShell} aria-hidden /> }
);

export function Variant2Hero() {
  return <Variant2Scene />;
}
