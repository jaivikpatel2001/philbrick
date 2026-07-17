"use client";
import dynamic from "next/dynamic";
import styles from "./variants.module.css";

/* Client-only, code-split entry for the Variant 4 Three.js hero. */
const Variant4Scene = dynamic(
  () => import("./Variant4Scene").then((m) => m.Variant4Scene),
  { ssr: false, loading: () => <div className={styles.loadingShell} aria-hidden /> }
);

export function Variant4Hero() {
  return <Variant4Scene />;
}
