# Homepage Hero — Three.js Implementation

How the cinematic elevator hero on the **homepage (`/`)** is built, how it
syncs to scroll, and how to extend it. The hero is the first thing on the
homepage and hands off — via a light-wipe — into the rest of the site.

> There is **no `/experience` route**. The experience *is* the homepage. The
> hero component lives in `sections/experience/` (folder name only) and is
> rendered first by `app/page.tsx`.

---

## 1. Files

| File | Role |
|---|---|
| [`app/page.tsx`](../../app/page.tsx) | Homepage. Renders `<ElevatorScene/>` then About → Products → Services → Technology → Projects → Industries → Testimonials → CTA. |
| [`sections/experience/ElevatorScene.tsx`](ElevatorScene.tsx) | **The hero.** Capability wrapper + the Three.js `Scene3D`. |
| [`sections/experience/ElevatorScene.module.css`](ElevatorScene.module.css) | Stage / canvas mount / atmosphere / copy positioning / light-wipe. |
| [`sections/experience/ScrollStory.tsx`](ScrollStory.tsx) | **Fallback hero** (hand-built CSS/GSAP elevator) for no-WebGL / reduced-motion. Also the source of the shared copy/HUD/finale styles. |
| [`sections/experience/ScrollStory.module.css`](ScrollStory.module.css) | Shared scene/HUD/finale styling, reused by `ElevatorScene` via `import story from "./ScrollStory.module.css"`. |
| [`data/model.ts`](../../data/model.ts) | Optional GLTF model drop-in config (default off). |
| [`styles/tokens.css`](../../styles/tokens.css) | Global palette/tokens (champagne gold, electric blue, steel, deep black) the hero and overlays use. |

Global [`components/providers/SmoothScroll.tsx`](../../components/providers/SmoothScroll.tsx)
runs **Lenis** and wires it into the GSAP ticker + `ScrollTrigger` site-wide.

---

## 2. Homepage integration architecture

```
app/page.tsx
└─ <ElevatorScene/>     ← 900vh pinned hero; ends in a full-screen light-wipe
   <AboutPreview/>      ← revealed as the wipe fades  ("step out of the elevator")
   <ClientMarquee/> <ProductsShowcase/> <ServiceEcosystem/> <TechnologyPreview/>
   <Projects/> <IndustriesShowcase/> <StatsBand/> <TestimonialsSection/> <CTASection/>
```

The hero is just the first section in normal document flow. Because the wipe
overlay is appended to `<body>` (not trapped in the hero's stacking context), it
can cover the whole viewport during the hand-off and then fade to reveal whatever
section comes next — currently `AboutPreview`.

## 3. Capability wrapper & fallback

```
<ElevatorScene>
  ├─ reduced-motion OR no WebGL → <ScrollStory/>   (CSS/GSAP elevator)
  └─ else                       → <Scene3D/>        (Three.js)
```

`ScrollStory` is a full parallel implementation (same scene copy, HUD, finale)
so the storytelling survives without WebGL. It also renders if a GLTF model fails
to load.

## 4. Scroll synchronization

Two systems, one scroll value:

1. **3D pose** — a `requestAnimationFrame` loop renders every frame and poses the
   scene from `progress.current` (a `useRef`).
2. **HTML copy/HUD + wipe** — a **scrubbed GSAP timeline** whose
   `ScrollTrigger.onUpdate` writes `progress.current`, the progress-bar width, and
   the active HUD index.

```
scroll → Lenis → ScrollTrigger(scrub) → onUpdate → progress.current
rAF loop (always) → pose(progress.current, time) → composer.render()
```

**Pinning** is CSS: the 900vh section (`SCROLL_VH = 900`) contains a
`position: sticky; height: 100vh` stage, so the hero stays on screen while the
section scrolls. We deliberately do **not** use GSAP `pin` (it fights Lenis).

## 5. Scene breakdown (the 6 beats)

`sceneFrom(p)` drives the HUD; `pose()` + the copy timeline use explicit thresholds.

| # | HUD | progress | 3D behaviour | Copy |
|---|---|---|---|---|
| 1 | Arrival | 0.00–0.20 | Lobby wide shot, doors closed, indicator counting down | "Engineered for **movement.**" |
| 2 | The Call | 0.20–0.40 | Camera approaches; **doors part** | "Your elevator **arrives.**" |
| 3 | Step Inside | 0.40–0.60 | At the doorway; interior light comes up | "Into the **cabin.**" |
| 4 | Ascending | 0.60–0.82 | **Shaft markers scroll** behind the glass back + floor indicator climbs (environment moves, not the car) | "The **ascent.**" |
| 5 | Engineering | 0.82–~0.9 | Side panels **fade** to reveal rails / counterweight / machine / ropes | "Beneath the **calm.**" |
| 6 | Destination | ~0.9–1.0 | Warm light blooms → **full-screen wipe** → hands off to the site | finale: "Engineering Every **Journey.**" + CTA |

## 6. `pose(progress, time)` — the analytic driver

Pure function of progress + time (perfectly scrubbable). Highlights:
- **Camera** interpolates a keyframe path (`camKeys`) with `smoothstep` easing and
  always `lookAt`s the centered elevator. A separate `camKeysG` path is used when a
  GLTF model is active.
- **Doors:** `o = smoothstep(0.26, 0.46, p)` slides `doorL/doorR` apart.
- **Ascent:** shaft `markers` translate on a loop (`travel % spacing`); the
  counterweight moves opposite; a canvas-texture floor indicator redraws on change.
- **Engineering reveal:** `panelMat.opacity` fades the side panels.
- **Destination:** `destLight` + LED emissive bloom up.

## 7. Three.js structure

- **Renderer:** `WebGLRenderer({ antialias, alpha })`, ACES filmic tone mapping,
  `PCFShadowMap`, `pixelRatio ≤ 2`.
- **Environment:** `RoomEnvironment` baked via `PMREMGenerator` → realistic IBL
  reflections (does most of the lighting work).
- **Procedural textures:** brushed-metal roughness, marble (floor + walls), stone
  (cabin floor), radial contact-shadow.
- **Materials (PBR):** brushed steel (anisotropy), dark metal, champagne gold,
  transmission glass, mirror, marble, emissive LED/screen/sensor.
- **Lobby:** marble floor, back + side walls, ceiling with warm emissive coves,
  gold pilasters, ambient particles — no black void.
- **Car:** steel frame, **glass back** (panoramic — see the shaft during ascent),
  glass doors + steel stiles, gold corner posts, ceiling LED, COP (buttons +
  screen), handrail, mirror strip, transom + **floor indicator**, interior light.
- **Shaft:** guide rails, counterweight (plates), looping floor markers + lights,
  machine (motor + sheave) and ropes — revealed during ascent/engineering.
- **Lighting:** warm key (shadowed) + cool fill + blue rim + hemisphere + interior
  point + destination point.
- **Post:** `EffectComposer` → `RenderPass` → low `UnrealBloomPass`
  (strength 0.12, threshold 0.9) → `OutputPass` → `SMAAPass`.

## 8. The light-wipe hand-off

A `position: fixed` warm-white overlay (`styles.flash`) is appended to `<body>`
(z-index 9999, `pointer-events: none`). Two coordinated controls:
- The hero timeline ramps its opacity 0→1 over progress ~0.91→1.0 (doors open →
  light floods).
- A separate `ScrollTrigger` (`start: "bottom bottom"`, `end: "+=100%"`) fades it
  1→0 as the next section scrolls up — revealing the site beneath.

Net effect: doors open → camera glides in → light floods → the homepage content
fades in. One continuous scroll, no reload.

## 9. Performance considerations

- One render loop; `pixelRatio` capped at 2.
- Transmission glass + bloom + shadows are the heaviest costs — keep glass
  surfaces few; shadow map at 2048; bloom subtle.
- All geometries/materials/textures/render-targets are disposed on unmount; the
  body-level wipe overlay is removed in the GSAP cleanup.
- Reduced-motion / no-WebGL users get the lightweight CSS `ScrollStory`.

## 10. Future extensibility

- **Swap to a real model:** drop `elevator.glb` in `public/models/`, set
  `MODEL.enabled = true` ([`data/model.ts`](../../data/model.ts)). Best with a
  standalone *cabin* model (not a full room). Named door nodes can be wired to the
  door-open beat.
- **Tune pacing:** `SCROLL_VH`. **Tune scrub:** the `scrub` value.
- **Reframe:** edit `camKeys`. **Re-time scenes:** `sceneFrom()` thresholds +
  the copy-timeline positions (keep them in sync).
- **Add realism later:** depth-of-field (BokehPass) and a mirror-reflective floor
  (Reflector) are the next high-impact additions; add once the base look is locked.
- **Palette:** all colors come from `styles/tokens.css` — change them there.

## 11. Gotchas

- Don't add GSAP `pin` — pinning is CSS `position: sticky`.
- `progress.current` is written only in the timeline `onUpdate`, read in the rAF
  loop. Keep it that way.
- Programmatic `window.scrollTo` doesn't reliably drive Lenis-linked ScrollTrigger;
  scroll via Lenis or set the timeline progress directly when testing.
- Backgrounded tabs freeze `requestAnimationFrame`, so the 3D won't animate in a
  hidden/headless preview (it renders one frame on mount). Verify in a real window.
