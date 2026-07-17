"use client";
import dynamic from "next/dynamic";
import styles from "./variants.module.css";

/* Client-only, code-split entry for the Variant 5 Three.js hero. */
const Variant5Scene = dynamic(
  () => import("./Variant5Scene").then((m) => m.Variant5Scene),
  { ssr: false, loading: () => <div className={styles.loadingShell} aria-hidden /> }
);

export function Variant5Hero() {
  return <Variant5Scene />;
}
