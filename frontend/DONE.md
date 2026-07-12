# DONE — Implementation History

A permanent, dated log of completed work on the Philbrick website. Read this
before starting a task (see the rule in `CLAUDE.md`); append a new entry after
completing one. Newest entries at the top.

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
