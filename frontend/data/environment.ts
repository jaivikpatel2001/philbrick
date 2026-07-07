/* =============================================================================
   HERO ENVIRONMENT (reflections + lighting realism)

   The #1 thing that makes Three.js metal look REAL is reflecting a real lit room.
   Drop a free interior HDRI into  frontend/public/hdri/  and point `hdri` at it
   — every steel/glass/gold surface will instantly reflect a believable
   environment instead of the generic studio default.

   Where to get one (free, CC0):
     • https://polyhaven.com/hdris/indoor   (download the 2k or 4k .hdr)
     • https://ambientcg.com  (HDRIs section)
   Save it as e.g.  frontend/public/hdri/lobby.hdr  then set:
     hdri: "/hdri/lobby.hdr"

   While `hdri` is empty, a neutral studio environment (RoomEnvironment) is used.
   ========================================================================== */

export interface EnvConfig {
  /** Path to an .hdr equirectangular environment (served from /public). Empty = studio default. */
  hdri: string;
  /** Overall reflection / ambient strength. */
  intensity: number;
  /** Also show the HDRI as the scene backdrop (vs the dark lobby). */
  background: boolean;
}

export const ENV: EnvConfig = {
  hdri: "",
  intensity: 1.25,
  background: false,
};
