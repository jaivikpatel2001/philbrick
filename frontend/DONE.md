# DONE — Implementation History

A permanent, dated log of completed work on the Philbrick website. Read this
before starting a task (see the rule in `CLAUDE.md`); append a new entry after
completing one. Newest entries at the top.

---

## 2026-07-17 14:18 IST

### `/variant6` overlay was invisible — z-index (canvas covered it)

**Status:** Completed

The exploded overlay was fully wired but nothing showed: `.mount` (the WebGL
canvas) is `z-index: 1` and `.v6Overlay` had no z-index, so the overlay painted
BEHIND the canvas. Fixed: `.v6Overlay { z-index: 3 }` (above the canvas, below
the HUD rail at 7), and `.v6Part { pointer-events: auto }` so parts stay
clickable while the overlay stays click-through. Verified on `:3002`: overlay
z-index 3 vs mount 1; hit-test at the COP slot returns IMG → BUTTON → CANVAS
(part now paints above the canvas); zero console errors. Files:
`ElevatorScene.module.css`.

---

## 2026-07-17 14:10 IST

### `/variant6` — exploded view now uses variant1's EXACT DOM layout

**Status:** Completed (scroll reveal to be judged in the real browser)

Feedback: the 3D billboarded part planes overlapped and did not match
`/variant1`. Root cause: variant1's clean composition is inherently a 2D/DOM
layout (fixed screen-% slots + leader lines + labels) — faking it with
perspective 3D planes always distorts and overlaps.

**Fix:** replaced the 3D part planes with a DOM overlay that reuses variant1's
own data (`EXPLORATION_PARTS` from `data/heroExploration.ts`), so the layout is
identical by construction:
- the 3D scene now only plays the building arrival (car + shaft hidden);
- from the threshold a dark scrim + the overlay fade in, the cutaway render
  centres, then the 8 component cutouts reveal one by one — each flying from
  its anchor on the spine to variant1's exact resting slot (30/16, 86/17,
  13/42, 69/43, 30/68, 86/69, 13/90, 69/91) with a dashed azure leader line
  and an index/name/tagline label — and ACCUMULATE, exactly like variant1;
- parts are clickable (open the ComponentModal); the right-side rail stays.
- Driven by a `gsap.ticker` reading `progress.current` (opacity/left/top/line
  endpoints only — no React re-renders per frame).

Removed: the 3D part/spine planes, the projected 3D hotspot chips, and the
bottom-left caption (its per-part labels + View-details are now on the parts).
The building arrival, camera, day/night and outro remain byte-identical to `/`.

**Files:** `sections/experience/Variant6ElevatorScene.tsx` (overlay JSX + reveal
ticker; V6 blocks slimmed to `car.visible=false`), `ElevatorScene.module.css`
(v6 overlay classes appended). No new assets (reuses the machine + 8 component
renders; `V6_SLOTS`/`FRAMING`-based 3D layout no longer used for parts).

**Verified:** build green (compiled, TypeScript clean, 64/64). Live on
`:3002/variant6`: overlay present with 8 parts at variant1's exact slots, all
8 real component images + spine loaded, 8 leader lines, correct labels, zero
console errors. The reveal animation itself (arrival → centred elevator → 8
parts one by one with lines) needs a real browser — preview freezes the ticker.

---

## 2026-07-17 13:57 IST

### `/variant6` — remove the 3D elevator entirely; image + variant1-style reveal

**Status:** Completed (scroll reveal to be judged in the real browser)

Feedback: the previous pass only hid the cabin trim, so the modelled elevator
(doors, header, shaft rail) was still there. The ask: remove the 3D elevator
ENTIRELY, and once the camera is inside the building show the elevator IMAGE,
then reveal the parts one by one like `/variant1`.

**Changes (all V6-local in `Variant6ElevatorScene.tsx`):**
- **Whole 3D elevator gone:** `car.visible = false` (shell, doors, header, COP,
  brand decal, lights, brakes) and `shaft.visible = false` (rails, counterweight,
  traction machine, ropes). The building/lobby (in `world`, not `exterior`)
  stays, so the camera still arrives and ends inside the lit lobby.
- **Elevator = the cutaway image**, standing on the lobby floor
  (`v6Spine` at `y = FY + H/2`), revealed as the camera enters (p 0.3→0.37) and
  held.
- **8 parts reveal one by one, variant1-style:** new module const `V6_SLOTS`
  (zigzag around the image); each component cutout fits a ~1.1 box, sits at its
  slot, and fades in in sequence across COMP_START→COMP_END, ACCUMULATING (once
  shown it stays), so the full system is assembled by the end.
- **Camera no longer flies around** the (absent) cabin: the 8 `frameOf` stops
  are replaced by a steady interior shot facing the image with a slow push-in
  (z 9.2→5.2). Hotspot anchors repointed to `V6_SLOTS` so the "details" chips
  land on the parts. `frameOf`/`step` kept (voided) — arrival stops unchanged.

The exterior arrival, dolly-zoom, threshold, day/night cycle, postprocessing
and outro remain byte-identical to `/`.

**Verified:** build green (compiled, TypeScript clean, 64/64). Live on
`:3002/variant6`: WebGL alive, canvas sized, all 9 real textures loaded, zero
console errors. Scroll reveal (arrival → image in the lobby → 8 parts one by
one) to be confirmed in a real browser — preview freezes the render loop.

**Follow-up:** in-browser, tune the elevator image scale (`V6_SPINE_H = 2.6`),
the part box size (`V6_MAX = 1.12`) and the 8 `V6_SLOTS` positions if the
composition needs balancing.

---

## 2026-07-17 13:44 IST

### `/variant6` rebuilt as an exact ElevatorScene duplicate + real imagery

**Status:** Completed (interior reveal to be judged in the real browser)

Clarified intent: variant6 should be an ENTIRE duplicate of the homepage hero
(`/`), with only the 3D elevator + its parts swapped for the real spine +
component renders "so it looks real". The earlier variant6 (a fresh matte
scene) was the wrong interpretation and is deleted.

**Approach (lowest-risk faithful duplicate):** copied
`ElevatorScene.tsx` → `Variant6ElevatorScene.tsx` verbatim (kept in
`sections/experience/` so all relative imports resolve unchanged; export
renamed `Variant6ElevatorScene`). The whole scene — night-city arrival,
dolly-zoom, threshold, camera stops, day/night cycle, bloom/NaN-guard/SMAA,
adaptive DPR, IntersectionObserver gating, outro — is byte identical. Two
clearly-marked "V6 BLOCK" edits are the only change:
- **BLOCK 1** (after the car build): hides the toy interior detail (`cop`,
  `sidePanels`, `backMirror`, `handrail`) and hangs the real renders — the
  cutaway machine at cabin centre + the 8 component cutouts at their exact
  `FRAMING` anchors (unlit MeshBasic, billboarded, `depthTest:false` so a photo
  never clips into a wall).
- **BLOCK 2** (in `pose`, before `updateHotspots`): billboards each plane and
  fades a component in when it becomes the active component (the camera already
  frames that anchor); the spine reveals as the camera settles inside
  (0.34→0.41) and returns for the outro (0.9→0.94).

Because the camera already flies to each `FRAMING` anchor, the real photo lands
exactly where the modelled part used to be — the entire original camera/scroll
system is reused untouched. The hotspot chips still project to the same anchors,
so the "click for details" modal keeps working over the real images.

**Files:** `sections/experience/Variant6ElevatorScene.tsx` (new duplicate),
`variants/Variant6Hero.tsx` (repointed), `variants/Variant6Scene.tsx` (deleted
— old fresh scene), `imagegeneration.md` (§11.5 note + §11.6), `VARIANTS.md`.
No new image assets (reuses the machine + 8 component renders).

**Verified:** build green (compiled, TypeScript clean, 64/64 pages). Live on
`:3002/variant6`: WebGL context alive, canvas sized, all 9 real textures loaded
(spine + 8 components) + brand logo (confirming the full original scene is
intact), zero console errors. The scroll-driven interior reveal (arrival
identical to `/`, real parts appearing at the anchors) can only be confirmed in
a real browser — the preview pane freezes the render loop (screenshot timed out,
same as the original `/`).

**Follow-up:** judge in-browser whether each component photo sits/scales well at
its anchor; per-part height is `FRAMING.dist * 0.52` (clamped 0.6–1.5) and the
spine height is 2.3 — both are one-number tunes if any part reads too big/small.

---

## 2026-07-17 13:02 IST

### `/variant5` door pass-through blur — leaves now dissolve to 0 opacity

**Status:** Completed

The reframe/faster-pass reduced but did not kill the gold blur: even fully
open, the door-leaf photo planes are large surfaces the camera flies *through*,
so for a frame or two the brushed-steel texture smeared across the whole lens.

**Fix (per user's "0 opacity" suggestion):** captured the leaf materials
(`panelMats`) and, once the doors are open, fade them to zero
(`1 - beat(p, 0.5, 0.56)`) and flip `leaf.visible` off below the threshold, so
the leaves are gone before the camera reaches the doorway. The indicator fades
on the same curve. The camera then crosses the black void quad (the intended
"doors open onto darkness" beat) into the clean studio showcase.

**Files:** `variants/Variant5Scene.tsx`. Build green (64/64, TypeScript clean);
page mounts with mattes + 8 callouts, zero console errors. Final look to be
confirmed in the real browser.

---

## 2026-07-17 12:54 IST

### `/variant5` polish: door pass blur, blue square, showcase background

**Status:** Completed

Three user-reported issues in the night arrival flow, all fixed:

- **Blurry gold "middle frame":** the camera crossed the doorway slowly and at
  point-blank range, magnifying the 440px door-leaf texture into a full-screen
  blur. Fixed by reframing the approach (the portal beat now frames the FULL
  doors + indicator from 4m back), opening the doors earlier (0.45 to 0.53,
  slide widened to ±1.5) so they are fully aside before the crossing, and
  passing through faster (new stops 0.55 / 0.64). The entrance glass fade was
  moved earlier (0.37 to 0.43) to finish before the quicker camera reaches it.
- **Blue square behind the machine:** the showcase "halo" was a flat azure
  8.4x8.4 plane that read as a literal box. Deleted — the cutaway render
  stands on its own.
- **Background behind the last frame:** the skyline mattes (z -54/-60) loomed
  directly behind the showcase. Added an act change: once the camera passes
  the doorway, the whole city act pops out of the render (towerGrp.visible,
  behind the lens so it is invisible to drop) and the skylines + tower matte
  fade to zero (0.56 to 0.66) — the machine and parts now live in a clean
  dark studio void.

**Files:** `variants/Variant5Scene.tsx` (CAM stops, door timing, halo removal,
city-act fade). Build green (64/64, TypeScript clean); page verified mounting
with mattes + 8 callouts. Motion to be judged in the real browser.

---

## 2026-07-17 12:42 IST

### Environment mattes integrated: `/variant5` + `/variant6` go photoreal

**Status:** Completed

The client generated the §11.4 environment set. Audit: all four true-alpha
(tower 23% opaque, skyline 22%, lobby 43%, door leaf 37%; corners transparent).

**Processing:** originals archived
(`image-sources/home/hero-exploration/environment-original/`); tower + skyline
had a semi-transparent gray halo, attenuated (alpha < 235 scaled x0.3) then
trimmed; lobby trimmed as-is (its warm glow alpha is the design); door leaf
cropped out of its glow field to the actual panel (440x1372).
`optimizeHeroExploration.mjs` re-run (WebP variants + manifest). Processed
aspects: tower 0.248 (slender §10.1 tower), skyline 3.046, lobby 0.679,
leaf 0.321.

**`/variant5` wiring:** procedural tower exterior (shell/fins/window points/
podium/canopy) replaced by the tower matte; instanced flanking city replaced by
the skyline matte mirrored at two depths; procedural door panels replaced by
the client's leaf render mirrored into the centre-opening pair, sliding over a
new pitch-black void quad (what the parting doors reveal). The 3D lobby
interior (stone floor, columns, graphite wall + frame, azure indicator) stays
real geometry — the camera enters it, so parallax matters there.

**`/variant6` wiring:** all four `MATTES` slots flipped `ready: true` with the
measured aspects; lobby matte resized to a 7.8-tall portal wall + the same
black void quad behind the leaves.

**Verified:** build green (compiled, TypeScript clean, 64/64). Live on
`:3002`: variant5 loads tower/skyline/leaf mattes + 9 part textures, 8
callouts; variant6 loads all four mattes + 9 part textures, 8 callouts, 8-item
rail; WebGL contexts alive. Look/motion to be judged in the real browser.

**Note:** matte textures load as the processed PNGs (TextureLoader bypasses
the next/image loader); post-trim they are small, but converting the loads to
the -960 WebP variants is a cheap follow-up if profiling ever flags them.

---

## 2026-07-17 12:28 IST

### New `/variant6`: the original journey, photoreal edition (matte slots)

**Status:** Completed (scene live with stand-ins; environment mattes pending
client generation)

Client wants the ORIGINAL homepage hero's visuals upgraded with real images
(like the product cutouts) instead of procedural "dummy visuals", as a new
variant. Rather than forking the 1500-line `ElevatorScene`, `/variant6`
remakes its narrative on the variants kit: arrival at the night tower →
approach → the threshold → the doors answer (leaves slide apart) → the
8-component tour (one real render per beat, centre stage, with the original's
right-rail index) → the finale gathering all 8 around the machine → outro.
The original stays untouched at `/` for comparison.

**Matte-slot architecture:** every environment element is a config slot
(`MATTES` map: tower, skyline, lobby, doorLeaf). `ready: false` renders a
clean procedural stand-in; when the client's transparent render lands in
`public/images/home/hero-exploration/environment/` (+ optimize script), flip
`ready: true` and the photo plane replaces the stand-in. Product imagery
(machine + 8 cutouts) is already real. Prompts: imagegeneration.md §11.4;
mapping: §11.5.

**Files:** `variants/Variant6Scene.tsx` + `Variant6Hero.tsx` +
`app/variant6/page.tsx` (new), `variants.module.css` (railV6 styles),
`config/pageReleases.ts` (+/variant6), `imagegeneration.md` (§11.5),
`VARIANTS.md` (row).

**Verified:** build green (compiled, TypeScript clean, 64/64 pages). Live on
`:3002/variant6`: WebGL context alive, all 9 real textures loaded, 8 callouts,
8-item tour rail, 940vh. Motion pacing to be judged in the real browser.

---

## 2026-07-17 11:54 IST

### `/variant4` machine cropped — intro reframed; variant5 environment matte plan

**Status:** Completed (code); environment assets pending client generation

- **`/variant4` "my elevator cut":** the cutaway render (7.2 world units tall)
  was taller than the intro camera's vertical field of view, so its top
  cropped. Reframed: the intro camera now starts higher and further back
  (y 2.9, z 14.2) aiming at the machine's centre (y 3.6) — full render in
  frame with margin — then eases down to part height (target y 2.1) as the
  lateral take begins. Build green (63/63).
- **`/variant5` environment looks like a mockup:** agreed — the procedural
  night world reads as boxes next to the real renders. Plan: replace it with
  photoreal TRANSPARENT matte planes (same technique as the product cutouts).
  Asset spec + prompts documented as imagegeneration.md §11.4: `tower-night`
  (tall cutout, lobby centred at bottom), `skyline-strip` (wide cutout, used
  mirrored at two depths), `lobby-backdrop` (16:9 full bleed, open DARK
  doorway, doors ship separately), `door-leaf` (single leaf cutout, mirrored
  into the centre-opening pair and slid apart in 3D). Drop into
  `public/images/home/hero-exploration/environment/`, run
  `optimizeHeroExploration.mjs`, then the scene wiring is a follow-up task.

**Files:** `variants/Variant4Scene.tsx` (camera), `imagegeneration.md` (§11.4).

---

## 2026-07-17 11:50 IST

### `/variant2` machine invisible — glass depth-write occlusion fixed

**Status:** Completed

**Symptom (user report + screenshot):** at the climb beats, no machine render
and no component images were visible — only the tower ledges, city and the
HTML callouts.

**Root cause:** the tower's glass facade (`MeshPhysicalMaterial`, transparent)
kept its default `depthWrite: true`. Even after its opacity scrubbed to 0 it
still wrote its front face into the depth buffer; the photo planes (transparent,
`renderOrder 4`, so drawn after it) then failed the depth test behind that
invisible surface and were discarded. The HTML callouts survived because they
are DOM, not WebGL — which is why labels floated over nothing.

**Fix:** `depthWrite: false` on the facade glass (physically correct for
glass) plus `facade.visible = opacity > 0.004` so the dissolved facade leaves
the render entirely. Applied the same fix preventively to `/variant5`'s
entrance glass (`entGlassMat` + `entGlass.visible` toggle), which had the
identical pattern in front of its showcase.

**Files:** `variants/Variant2Scene.tsx`, `variants/Variant5Scene.tsx`.

**Verified:** build green (compiled, TypeScript clean, 63/63). Visual
confirmation in the user's real browser (the embedded pane cannot advance the
scrub). Rule of thumb recorded for future scenes: any transparent material
that can sit between the camera and the photo planes must set
`depthWrite: false`.

---

## 2026-07-17 11:31 IST

### Variant fixes (v2 flat, v4 flash) + new `/variant5` "Night Arrival"

**Status:** Completed

Client feedback round two, all three items addressed:

- **`/variant4` — jitter/flash after the 4th part, wants one smooth take:**
  the flash was the five scene architecture (scene-group swaps + camera
  teleports masked by a fade that scrub speed could outrun). Rebuilt as a
  SINGLE CONTINUOUS TAKE: the machine and all 8 parts stand along one long
  gallery; the camera opens on the cutaway, tracks laterally past every
  component (lit by proximity), then pulls back and up to frame the whole
  line-up. No visibility toggling, no fade layer, nothing can flash. 840vh.
- **`/variant2` — looked flat, machine/parts not visible:** root cause was
  full-width floor plates slicing through the photo planes (parts taller than
  the 1.75 floor pitch) and part heights misaligned with the camera's climb.
  Fixed: floor plates are now side ledges around an OPEN CORE (|x| < 4.9) so
  nothing slices the renders; the spine is 14 units tall centred on the climb
  (y 3.5 to 17.5); each part's height now matches the camera altitude at its
  beat so it reveals centred in view (x ±2.4, z 1.0, bigger sizes).
- **`/variant5` — new, from imagegeneration.md §10.1:** the MASTER CONSISTENCY
  BLOCK world built live — full moon fixed upper right, stars, deserted
  boulevard, the main tower (warm amber occupied floors, fins, dark podium,
  double-height glowing lobby, thin steel canopy), single brushed
  centre-opening elevator with azure arrow-only indicator; one continuous
  §10.1 dolly (descend to eye height → lobby → doors part) ending beyond the
  threshold with the real cutaway + all 8 real components revealed and named.
  Azure #109BDD + warm amber palette per the block. 880vh, noindex, route
  registered.

**Affected files:** `Variant4Scene.tsx` (rewritten single take),
`Variant2Scene.tsx` (open core, climb alignment), `Variant5Scene.tsx` +
`Variant5Hero.tsx` + `app/variant5/page.tsx` (new), `config/pageReleases.ts`
(+/variant5), `VARIANTS.md`.

**Verified:** build green (compiled, TypeScript clean, 63/63 pages, was 62).
Live on `:3002`: v4 shows "Eight components. No cuts." with the fade layer
gone, 8 callouts, all 9 real textures; v2 loads 9 textures + 8 callouts with
the open-core layout; v5 mounts with a live WebGL context, 8 callouts, 9
textures, 880vh. Motion pacing to be judged in the real browser as usual.

---

## 2026-07-17 11:08 IST

### Variants 2 to 4 rebuilt around the real renders (client feedback)

**Status:** Completed

Client feedback on the first pass: the procedural geometry read as toy-like;
they want realistic structure and materials matching the `/variant1` imagery,
and EVERY variant must showcase all 8 elevator components.

**Approach:** every Three.js variant is now built around the actual client
renders — the cutaway machine (spine) and the 8 true-alpha component cutouts —
placed in the 3D scenes as unlit photo planes (`photoPlane` in heroSceneKit;
baked lighting, the same rule as the ElevatorScene brand decal), billboarded to
the camera each frame, grounded with contact glows and additive light cones.
New shared asset map: `sections/experience/variants/partAssets.ts` (exact WebP
variants, aspects, names from `data/elevatorComponents.ts`; 07 renders as a
framed plate because its background is baked).

- **`/variant2`:** the real cutaway stands as the tower core (azure halo);
  during the climb all 8 real cutouts slide out of the machine at their
  working heights (safeties at the pit, traction machine at the top),
  alternating sides; pull-back ends with every part in place. 8 callouts.
- **`/variant3`:** the scan now materialises the REAL render (blueprint lines
  clipped above the sweep, photo clipped below — one scrubbed plane constant);
  after the scan, all 8 real parts detach into a documented two-column
  exploded layout. 8 callouts, one per beat.
- **`/variant4`:** the five scenes restaged with real imagery: S1 the cutaway
  under a key light cone; S2 cabin cluster (interior plate, COP, key switch,
  emergency call) spotlit in turn; S3 doors + display; S4 traction machine +
  safety system; S5 the machine with ALL 8 parts assembling around it.
  8 callouts across S2 to S4.

**Affected files:** `variants/partAssets.ts` (new), `variants/heroSceneKit.tsx`
(+`loadPhoto`/`photoPlane`/`contactGlow`), `Variant2Scene.tsx`,
`Variant3Scene.tsx`, `Variant4Scene.tsx` (rewritten), `VARIANTS.md` (photoreal
edition note + updated storyboards).

**Verified:** build green (compiled, TypeScript clean, 62/62 pages). Live on
`:3002`: each variant page fetches all 9 real textures into its WebGL scene
(cutaway + 8 cutouts, confirmed via the resource log), mounts 8 callouts, and
holds a live WebGL context. Motion pacing to be judged in a real browser as
usual (preview pane freezes the ticker).

---

## 2026-07-17 10:53 IST

### Three new cinematic Three.js hero variants (`/variant2` `/variant3` `/variant4`)

**Status:** Completed (built + verified live; scrub motion is real-browser
verified — the preview pane freezes the ticker)

Three original scroll-driven WebGL heroes for client A/B review, joining `/`
(night-city 3D) and `/variant1` (exploded tour). Full design + implementation
reference: `sections/experience/variants/VARIANTS.md`.

- **`/variant2` Architectural Journey (780vh):** abstract night skyline →
  camera flies through the tower facade as floor plates draw in → rides the
  shaft beside the climbing car (live ropes, counterweight, warm car glow) →
  machine room → assembled-system pull-back. Component callouts land at their
  working positions (Synergy Auto Door, ARD following the car, counterweight
  and rails, Traction Machine).
- **`/variant3` Engineering Blueprint (720vh):** the system as a living azure
  wireframe on a drafting grid; a luminous scan ring sweeps up twice —
  blueprint → raw metal → finished PBR — implemented with three co-located
  mesh sets partitioned by scrubbed clipping planes (perfectly reversible,
  zero shader recompiles). Sparks ride the ring; callout windows are derived
  from the exact scan height crossing each component.
- **`/variant4` Immersive Storytelling (860vh):** a five scene product film
  (lobby → shaft ride with light beams and dust → machine room under one
  dramatic key → three component pedestals lit in turn → assembled system
  reveal) joined by scrub-reversible fade cuts; only the active scene group is
  visible/energised.

**Shared kit** (`sections/experience/variants/heroSceneKit.tsx`): renderer
(ACES/sRGB/alpha, DPR cap 2 desktop 1.5 low-perf, RoomEnvironment IBL), CSS
sticky stage + ScrollTrigger scrub 1.1 (house pattern, Lenis-driven ticker),
render loop paused off-screen/hidden, full dispose sweep, world-anchor → HTML
callout projector, reduced-motion single static frame, no-WebGL branded
fallback. Shared overlay CSS (`variants.module.css`): film captions, intro,
outro + scrim, callout chips, vignette, progress, cue.

**Decisions:**
- Vanilla Three.js, NOT React Three Fiber: npm installs are currently broken
  on this machine (silent exit 1 — see 2026-07-16 sessions), and the house
  standard (THREEJS-IMPLEMENTATION.md, ElevatorScene) is vanilla Three.js
  anyway. Zero new dependencies.
- No shadow maps or composer passes in any variant (60 FPS budget); glow/depth
  via emissive materials, additive cones/points, fog and a CSS vignette.
- Inspiration sites were analysed for qualities only; all geometry, motion and
  copy are original and Philbrick-specific.

**Routes:** `app/variant2|3|4/page.tsx` (noindex, ReleaseGate, shared
`HomeSections` body), `config/pageReleases.ts` entries; sitemap already filters
the `/variant` prefix.

**Verified:** `npm run build` green first pass — compiled, TypeScript clean,
**62/62 pages** (was 59). Live probes on `:3002`: each page mounts a sized
canvas with a live (non-lost) WebGL context, correct scroll lengths
(780/720/860vh), callouts mounted (4/6/3), correct h1s, v4 fade layer present,
zero console errors.

**Follow-ups:** judge motion pacing in a real browser and tune beat windows;
optional variant switcher chip for the client; delete losing variants after
the client decision (git preserves everything).

---

## 2026-07-17 10:34 IST

### `/variant1` closing statement: centred, big, over a readable overlay

**Status:** Completed (composition verified live; scrub reveal real-browser
verified — preview freezes the ticker)

The outro was colliding with the exploded parts at the bottom. It is now the
mirror of the intro: a big centred closing line over a scrim that dims the
machine.

- **Centred + big.** `.outro` moved from `bottom:9%` to true centre
  (`left/top:50%; translate(-50%,-50%)`, flex column, centre-aligned); GSAP owns
  the centring (`xPercent/yPercent:-50`) so the reveal's `y` stays additive. The
  line jumped from `--fs-h4` to `--fs-h1` — verified identical to the intro
  title (both 65.6px) and dead-centred (X off 5px, Y 0).
- **Readable overlay.** New `.outroScrim` (full stage, z 5, below the outro at
  z 6) fades in as the last part lands: a `color-mix(bg-primary 88%)` wash (parts
  dimmed to ~12%) + a soft accent-glow radial, so the white copy reads with high
  contrast. `backdrop-filter: blur(6px)` is kept as progressive enhancement, but
  the CSS pipeline drops it on this rule (likely the `color-mix` interaction), so
  readability rests on the dim, not the blur — verified the dim resolves
  (`bgColor = bg-primary / 0.88`).
- **Timeline.** In the settle phase the scrim fades in at `settleAt − 0.05` and
  the big outro at `settleAt + 0.2`, so the machine dims just before the closing
  line lands. Reversible with scrub; mobile keeps it centred (width 90vw, font
  clamps down).

**Affected files:** `sections/experience/ExplorationHero.tsx` (scrim element +
settle tweens + outro yPercent), `ExplorationHero.module.css` (`.outroScrim`,
centred/big `.outro`, mobile).

**Verified:** forced-visible measurement on `:3002/variant1` (font 65.6px,
centred, scrim full-stage, dim 0.88); `npm run build` green (59/59, TypeScript
clean). Scrub reveal itself confirmed in the real browser (preview pane freezes
rAF).

---

## 2026-07-17 10:23 IST

### `/variant1` exploration hero re-choreographed: centred text + strict phase order

**Status:** Completed (initial state + build verified; scrub motion is
real-browser verified — the preview pane freezes the GSAP ticker)

Reworked `ExplorationHero` per client direction into a centred, phased reveal.

**Layout.** The intro copy is now absolutely centred (both axes) and
centre-aligned: `.intro { left/top:50%; transform:translate(-50%,-50%); display:
flex; flex-direction:column; align-items:center; text-align:center; width:
min(92vw,42rem) }`; mobile just narrows the width. GSAP owns the centring
transform (`xPercent/yPercent:-50`) so the fade's additive `y` stays correct.

**Strict phase order** (one scrubbed master timeline, each phase finishing before
the next; new pacing constants in `data/heroExploration.ts`):
1. **Text** `[0 … TEXT_UNITS=1.0]` — centred copy holds ~0.28, then fades
   `autoAlpha 1→0` with a `-7vh` rise (power2.in); fully gone by TEXT_UNITS. The
   scroll cue fades with it.
2. **Elevator** `[1.0 … PARTS_START=2.15]` — the machine, held at `scale 0 /
   opacity 0` through phase 1, scales `0→1` (`autoAlpha 0→1`, `y 4vh→0`,
   power2.inOut) so it emerges rather than pops. A subtle continued push to 1.04
   runs through the parts phase for depth.
3. **Parts** `[2.15 …]` — components reveal one by one (fly from anchor to slot,
   leader line draws, label lands), exactly as before but starting after the
   elevator is full-scale.
4. **Settle** — exploded overview + outro CTAs hold to TOTAL_UNITS.

Scroll length `SCROLL_VH` ≈ 890vh (11.15 units × 80vh). Fully reversible (scrub).
Removed the trailing dead-zone tween so timeline length == TOTAL_UNITS (keeps the
active-index math exact). Performance unchanged: transform/opacity only, `active`
state updates once per beat (not per frame), progress bar via CSS var.

**Affected files:** `sections/experience/ExplorationHero.tsx` (timeline),
`sections/experience/ExplorationHero.module.css` (centred `.intro`),
`data/heroExploration.ts` (TEXT_UNITS / ELEVATOR_UNITS / PARTS_START / pacing).

**Verified:** live on `:3002/variant1` — initial state reads `spineScale 0`,
`spineOpacity 0`, `introOpacity 1`, `text-align center`, intro centred (X off 5px,
Y 0), `part0Opacity 0` — i.e. only the centred text shows, machine hidden at
scale 0. `npm run build` green (compiled, TypeScript clean). The preview pane
freezes rAF so the scrub itself is verified in the real browser.

**Note:** the in-app preview auto-targets `:3000` (per `.claude/launch.json`),
which currently hosts a different local project; the Philbrick dev server is on
`:3002`. Only affects tooling, not the app.

---

## 2026-07-17 10:04 IST

### Two homepage hero variants for client A/B review (`/` + `/variant1`)

**Status:** Completed

The client will compare hero directions, so the homepage now exists in two
routes that share everything below the hero:
- **`/`** — the cinematic Three.js on-scroll elevator hero (`ElevatorHero` /
  `ElevatorScene`). Restored here from being commented out.
- **`/variant1`** — the scroll-driven exploded component tour hero
  (`ExplorationHero`).

**Architecture (DRY):** extracted the shared page body (About → Products →
Services → Applications → Stats → CTA) into `sections/home/HomeSections.tsx`.
Each route is just `<ReleaseGate route><Hero /><HomeSections /></ReleaseGate>`,
so the body is edited once and both variants stay identical.

**Route registration (strict page-release rule):** added `"/variant1": true`
to `STATIC_ROUTE_RELEASES` (live so it can be shared with the client). Kept out
of public search: page-level `robots: { index:false, follow:false }` metadata in
`app/variant1/page.tsx`, plus a `/variant`-prefix filter in `app/sitemap.ts` so
variant routes are never advertised.

**Affected files:** `app/page.tsx` (→ ElevatorHero + HomeSections),
`app/variant1/page.tsx` (new), `sections/home/HomeSections.tsx` (new),
`config/pageReleases.ts` (+ /variant1), `app/sitemap.ts` (variant filter).

**Verification:** `npm run build` green — 59/59 pages (was 58), TypeScript
clean, `assertReleaseConfig()` passed. Static export checks: `out/index.html`
carries the Three.js `heroLoading` shell (no exploration markup);
`out/variant1.html` carries the exploration `spineWrap` + 8 `hero-exploration`
cutouts + the `One elevator` h1 + `<meta name="robots" content="noindex,
nofollow">`; `sitemap.xml` contains zero `variant1` occurrences. Both dev routes
return HTTP 200.

**Follow-up:** temporary review setup — once the client picks a hero, keep the
winner on `/` and delete `app/variant1/`, its `/variant1` config entry, and the
loser's hero component (all preserved in git regardless).

---

## 2026-07-16 16:50 IST

### Exploration hero: 8 client component cutouts integrated (cards → floating parts)

**Status:** Completed

The client generated all 8 component images from the §11.3 prompts and dropped
them in `public/images/home/hero-exploration/components/`. Audit: 7 of 8 are
true-alpha cutouts (opaque coverage 18 to 39%, edges transparent);
`07-interior-design` arrived fully opaque with a painted fake-transparency
checkerboard.

**Pipeline:** originals archived to
`image-sources/home/hero-exploration/components-original/`; the 7 cutouts
trimmed of transparent padding (sharp `.trim` threshold 8) + 16px margin
re-added so parts render at full visual size; 07 cropped inside the
checkerboard to the cabin's rectangle (kept as a framed card — a room reads
well framed; regenerating with true alpha can upgrade it later);
`optimizeHeroExploration.mjs` produced 18 WebP variants + manifest entries.

**Wiring:** `data/heroExploration.ts` PART_SPECS now carry per-part
`treatment` / `image` / natural `aspect` / optional `size` caps (COP strip:
wCap 110px, hCap 38vh; default 205px / 23vh). `ExplorationHero.tsx` renders
per-part images with inline aspect-ratio + `min(hCapVh, wCap/aspect)` height
for cutouts. CSS: cutouts have no card chrome, `object-fit: contain`, a
static drop-shadow to ground them (theme-tuned), width-auto boxes, capped
labels. The old 3D_Elevetor photos remain untouched (still used by the
preserved Three.js hero's modal).

**Verified:** all 8 serve as WebP (HTTP 200, image/webp); forced final-state
geometry shows the natural-shape boxes sized as designed (e.g. COP 68px wide
at 38vh tall, door operator 204px wide) and ZERO overlaps among the 8 parts;
the priority image decodes; lazy siblings pend only in the rAF-frozen preview
pane (environment artifact — they load normally in a real browser).

**Follow-up:** optional regeneration of 07 with true transparency; consider
per-part fine-tuning of slot positions now that shapes are natural.

---

## 2026-07-16 15:55 IST

### Exploration hero polish: calmer headline + "machine arrives" intro

**Status:** Completed

- **Intro type (user request, settled after three iterations):** the h1 moved
  from `--fs-display-2` (≈85px, 4-line wall) through an over-shrunk 46px step
  to the final `--fs-h1` (≈66px, 3 lines, ~460px intro block including
  eyebrow + lead) — strong editorial presence without the wall of text;
  line-height 1.08; the lead is `--fs-body` with a 26rem measure.
- **Scroll-driven arrival (user request, settled after three iterations):**
  the elevator rests small (scale 0.45 desktop / 0.6 mobile, opacity 0.92,
  7vh low, ~243px tall at rest). As the user begins scrolling it scales up
  ~2.3x into place (power2.out, lands just after the intro beat), then keeps
  slowly approaching (to scale 1.05) plus the -2vh drift for the rest of the
  tour. Implemented as sequential same-property tweens on the one scrubbed
  master timeline (scrub-reversal safe); replaces the old flat spine
  parallax. Reduced-motion static view untouched (full size).

**Files:** `sections/experience/ExplorationHero.tsx` (arrival tweens),
`ExplorationHero.module.css` (.title/.lead sizes).

**Verified (geometry, preview tab):** at scrollY 0 the spine computes
scale 0.78 / opacity 0.92 with the 50% 62% origin; h1 renders 54.4px over 3
lines. Scrub motion validated in the user's real browser (preview pane
freezes rAF; known quirk).

---

## 2026-07-16 15:49 IST

### Exploration hero: real cutaway spine integrated + zigzag part layout

**Status:** Completed

**Real center elevator.** The client supplied a photoreal cutaway render
(1024x1536). It carried a painted grey studio backdrop (alpha channel present
but background not transparent), so the pipeline feathers its edges to alpha
(hard fade left/right where the margins are empty, gentle top/bottom where the
machine nearly touches) — it now melts into the themed stage like a lit
column. Original archived at
`image-sources/home/hero-exploration/elevetorhero-original.png`; processed file
at `public/images/home/hero-exploration/spine/elevator-cutaway.png` with WebP
variants + manifest entries via `scripts/optimizeHeroExploration.mjs`. Wired
through the `SPINE` config in `data/heroExploration.ts` (blueprint SVG remains
the fallback by flipping the config back).

**Zigzag layout (user request: parts must not overlap).** Each column now
alternates near/far from the elevator: left column x 30/13/30/13, right column
x 86/69/86/69 (% of stage). The alternating x offsets guarantee vertically
adjacent cards never collide. Cards slimmed to `clamp(140px, 12.5vw, 190px)`.
The right rail became dots-only with the name shown just for the active part,
removing its collision with the far-right cards.

**Verification (geometry, in-page):** spine loads and serves as
`elevator-cutaway-640.webp` through the loader; all 8 parts forced to their
final slots and measured — pairwise overlap check: NONE; zero console errors.
(The embedded preview pane still freezes rAF, so scrub motion remains
real-browser verified.)

**Affected areas:** `data/heroExploration.ts` (SPINE + zigzag slots),
`sections/experience/ExplorationHero.tsx` (rail markup),
`ExplorationHero.module.css` (card width, rail name reveal),
`public/images/home/hero-exploration/spine/*`, `lib/imageManifest.json`,
`imagegeneration.md` §11.2 status.

**Follow-up:** a re-render with a TRUE transparent background (prompt in
§11.2) can drop in at the same path for an even cleaner cutout in light theme;
the 11 component cutouts (§11.3) remain pending to replace the interim cards.

---

## 2026-07-16 14:57 IST

### New hero: scroll-driven exploded component tour + sticky navbar

**Status:** Completed (live with interim art; final client assets pending)

**Concept.** Replaced the homepage hero with `ExplorationHero`: the assembled
Philbrick elevator stands centred as a technical spine; as the user scrolls,
each major component flies out from its position on the machine to its
catalogue slot, a leader line draws and its label lands, ending on the full
exploded overview (the product catalogue composition) with CTAs. Scroll drives
everything forward and backward. Chosen over a frame sequence deliberately:
~10 small images instead of 360 frames (~1 MB vs 17 MB), crisp at every DPR,
native reverse scrubbing, responsive recomposition instead of cropping, real
text labels (SEO/a11y), and independent per-part motion/parallax.

**Architecture.**
- `data/heroExploration.ts` — everything is config: part list (reuses
  `ELEVATOR_COMPONENTS` content + images), spine anchor + resting slot per part
  (% of stage), mobile slots, reveal order, scroll pacing, and the SPINE
  (blueprint SVG now; one line swaps in the client's photoreal cutaway PNG).
- `sections/experience/ExplorationHero.tsx` + `.module.css` — tall section
  (`SCROLL_VH` ≈ 850vh) + CSS sticky stage (house rule: no GSAP pin), ONE
  master GSAP timeline scrubbed by ScrollTrigger (scrub 1.1, house standard;
  Lenis already drives ScrollTrigger via the gsap ticker in SmoothScroll).
  Transform/opacity only; leader lines animate strokeDashoffset (pathLength 1);
  progress bar via a CSS var (no per-frame React renders); right rail tour
  index; `gsap.matchMedia` desktop/mobile fork; interim photos render as
  premium component cards (`treatment: "card"`), client cutouts will render
  bare (`treatment: "cutout"`).
- Mobile (≤820px): spine sits higher, parts take turns in one focal slot,
  labels centred, beat counter instead of the rail, leader lines off.
- `prefers-reduced-motion`: no pin, no scrub — a static exploded overview
  (flowing column on mobile). No JS default state = assembled machine +
  headline (a complete hero).
- `scripts/optimizeHeroExploration.mjs` — ready-made pipeline for the final
  assets (recursive PNG → WebP variants + manifest MERGE, alpha preserved).

**Navbar: fixed → sticky (site-wide, user request).** The header now occupies
its own layout space so no hero or page content ever sits behind it. It keeps
the scrolled glass state but also carries `background: var(--bg-primary)` at
top so content can never show through. The old fixed-nav "overlay white text"
token override was removed (a sticky header never floats over a hero;
`data-overlay` is now inert). Removed the `--nav-h` compensation from
`PageHero`, `not-found`, `ComingSoon`; MegaMenu/NavDropdown viewport math is
unchanged (still correct). The hero stage sticks at `top: var(--nav-h)` with
`height: calc(100svh - var(--nav-h))`.

**Affected areas:** `data/heroExploration.ts` (new),
`sections/experience/ExplorationHero.tsx` + `.module.css` (new),
`scripts/optimizeHeroExploration.mjs` (new), `app/page.tsx` (hero swap;
Three.js `ElevatorHero` preserved, commented), `components/layout/
Navbar.module.css`, `sections/shared/PageHero.module.css`,
`app/not-found.module.css`, `components/release/ComingSoon.module.css`,
`imagegeneration.md` (intro note + new §11 asset spec/prompts).

**Verification:** user confirmed the experience live in a real browser
("really good"). Geometry checks in the embedded preview: header sticky at
top 0 while deep-scrolled with opaque bg; hero + inner-page heroes start
exactly at the header's bottom edge (no hidden content, no double spacing);
stage sticks below the nav at the right height; 8 parts mounted with correct
initial offsets; h1 present. The preview pane freezes rAF (known environment
quirk, memory-documented) so scrub motion itself was validated in the real
browser by the user. `npm run build` green: compiled, TypeScript clean, 58/58
pages.

**Known limitations / follow-ups:**
- Interim art: blueprint SVG spine + photo cards. Final look needs the client
  assets per imagegeneration.md §11 (transparent cutaway spine + 11 component
  cutouts), then config-only swaps in `data/heroExploration.ts`.
- Right rail is display-only (not click-to-jump) — candidate follow-up.
- The Three.js hero and its docs remain intact for instant restoration.

---

## 2026-07-16 12:45 IST

### Removed the frame-based video hero — restored the Three.js elevator hero

**Status:** Completed

The client rejected the frame-sequence / video hero concept, so it was removed
entirely and the real-time Three.js elevator hero (which had been kept intact,
commented out) was restored as the homepage hero.

**Removed:**
- `sections/experience/FrameSequenceHero.tsx` + `FrameSequenceHero.module.css`
  (the scroll-scrubbed canvas frame player).
- `public/images/home/hero-frames/{desktop,mobile}/` — all 360 frame WebPs
  (~17 MB), plus the git-ignored `image-sources/home/hero-frames/` archive.
- `imagegeneration.md` §9.1 "Hero frame sequences", §10 "Cinematic Hero Video"
  (the exploded-reveal video prompt suite), and the intro "Hero upgrade — SHIPPED"
  note.

**Restored:** `app/page.tsx` now imports and renders `<ElevatorHero />`
(`sections/experience/ElevatorScene.tsx`, unchanged) instead of
`<FrameSequenceHero />`. This matches the `CLAUDE.md` architecture note, which
always described the homepage hero as the Three.js scene.

**Kept (part of the 3D concept, not the video concept):**
`public/images/3D_Elevetor/*` (the 8 component photos used by the hero hotspot
modals) and all `ElevatorScene`/`ElevatorHero` code.

**Notes / decisions:**
- The prior frame-concept DONE.md entries below are left as historical record
  (permanent log); this entry supersedes them for the current hero state.
- Remaining `FrameSequenceHero`/`hero-frames` strings exist only in `.next/` and
  `out/` build caches, which regenerate on the next build.
- The frame concept and the separate exploded-video prompt suite are recoverable
  from git history if ever revived.

**Verification:** no source file references `FrameSequenceHero`; `app/page.tsx`
renders `ElevatorHero`; homepage confirmed rendering the Three.js hero (see below).

---

## 2026-07-14 11:35 IST

### Hero frames: AI super-resolution (Real-ESRGAN) — replaces Lanczos upscale

**Status:** Completed

Client approved an AI super-resolution pass to push hero sharpness past what the
Lanczos upscale (11:21 entry) could reach. Re-upscaled all 360 source frames
with **Real-ESRGAN** (`realesrgan-ncnn-vulkan`, official GitHub v0.2.5.0 release,
~43 MB, downloaded to scratchpad — NOT committed) and re-encoded to WebP at the
same paths/dimensions, so it is a pure drop-in (no `FrameSequenceHero.tsx`
change).

**Model choice (A/B tested on frame 165 before committing to 360):**
- `realesrgan-x4plus` (photo model): sharpest on the elevator structure but
  **hallucinated** the small COP button grid and warped the baked-in label text
  — unacceptable for a product hero.
- `realesr-animevideov3 -s 2` (CGI/anime-video model): clean, faithful edges on
  the metal structure (which is most of every frame), labels equal-or-crisper at
  real viewing scale, no melted UI. **Chosen.**

**Pipeline** (`scratchpad/esrgan-batch.mjs`): for each set, run
`realesrgan-ncnn-vulkan -i <src-dir> -o <tmp> -n realesr-animevideov3 -s 2 -f png`
on the archived originals, assert 180 outputs in frame order, then
`sharp(png).webp({quality})` → `public/images/home/hero-frames/<set>/frame-NNN.webp`
(desktop q80, mobile q74). GPU time ≈80 s for all 360 (Vulkan).

**Result:** desktop 1696×956 ≈7.3 MB, mobile 956×1700 ≈8.8 MB — both *smaller*
than the Lanczos versions (9 / 10.4 MB) because the AI output compresses cleaner.
Old Lanczos WebPs overwritten in place; git restaged (360 webp).

**Verified in preview:** dev server serves the new frames (fetch `cache:reload`
→ 1696×956, image/webp, ~45 KB), 180 loaded, frame 90 draws non-blank; a
1/90/180 progression strip confirms the assemble→explode ordering survived the
per-set ESRGAN round-trip (script asserts `ezgif-frame-NNN`→`frame-NNN` mapping).

**Limitation (unchanged, told to client):** AI SR restores acutance but cannot
recover detail absent from the 848 px source. A client re-render at ≥1600 px
wide is still the only true fix; documented in imagegeneration.md §9.1.

**Affected files:** `public/images/home/hero-frames/**` (360 webp re-generated),
`imagegeneration.md` §9.1, `DONE.md`. (`FrameSequenceHero.tsx` unchanged — already
`.webp`.)

---

## 2026-07-14 11:21 IST

### Hero frames enhanced: 2× upscale + sharpen → WebP (blur fix)

**Status:** Completed

**Problem:** the client flagged the hero as blurry — the supplied 848×478 /
478×850 JPEGs were being cover-scaled ~2.2× by the canvas on desktop viewports,
and the sources are heavily compressed.

**Fix:** batch-enhanced all 360 frames with the project's existing `sharp`
dependency: `blur(0.4)` (suppresses JPEG grain so sharpening doesn't amplify it)
→ 2× Lanczos3 resize → `sharpen()` → WebP. Desktop 1696×956 q80
(`sharpen sigma 1.2, m1 0.8, m2 2.6`) ≈9 MB/set; mobile 956×1700 q74
(`sigma 1.1, m1 0.7, m2 2.3`, lighter to keep cellular weight down) ≈10.4 MB/set.
Chosen after A/B/C crop comparison (plain 2× vs sharpen vs denoise+sharpen) and
verified with a before/after crop of the shipped file: label text and component
edges clearly crisper, no halos. Only one set downloads per device,
progressively. Public `.jpg` frames deleted (originals remain archived in
git-ignored `image-sources/home/hero-frames/`); `frameSrc()` now points at
`.webp`. Git index restaged (360 webp added, 360 jpg dropped).

Regenerate (from `image-sources/home/hero-frames/<set>/ezgif-frame-*.jpg`):
`sharp(src).blur(0.4).resize({width: W, kernel: "lanczos3"}).sharpen({...}).webp({quality: Q})`
with W=1696/956, Q=80/74 and the sharpen params above (desktop/mobile).

**Verified in preview:** 2× WebP served (probe naturalWidth 1696), zero .jpg
requests, 180 frames loaded in the designed order (first → last → anchors),
frame 165 draws non-blank; `tsc` + eslint clean.

**Honest limitation (told to client):** Lanczos + sharpening raises acutance
but cannot invent detail. The true fix is client re-rendering at ≥1600 px wide,
or an AI super-resolution pass (Real-ESRGAN — needs a tool download/approval).
Documented in imagegeneration.md §9.1.

**Affected files:** `sections/experience/FrameSequenceHero.tsx` (frameSrc →
.webp + header note), `public/images/home/hero-frames/**` (360 .webp replace
360 .jpg), `imagegeneration.md` §9.1, `DONE.md`.

---

## 2026-07-14 11:03 IST

### Homepage hero: Three.js scene → scroll-driven image sequence (canvas)

**Status:** Completed

Replaced the visible Three.js hero with a **scroll-scrubbed image-sequence
hero** playing the client's rendered exploded-elevator frames (the §10
imagegeneration.md concept, delivered as stills). The Three.js implementation is
**commented out, not deleted** — `sections/experience/ElevatorScene.tsx`,
`ScrollStory.tsx`, `ElevatorHero.tsx`, `ComponentModal.tsx` and their CSS are all
untouched; `app/page.tsx` keeps the import + JSX as clearly-marked comments.

**Assets.** Client supplied two 180-frame JPEG sequences (not 240 as first
described — actual count is 180): landscape 848×478 (folder `pcversionzip`) and
portrait 478×850 (folder `laptopversionzip` — despite the name, it is the
mobile/portrait set). Reorganised per the image-asset rule into
`public/images/home/hero-frames/{desktop,mobile}/frame-001…180.jpg` (git index
restaged for the move), originals archived in git-ignored
`image-sources/home/hero-frames/`. They bypass the WebP/manifest pipeline by
design (canvas needs raw frames; ≈5.3 MB total for all 360). Documented in
imagegeneration.md §9.1 + §10 status + top note.

**New component:** [`sections/experience/FrameSequenceHero.tsx`](sections/experience/FrameSequenceHero.tsx)
(+ module CSS), same pinning pattern as the old hero: 400vh section, sticky
100vh/100svh stage.
- **Scroll → frame:** a ScrollTrigger (Lenis already drives ScrollTrigger via
  SmoothScroll) maps section progress 0→1 to frames 1→180, with small holds
  (4% start, 6% end) so the headline settles and the final labelled diagram
  lands before unpin. Scrolling up reverses naturally; after the last frame the
  page continues to the next section.
- **Rendering:** one `<canvas>`, cover-fit draw (centered, cropped, never
  distorted), DPR capped at 2, `imageSmoothingQuality: "high"`; redraws only
  when the frame index actually changes (or resize/sequence switch) — no React
  re-renders on scroll, overlay fades are direct style writes on refs.
- **Preloading:** frame 1 + final frame first, then every 6th as scrub anchors,
  then the rest through a 6-wide concurrency pool; while a frame is in flight
  the nearest loaded frame is drawn and the loader redraws when a better one
  lands (no blanks/flicker on fast scrubs). Scrubbing into an unloaded region
  jumps those frames to the front of the queue.
- **Device detection:** `(orientation: portrait)` picks the mobile sequence,
  landscape picks desktop (a portrait tablet correctly gets the portrait set;
  detection at mount + on media-query change + on window resize as fallback for
  webviews that throttle observer delivery). Each variant has its own lazy
  store, so rotation switches sequences and reuses anything already cached.
- **Overlay:** eyebrow + H1 ("Engineered for movement.") + sub in the initial
  HTML (crawlable, verified present in the static export), fading out over the
  first ~10% of progress together with its legibility scrim so the scrim never
  dims the baked-in component labels of the later frames; "Scroll to explore"
  cue fades even faster. Mobile drops the copy to the lower third over a bottom
  scrim.
- **Reduced motion:** no pin (100vh section), no ScrollTrigger, static first
  frame, copy always visible, and only frame 1 is downloaded (`useSyncExternalStore`
  for the media query — SSR-safe, no setState-in-effect lint violation).
- **QA hook:** `window.__philbrickHero` ({frame, desired, variant, loadedCount,
  progress, drawIndex}) mirroring the old hero's hook pattern; removed on unmount.

**Navbar:** the homepage hero is now dark in BOTH themes (the frames are a dark
studio scene), so the light-theme homepage special case is gone —
`overlay = "dark"` always ([`Navbar.tsx`](components/layout/Navbar.tsx), with the
original logic kept in a comment for the Three.js restoration; unused `useTheme`
import removed).

**Verification:** `tsc` exit 0; eslint clean (after switching reduced-motion
detection to `useSyncExternalStore`); production build compiles + all 58 static
pages generate, `out/` contains all 360 frames and the prerendered H1 (`npm run
build` "exit 1" is the known npm-wrapper phantom on this shell — the log has
zero errors and artifacts are complete). In-pane QA via the debug hook (pane
freezes rAF, so screenshots/live tween can't be captured): frame 1 drawn with
non-blank pixels; frames 1/46/91/136/180 all draw distinct checksums;
scrollY→progress→frame verified at 0 / 0.1 / 0.5 / 0.694 / ~0.99 including
reverse scrubbing (frame 92 → 12 → 1) and end hold (frame 180 by p≈0.94); copy +
scrim fade 1→0 over the first ~10% and return; portrait pane boots the mobile
variant (portrait canvas 750×1624, 180 frames, full scrub + return).

**Known limitations / follow-ups:**
- Source frames are 848×478 / 478×850 — soft on large/hi-DPI screens when
  cover-scaled. If the client can re-render at ≥1600px wide (and ideally the
  same 240 frames they mentioned), drop-in replace per imagegeneration.md §9.1.
- The old hero's interactive component hotspots/modal don't exist in the frame
  hero (labels are baked into the frames instead). The exploded-frame hotspot
  overlay (§10.6 component map) is a possible future enhancement.
- `data/elevatorComponents.ts`, `data/model.ts`, `data/environment.ts` and
  `public/models`/`public/hdri` remain in place solely for the parked Three.js
  hero.

**Affected files:** `app/page.tsx`, `components/layout/Navbar.tsx`,
`sections/experience/FrameSequenceHero.tsx` (new),
`sections/experience/FrameSequenceHero.module.css` (new),
`public/images/home/hero-frames/**` (360 files, moved + renamed),
`image-sources/home/hero-frames/**` (archive, git-ignored),
`imagegeneration.md` (top note, §9.1, §10 status), `DONE.md`.

---

## 2026-07-14 10:38 IST

### Fix: FAQ rows vanished when opened (reveal-class wipe)

**Status:** Completed (bug fix on the 10:26 FAQ change)

**Symptom:** after the FAQ was rebuilt as a client accordion, opening a row made
its text (question *and* answer) disappear, leaving an empty gap. Reported with a
screenshot showing opened rows blank while closed rows rendered fine.

**Cause:** [`RevealObserver`](components/providers/RevealObserver.tsx) reveals
`[data-reveal]` elements by adding the `.is-visible` class **imperatively** to the
DOM node (that class flips `opacity: 0 → 1`, see the `[data-reveal]` rules in
[`globals.css`](styles/globals.css)). My new [`FAQSection`](sections/shared/FAQSection.tsx)
put `data-reveal` on the row **and** set its className to
`cn(styles.item, isOpen && styles.itemOpen)`. On open, React re-rendered, saw a
new className string (`item itemOpen`) and rewrote the DOM `className` — **wiping
the observer's `.is-visible`**. The row fell back to `[data-reveal]`'s base
`opacity: 0` and disappeared (its height stayed, hence the empty gap). The old
native-`<details>` version never hit this: it was a server component with a
static className.

**Fix:** keep the reveal element's className **static** (`className={styles.item}`)
and express the open state through the trigger's `aria-expanded` instead of a
class on the row. CSS now reads it via `.item:has(.question[aria-expanded="true"])`
(border accent) and `.question[aria-expanded="true"] .marker::after` (plus→minus).
React never rewrites `.item`'s className, so `.is-visible` survives every toggle.

**Verification:** `tsc` clean. In the preview, simulated the observer
(`item.classList.add('is-visible')`) then opened the row: the row **kept**
`is-visible` and `opacity: 1` (before the fix it would have been wiped to
`opacity: 0`). Confirmed `:has()` is supported and, with the CSS transition
disabled, the open row's border resolves to the azure accent
(`rgba(47,172,236,0.42)`) — i.e. the open-state selectors match. Swept all other
`data-reveal` usages: every one uses a static className, so none share this bug.

**Affected files:** `sections/shared/FAQSection.tsx`,
`sections/shared/FAQSection.module.css`.

---

## 2026-07-14 10:26 IST

### UI fixes: smooth FAQ, Gmail email links, simplified Products menu

**Status:** Completed

Three client-requested UX fixes. No redesign, no content changes.

**1. FAQ accordion now opens/closes smoothly.**
[`FAQSection`](sections/shared/FAQSection.tsx) used native `<details>/<summary>`,
which snap open with no animation. Rebuilt it as a client component using the
shared Framer Motion collapse timing ([`lib/motion.ts`](lib/motion.ts):
`collapseMotion` + `collapseTransition`, the same pattern already shipping in the
mobile nav) — an `AnimatePresence` height tween inside an `overflow:hidden`
wrapper. Kept the exact editorial design (mono index numerals, plus→minus marker,
hairline rows). Each row toggles independently; the plus marker rotates to a minus
via CSS. `<summary>` became a reset `<button>` with `aria-expanded` /
`aria-controls`; the `[open]` CSS selectors moved to an `.itemOpen` class. Applies
on both the Contact and Products pages (both use `FAQSection`).

**2. Email links open Gmail, not the desktop mail app (Outlook).**
Added `gmailHref()` to [`constants/site.ts`](constants/site.ts) which builds a
Gmail web compose URL (`mail.google.com/mail/?view=cm&fs=1&to=…`). Replaced the
`mailto:` links in [`Footer`](components/layout/Footer.tsx) and the
[Contact page](app/contact/page.tsx) contact methods; they open in a new tab
(`target="_blank" rel="noopener noreferrer"`). Phone numbers already use the
`tel:` protocol (opens the dialpad on phones) in the footer, contact page and
mobile nav — verified consistent, left unchanged. The contact form is unaffected
(it posts via FormSubmit, never used `mailto:`).

**3. Products menu simplified (client was getting lost in the mega menu).**
Replaced the two-pane [`MegaMenu`](components/layout/MegaMenu.tsx) (left category
rail + hover-reveal detail pane + flagship image card) with a clean, flat grouped
dropdown in the same style as the About dropdown (`NavDropdown`): the five product
groups as headed columns listing all 14 categories as one-click links, plus a
"View all products" link. No images, no flagship card, no hover-to-reveal
sub-panels. The panel is a full-width, click-through centering layer wrapping a
capped-width card, so it never overflows the viewport. Rewrote
`MegaMenu.module.css` accordingly. Navbar and MobileNav needed no changes (same
`item.mega.groups` data; mobile accordion untouched).

**Verification:** TypeScript compiles clean (`tsc --noEmit`, exit 0). DOM-verified
in the preview: 2 email links → Gmail with `target="_blank"`, 0 `mailto:` left;
phone links → `tel:+919978986631`; FAQ = 4 animated buttons (aria-expanded toggles
both directions, answer mounts/unmounts, 0 `<details>` left); Products menu = 5
group headings + 14 category links + "View all products", 0 old rail/feature/detail
elements. The open/close *tweens* couldn't be filmed here — the in-app preview
pane freezes `requestAnimationFrame` (0 frames), and the user's real Chrome can't
reach the agent-side dev server — but the animation uses the proven production
`collapseMotion` pattern and the state logic is confirmed.

**Affected files:** `sections/shared/FAQSection.tsx`,
`sections/shared/FAQSection.module.css`, `constants/site.ts`,
`components/layout/Footer.tsx`, `app/contact/page.tsx`,
`components/layout/MegaMenu.tsx`, `components/layout/MegaMenu.module.css`.

**Known limitation / follow-up:** the `feature` (flagship ARD card) block in
`MAIN_NAV` Products ([`constants/navigation.ts`](constants/navigation.ts)) is now
unused by the desktop menu (ARD is still reachable as a category). Harmless dead
data; can be removed in a later cleanup.

---

## 2026-07-14 10:24 IST

### WordPress content migration to frontend

**Status:** Completed

Replaced dummy/placeholder content across the frontend with real content
extracted from the client's WordPress database backup (UpdraftPlus SQL dump from
acharyagroup.in / philbrickindia.com). The WordPress site was treated as the
primary source of truth. Existing UI design, layout, animations and the 3D
experience were preserved.

**What changed:**

- **Contact info** (`constants/site.ts`): email → `philbrick@philbrickindia.com`,
  salesEmail → `sales@philbrickindia.com`, careersEmail →
  `hr.philbrickindia@gmail.com`, phone → `+91 99789 86631`, added `phones` array
  (4 numbers), `whatsapp`/`whatsappUrl`, hours → "Mon to Fri, 09:00 to 18:00",
  legalName → "Philbrick Technologies (India) Pvt. Ltd." (with parentheses),
  address removed "Odhav" from line1.
- **Social links** (`constants/site.ts`): added Facebook, Instagram, Twitter from
  WP footer.php; added `FiFacebook` to icon registry (`lib/icons.ts`).
- **Company content** (`data/company.ts`): replaced ABOUT_STORY with 3 real WP
  paragraphs about founding, activity and industrial segments. Expanded TIMELINE
  from 4 entries to 11 real milestones (1992-Today). Added QUALITY_POLICY (3
  paragraphs from WP page ID 3) and CAREER_CONTENT (2 paragraphs from WP page
  ID 3435). Updated INFRASTRUCTURE descriptions with real WP data (10,000+ sq ft,
  R&D, ISO QC). Kept MISSION/VISION unchanged (WP had "Coming soon").
- **Product descriptions** (`data/products.ts`): updated child product
  descriptions with real WP spec data for automatic-door-controller (XPLA
  models), manual-door-controller (EPM/XPLM), hydraulic-controller
  (XPLA-Hydra/EPM-Hydra), parallel-type-controller (INTL-360),
  serial-can-bus-type-controller (INTL-380 64 Landing), mrl-control-panel
  (AS380). Updated category longDescriptions (RISC microprocessor, Galvanic
  Isolation, Lift Power LP440/LP220, LMP66/LMP110 BLDC, cabin variants, STEP
  partnership). Updated Synergy Auto Door children with real dimension data from
  WP tables.
- **Page content**: AboutPreview (homepage) → WP-sourced founding text; About
  page metadata → WP description; Contact page → correct legal name; Network
  page → "G.I.D.C. Kathwada" (no "Odhav"); ContactForm → philbrickindia.com
  page field.
- **Stats** (`data/stats.ts`): manufacturing facility → "10,000+ sq ft at GIDC
  Kathwada, Ahmedabad".
- **Footer** (`components/layout/Footer.tsx`): fixed double period in copyright
  line (legalName ends with "Ltd." + template period).
- **Config**: `.env.example` updated contact email; `public/llms.txt` updated
  legal name, phone, email, address.

**Content NOT changed (by design):**
- Mission/Vision statements (WP said "Coming soon"; kept existing editorial copy).
- News & Events items (no matching WP news content found; kept placeholder).
- Product images (current images are custom brand photography, not unrelated
  dummy images; WP has real product photos in `uploads/` if the client prefers).
- Pages without matching WP content retain existing dummy UI data.

**Verification completed:**
- Homepage: About section, footer contact info, social links all correct.
- About page: full WP company story, infrastructure, quality policy, timeline.
- Contact page: phone, email, address, hours, legal name all correct.
- Products: Elevator Control Panel (WP specs), ARD (Lift Power LP440/LP220),
  Synergy Auto Door (dimension data), Integrated Control Panel subcategories.
- Infrastructure page: WP-sourced descriptions, stats.
- Milestone page: all 11 WP timeline entries rendered.
- No console errors on any page. TypeScript compiles cleanly.
- Grep confirmed: old phone (80478 52949), old email (info@philbrick), "Odhav"
  all removed from codebase.

**Affected files:** `constants/site.ts`, `lib/icons.ts`, `data/company.ts`,
`data/products.ts`, `data/stats.ts`, `components/layout/Footer.tsx`,
`components/forms/ContactForm.tsx`, `sections/home/AboutPreview.tsx`,
`app/about/page.tsx`, `app/contact/page.tsx`, `app/network/page.tsx`,
`.env.example`, `public/llms.txt`.

**Follow-up:** WP has ~100+ real product photos in `wordpress/wp-content/uploads/`
that could replace the current brand photography if the client prefers authentic
product shots. The WP also has an additional email (`philbrick_controls@yahoo.com`)
not used anywhere in the frontend.

---

## 2026-07-14 12:33 IST

### Re-point §10 hero-video prompt suite to the exploded-elevator concept

**Status:** Completed (documentation)

Rewrote **§10 "Cinematic Hero Video"** in [`imagegeneration.md`](imagegeneration.md)
from the earlier night-city journey (city → lobby → cabin → cabin fixtures) to an
**exploded technical reveal** driven by the client's product-catalogue reference
image: a fully assembled elevator system pushes in, opens into a cutaway, and its
major components separate outward into a symmetric exploded overview. Kept the same
production-suite rigor and structure; swapped the parts and the motion concept.

**What changed:**
- Concept + camera grammar: system stays dead-centred; one push-in, then parts
  translate straight out (top rises, sides slide, lower descends) and settle. No
  city, tower, lobby or cabin-interior journey.
- Parts now match the reference set: traction machine, control panel + ARD, overload
  annunciating device, door operator, fan/blower, floor-announcing system, COP/LOP
  with display, safety light curtain, lift display, landing doors, accessories, plus
  the shaft spine (car, counterweight, rails, ropes, governor, pit buffers, ladder).
- Restructured subsections: §10.0 production strategy (the **10 s single-clip rule**
  the client specified, primary two-keyframe + interpolation method via Kling v3.0
  start+end frames, fallback text-to-video, optional chained beats), §10.1 rewritten
  master consistency block (system + parts + dark studio void + strict no-text/label/
  arrow negatives), §10.2 keyframe A (assembled), §10.3 keyframe B (exploded), §10.4
  primary 10 s video prompt, §10.5 six chained beats, §10.6 component explosion map
  table (part → zone), §10.7 QA + integration checklist.
- Updated the file's top "Planned hero upgrade" note to the new concept.

**Context / decisions:**
- Higgsfield generation is currently blocked (connected account is free tier, 0
  credits; video preflights at 17.5 credits, keyframe 2 credits). Kling v3.0 confirmed
  to support start+end frames, 3–15 s, 16:9 — hence the two-keyframe method is primary.
- Free-tier video tools (Kling direct, Hailuo, Vidu) can prototype but carry
  watermarks and **no commercial rights**, so they are not shippable on the client's
  live site; production needs a paid tier or the Three.js route.
- The earlier night-city §10 is preserved in git history (superseded, not lost).

**Affected areas:** `imagegeneration.md` (§10 + intro note).

**Follow-up:** generation still pending on credits/tool choice; scroll-scrubbed
video integration (frame → scroll mapping + hotspots per §10.6) is a separate task to
raise once a final clip is approved.

---

## 2026-07-12 20:05 IST

### Follow-ups: mega-menu rail scroll + rotating product orbit

**Status:** Completed

**Mega menu — left rail now scrolls.** The category rail could overflow the panel
on short viewports but wouldn't scroll: `.rail`/`.detail` used `max-height: 100%`,
which can't resolve because `.inner` is a grid with `align-items: start` and no
*definite* height (the row is content-sized, so `100%` = the tall content height →
no constraint). Fix: `.inner` now exposes its usable height as a custom property
`--menu-max-h: calc(100vh - var(--nav-h) - 1rem)`, and the scrollable columns bound
themselves to `calc(var(--menu-max-h) - 4.5rem)` (minus the panel's block padding).
Verified at 1440x700: rail `max-height` resolves to 536px, `overflow-y: auto`,
`scrollHeight 917 > clientHeight 536`, scrolls 381px; detail/feature stay put.

**Section 02 orbit — the ring now revolves, cards stay upright.** Per request, the
six category nodes now orbit "The Philbrick system" core continuously, while each
card stays horizontal ("straight"). Technique: `.orbit` spins `orbitSpin` 0→360°;
each node gets a new counter-rotating wrapper `.nodeSpin` running `orbitCounter`
0→-360° at the identical 40s/linear rate, so the ring's rotation is cancelled at
the card and text never tilts. The wrapper is separate from `.node` so it doesn't
collide with the hover lift or the entrance `data-reveal` (both use transform on
`.node`). Motion is gated behind `@media (prefers-reduced-motion: no-preference)
and (min-width: 821px)` — reduced-motion users and mobile keep the static ring /
spine. It pauses ONLY while a clickable card is hovered (`.stage:has(.node:hover)`)
or focused (`:focus-within`) — not over empty stage space or the core — so the ring
keeps turning until you actually target a node. Verified: hovering the core/empty
area leaves it `running`, hovering a card flips both `.orbit` and `.nodeSpin` to
`paused`, moving away resumes. Verified: `.orbit` animation `orbitSpin` 40s, `.nodeSpin` `orbitCounter`
40s (6 wrappers); a node swept 91° around the core while its AABB height held at
~80px (a co-rotating card would balloon to ~199px), proving it stays upright.

**Section 02 core — centered + round.** The "The Philbrick system" hub sat
off-axis (down-right by half its size): it centered itself with `transform:
translate(-50%, -50%)`, but it also carries `data-reveal="scale"`, and the reveal
utility ends on `transform: none` (globals.css) — which overrode the centering
transform once revealed (a single element can't hold both transforms). Fix: a new
`.coreWrap` owns the centering transform (no `data-reveal`), so the reveal's
transform lives on the inner `.core` and can't move it. The core is now a circle
(`aspect-ratio: 1; border-radius: 50%`, ~220px) instead of a rounded square; on
mobile it reverts to the rounded-rectangle row for the vertical spine. Verified:
core center == node centroid (Δ 0,0), 220.8x220.8 with border-radius 50%, mobile
spine intact (~0 overflow), light + dark.

**Affected Areas:** `components/layout/MegaMenu.module.css` (`.inner`/`.rail`/
`.detail` height model), `sections/home/ProductsShowcase.tsx` (`.nodeSpin` +
`.coreWrap` wrappers), `sections/home/ProductsShowcase.module.css` (spin/
counter-spin keyframes + motion-safe media query, circular centered core).

**Technical Decisions:**
- Shared the panel height via a CSS custom property instead of hard-coding a vh
  calc on each column, so the padding math lives in one place.
- Counter-rotation on a dedicated wrapper (not `.node`) keeps three independent
  transforms from fighting: positioning (`.nodeItem`), spin-cancel (`.nodeSpin`),
  hover/reveal (`.node`).
- 40s/revolution + hover/focus pause keeps the motion calm and the links usable,
  in line with the "premium, intentional, reduced-motion-safe" motion rules.

**Known Limitations:**
- The orbit only animates >=821px (below that it's the static vertical spine, which
  has no ring to rotate).

---

## 2026-07-12 19:51 IST

### Requirements 28–30: interior lighting, part-image hotspot modals, mega-menu UX, Home 02/03 redesign

**Status:** Completed

**28 — Interior lighting rebalance (interior-only, exterior untouched):**
- The lobby/cabin was overexposed. Fixed by dialling interior-dominant lighting,
  not global brightness: `soft1` 3.2→1.7, `soft2` 1.8→0.95 (RectArea softboxes);
  the warm `key` DirectionalLight now eases 2.0→1.0 by `insideT`; interior IBL
  target eased to `INTERIOR_ENV` 0.9→0.72 (was `ENV.intensity` 1.25); tone-mapping
  exposure ×0.76 once inside; lobby marble `floorMat` roughened (0.14→0.34) and
  darkened so it stops blowing to white; chrome tamed (`steel`/`panelMat`/`mirror`
  envMapIntensity + roughness); emissive pulses (COP screen, ceiling LED) lowered.
  All gated by `insideT` (0 during exterior beats) so the tower/sky/moon/stars and
  day/night arc are unaffected. Verified day + night, both interior beats.

**28 — 8 realistic part images + redesigned hotspot modal:**
- Audited all 8 renders in `public/images/3D_Elevetor` (2400×1792). Clean 1:1
  mapping to the hero components (image → key): car-operating-panel→control-panel,
  security-key-switch→key-switch, display-screen→display, emergency-call→emergency,
  door-mechanism→doors, traction-machine→motor, safety-system→safety,
  interior-design→interior. No image ambiguous; none reused.
- `data/elevatorComponents.ts` gained an `image` field. `ComponentModal` rebuilt
  into a premium **image + info split** (image left / scrollable info right on
  desktop, stacked on mobile): Next.js Image, responsive, aspect-preserved, alt
  text; background scroll locked (Lenis stop + overflow, restored on close);
  Escape + Tab-trap + focus restore to the trigger; theme-aware via tokens; a
  "Explore Philbrick products" link to the real /products route.
- `scripts/optimize3DElevator.mjs` generates 384/640/960 WebP variants (≈9–55 KB
  vs 1.5 MB PNG) and merges them into `lib/imageManifest.json`, so `imageLoader`
  serves modal images as WebP — mobile-safe, lazy (loads only when a hotspot is
  opened). Source PNGs kept.

**28 — deliberate decision (documented):** the 8 images are **complete composed
renders with backgrounds**, not surface/cutout textures. Mapping them onto the
procedural elevator's small meshes would show their backgrounds and look wrong,
and loading eight 2400px textures would risk the mobile jitter the earlier passes
fixed. Per the spec's own guidance ("prioritize the hotspot modal image
experience"), the correct integration point is the redesigned modal. No floating
image planes were added to the 3D scene.

**29 — Products mega menu:**
- Scroll is now **scoped**: `.inner` is `overflow: hidden` (the whole panel no
  longer scrolls); the category **rail** and the **product list** each scroll
  independently only when they overflow; the detail header stays fixed. Kept the
  previous Lenis fix (`data-lenis-prevent` + `overscroll-behavior: contain`).
- Subcategory chevrons are bolder/clearer (size + weight + colour), rendered
  **only** for categories that actually have children.
- Product-group headings (Control & Drives, Safety & Intelligence, Doors &
  Mechanism, Cabin & Fixtures) now read as a clear hierarchy: an accent tick
  before each title + a hairline rule between groups. Verified light + dark.

**30 — Home sections 02 & 03 fully redesigned (distinct concepts):**
- **02 The Range → "Product Orbit"** (`ProductsShowcase`): six categories orbit a
  central "Philbrick system" core on concentric rings (CSS orbit via per-node
  angle); collapses to a connected vertical **system spine** on mobile. Nodes link
  to their categories.
- **03 What We Offer → "Partnership Journey"** (`ServiceEcosystem`): the four real
  offerings (Manufacture · Configure · Modernise · Support) as a linear continuum
  along a drawn progress line with numbered nodes; vertical spine on mobile.
- Radial (02) vs linear (03) read as clearly different but share tokens, the
  numbered-eyebrow system, typography and motion. Line-draw + node reveals use the
  existing `[data-reveal]` utilities (reduced-motion safe). Both themes, mobile
  recomposed, ~0 horizontal overflow.

**Affected Areas:**
- `sections/experience/ElevatorScene.tsx` (interior lighting), `ComponentModal.tsx`
  + `.module.css`, `data/elevatorComponents.ts`, `scripts/optimize3DElevator.mjs`,
  `lib/imageManifest.json`, `public/images/3D_Elevetor/*` (WebP),
  `components/layout/MegaMenu.module.css`, `sections/home/ProductsShowcase.*`,
  `sections/home/ServiceEcosystem.*`.

**Technical Decisions:**
- Interior lighting driven entirely by `insideT` so it can't touch the exterior;
  chrome/floor material tweaks are global but only visible inside.
- Modal images through the existing WebP pipeline (new dedicated script) rather
  than serving raw PNGs — keeps the mobile-perf guarantee.
- Mega-menu scoped scroll via per-column `overflow` + `max-height: 100%` against a
  bounded, non-scrolling `.inner` — no new scroll-lock machinery.
- Section concepts are pure CSS/SVG-free layout + existing reveal utilities (no
  new Three.js scene, no new deps).

**Verification (dev server + Puppeteer + `__vertiqHero` scrub hook):**
- Interior day + night at the lobby and explore beats (rebalanced, floor reads,
  components still clearly visible). Modal: opens from a hotspot, image served as
  `...-640.webp`, scroll locked, Escape closes + restores scroll, has the products
  CTA — dark, light, mobile. Mega menu: `.inner overflow=hidden`, `.rail
  overflow-y=auto`, 5 chevrons (only sub-cat categories), 5 group headings.
  Sections 02/03: desktop dark + light + mobile, ~0 overflow. `npm run build`
  green (58/58 pages). Zero page errors; zero failed image responses.

**Known Limitations:**
- Component explore close-ups still read fairly bright where the camera sits right
  under the cabin LED cove; pushing darker would fight the "components must be
  clearly visible" requirement, so the balance favours visibility.
- `components/cards/ServiceCard.*` is now unused (section 03 no longer renders it);
  left in place (not imported, not bundled) to avoid churn — safe to delete later.

**Follow-up:**
- If the client wants an in-3D-scene image beyond the modal, commission cutout
  (transparent-background) part renders that can texture a plane cleanly.

---

## 2026-07-12 18:24 IST (cinematic hero video prompt suite)

### Add the video-generation prompt suite for a photoreal scroll-scrubbed hero

**Status:** Completed (documentation only — no code changed; generation pending)

**Changes:**
- New **§10 "Cinematic Hero Video"** in [`imagegeneration.md`](imagegeneration.md):
  a complete, production-ready video-generation prompt suite for replacing the
  procedural Three.js hero with a photoreal continuous shot — night city →
  forward push to the main tower → through the glass lobby → into the elevator →
  in-cabin component reveals (wall finish/handrail, COP, doors + azure floor
  display + door-operator header) → doors part on a night sky-lobby.
- **Multi-clip strategy** (the honest call): no current model holds one
  identical building/elevator/cabin across ~50 s in a single generation, so the
  sequence is **6 chained ~8 s clips** (VID-001…VID-006) with: a **MASTER
  CONSISTENCY BLOCK** pasted verbatim into every prompt (fixed tower, elevator,
  cabin, palette #109BDD azure + warm amber, night environment, camera grammar,
  strict negative list), **last-frame → first-frame conditioning** between
  clips, and explicit per-clip START/END STATE descriptions so each clip begins
  exactly where the previous ends. A §10.9 **single-prompt variant** covers
  future ≥50 s tools.
- **Camera grammar codified:** exactly two motions in the whole film, each in
  one unwavering direction — a single straight-forward dolly (clips 1–5), then,
  only after translation stops, a single clockwise pan for the component
  reveals (clip 6). 35 mm spherical, 24 fps, eye height locked at 1.60 m,
  documented rationale in §10.8.
- **Brand-safety:** all prompts forbid readable text/logos; the Philbrick
  wordmark is composited in post from `public/brand/logo.png` (§10.10), same
  reasoning as the site's 3D decal.
- Header note in the doc now points to §10 as the planned hero upgrade.

**Affected Areas:** `imagegeneration.md` only.

**Follow-up:** user generates the 6 clips (chained, per §10.0), delivers to
`public/videos/hero/`; the scroll-scrubbed playback integration replacing
`ElevatorScene` is a separate implementation task raised on approval.

---

## 2026-07-12 08:09 IST (default theme: dark for first-time visitors)

### Dark is the brand default; a visitor's chosen theme persists

**Status:** Completed (full cycle verified on the production build)

**Change:** the pre-paint `themeInitScript` (ThemeProvider) previously fell back
to the OS `prefers-color-scheme` for first-time visitors — a light-mode OS got
the light site. It now defaults to **dark unconditionally**; only a theme the
visitor picked with the toggle (saved in `localStorage["philbrick-theme"]`)
overrides it on return visits. Persistence on toggle already existed.

**Also:**
- `viewport.themeColor` no longer follows the OS (was a light/dark media pair,
  contradicting the dark default): single `#0A0E14`, updated at runtime by the
  init script + `ThemeProvider.apply()` (`#FFFFFF` when light is chosen) so the
  mobile browser chrome always matches the actual page theme.
- No-JS fallback already dark (`:root` carries the dark tokens in tokens.css).

**Verification (production build, real browser):** shipped HTML contains **zero**
`prefers-color-scheme` references (OS never consulted). First visit (storage
cleared) → `data-theme="dark"`, meta `#0A0E14`, nothing stored. Navbar toggle →
light + `localStorage=light` + meta `#FFFFFF`. Fresh load on another route →
**still light** (persisted, applied pre-paint by the inline script — no flash).

**Affected Areas:** `components/providers/ThemeProvider.tsx`, `app/layout.tsx`.

**Follow-up:** None.

---

## 2026-07-12 08:01 IST (network map: marker accuracy + all-city labels)

### Fix markers drifting off the coastline; label every city

**Status:** Completed (0 label collisions, all 31 markers verified inside the landmass)

**Problems (user-reported, confirmed):** some coastal dots sat on or outside the
outline, and only 8 cities had permanent labels while the client's reference
artwork names all of them.

**Root causes + fixes:**
1. **Coordinate-space bug:** the HTML marker buttons were positioned as
   percentages of the UNPADDED map size while the SVG viewBox includes padding —
   biasing every marker ~2% left/up (what pushed west-coast dots onto the sea).
   Buttons now use the same padded space (shared `PAD` constants).
2. **Simplified-coastline drift:** true lat/lng of coastal cities (Kandla,
   Mumbai, Goa, Chennai, Kochi, Thiruvananthapuram) can fall outside the
   450-point simplified polygon. Added a point-in-polygon **radial nudge** in
   `NetworkMap.tsx`: the smallest displacement in any direction that puts a
   marker safely inside (a centroid-directed nudge fails on the tapered east
   coast — Chennai's centroid direction points seaward). Max real nudge: 7.5
   map units (invisible at scale).
3. **All 31 cities now carry permanent labels** as SVG `<text>` (scales with the
   map like the client's print artwork) with per-city placement hand-tuned in
   `data/network.ts` (labelDx/labelDy/labelAnchor, mirroring the reference's
   label sides) + a background-matched halo (`paint-order: stroke`) for
   readability over dots/arcs in both themes. Hover/selection tooltip now shows
   the STATE (name is always visible). Labels fade in with the reveal.

**QA harness:** new [`scripts/checkNetworkMap.mjs`](scripts/checkNetworkMap.mjs)
parses `data/network.ts` + `data/indiaMap.ts`, replicates the projection/nudge,
**asserts every marker is safely inside the landmass**, and renders a dark+light
preview PNG for collision review. Verified: ✓ all 31 inside; in-page pairwise
label-bbox scan → **0 overlaps** (fixed the Gujarat cluster: Kandla above its
dot, Ahmedabad below the HQ dot, Rajkot below); no horizontal overflow.

**Affected Areas:** `sections/network/NetworkMap.{tsx,module.css}`,
`data/network.ts`, `scripts/checkNetworkMap.mjs` (new).

**Follow-up:** None.

---

## 2026-07-12 07:44 IST (requirement 27: cinematic India network map)

### Network page: interactive India service network map

**Status:** Completed (build green; interaction, themes, mobile geometry and
data integrity verified on the production build)

**Data integrity (the hard requirement):**
- City list = **exactly the 31 cities on the client's own "Our Domestic
  Business" India map** (artwork supplied by the user, 2026-07-12) — recorded in
  [`data/network.ts`](data/network.ts) with a source-of-truth header forbidding
  additions. Ahmedabad is the emphasised HQ point, as on the artwork. Spellings
  normalised (Srinagar, Bhubaneswar); states are plain geography.
- No invented coverage: no dealer counts, no service-centre counts, no
  "pan-India" claims. The stat rows show only verified facts: 31 network
  cities (count of the client map), Ahmedabad factory/HQ, exports to China &
  Taiwan (existing verified copy). Supply arcs are documented in-source as
  **decorative composition**, not logistics routes.
- **India outline:** generated from DataMeet's `india-composite` boundary (the
  Survey-of-India convention — full J&K, matching the client's artwork) by the
  committed [`scripts/generateIndiaMap.mjs`](scripts/generateIndiaMap.mjs):
  242k points Douglas-Peucker-simplified to 450 (5 KB path) with shared
  projection constants in [`data/indiaMap.ts`](data/indiaMap.ts). Islands
  omitted, as in the client's reference. Outline + all 31 projected cities
  visually verified against real geography before implementation.

**Experience** ([`sections/network/NetworkMap.tsx`](sections/network/NetworkMap.tsx) + module CSS):
- Custom SVG map — no Google Map, no mapping library: glowing national outline
  (drop-shadow) drawn on reveal; **dot-matrix interior as ONE pattern-masked
  rect** (not thousands of elements); faint engineering grid + radial halo;
  8 decorative supply arcs from Ahmedabad with travelling light pulses;
  31 city nodes (azure) + red HQ node with pulse ring.
- Interaction: every node is a real `<button>` (hover tooltip city · state,
  focus ring, `aria-pressed`, keyboard operable); selecting updates an
  `aria-live` info panel (kicker "Headquarters & factory"/"Network city", city,
  state, honest body copy, HQ address, contextual contact CTA, verified stat
  rows). Default selection = Ahmedabad. Touch: 36px hit targets on coarse
  pointers; hover never required.
- Reveal-once via IntersectionObserver (+4s fallback so the map can never stay
  hidden); staggered node pops; arcs draw last. **Reduced motion:** complete map
  immediately, arcs become faint static lines, no loops — enforced by wrapping
  every animation in `prefers-reduced-motion: no-preference` and arming
  pre-reveal hiding only via JS (no-JS visitors also get the finished map).
- Performance: all motion is CSS; React state = selected city + one reveal flag;
  no rAF loops; ~31 buttons + 8 paths + 3 masked shapes total.
- Layout: SectionHeader (centered eyebrow rule) + map ~62% / panel ~38% on
  desktop, stacked under 1020px; alternating section backgrounds untouched
  (new section slots into the global nth-of-type system).

**State boundaries decision:** national outline + dot-matrix interior instead of
internal state borders — accurate state polygons need heavy geodata conflicting
with the performance requirement, and the client's own reference artwork also
shows no state boundaries. Documented per "where technically practical".

**Verification (production build):** desktop 1280px — 31 nodes, 8 arcs, default
HQ panel, click Chennai → panel + `aria-pressed` update, no horizontal overflow.
Mobile 375px — stacked layout, tap Mumbai → panel updates, no overflow. Themes —
static cascade verified (dark arc/dots .55/.34 vs light .7/.5; nodes 28px,
opacity 1). IO fallback fired where IO was unavailable. (The preview pane's
frozen renderer cannot play CSS animations — entrance/pulse tweens are standard
CSS; a real visible browser runs them.)

**Affected Areas:** `data/{network,indiaMap}.ts`, `scripts/generateIndiaMap.mjs`,
`sections/network/NetworkMap.{tsx,module.css}`, `app/network/page.tsx`.

**Known Limitations:**
- The 31-city list is client artwork; confirm it stays current with the client
  before major releases (single edit point: `data/network.ts`).
- Permanent labels show for 8 anchor metros only (all cities label on
  hover/focus/selection) to avoid label collisions at small sizes.

**Follow-up:** None.

---

## 2026-07-12 07:20 IST (mobile nav drawer scroll fix)

### Make the mobile menu scrollable when the product accordion overflows

**Status:** Completed (geometry-verified at 375×812 on the production build)

**Problem:** with Products (and a category) expanded, the drawer's nav list grew
taller than the viewport and could not be scrolled — items below the fold were
unreachable.

**Root causes (two, both fixed):**
1. `.body` had `flex: 1; overflow-y: auto` but **no `min-height: 0`** — a column
   flex item never shrinks below its content by default, so the list grew past
   the panel and `overflow-y` never engaged.
2. The drawer stops Lenis while open, and a **stopped Lenis preventDefaults
   touch/wheel globally** — the same root cause as the earlier mega-menu scroll
   bug. The panel lacked the `data-lenis-prevent` exemption.

**Changes** (`components/layout/MobileNav.module.css`, `MobileNav.tsx`):
- `.body`: `min-height: 0` + `overscroll-behavior: contain` +
  `-webkit-overflow-scrolling: touch`.
- `.head` / `.foot`: `flex-shrink: 0` (header + Theme/CTA/phone stay pinned
  while only the nav list scrolls).
- `data-lenis-prevent` on the drawer `aside`.

**Verification:** production build served at 375×812; drawer opened, Products +
a category expanded → nav list `scrollHeight 1282` vs `clientHeight 551` with
`overflow-y: auto`, programmatic scroll 0→400 works, footer pinned,
`data-lenis-prevent` present. (Touch gestures themselves can't be simulated in
the preview pane; both root causes are fixed and the scroll region is proven.)

**Follow-up:** None.

---

## 2026-07-12 07:14 IST (requirements 24 + 25 + 26: logo spelling, preloader line, contact form email)

### Fix "phibrick" → "philbrick" in the logo artwork; sequence the preloader seam line; real contact form delivery

**Status:** Completed (build green; delivery to the configured inbox confirmed by
FormSubmit `success:true` after the user activated the endpoint)

**24 — Logo spelling (root cause + repair):**
- The user was right: the elevator branding was missing its "l" — but the defect
  was in the **supplied artwork itself**. Both `public/brand/logo.png` AND the
  pre-cleanup `logo-source.png` read **"phibrick"** (8 glyph runs, verified by
  pixel column analysis and visual inspection), while the client's original
  low-res `logo.jpg` and the older generated `philbrick-logo.png` read
  "philbrick". The earlier transparency fix did NOT cause it.
- **Repair (image surgery on `logo.png`):** measured every glyph box, shifted
  "phi" left 14px and "brick"+® right 35px (® stays well inside the canvas),
  and inserted a new "l" cloned from the **b's own left ascender stem**
  (x718–750, a pure vertical bar y31–192) — so weight, height, terminals and
  colour match the typeface by construction. Result: 9 glyph runs, verified
  visually. Canvas stays 1277×286, so no component dimensions changed.
- Regenerated `philbrick-og.png` from the repaired logo (1200×630, navy
  `#0A0E14`); dark tagline/® recoloured to light steel **in the OG only** so the
  full lockup reads on navy. Favicons/mark derive from the emblem — unaffected.
- The 3D elevator decal, navbar, preloader and Coming Soon all load this same
  file, so every surface now shows "philbrick". Decal legibility verified by
  simulating the texture at 120/240/420px on the dark header (the "l" is clearly
  visible at all sizes); day/night identical by construction (unlit material).
  Light theme verified on white. Code sweep for text misspellings: none found.
- CLAUDE.md architecture note fixed (`philbrick-logo.png` → `logo.png`).

**25 — Preloader: seam line only after the countdown:**
- New phase between countdown and doors in `Preloader.tsx`:
  `boot → arrive → open → done` (was boot → open). The **same promise chain that
  ends the countdown** (min sequence ∧ page load, or the hard cap) now triggers
  `arrive`; `open` follows after `LINE_MS` (460ms). No arbitrary CSS delays, so
  the sequence cannot desynchronise on fast/slow devices.
- `Preloader.module.css`: `.doorEdge` is now fully hidden during boot
  (`opacity: 0; transform: scaleY(0)`) and draws in top→bottom on
  `[data-phase="arrive"]` (0.42s ease-out scaleY + 0.18s fade), staying lit
  through `open` so it rides the door edges apart. Reduced motion: no line
  travel (transition removed; straight to the quick fade as before).
- **Verified with a live timeline probe** on the built site: `boot` (line
  computed opacity 0 for the whole countdown, t≈316–2106ms) → `arrive` (2106ms)
  → `open` (2601ms ≈ arrive + LINE_MS) → removed (3709ms). Steady-state cascade
  checks confirm hidden-in-boot / visible-in-arrive+open. (The in-app preview's
  frozen renderer cannot tween transitions, which initially masked the reveal —
  the state and cascade are proven; the tween is standard CSS.)

**26 — Premium contact form + email delivery (no backend):**
- `ContactForm.tsx` rewritten: the old form **simulated** success with a
  setTimeout and delivered nothing. It now POSTs JSON via `fetch` to
  **FormSubmit.co's AJAX endpoint** — works on the static export with no
  backend, no Next API route/Server Action, no nodemailer, no `mailto:`, and the
  visitor never leaves the page.
- Recipient configured via **`NEXT_PUBLIC_CONTACT_FORM_TO_EMAIL`** (placeholder
  in `.env.example` with full setup notes; real inbox only in git-ignored
  `.env.local`). Documented that `NEXT_PUBLIC_*` is browser-visible — acceptable
  for a delivery address (FormSubmit needs no API key; no secrets involved), and
  the FormSubmit random alias can replace the raw address post-activation.
- Fields: Full name*, Work email*, Phone, Company, Inquiry type (Product /
  Technical Support / Dealer or Network / Business / General), Message*,
  consent*. Honeypot `_honey` (visually hidden, tabIndex −1) + FormSubmit
  server-side filtering; `_captcha` disabled (cannot render in the AJAX flow).
- Email is readable (`_template: "table"`, labelled fields, IST "Submitted At"
  timestamp, subject "Philbrick website enquiry: <type>").
- UX: inline validation with `aria-invalid`/`aria-describedby`, disabled button
  + spinner while sending (duplicate-submission guard), success panel that
  clears the form **only after confirmed success**, failure banner
  (`role="alert"`) that preserves every entered value for retry.
- Styling extends the existing token system (new `.banner`, `.spinner`, `.hp`);
  light/dark and responsive behaviour inherit the proven form styles.
- **Verified end to end:** empty submit → all 4 inline errors; filled submit
  through the real React form → FormSubmit accepted and the success panel
  rendered; final confirmation POST returned `{"success":"true"}` — the
  endpoint is **activated** (user clicked FormSubmit's activation link) and
  test submissions are delivering to the configured inbox.

**Affected Areas:** `public/brand/{logo.png,philbrick-og.png}`,
`components/providers/{Preloader.tsx,Preloader.module.css}`,
`components/forms/{ContactForm.tsx,ContactForm.module.css}`,
`.env.example`, `.env.local` (git-ignored), `CLAUDE.md`.

**Technical Decisions:**
- Repair the supplied wordmark via same-file glyph cloning rather than re-setting
  text in a lookalike font — the inserted "l" is pixel-identical in style.
- FormSubmit.co over Web3Forms/Formspree: no account or API key, the endpoint is
  derived from the env-configured address, and activation is a single inbox
  click — the only workable secretless flow for a fully static export.
- Preloader phases over CSS delays so countdown completion is the single source
  of truth for the line reveal.

**Known Limitations:**
- `logo-source.png` (haze original) still shows "phibrick"; kept verbatim as the
  as-supplied archive. Ask the client for corrected master artwork if they have it.
- FormSubmit free tier marks very high volumes as spam-filtered; if volume grows,
  swap the env var to a FormSubmit random alias (also hides the raw address) or
  upgrade — no code change needed.
- The in-app preview cannot render transitions/screenshots (frozen renderer);
  final visual polish of the line draw + form themes is worth one glance on a
  real browser.

**Follow-up:** Optionally replace `NEXT_PUBLIC_CONTACT_FORM_TO_EMAIL` with the
FormSubmit random alias (Settings on formsubmit.co) to keep the raw inbox out of
the page source, then rebuild.

---

## 2026-07-11 18:35 IST (3D hero: brand on the elevator + mobile performance)

### Move Philbrick branding to the elevator; investigate + fix mobile jitter

**Status:** Completed (build green; scene renders with no runtime errors; visual +
real-device FPS pass deferred to the user's device — see limitations)

**A. Branding — building → elevator** (`sections/experience/ElevatorScene.tsx`):
- Removed the backlit `PHILBRICK` canvas-text sign from the building podium; the
  facade is now clean/unbranded. Removed the now-unused `SITE` import.
- Added a Philbrick logo **decal on the elevator car's door-operator header** (a
  real elevator brand surface): `/brand/logo.png` via `TextureLoader`, on a plane
  at the logo's native **1277:286** aspect ratio (never stretched). Unlit
  `MeshBasicMaterial` + `toneMapped:false` so it reads identically in day, night
  and through the transition; `depthWrite:false` + `renderOrder` + a small
  stand-off so it never z-fights the header. Visible in the doors/lobby beats,
  present but not dominating the scene.

**B. Mobile performance — evidence-based investigation** (raw three.js + GSAP, not
R3F; single manual `requestAnimationFrame` loop):
- *Root causes (code/config, not just "weak GPU"):*
  1. **DPR capped at 2 for every device** (`setPixelRatio(min(dpr,2))`) → a
     high-DPR phone rendered a full-screen, post-processed scene (bloom + SMAA +
     MSAA) at up to 2× — the dominant mobile GPU cost.
  2. **Loop rendered continuously even when the hero was off-screen / tab hidden**
     — the 1300vh section stays mounted (static export), so a full frame kept
     rendering while the user scrolled the content below, contending with
     scroll compositing → jitter + battery drain.
  3. **Redundant anti-aliasing** (`antialias:true` MSAA **and** an SMAA post pass)
     + a **2048² shadow map**.
- *Investigated and cleared (not the cause):*
  - **React re-renders:** scroll → 3D is ref-driven (`progress.current`);
    `setActive`/`setBeat` are change-guarded, so no per-frame React reconciliation.
  - **Lenis:** configured with `syncTouch:false` → touch scrolling is already
    native (Lenis only smooths the wheel), so it is not hijacking touch. Kept
    Lenis; the jitter was render-cost driven, so reducing frame cost fixes it
    without a global scroll change.
  - **Stars/moon:** already adaptive (`compact` → 200 vs 420 stars) and cheap.
- *Fixes (desktop path unchanged):*
  - `lowPerf` flag = coarse pointer **or** min-viewport < 760 **or** ≤ 4 cores.
  - **DPR cap 1.5** on `lowPerf` (vs 2 desktop) — the biggest per-frame GPU saving.
  - **Shadow map 1024²** on `lowPerf` (vs 2048²).
  - **Skip the SMAA pass** on `lowPerf` (MSAA already resolves edges).
  - **Pause the render loop off-screen + when hidden** (IntersectionObserver on the
    canvas host + `visibilitychange`; `start()` resets the day/night dt so there is
    no jump on resume). Applies to all devices — a large, safe win.
  - **One-way adaptive DPR watchdog** (`lowPerf`): after a 1.6s warm-up, sample 72
    frames; if the average frame > 23 ms (~<43 fps) drop DPR one step **once** and
    rebuild buffers. Never raises again → no oscillation / monitoring feedback loop.

**Affected Areas:** `sections/experience/ElevatorScene.tsx`, `CLAUDE.md`.

**Verification:** `next build` green (TS clean, 58 routes). Ran the dev server +
in-app browser: the WebGL scene **renders** (canvas sized 1587×1000, shaders
compiled, **no error-level console output**), and `/brand/logo.png` is fetched
**twice** — once by the navbar and once by the elevator's `TextureLoader` —
confirming the brand decal is live in the 3D scene. The in-app preview **cannot
screenshot the hero** (its rAF freezes the capture) and did not expose the dev
`__vertiqHero` hook, both known quirks of this scene in the preview harness.

**Known limitations (code-level vs hardware):**
- *Addressed at the code/config level:* DPR, redundant AA, shadow size, off-screen
  rendering, per-frame React work.
- *Genuine hardware floor:* a full-screen post-processed WebGL scene (bloom +
  physical transmission/anisotropic materials) is fragment-bound; on very old /
  low-end mobile GPUs it may still not hold a locked 60 fps even at DPR 1.5 with
  SMAA off. The watchdog drops to a **DPR 1.0 floor**; below that, the existing
  **CSS `ScrollStory` fallback** (already used for no-WebGL / reduced-motion) is
  the graceful degradation. This is a real GPU/thermal limit, not a code defect.
- *Pending on a real device (per the user's own plan):* the visual day↔night decal
  check and measured mobile FPS — the preview harness can't validate GPU perf or
  screenshot the animated hero.

**Follow-up:** User to confirm the decal placement/legibility + mobile smoothness on
a physical device; tune the decal size/position or the `lowPerf` thresholds if needed.

---

## 2026-07-11 18:11 IST (truthful Coming Soon "in the meantime" message)

### Make the Coming Soon suggestion point only to genuinely live pages

**Status:** Completed (verified against a production-gated build)

**Problem:** the `ComingSoon` screen invited visitors to "explore our products or
get in touch with the Philbrick team", and its CTA linked to `/contact` — but in
production **both `/products` and `/contact` are gated**, so those links led to
more Coming Soon screens.

**Changes** (`components/release/ComingSoon.tsx`):
- Computes the live pages from `releasedRoutes()` (the released **top-level** routes,
  excluding the current gated route and deep product routes), so the copy only ever
  references pages that actually resolve to real content. It expands automatically
  as routes are flagged live in `config/pageReleases.ts`.
- Dynamic sentence via a small `joinLabels()` helper: 1 page →
  "In the meantime, explore our Home page."; multiple → "… our Home, About and
  Contact pages." The action buttons are generated from the same live list
  (Home first, "Back to home"; others secondary).
- Added `/`, `/about`, `/contact`, `/products` to `STATIC_LABELS` for friendly names.

**Verification:** production-gated build (`NEXT_PUBLIC_APP_ENV=production`) →
`/about`, `/products`, all gated pages render **"In the meantime, explore our Home
page."** with a single **Back to home** CTA; `/` stays real content. Reverted
`.env.local` to `development` and rebuilt (staging default: all pages open).

**Known Limitations:** the global Navbar (mega menu) + Footer still list the full
site (including gated routes) by design — they communicate the whole product range;
individual pages gate. Trim later if a Home-only chrome is preferred in production.

**Follow-up:** None.

---

## 2026-07-11 17:48 IST (2 remaining images supplied + PNG clarification)

### Integrate the last 2 images; consolidate flat duplicates; keep source PNGs

**Status:** Completed (production build green, 60/60 images, 0 broken paths)

**Changes:**
- The user dropped the full flat set of 60 PNGs back into `public/images/` root,
  including the two previously missing: `application-hospitality.png` and
  `category-synergy-auto-door.png`. Re-ran `node scripts/optimizeImages.mjs` →
  **60/60 processed, 0 missing**; the 60 flat root files were consolidated into the
  `image-sources/` archive (0 loose PNGs remain in the root) and regenerated
  page-wise as PNG + WebP variants + manifest (now 60 entries).
- **Hospitality** re-enabled: added `INDUSTRY_IMG.hospitality`, restored the card in
  `IndustriesShowcase.tsx` (7 sectors again) and the ScrollStory fallback tile.
- **Synergy Auto Door** switched from the interim child photo to its real cover:
  `CATEGORY_IMG["synergy-auto-door"]` → `synergy-auto-door.png`; removed
  `SYNERGY_COVER_INTERIM` in `data/products.ts` (now `cover("synergy-auto-door")`).
- **Clarified the PNG question (user asked to remove them if unneeded):** the source
  `.png` files are **required and were kept** — each is the `og:image` (social share
  card) and the Product/Article JSON-LD (SEO) image for its page (verified in `out/`:
  `og:image … /images/products/…png`, `lib/schema.ts` `image: product.image`).
  Crawlers/scrapers fetch the raw `.png` directly (the WebP loader never runs for
  them); visitors only download the small WebP. Only the redundant flat duplicates
  were removed. Documented in `CLAUDE.md` + `imagegeneration.md §9`.

**Affected Areas:** `data/images.ts`, `data/products.ts`,
`sections/home/IndustriesShowcase.tsx`, `sections/experience/ScrollStory.tsx`,
`public/images/**` (60 PNG + 274 WebP), `lib/imageManifest.json`,
`imagegeneration.md`, `CLAUDE.md`.

**Verification:** `next build` green (TS clean, 58 routes); served `out/` → all 7
application sectors present, Synergy uses `synergy-auto-door.png` (home thumb +
og:image), **314 image refs / 0 broken / 0 Unsplash**.

**Follow-up:** None — all 60 images live. Apply the `render.yaml` cache headers on Render.

---

## 2026-07-11 17:38 IST (requirements 22 + 23: image integration + Pingdom performance)

### Integrate all generated images + optimise per the HAR performance report

**Status:** Completed (production build green, static output verified, docs updated)

**22 — Image audit, organisation & integration:**
- **Audit vs `imagegeneration.md`:** 58 of 60 required images were supplied. The
  two missing were identified exactly (reported to the user with full prompts):
  **IMG-015 Hospitality** (`home/application-hospitality.png`, §3.4) and **IMG-024
  Synergy Auto Door cover** (`products/synergy-auto-door/synergy-auto-door.png`,
  §4.6). No duplicates, no unused, no mis-named files. (The supplied files were
  actually JPEG-encoded despite the `.png` extension, 94-475 KB, 1536-2752 px.)
- **Reorganised** the 58 flat PNGs into page-wise folders under `public/images/`
  (`home/ about/ vision-mission/ milestone/ infrastructure/ network/ news-events/
  products/<category>/ contact/ shared/`) with descriptive kebab names; full-res
  originals archived to `image-sources/` (git-ignored).
- **Optimisation pipeline** ([`scripts/optimizeImages.mjs`](scripts/optimizeImages.mjs)):
  keeps the verbatim PNG source of record + generates responsive **WebP** width
  variants (role-based ladders) and [`lib/imageManifest.json`](lib/imageManifest.json).
  266 WebP variants, ~17 MB total (~58 KB avg); the browser fetches one right-sized
  WebP per slot (7-330 KB).
- **Loader** ([`lib/imageLoader.ts`](lib/imageLoader.ts)) rewritten: maps each local
  `/images/**.png` + width to the nearest pre-generated WebP variant via the
  manifest, so next/image keeps full `srcset` behaviour with **no server** (static
  export). Non-manifest assets (logo, OG, icons) pass through.
- **Removed every Unsplash/external image:** rewrote `data/images.ts` to local
  paths (dropped `img()`/`ID`/Unsplash); `data/products.ts` wires per-node category
  + product images; `data/news.ts` uses `NEWS_IMG`. Verified **0 Unsplash** in
  `out/` and **0 broken paths** across 306 referenced image files in all HTML.
- **Accessibility:** descriptive, context-specific `alt` on every meaningful image
  (heroes, section media, applications, news); decorative images keep empty alt.
- **Missing-image handling (no unrelated substitutes):** the Hospitality card is
  omitted from `IndustriesShowcase` until supplied; the Synergy category cover uses
  a documented interim (its own `2-panel-centre-opening` photo).

**23 — Pingdom HAR analysis & performance fixes** (evidence: `har.json`, Render):
- **Findings (prioritised):** *Critical* — third-party Unsplash (953 KB / 15 reqs,
  TTFB up to ~1 s) + risk of shipping unoptimised source images. *High* — one
  294.7 KB (brotli) JS chunk = three.js loaded eagerly; `Cache-Control: max-age=0`
  on immutable `/_next/static/*` (Render default). *Medium/Low* — fonts already 2
  woff2 via next/font (fine); CSS/HTML/JS already brotli.
- **Images:** all now self-hosted, right-sized, WebP → removes the third-party host
  + its TTFB, and delivers per-device sizes. Below-the-fold images lazy-load;
  heroes keep `priority`.
- **JS:** the Three.js hero is now **dynamically imported** (`next/dynamic`,
  `ssr:false`) via [`sections/experience/ElevatorHero.tsx`](sections/experience/ElevatorHero.tsx)
  with a reserved-height night-shell fallback. The 901 KB (raw) three.js chunk is
  split off the critical path (confirmed absent from the initial `index.html`
  chunk graph); initial JS dropped ~1745 KB → ~960 KB raw. The experience is
  unchanged. Removed dead `sections/experience/Projects.tsx` (+ CSS).
- **Caching (deployment-level):** added [`render.yaml`](../render.yaml) with
  immutable long-cache for `/_next/static/*` + `/fonts/*` and 30-day for
  `/images/*` + `/brand/*`. Apache/cPanel already correct via `public/.htaccess`.
  Documented that Render dashboard-managed services must set the same headers in
  Settings → Headers (a static export cannot set its own response headers).

**Affected Areas:**
- New: `scripts/optimizeImages.mjs`, `lib/imageManifest.json`,
  `sections/experience/ElevatorHero.tsx`, `render.yaml`, `public/images/<page>/…`
  (58 PNG + 266 WebP), `image-sources/` (archive, git-ignored).
- Changed: `lib/imageLoader.ts`, `data/{images,products,news}.ts`,
  `app/{about,infrastructure,vision-mission,milestone,network,news-events,products,contact}/page.tsx`,
  `app/page.tsx`, `sections/home/{AboutPreview,IndustriesShowcase}.tsx`,
  `sections/shared/CTASection.tsx`, `sections/experience/{ScrollStory.tsx,ElevatorScene.module.css}`,
  `imagegeneration.md`, `CLAUDE.md`, `.gitignore`, `.claude/launch.json`.
- Removed: `sections/experience/Projects.{tsx,module.css}`.

**Technical Decisions:**
- Static export has no runtime optimiser, so WebP delivery is **pre-generated** at
  build time + committed (host needs no sharp). This is the "clear technical
  reason" to convert; the PNG source of record is kept per the brief.
- Kept the PNG source **verbatim** (not re-encoded to palette PNG) since the loader
  always serves WebP and palette PNG would only add banding.
- Dynamic hero uses `ssr:false` (WebGL can't SSR) behind the existing elevator
  preloader, so there is no perceived regression.

**Known Limitations:**
- 2 images still MISSING (IMG-015, IMG-024) — tracked in `imagegeneration.md §9`;
  interim handling in place until supplied.
- Render `max-age=0` on hashed assets is deployment-level; the code/`render.yaml`
  fix only applies once adopted in Render (Blueprint or dashboard headers).
- WebP covers ~97% of browsers; the ~3% without it fall back to the PNG source.
- The 3D hero's live WebGL render was validated via HTTP/asset checks + the
  server-rendered fallback shell (the preview pane can freeze on the hero's rAF).

**Follow-up:** When the 2 missing images arrive, drop them at their §9 paths, run
`node scripts/optimizeImages.mjs`, re-enable the Hospitality card, and repoint the
Synergy cover to `synergy-auto-door.png`. Apply the `render.yaml` headers on Render.

---

## 2026-07-11 14:42 IST (image generation catalog)

### Create imagegeneration.md — full brief for custom, India focused imagery

**Status:** Completed (brief only — no images or code changed yet)

**Changes:**
- Audited every image the site actually renders (traced from `data/images.ts`
  through each consuming page/section) and wrote **`imagegeneration.md`** at the
  frontend root: a complete, page by page catalog of **60 images** to generate as
  custom replacements for the current Unsplash placeholders.
- Each entry lists **Image Title, suggested File Name, Page, Section, exact Aspect
  Ratio, and a detailed AI generation prompt** — with the aspect ratio stated both
  in the details and inside every prompt (as required).
- Aspect ratios were taken from the real component CSS, not guessed: page heroes
  16:9 (`PageHero`, full bleed), section media 4:5 (`AboutPreview`/about story/
  infra intro), applications 3:4 (`IndustriesShowcase` 340×440 cards), product
  card 4:3 (`ProductCard`) reused for category/product heroes + 4:5 overview
  (`TechShowcase`), news 16:9 (`NewsCard` 16:10 card + detail hero), CTA band 21:9.
- Groups: 8 page heroes · 3 section media · 7 applications · 14 product categories ·
  21 individual (nested) products · 6 mock news · 1 CTA band. Product prompts are
  written **per exact product name and category** (control panels, ARD, door
  operators, displays by model, COP/LOP, voice modules, etc.), technically
  accurate, not generic.
- Added a **global brand + photography style guide** at the top so all 60 read as
  one consistent Indian brand shoot (premium/cinematic/ultra realistic, cool clean
  grade with restrained azure + red accents, Indian context and people, explicit
  "no text/logos/AI artifacts" guardrails).

**Affected Areas:**
- `imagegeneration.md` (new, frontend root). No source, data or image files changed.

**Technical Decisions:**
- Excluded assets that need no photo: the homepage hero (procedural Three.js scene)
  and the already custom logo/favicon/app icons/OG (`public/brand/`).
- One image per category serves card (4:3) + hero (16:9) + overview (4:5), so
  prompts instruct centred subjects with margin for clean `object-fit: cover` crops.
- Named `§1–§4 + §6 + §7 (42 images)` as the minimum set to remove all Unsplash;
  `§5` (21 per product images) as the recommended follow on for product accurate
  detail pages.

**Known Limitations:**
- News imagery (`§6`) is for the currently **mock** newsroom; regenerate with real
  event photography when real news is published.

**Follow-up:** When the user returns the generated image folder, place the files
under `public/` and rewire `data/images.ts` (drop the `img()` helper + Unsplash
`ID` map), plus per leaf `image` in `data/products.ts` and `data/news.ts`, so no
external stock images remain.

---

## 2026-07-11 14:13 IST (logo transparency fix)

### Fix white-haze transparency in logo.png

**Status:** Completed

**Changes:**
- The supplied `public/brand/logo.png` had a **white haze/halo**: ~38% of pixels
  were partially transparent with a light matte (e.g. `[241,244,243, alpha 49]`),
  showing as a milky film + halo around the artwork on dark backgrounds.
- Fixed by flattening the logo on white, then cleanly re-knocking-out white to
  transparent with a feather **and un-premultiplying the edges** (removes the
  white fringe). Result: partial alpha 37.9%→3.0%, opaque 0.9%→29.9%, white-fringe
  8.6%→2.0%. The cleaned file replaces `logo.png`; the original is preserved as
  `public/brand/logo-source.png`.
- Regenerated all derived assets from the cleaned logo: `philbrick-mark.png`,
  `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `public/icons/icon-192/512.png`,
  `public/brand/philbrick-og.png`.

**Affected Areas:**
- `public/brand/{logo.png,logo-source.png,philbrick-mark.png,philbrick-og.png}`,
  `public/icons/*`, `app/{favicon.ico,icon.png,apple-icon.png}`.

**Technical Decisions:**
- Un-premultiply feathered edges against white so anti-aliased pixels keep their
  true colour (no light fringe) instead of a lightened blend.

**Known Limitations:**
- The tagline is black, so it stays faint on dark backgrounds at small sizes
  (emblem + wordmark are the primary marks and read cleanly on both themes).

**Follow-up:** None.

---

## 2026-07-11 19:33 IST

### Requirements 20 + 21: elevator preloader, hero environment, day/night arc

**Status:** Completed

**Changes:**
- **Elevator preloader** (`components/providers/Preloader.tsx` + module CSS,
  mounted in `app/layout.tsx`): full-viewport elevator doors with an azure lit
  seam, the Philbrick lockup and a floor indicator stepping G → 1 → 2 → 3; the
  doors slide open to reveal the page, then the component unmounts entirely.
  Timing: opens at max(one full indicator ride ≈ 1.9s, window load), hard cap
  4.2s so it can never stick; scroll locked while active (Lenis stop/start +
  overflow) and restored on exit; no focusable elements (no keyboard trap);
  reduced motion gets a static logo and a quick fade instead of door travel.
- **Hero environment** (`sections/experience/ElevatorScene.tsx`):
  - Context buildings rebuilt: three façade texture variants (mullion grids,
    varied lit windows, warm/cool mix), slight per-building rotation, parapet
    caps and rooftop plant structures (all instanced; a handful of extra draw
    calls in total).
  - Ground composed as a real frontage: entrance paving, planted beds with
    kerbs, sidewalk band, curb, road with dashed centre line, far pavement
    (canvas textures, day/night colour pairs).
  - **Moon** (shaded disc with maria and halo, upper-right open sky) and
    **stars** (single Points cloud, 420 desktop / 200 compact, varied
    brightness, additive) in dark mode; **sun** glow disc in light mode.
  - **Day/night now travels through a sunset**: a third baked sky dome whose
    opacity peaks mid-blend, three-stop palette mixing for fog, hemisphere,
    exposure and key-light colour, slower blend (~2s), and sun/moon arcs
    (sun rises from behind the left skyline, moon sets behind the right;
    buildings depth-occlude them so rise and set read naturally).
- Completed the logo.png switch: fixed remaining references to the
  nonexistent `philbrick-logo.jpg` (navbar `Logo.tsx` full lockup + the new
  preloader) so they use `brand/logo.png`.

**Affected Areas:**
- `components/providers/Preloader.tsx|.module.css`, `app/layout.tsx`,
  `components/ui/Logo.tsx`, `sections/experience/ElevatorScene.tsx`.

**Technical Decisions:**
- The preloader is CSS-only animation (no Three.js); the doors themselves are
  the overlay surface, so the reveal is genuine — the page is visible the
  moment they part.
- Every scene change is uniform/texture-only; light membership is unchanged,
  so no shader recompile stalls (preserves the earlier first-scroll fix). The
  celestial bodies are additive-blended meshes, not lights.
- Adaptive detail via a `compact` flag (viewport under 760px): smaller ground
  textures, fewer stars, no rooftop plant.
- Verified headless (dev server + Puppeteer + the `__vertiqHero` scrub hook):
  preloader in dark/light/reduced motion with unmount + scroll restore, night
  scene (moon/stars), sunset mid-frame, full day (no stars, no moon), mobile
  390px, and `npm run build` green (58/58 pages).

**Known Limitations:**
- The reduced-motion exit measures slower in the dev harness (hydration +
  software GL); production timing is load-bound as designed.
- The day-mode sun glow is subtle against the bright sky by design; the arc
  still brings it through sunrise when toggling themes.

**Follow-up:**
- If the client wants a stronger day-mode sun, raise its glow opacity or move
  the disc higher into the deeper-blue zenith area.

---

## 2026-07-11 14:01 IST

### Switch to the high-res logo.png site-wide

**Status:** Completed

**Changes:**
- The client supplied a high-resolution transparent `public/brand/logo.png`
  (1277×286, emblem + wordmark + tagline). `Logo.tsx` now renders it as the full
  lockup everywhere it appears via the shared `Logo` component — **Navbar,
  Footer, MobileNav and the Coming Soon screen**. Image `width/height` set to the
  real intrinsic size to avoid distortion (CSS controls display height).
- Regenerated all derived brand assets **from logo.png** (via sharp) for
  consistency: the compact emblem `public/brand/philbrick-mark.png` (used for the
  compact logo + icons), `app/favicon.ico` (16/32/48 on a white plate),
  `app/icon.png` (512, transparent), `app/apple-icon.png` (180, white),
  `public/icons/icon-192/512.png` (maskable), and `public/brand/philbrick-og.png`
  (lockup on navy, 1200×630).

**Affected Areas:**
- `components/ui/Logo.tsx`; `public/brand/{logo.png,philbrick-mark.png,philbrick-og.png}`;
  `public/icons/*`; `app/{favicon.ico,icon.png,apple-icon.png}`.

**Technical Decisions:**
- Point the `Logo` component at `logo.png` (single source used across all chrome)
  rather than editing each consumer; derive icons/OG from the same file.

**Known Limitations:**
- The logo's "PROVIDING ELEVATOR SOLUTIONS" tagline is black, so it is faint/invisible
  on dark backgrounds at small sizes; the emblem + blue wordmark (the primary brand
  marks) read clearly on both themes. The old generated `philbrick-logo.png` is now
  unused (kept, harmless).

**Follow-up:**
- If a light-tagline logo variant is wanted for dark surfaces, supply it and add a
  theme-swap in `Logo.tsx`.

---

## 2026-07-11 13:28 IST

### Accordions, News detail pages, centered eyebrows, alternating section backgrounds

**Status:** Completed

**Changes:**
- **Smooth, consistent accordions (req 16).** Added shared timing in
  `lib/motion.ts` (`EASE_OUT`, `ACCORDION_DURATION`, `collapseMotion`,
  `collapseTransition`) used by `FAQAccordion` and `MobileNav` (groups + nested
  category accordions) — one duration/ease everywhere, `overflow:hidden` wraps,
  no jump/flash. Removed the icon spring bounce (now `--ease-out`). Reduced
  motion: `useReducedMotion()` makes height collapses instant, and a global
  `<MotionConfig reducedMotion="user">` (in `SmoothScroll`) reduces transform
  animations (drawer/mega/dropdown). Keyboard/focus behaviour preserved.
- **News & Events detail pages (req 17).** Centralized `data/news.ts` now has
  `slug` + `content` blocks (`p`/`h2`/`list`) + `imageAlt`/`author`/`eventDate`/
  `location`/`featured` (still clearly marked MOCK). New dynamic route
  `app/news-events/[slug]/page.tsx` with `generateStaticParams`, `notFound()` for
  invalid slugs, a readable `container--prose` article layout (eyebrow, title,
  meta, image via hero, headings, lists, back link, related grid). `NewsCard` is
  now a link with a "Read more" affordance + focus-visible state. Detail routes
  enumerated in `config/pageReleases.ts` (`RELEASED_NEWS_ROUTES`, default-deny) so
  they follow the release system — gated (Coming Soon) in production, open in dev.
- **Centered section eyebrows (req 18).** `SectionHeader` + `FeatureGrid` default
  `align="center"`; flipped remaining `align="left"` usages; centered the home
  `AboutPreview` intro, the `CTASection` body, and the custom About/Infrastructure
  story eyebrows (moved above the 2-col block via a `.sectionEyebrow` wrapper).
  Page heroes intentionally keep their dedicated left-aligned styling.
- **Alternating section backgrounds (req 19).** New `--section-bg-a`/`--section-bg-b`
  theme tokens; a positional `main > section:nth-of-type(even)` rule in
  `globals.css` alternates A/B on every page (hero = section 1, keeps its media
  bg). Verified alternation B/A/B/A in-browser; light values are a touch off-white
  so white cards stay visible; no horizontal overflow introduced (checked at 375px
  and 1280px).

**Affected Areas:**
- `lib/motion.ts`, `components/ui/FAQAccordion.*`, `components/layout/MobileNav.tsx`,
  `components/providers/SmoothScroll.tsx`
- `data/news.ts`, `app/news-events/[slug]/*`, `components/cards/NewsCard.*`,
  `config/pageReleases.ts`
- `components/ui/SectionHeader.tsx`, `sections/shared/{FeatureGrid,CTASection}.*`,
  `sections/home/AboutPreview.*`, `app/{about,infrastructure,page,products}.tsx`
- `styles/tokens.css`, `styles/globals.css`, `CLAUDE.md`

**Technical Decisions:**
- One shared motion-timing module rather than per-component durations; reduced
  motion handled with Framer's `useReducedMotion` (height) + `MotionConfig`
  (transform), no CSS-only hacks.
- Alternating backgrounds via a single positional CSS rule (`nth-of-type`) — no
  JS/DOM system, works on every page because sections are direct `<main>` children.
- Heroes excluded from the centering rule (dedicated hero styling, consistent
  with the req-19 hero exemption).

**Known Limitations:**
- 2-col editorial content blocks (`TechShowcase`) keep a left-aligned eyebrow
  inside their text column (they are content blocks, not section headers).
- News detail content is still MOCK (marked in `data/news.ts`).
- `next build` prints `EXIT=1` in this environment (known Next 16 + Turbopack
  tsc-plugin quirk — `out/` generates completely; not from these changes).

**Follow-up:**
- Replace mock news with real articles before releasing `/news-events`.
- Enable news/other routes in `config/pageReleases.ts` as approved.

---

## 2026-07-11 12:07 IST

### UI polish, Home-only production release, favicon, dashes, carousel, map, docs

**Status:** Completed

**Changes:**
- **Production release locked to Home only (secure default-deny).** Reworked
  `config/pageReleases.ts`: `/` is the only `true` static route; all other static
  routes and **all** product routes are disabled. Product routes are enabled via
  an explicit `RELEASED_PRODUCT_ROUTES` allow-list (empty by default), so an
  unlisted product route can never leak to production. `isReleased` denies unknown
  routes. Verified: production build renders real Home; `/products`, `/contact`,
  `/products/ard` etc. render Coming Soon; sitemap contains only `/`. Direct-URL
  access is gated (the built HTML for a disabled route *is* the Coming Soon screen).
- **Mega menu + About dropdown fixes.** Backgrounds changed to a new near-solid
  `--surface-menu` token (`rgba(13,18,26,0.98)` dark / `rgba(255,255,255,0.985)`
  light) so they no longer bleed the page behind them. Added `data-lenis-prevent`
  + `overscroll-behavior: contain` so scrolling over an open menu scrolls the menu,
  not the background page (no duplicate Lenis, no body-lock, attribute-based so
  cleanup is automatic). Verified via computed style + attribute in-browser.
- **Removed unnecessary dashes from user-facing text.** Product names use
  spaces/parentheses (e.g. `Automatic Rescue Device (ARD)`, `XN-1000 LED Segment
  Display`); prose em/en-dash separators became commas/colons; numbered eyebrows
  are `01 Who we are` etc. Kept model numbers (`XN-1000`), compound modifiers
  (`in-house`, `dot-matrix`), slugs and code. `SITE.hours` → `Mon to Sat, 09:30 to
  18:30`. Added the permanent text-formatting rule to `CLAUDE.md`.
- **Favicon / app icons / manifest / OG.** Generated a real multi-size Philbrick
  `app/favicon.ico`, maskable `public/icons/icon-192/512.png`, `app/manifest.ts`,
  and a branded `public/brand/philbrick-og.png` (logo on navy) now used as the OG
  image (absolute URL in JSON-LD). `app/icon.png` + `app/apple-icon.png` already
  Philbrick.
- **04 Applications carousel.** Grew the section to 7 sectors (>5) and converted
  it to a horizontal scroll-snap carousel with theme-aware prev/next arrows
  (keyboard + touch, disabled at ends). Verified the track scrolls (scrollWidth
  2299 > clientWidth) with no page overflow.
- **Section alignment.** Centered the About → Leadership header + team grid and
  the Infrastructure → "At a glance" stats band, matching sibling sections.
- **News & Events content.** Added centralized **MOCK** `data/news.ts` (clearly
  marked as temporary, no fabricated awards/certs/contracts/revenue) + a
  `NewsCard` grid on `/news-events` for layout testing.
- **Contact map.** Added an embedded Google Maps iframe using the verified
  Ahmedabad coordinates (`23.03676, 72.68678`) in a theme-aware container, with
  working "Get directions" and "Open in Google Maps" actions.
- **Created this `DONE.md`** and added the read/update workflow rule to `CLAUDE.md`.
- **Fixed `npm run start`.** `next start` is unsupported under `output: "export"`.
  Added a zero-dependency static server `scripts/serve.mjs` (clean URLs + 404) and
  pointed `start`/`preview` scripts at it (`node scripts/serve.mjs`), so
  `npm run start` serves `out/` offline. Verified: home 200 (real), `/products`
  200 (Coming Soon), nested `/products/ard` 200, favicon/manifest 200, unknown 404.

**Affected Areas:**
- `config/pageReleases.ts`, `lib/release.ts`
- `styles/tokens.css`, `components/layout/{MegaMenu,NavDropdown}.*`
- `data/{products,company,services,faqs,news,images}.ts`, `constants/{site,navigation}.ts`
- many `app/**/page.tsx` + `sections/home/*` (dash cleanup, alignment, carousel)
- `sections/home/IndustriesShowcase.*` (carousel), `components/cards/NewsCard.*`
- `app/{favicon.ico,icon.png,apple-icon.png,manifest.ts}`, `public/{icons,brand}/*`
- `app/contact/{page.tsx,contact.module.css}` (map)
- `CLAUDE.md`, `DONE.md`

**Technical Decisions:**
- Production gating is **default-deny** via a central allow-list; the product
  tree's `released` flags are now content-readiness hints, not the prod gate.
- Menu scroll fixed with Lenis's `data-lenis-prevent` rather than stop/start or a
  global wheel listener — simplest, self-cleaning, no duplicate instances.
- Dash policy: remove spaced/separator dashes from labels + prose; keep model
  numbers and genuine compound modifiers.

**Known Limitations:**
- News & Events content is **mock** (marked in `data/news.ts`) — replace before
  releasing that page.
- Company email + social profiles remain unverified placeholders (in `site.ts`).
- The Google Maps iframe cannot be recoloured (API limitation) — only the
  surrounding container is themed.

**Follow-up:**
- Enable individual routes in `config/pageReleases.ts` as client approval arrives.
- Replace mock news + placeholder email/socials + Unsplash images with real assets.

---

## 2026-07-11 (earlier) — VERTIQ → Philbrick rebrand

### Full rebrand, route-release system, navigation restructure, real content

**Status:** Completed

**Changes:**
- Rebranded the entire site from the fictional **VERTIQ** to **Philbrick
  Technologies India Pvt. Ltd.** (Ahmedabad elevator-component manufacturer,
  founded 1992). Real data centralized in `constants/site.ts` (address, phone,
  GST/CIN/IEC, contacts); fabricated content removed (Pulse™, 1968/Pune, 1.4M
  units, fake execs/testimonials/landmark projects).
- **Colour system** redesigned to azure blue + signal red (from the logo),
  AA-tuned per theme in `styles/tokens.css`.
- **Logo** switched to the real lockup (`public/brand/philbrick-logo.png` +
  `philbrick-mark.png`, transparent PNGs generated via sharp).
- **Environment page-release system** built: `config/pageReleases.ts`,
  `lib/release.ts`, `components/release/{ReleaseGate,ComingSoon}.tsx` (dev = all
  open; prod = flagged routes only, else animated Coming Soon).
- **Navigation** restructured: Home · About ▾ · Products ▾ (two-pane mega) ·
  Infrastructure · Network · News & Events · Contact. New pages added for the
  About sub-items + Infrastructure/Network/News & Events.
- **Products** rebuilt as a real 14-category tree with nested products
  (`data/products.ts`), routes `/products/[category]/[product]`.
- Footer, metadata, OG, JSON-LD, `llms.txt`, sitemap/robots rebranded.
- Docs: `CLAUDE.md` (page-release STRICT RULE), `README.md`, `SITE-STRUCTURE.md`.

**Affected Areas:**
- `styles/`, `constants/`, `data/`, `config/`, `lib/`, `components/`, `sections/`,
  `app/` (routes + metadata), `public/` (brand assets, llms.txt), docs.

**Technical Decisions:**
- Static-export-safe gating (no middleware): build-time env flag + a reusable
  `<ReleaseGate>` wrapping every page.
- Reused the existing token/component/section architecture rather than rebuilding.

**Known Limitations:**
- Email/social profiles unverified (placeholders); images are Unsplash placeholders.

**Follow-up:**
- Superseded by the entry above (Home-only release, UI polish).
