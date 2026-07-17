"use client";
import dynamic from "next/dynamic";
import styles from "./variants.module.css";

/* Client-only, code-split entry for the Variant 3 Three.js hero. */
const Variant3Scene = dynamic(
  () => import("./Variant3Scene").then((m) => m.Variant3Scene),
  { ssr: false, loading: () => <div className={styles.loadingShell} aria-hidden /> }
);

export function Variant3Hero() {
  return <Variant3Scene />;
}
