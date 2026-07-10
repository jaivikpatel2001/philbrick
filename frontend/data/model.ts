/* =============================================================================
   OPTIONAL GLTF ELEVATOR MODEL
   Drop a real .glb into  frontend/public/models/  for maximum realism, then set
   `enabled: true`. While disabled (or if the file fails to load), the hero uses
   the high-quality procedural Three.js elevator. See public/models/README.md.
   ========================================================================== */

export interface ModelConfig {
  /** Master switch — keep false until a real model exists. */
  enabled: boolean;
  /** Public path to the .glb / .gltf (served from /public). */
  url: string;
  /** The model is auto-scaled so its height equals this many world units (cabin ≈ 3). */
  targetHeight: number;
  /** Extra multiplier on the auto-scale, if you need to nudge size. */
  scale: number;
  /** Vertical offset after centering. */
  yOffset: number;
  /** Rotate the model (degrees) if it faces the wrong way or is Z-up. */
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

export const MODEL: ModelConfig = {
  enabled: false,
  url: "/models/elevator.glb",
  targetHeight: 3.0,
  scale: 1,
  yOffset: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
};
