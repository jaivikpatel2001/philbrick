"use client";
import dynamic from "next/dynamic";
import styles from "../ElevatorScene.module.css";

/* Client-only, code-split entry for the Variant 12 hero: the variant6
   experience (original 3D arrival) with the catalogue drawing + part set. */
const Variant12ElevatorScene = dynamic(
  () => import("../Variant12ElevatorScene").then((m) => m.Variant12ElevatorScene),
  { ssr: false, loading: () => <div className={styles.heroLoading} aria-hidden /> }
);

export function Variant12Hero() {
  return <Variant12ElevatorScene />;
}
