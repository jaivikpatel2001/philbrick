# Homepage Hero Variants — design + implementation reference

Four alternative homepage heroes for client A/B review, each on its own URL,
each sharing the page body below the hero (`sections/home/HomeSections.tsx`).
All are noindex + excluded from the sitemap (temporary review pages). The main
homepage `/` keeps the original cinematic Three.js night-city hero.

| URL | Concept | Tech |
| --- | --- | --- |
| `/variant1` | Exploded component tour | GSAP ScrollTrigger + real photo cutouts |
| `/variant2` | Architectural journey | Three.js fly-through (this folder) |
| `/variant3` | Engineering blueprint | Three.js clipping-plane scan (this folder) |
| `/variant4` | Immersive storytelling | Three.js single take gallery (this folder) |
| `/variant5` | Night arrival (imagegeneration.md §10.1 world) | Three.js journey (this folder) |
| `/variant6` | The ORIGINAL hero, verbatim, with real spine + component images | duplicate of `../ElevatorScene.tsx` |

Inspiration was analysed (award-site scroll films, product configurators,
technical reveal pages) but every concept, asset and interaction here is
original and Philbrick-specific. No third-party designs, models or code.

**Photoreal imagery edition (2026-07-17, client feedback):** procedural-only
geometry read as toy-like next to the real renders, so every variant is now
built around the actual imagery — the cutaway machine render (`SPINE_ASSET`)
and the 8 true-alpha component cutouts (`partAssets.ts`), placed as unlit
photo planes in the 3D scenes (baked lighting, the brand-decal rule),
billboarded to the camera, grounded with contact glows and light cones.
**Every variant showcases all 8 components with named callouts** (client
requirement): v2 reveals them along the climb, v3 explodes them into a
documented layout after the scan, v4 features them across scenes 2 to 4 and
reassembles all 8 around the machine in scene 5.

## Shared architecture (`heroSceneKit.tsx`)

- **Pinning:** tall section + CSS `position: sticky` stage (house rule — no
  GSAP pin), stage sits below the sticky navbar (`top: var(--nav-h)`).
- **Scrub:** one `ScrollTrigger` per hero (`scrub: 1.1`, the house standard);
  Lenis already drives ScrollTrigger through the gsap ticker (SmoothScroll).
  Progress lands in a ref + the `--p` CSS var — zero React re-renders per frame.
- **Renderer:** WebGL, ACES tone mapping, sRGB, alpha, DPR capped at 2 (1.5 on
  touch/small/low-core devices), RoomEnvironment IBL. No shadow maps, no
  post-processing passes in any variant (60 FPS budget); depth and glow are
  sold with fog, emissive materials, additive cones/points and a CSS vignette.
- **Lifecycle:** render loop on the gsap ticker, paused when the hero is
  off-screen (IntersectionObserver) or the tab is hidden; full dispose sweep
  (geometries, materials, textures, env RT, renderer) on unmount.
- **Callouts:** world-space anchors projected to screen each frame; HTML chips
  (real text — SEO/a11y/crisp) with per-beat visibility windows.
- **Copy overlays:** intro / captions / outro are HTML driven off the same
  scrubbed progress (opacity/transform only) — subtitles like a film.
- **Reduced motion:** no scrub, no loop — one static frame at each scene's
  chosen "money shot" pose, section collapses to one viewport.
- **No WebGL:** canvas hides; the branded gradient + copy remain a legible hero.
- **Mobile:** DPR 1.5, +6° FOV, half particle counts, callout sublabels hidden,
  captions full-width; scroll lengths per variant below.
- **Loading:** each scene is dynamically imported (`ssr: false`) behind a
  stable full-height shell — the Three.js chunk stays off the critical path.

## Variant 2 — Architectural Journey (`Variant2Scene.tsx`, 820vh)

- **Storyboard:** night skyline (instanced towers + scattered window lights)
  → dolly toward the hero tower → glass facade dissolves and floor plates draw
  in → the REAL cutaway machine render reveals as the tower's core (azure halo
  behind it) → the camera climbs past all 8 real component cutouts, which
  slide out of the machine at their working heights (pit safeties at the
  bottom, traction machine at the top), alternating sides → pull-back with the
  complete system and every part in place.
- **Camera:** one continuous 6-stop keyframed dolly (`poseCamera`), no cuts,
  plus a subtle handheld breath.
- **Scroll timeline:** intro 0–0.11 · approach 0.11–0.27 · core reveal
  0.3–0.4 · the climb 0.36–0.84 (8 equal part beats) · pull-back + outro
  0.86–1.
- **Component callouts:** all 8, one per climb beat, anchored to each cutout.
- **Perf:** photo planes are unlit MeshBasic (no lighting cost); city is 1
  InstancedMesh + 1 Points cloud.

## Variant 3 — Engineering Blueprint (`Variant3Scene.tsx`, 780vh)

- **Storyboard:** the machine stands as a living blueprint (azure edge lines
  on a drafting grid, shimmering) → a luminous scan ring sweeps up and, below
  it, the REAL cutaway render materialises (blueprint clipped above the scan,
  photo clipped below — one scrubbed plane constant) → once real, all 8 real
  component cutouts detach and fly to a documented two-column exploded layout,
  each with a named callout, while the grid recedes.
- **Camera:** slow 5-stop orbital drift, always on the machine.
- **Scroll timeline:** intro 0–0.1 · the scan (blueprint→real) 0.12–0.5 ·
  the documentation (8 part beats) 0.56–0.92 · outro 0.945–1.
- **Callouts:** all 8, one per explosion beat.
- **Technique:** clipping planes on the line set + the photo plane; sparks
  (additive Points) ride the ring; photos render unlit.

## Variant 4 — Immersive Storytelling (`Variant4Scene.tsx`, 840vh, single take)

**Single take edition (client feedback: the five scene cuts flashed at
boundaries):** the machine and all 8 components now stand along ONE long
studio gallery; the camera opens on the cutaway, tracks laterally past every
component (each lit as the camera arrives), then pulls back and up to frame
the entire line-up. One unbroken camera move, nothing toggles, nothing can
flash. Callouts fire by camera proximity; captions change by zone.

## (superseded) five scene version

- **Storyboard (five scenes, cut like a trailer, all real imagery):**
  1. *The machine* — the cutaway render alone in a dark studio, one key light
     cone, drifting dust; slow dolly-in.
  2. *The cabin* — interior plate, Car Operating Panel, Security Key Switch and
     Emergency Call staged with contact glows; lateral camera track, each part
     spotlit in turn.
  3. *The doors* — Door Mechanism and Display Screen; push-in.
  4. *The drive* — Traction Machine and Safety System; push-in.
  5. *The system* — the machine again while ALL 8 parts take their places
     around it; closing statement over the scrim.
- **Transitions:** scenes live at separated world offsets; an HTML fade layer
  dips to black at each boundary (tent function around the cut points), fully
  scrub-reversible — reads as film cuts.
- **Perf:** only the active scene group is `visible`; cones/glows are additive
  unlit planes, photos are unlit MeshBasic.
- **Callouts:** all 8 across scenes 2 to 4, named from the content source.

## Performance checklist (all variants)

- Transform/opacity-only DOM overlays; canvas work is camera poses, plane
  constants, light intensities and object transforms — no per-frame allocation
  in the hot path beyond vector reuse.
- DPR ≤ 2 (1.5 low-perf), no shadows, no composer passes, additive glow via
  materials, instancing for repetition.
- Loop pauses off-screen/hidden; everything disposed on unmount.
- Lazy: WebGL chunk dynamically imported per page; hero images elsewhere on
  the page keep their existing lazy/WebP pipeline.

## Variant 5 — Night Arrival (`Variant5Scene.tsx`, 880vh)

- **Concept:** the imagegeneration.md §10.1 MASTER CONSISTENCY BLOCK built
  live: clear dry night, full moon fixed upper right, stars, deserted
  boulevard; the main tower with warm amber occupied floors, vertical fins, a
  dark stone podium, a double-height glowing glass lobby and one thin steel
  canopy; a single brushed centre-opening elevator with a graphite frame and
  an azure dot-matrix indicator showing an up arrow only (no lettering).
- **Camera (§10.1 grammar):** one continuous forward dolly — descend to eye
  height 1.7 on the boulevard, approach, pass the dissolving entrance glass,
  arrive at the doors; they answer the call and part from the centre; the
  camera crosses the threshold into a dark void where the REAL cutaway render
  and all 8 real components reveal one by one (two columns), each named.
- **Scroll timeline:** arrival 0–0.3 · lobby 0.3–0.46 · the call (doors part)
  0.48–0.58 · the system (8 part beats) 0.6–0.92 · outro 0.945–1.
- **Palette:** azure #109BDD accents + warm amber architectural light only,
  per the consistency block.

## Review + promotion

When the client picks a direction: promote the winning hero to `/`, delete the
other `app/variantN/` folders and their `config/pageReleases.ts` entries, and
remove unused scene files. Everything stays recoverable in git.
