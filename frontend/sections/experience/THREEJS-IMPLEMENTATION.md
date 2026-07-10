# Homepage Hero — Three.js Implementation

How the cinematic elevator hero on the **homepage (`/`)** is built, how it
syncs to scroll, and how to extend it. The hero is the first thing on the
homepage; when its pinned scroll ends, the rest of the site scrolls in
normally.

> There is **no `/experience` route**. The experience *is* the homepage. The
> hero component lives in `sections/experience/` (folder name only) and is
> rendered first by `app/page.tsx`.

---

## 1. Files

| File | Role |
|---|---|
| [`app/page.tsx`](../../app/page.tsx) | Homepage. Renders `<ElevatorScene/>` then About → Products → Lifecycle support → Projects → Industries → Stats → CTA. |
| [`sections/experience/ElevatorScene.tsx`](ElevatorScene.tsx) | **The hero.** Capability wrapper + the Three.js `Scene3D`. |
| [`sections/experience/ElevatorScene.module.css`](ElevatorScene.module.css) | Stage / canvas mount / atmosphere / copy positioning. |
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
└─ <ElevatorScene/>     ← 1300vh pinned hero
   <AboutPreview/>      ← scrolls in as soon as the pinned hero ends
   <ProductsShowcase/> <ServiceEcosystem/> <Projects/> <IndustriesShowcase/>
   <StatsBand/> <CTASection/>
```

The hero is just the first section in normal document flow: when its 1300vh
wrapper has scrolled past, the sticky stage releases and `AboutPreview` slides
up like any other section. (An earlier iteration used a full-screen light-wipe
overlay here; it was removed — no overlay is appended to `<body>` anymore.)

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

**Pinning** is CSS: the 1300vh section (`SCROLL_VH = 1300`) contains a
`position: sticky; height: 100vh` stage, so the hero stays on screen while the
section scrolls. We deliberately do **not** use GSAP `pin` (it fights Lenis).

## 5. Scene breakdown (exterior arrival → component explorer)

The story now **opens outside at night** and pushes into the building before the
interior sequence begins. `beatFromP(p)` drives the exterior copy,
`activeFromP(p)` drives the component explorer, and `pose()` uses the explicit
thresholds below (`ARRIVE_END` / `APPROACH_END` / `INSIDE_P` / `COMP_START` /
`COMP_END` in `ElevatorScene.tsx`).

| Beat | progress | 3D behaviour | Copy / UI |
|---|---|---|---|
| Arrival (exterior) | 0.00–0.12 | Wide night establishing shot: procedural VERTIQ tower (instanced curtain-wall + lit offices, gold podium, backlit sign, entrance glow), fogged context towers, gradient sky dome, reflective plaza | "Engineered for **movement.**" |
| The Approach | 0.12–0.24 | Dolly-zoom push toward the entrance — the camera moves in while the fov narrows 52°→38°, so the tower looms | "Your elevator **arrives.**" |
| Threshold | 0.24–0.34 | Camera passes under the canopy and *through* the entrance glass (the glass + plaza pool light fade just before contact); studio reflections ramp back up; lands on the original lobby wide shot | — |
| The Call | 0.34–0.42 | Lobby wide → closer; **doors part** (`smoothstep(0.36, 0.45, p)`) | — |
| Explore | 0.42–0.90 | The 8-component explorer: the camera auto-frames each part; projected hotspot + caption + right-hand rail; clicking opens the detail modal | component captions |
| Destination | 0.90–1.0 | Glide into the cabin; the pin then releases and the page scrolls on normally | — |

## 6. `pose(progress)` — the analytic driver

Pure function of progress (perfectly scrubbable). Highlights:
- **Camera** interpolates the `stops` keyframe path (exterior stops → per-component
  auto-framing from `FRAMING` → outro) with `smoothstep` easing; a parallel
  `gltfStops` path is used when a GLTF model is active. `fov` animates for the
  dolly-zoom (52→38→40) and `updateProjectionMatrix()` runs only when it changes.
- **Exterior lifecycle:** `exterior.visible = p < INSIDE_P + 0.03`;
  `scene.environmentIntensity` lerps 0.35 (night) → `ENV.intensity` (interior)
  across the threshold; the entrance glass + plaza pool light fade before the
  camera crosses the facade plane.
- **Doors:** `o = smoothstep(0.36, 0.45, p)` slides `doorL/doorR` apart.
- **Safety x-ray:** `panelMat.opacity` eases toward 0.12 while the safety
  component is active.
- **Emissive pulses:** COP screen + ceiling LED breathe on `performance.now()`.
- **Hotspots:** the active component's anchor projects to screen space
  (`vector.project(camera)`) each frame.

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
- **Shaft:** guide rails, counterweight (plates), machine (motor + sheave),
  ropes, safety brakes + governor.
- **Exterior (arrival beats):** tower envelope built from slabs around the
  entrance (so the lit lobby shows through the glass from the street), window
  grid as two `InstancedMesh`es (dark glass + sparse warm lit offices), gold
  podium trims + backlit canvas-texture sign, entrance glass + frame + canopy,
  reflective plaza plane, baked gradient sky dome, one instanced set of fogged
  context towers sharing a single material, `THREE.Fog` starting beyond every
  interior camera distance, plus a cool "city moon" directional + warm entrance
  pool light that live inside the exterior group (hidden with it). Colors are
  read from `styles/tokens.css` at init.
- **Lighting:** warm key (shadowed) + cool fill + blue rim + hemisphere + interior
  point + two rect-area softboxes; exterior adds the moon + entrance pool.
- **Post:** `EffectComposer` → `RenderPass` → NaN-sanitize `ShaderPass` → low
  `UnrealBloomPass` (strength 0.12, threshold 0.9) → `OutputPass` → `SMAAPass`.

## 8. The hand-off

There is **no overlay transition** at the end of the hero (an earlier
light-wipe was removed — it could sit over the page and read as "stuck").
When the 1300vh wrapper finishes, the sticky stage simply releases and the
next section scrolls up over the final cabin shot. If a transition is ever
reintroduced, drive it from the main timeline and keep it `pointer-events:
none`, fully faded out at rest.

## 9. Performance considerations

- One render loop; `pixelRatio` capped at 2.
- Transmission glass + bloom + shadows are the heaviest costs — keep glass
  surfaces few; shadow map at 2048; bloom subtle.
- All geometries/materials/textures/render-targets are disposed on unmount.
- Reduced-motion / no-WebGL users get the lightweight CSS `ScrollStory`.

## 10. Future extensibility

- **Swap to a real model:** drop `elevator.glb` in `public/models/`, set
  `MODEL.enabled = true` ([`data/model.ts`](../../data/model.ts)). Best with a
  standalone *cabin* model (not a full room). Named door nodes can be wired to the
  door-open beat.
- **Tune pacing:** `SCROLL_VH`. **Tune scrub:** the `scrub` value.
- **Reframe:** edit `stops` (exterior/outro) or `FRAMING` (per component).
  **Re-time beats:** the `ARRIVE_END`/`APPROACH_END`/`INSIDE_P`/`COMP_START`/
  `COMP_END` constants + the door/glass thresholds in `pose()` (keep in sync).
- **Add realism later:** depth-of-field (BokehPass) and a mirror-reflective floor
  (Reflector) are the next high-impact additions; add once the base look is locked.
- **Palette:** all colors come from `styles/tokens.css` — change them there.

## 11. Gotchas

- Don't add GSAP `pin` — pinning is CSS `position: sticky`.
- `progress.current` is written only via `applyProgress()` (timeline `onUpdate`
  + the dev hook), read in the rAF loop. Keep it that way.
- Programmatic `window.scrollTo` doesn't reliably drive Lenis-linked ScrollTrigger;
  scroll via Lenis or set the timeline progress directly when testing.
- Backgrounded tabs freeze `requestAnimationFrame`, so the 3D won't animate in a
  hidden/headless preview. In dev, `window.__vertiqHero.set(p)` scrubs the hero
  synchronously (pose + render + HUD state) — use it for headless screenshots.
- **Anisotropy + bloom NaN:** anisotropic materials derive tangent frames from
  screen-space UV derivatives, which collapse when a mesh is sub-pixel small
  (e.g. the cabin seen from the street). One NaN pixel makes `UnrealBloomPass`
  black out the whole frame — the sanitize `ShaderPass` before bloom clamps it.
  Keep that pass if you add bloom passes or new anisotropic materials.
- The exterior assumes the lobby stays inside the tower footprint
  (`TW/TD/FRONT_Z` in the exterior block). If you resize the lobby, keep the
  marble floor and side walls ending at the entrance line `z = FRONT_Z`.
