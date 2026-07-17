"use client";
import dynamic from "next/dynamic";
import styles from "../ElevatorScene.module.css";

/* Client-only, code-split entry for the Variant 6 hero: an exact duplicate of
   the homepage ElevatorScene, with the modelled cabin interior + procedural
   parts replaced by the real cutaway machine and 8 component renders. */
const Variant6ElevatorScene = dynamic(
  () => import("../Variant6ElevatorScene").then((m) => m.Variant6ElevatorScene),
  { ssr: false, loading: () => <div className={styles.heroLoading} aria-hidden /> }
);

export function Variant6Hero() {
  return <Variant6ElevatorScene />;
}
