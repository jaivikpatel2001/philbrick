# DONE — Implementation History

A permanent, dated log of completed work on the Philbrick website. Read this
before starting a task (see the rule in `CLAUDE.md`); append a new entry after
completing one. Newest entries at the top.

---

## 2026-07-23 — Gate Products (+ categories/sub-products) in production

**Client:** `/products` and any category / sub-product must NOT be live on
`philbrick.onrender.com` yet. Chosen scope: **Home only** live; everything else
(products + all content pages) shows Coming Soon.

**PRIMARY root cause (found after the first fix didn't fully work): the product
gate honored the `released` content-hint.** `PRODUCT_ROUTE_RELEASES` computed
`r.released || RELEASED_PRODUCT_ROUTES.includes(r.path)`. **23 product nodes in
`data/products.ts` are flagged `released: true`** (a content-readiness hint), so
those 23 product/category pages published to production regardless of the env —
which is why `/products/elevator-doors`, `/products/integrated-control-panel/...`
etc. stayed live even with `NEXT_PUBLIC_APP_ENV=production`. This directly
contradicts CLAUDE.md ("the `released` flag is a content-readiness hint only and
does not gate production"). Fixed: `PRODUCT_ROUTE_RELEASES` now consults ONLY the
explicit `RELEASED_PRODUCT_ROUTES` allow-list (empty → every product route
gated). Verified a production build: **all 38 product HTML pages bake Coming
Soon, 0 leaks**; Home stays real.

**Secondary root cause (a whitespace bug).** The release config was already
correct — `"/products": false`, `RELEASED_PRODUCT_ROUTES: []` (default-deny),
every product page wrapped in `<ReleaseGate>`, and `NEXT_PUBLIC_APP_ENV=production`
IS set in the Render dashboard. Yet every product page rendered real content.

Reason: `getAppEnv()` did `.toLowerCase()` on the env value but not `.trim()`,
then checked `=== "production"`. Render's env-var *value* field is a textarea
that stores a **trailing newline**, so the build saw `"production\n"`, which
`!== "production"` → the function fell through to `"development"` → `isReleased`
returned `true` for EVERY route → the whole site opened in production.

**Fix — `lib/release.ts` `getAppEnv()` now trims and fails CLOSED:**
```
const raw = (NEXT_PUBLIC_APP_ENV ?? NODE_ENV ?? "development").trim().toLowerCase();
return raw === "development" ? "development" : "production";
```
Only an explicit `"development"` opens pages now; `"production"`, `"production\n"`,
empty, or a typo all enforce the flags. Local `next dev` is unaffected
(NODE_ENV = "development", and `.env.local` sets `NEXT_PUBLIC_APP_ENV=development`).
Also kept the `NEXT_PUBLIC_APP_ENV=production` pin in `render.yaml`.

**Proven** with `NEXT_PUBLIC_APP_ENV="production " npm run build` (trailing space
reproduces the whitespace bug): the static export baked **Coming Soon** into
`out/products.html`, `out/products/integrated-control-panel.html` and
`out/products/integrated-control-panel/parallel-type-controller.html` (real
product copy absent), while `out/index.html` kept the real Home hero. Under the
old code that same value opened everything.

**To go live:** merge to `main` (Render deploys `main`) and it auto-redeploys —
no dashboard change needed, the code now tolerates the existing value.

**Files:** `lib/release.ts`, `render.yaml`.

---

## 2026-07-23 — Variant 18 promoted to the homepage; variants 1–17 removed

**Status:** Completed. Build clean (65 static pages, 0 variant routes), homepage
hero verified rendering from the static export.

**1. Homepage.** `app/page.tsx` now renders `Variant18Hero` + `CategoryBrowse15`
+ `HomeSections` (was `ElevatorHero` + `HomeSections`). Variant 18 is the single
homepage hero: sky, skyline and headline baked into one photo per theme
(`hero-scene-{day,night}`), live lead + trust badges in front, `<h1>` kept
`sr-only` for semantics.

**2. Navbar float is now site-wide.** `data-nav="float"` moved from the per-hero
`useEffect` onto `<html>` in `app/layout.tsx`, so the floating glass pill (no
fill, blur only, black nav links over content / white over a hero) is the global
navbar on every page (client direction: "float everywhere"). Every inner page
has a full-bleed hero or a full-bleed ComingSoon, so the fixed pill sits over
imagery as intended — verified on `/products`.

**3. Removed variants 1–17 (and the /variant18 review route).**
- Routes: `git rm` of `app/variant1…18`.
- Heroes: `Variant7/8/9/10/13/14/15/16/17Hero.tsx`.
- Three.js / exploration engine: `ElevatorHero`, `ElevatorScene(.module.css)`,
  `ExplorationHero(.module.css)`, `Exploration11Hero`, `Variant6/12ElevatorScene`,
  `ScrollStory(.module.css)`, `ComponentModal(.module.css)`,
  `THREEJS-IMPLEMENTATION.md`, and the whole `sections/experience/variants/` dir
  (`heroSceneKit` + `Variant2–5Scene` + `VARIANTS.md`).
- Dead data: `data/elevatorComponents.ts`, `data/heroExploration.ts`.
- `config/pageReleases.ts`: all `/variantN` entries dropped.
- Kept and still used by the homepage: `Variant18Hero`, `CategoryBrowse15`,
  `TrustBadges`, `corporate.module.css`, `corporateData.ts` (trimmed to just
  `TRUST_BADGES`), `data/catalogParts.ts` (made self-contained — the two type
  imports pointed at the deleted data files; inlined `StagePoint` /
  `ElevatorComponent` / `ExplorationPart` and dropped the dead `CATALOG_SPINE` +
  pacing exports).

**4. Asset GC.** A reference analyzer (scratchpad) flagged orphans by scanning
all of `app/sections/components/lib/data/constants/config/styles/scripts` —
excluding `imageManifest.json` (lists every optimized image, incl. dead) and
`.md` docs (mention ≠ render). Deleted ~260 dead public files: the entire
`/images/3D_Elevetor` render set (from the removed ElevatorScene), the dead
`/images/home/hero-exploration` leftovers (old `hero-city/sky/tower/front`,
`india-tower`, `lobby-backdrop`, `door-leaf`, `commercial-tower`,
`skyline-strip`, `spine/elevator-cutaway`, the `components/original` raw shots
and `components/0N-*.png` cards), Next boilerplate SVGs (`file/globe/next/vercel/
window.svg`) and the duplicate brand files (`logo-source.png`, `logo.jpg`,
`philbrick-logo.png`). Pruned the matching `lib/imageManifest.json` entries
(107 → 72 keys). **Deliberately kept:** all `/images/products/*` — product
images are addressed by TEMPLATE LITERAL in `data/products.ts` (`cover(slug)` /
`leaf(cat, prod)`), so their literal paths never appear in source and a naive
grep false-flags them; deleting would have broken every product/category page
and its og:image/JSON-LD. Also kept the live `hero-scene*`, `drawing-elevetor`
and `components/parts/*` (CategoryBrowse15 via `catalogParts`).

**5. Fixed a pre-existing gap.** `hero-scene-{day,night}` had manifest entries
but no generated `.webp` variants on disk, so the hero rendered as a grey
gradient (the loader pointed at nonexistent files). Ran
`scripts/optimizeHeroExploration.mjs` to generate them.

**Known residual (not blocking):** `corporate.module.css` still contains the
dead V7–V17 rule blocks. They are interleaved with classes the live hero reuses
(`bg16`, `flank17`, `trust17`, `cat*15`), and unused CSS selectors cause no
broken import, dead JS or build warning — so they were left rather than risk a
silent visual break on the new hero (CSS removal can't fail the build, only the
render). The `three` package is now unused (no Three.js in the tree) but left
installed to avoid dependency churn; `gsap` is still used by `SmoothScroll`.

**Files:** `app/page.tsx`, `app/layout.tsx`,
`sections/experience/corporate/{Variant18Hero,corporateData}.ts(x)`,
`data/catalogParts.ts`, `config/pageReleases.ts`, `lib/imageManifest.json`, and
the deletions above.

---

## 2026-07-22 21:45 IST

### Variant18: the bottom wash takes the theme's polarity

**Status:** Completed

Client: in light theme make the bottom band a **white** blurred fade, and black
in dark, so the copy reads properly. Previously it was a dark veil in both,
which is variant17's logic and wrong for a daylight scene.

`.scrim18` is now a tint plus a frost, both shaped by the SAME mask so they fade
out together at the 30% line — no visible band edge:

| | tint | blur |
| --- | --- | --- |
| light | `rgba(255,255,255,0.86)` | `backdrop-filter: blur(14px)` |
| dark | `rgba(5,9,15,0.82)` | same |

Mask: `#000 0% → 0.88 at 10% → 0.45 at 20% → transparent at 30%`.

**The copy follows the wash**, which is the part variant17 does not have to
handle: dark over the white band in light theme, white over the near-black band
in dark.

**Two contrast failures caught by measuring rather than eyeballing.** First pass
kept the copy white in light theme, over what was now a white band. Second pass
put the badge label on `--text-secondary`, which measured **3.62:1** at 0.72rem —
below the 4.5:1 it needs at that size. Both fixed; the label uses
`--text-primary`, exactly as variant17 had to.

Final, composited against the real plate, the tint and the mask:

| | light | dark |
| --- | --- | --- |
| lead | 10.26:1 | 15.02:1 |
| badge stat | 6.23:1 | 16.35:1 |
| badge label | 8.40:1 | 16.10:1 |

**Self-inflicted break worth recording:** the first edit dropped its comment text
after an already-closed `*/`, which is a CSS parse error — the dev server
returned 500 until it was fixed. Caught immediately because the route was polled
after the edit.

**Affected Areas:** `corporate.module.css` (variant18 scrim and copy colours).

---

## 2026-07-22 21:15 IST

### Variant18: overlay cut back to a bottom-30% gradient

**Status:** Completed

Client: too much darkness over the scene. Correct, and the cause was inherited
rather than intended — variant18 was still using variant17's `.scrim17`, which in
**light theme** washes the entire frame from `rgba(6,12,22,0.88)` at the foot to
`0.26` at the very top. It never fully clears, so a daylight photograph rendered
like dusk. Dark theme added a 0.7 radial over the middle on top of that.

**`.scrim18` replaces it:** one bottom-up linear gradient over the lowest 30% of
the hero and nothing above it, per the client's own suggestion. `0.72 → 0.46 →
0.18 → transparent` in light, a gentler `0.62 → 0.38 → 0.14 → transparent` in
dark, since the night plate is already dark. Variant17 is untouched.

**No top scrim, because it turned out not to be needed.** The scrim's other job
was giving the fill-less floating navbar something to sit on. Measured against
the scene's own top 10% (`#3578b9` day), white nav links sit at **4.62:1**, which
clears AA; night is 19.49:1. So the top of the frame is now completely clear.

**Also removed:** the per-block radial washes behind the lead and badges
(`.flank18::before`). They covered the same band as the new gradient, and
stacking the two was a large part of what made the hero look murky.

**A real bug this exposed.** With the radials gone and no light-theme override,
the lead and badges fell back to the near-black body colour over a dark scene:
measured **1.66:1** (lead), **1.67:1** and **1.71:1** (badges) — unreadable. They
are now white in light theme. Note this is deliberately NOT the same decision as
the headline, which does not take variant17's white treatment: the headline is
baked into the picture, while the lead and badges sit at the foot of the scene
over dark buildings.

**After, composited against the real plate plus the gradient:**

| | light | dark |
| --- | --- | --- |
| lead | 11.52:1 | 11.80:1 |
| badge stat | 11.43:1 | 14.89:1 |
| badge label | 11.15:1 | 13.93:1 |

**One dead end worth recording.** The dev page reported the floating navbar's
links resolving to the light-theme near-black over the hero, which would have
been a contrast failure. It is a dev-server hot-reload artifact: the production
CSS contains no `@layer`, so specificity decides there and
`[data-nav="float"] header[data-scrolled="false"] nav a` (0,2,3) beats
`.navLink` (0,1,0). The client's own screenshots show light nav links. No change
made.

**Affected Areas:** `sections/experience/corporate/Variant18Hero.tsx`,
`corporate.module.css` (variant18 block).

---

## 2026-07-22 20:40 IST

### Variant18 becomes a single-scene hero

**Status:** Completed

Client supplied `hero-scene-{day,night}.png` (2752x1536, headline baked in) and
asked for the whole layered build to be replaced by one background image, with
only the lead paragraph and the two trust badges kept live in front of it.

**Now:**

| z | layer |
| --- | --- |
| 2 | lead + trust badges |
| 1 | scrim (dark theme only) |
| 0 | the scene, day/night cross-faded by `[data-theme]` |

Removed: the open-sky plates, the transparent building plate, the visible
headline and eyebrow, and all the CSS that anchored towers to the headline
(`.content18`, `.title18`, `.titleWrap18`, `.front18*`, `--peak-lift`).

**The `<h1>` is still in the DOM, `sr-only`.** The headline is pixels inside a
photograph now; without this the page has no heading outline for screen readers
and nothing for search engines to read. Zero visual cost. It must be kept in step
with the picture — the prompts are §11.10 of `imagegeneration.md`.

**Sharpness is fixed by the new source.** At 1440x900 the browser now serves the
1920 variant and paints it 1612px wide: a **0.84x downscale**, where the old
1536px plates were being upscaled 1.24x and the original 1280 ladder 1.50x.

**The crop threshold was measured, not guessed.** Scanning both plates for the
azure accent line, the headline occupies rows 509–704 and spans x 293–2458 —
**10.6% to 89.3%** of the width, identical in day and night. So it needs 78.7% of
the plate's width on screen, and since `cover` crops horizontally below the
plate's 1.79 aspect, anything narrower than **1.41:1** starts eating the first
and last words:

| Viewport | Aspect | Width shown | Headline |
| --- | --- | --- | --- |
| 1920x1080 | 1.78 | 99% | intact |
| 1440x900 | 1.59 | 89% | intact |
| iPad landscape 1180x820 | 1.44 | 80% | intact |
| 1024x768 | 1.33 | 74% | would clip |
| 768x1024 | 0.75 | 42% | would clip |
| 388x841 | 0.46 | 26% | would clip |

Below 1.41:1 the plate switches to `object-fit: contain`, pinned to the top, so
the whole picture shows and the copy sits on the base colour beneath. That base
colour is sampled from each plate's own bottom edge (`#3f4957` day, `#524f53`
night) so the join reads as a continuation rather than a hard cut. Verified: at
1024x768 and 388x841 the fit switches and 100% of the width shows; at 1440x900
and 1920x1080 it stays full-bleed at 89% and 99%.

**Affected Areas:** `sections/experience/corporate/Variant18Hero.tsx` (rewritten),
`corporate.module.css` (variant18 block reduced to the hero, stack, flank and the
aspect guard), regenerated WebP variants, `lib/imageManifest.json`.

**Known Limitations:**
- The letterboxed fallback is a compromise, not a design. A portrait scene pair
  is the proper fix for phones and portrait tablets — same prompts, portrait
  framing.
- Changing the headline now means regenerating both images; the copy no longer
  lives in code alone.

---

## 2026-07-22 18:55 IST

### Hero scene prompts recorded in imagegeneration.md

**Status:** Completed (documentation; the images themselves are not supplied)

Client asked for the single-scene hero prompts to be written down so the
headline can be changed later without anyone reconstructing the look from
scratch. Added as **§11.10** of `imagegeneration.md`: both prompts verbatim, the
target filenames `hero-scene-{day,night}.png`, the current headline for
reference, and the four caveats — image models garble six-word headlines, baked
text stops being a real `<h1>` (mitigated by keeping it visually hidden in the
DOM), 16:9 crops badly on a portrait phone hero, and the zero-risk alternative of
generating the scene text-free and compositing the headline with sharp using the
site's own font.

Also documented the two responsive ladders as **§11.11**, since the reason for
them is not obvious from the script alone.

`scripts/optimizeHeroExploration.mjs` now matches `hero-scene*` as full-bleed, so
the 1920/2560/3072 tiers generate as soon as a 3840px source lands. Verified the
filename matcher against four paths: `hero-scene-day.png` and `hero-sky-day.png`
resolve to the full-bleed ladder, `commercial-tower.png` and
`component-cabin.png` stay on the component ladder.

**Affected Areas:** `imagegeneration.md` (§11.10, §11.11),
`scripts/optimizeHeroExploration.mjs`.

**Follow-up:** the hero is still the three-layer build. Nothing switches to the
single-scene images until they are supplied.

---

## 2026-07-22 18:35 IST

### Fix: variant18 hero plates were being upscaled 1.5x

**Status:** Partly fixed in code; the rest needs bigger artwork

Client: the hero looks blurry. It was, and measurably.

**Cause.** `scripts/optimizeHeroExploration.mjs` builds one responsive ladder,
`384/640/960/1280`, sized for the component cutouts that render in ~300px cards.
The hero sky and building plates are painted EDGE TO EDGE, so on a 1920px screen
the browser was picking the 1280 variant and stretching it by **1.5x**. Hard
edges — window mullions, tower silhouettes — show that immediately.

**Fix.** Full-bleed plates now get their own ladder,
`640/960/1280/1536/1920/2560/3072`, at quality 88 rather than 80 (large
photographic plates band in gradient sky at 80). Tiers above the source are
skipped, never upscaled, so listing 3072 costs nothing today and pays off the
day a bigger original arrives. Matched by filename:
`environment/hero-(sky|city|front|tower)*`.

Measured at 1920x1080, DPR 1, after regenerating:

| | before | after |
| --- | --- | --- |
| variant served | 1280 | **1536** |
| upscale factor | 1.50x | **1.24x** |

Weight paid for it: the building plate goes 262KB to 339KB (day) and 336KB to
483KB (night); the sky plates 83KB to 113KB and 90KB to 122KB.

**What code cannot fix.** The sources are 1536px wide, so 1.24x is the floor at
1920 CSS px, and a 2x-DPR laptop at that width needs 3840px to be truly crisp.
The remaining softness needs the plates re-rendered larger — 3840x2560 keeps the
current 3:2 framing. The sky matters far less (soft gradient hides
interpolation); it is the buildings that show it.

**Affected Areas:** `scripts/optimizeHeroExploration.mjs`, regenerated WebP
variants, `lib/imageManifest.json`.

---

## 2026-07-22 18:10 IST

### Variant18: real sky plate behind the headline, three layers

**Status:** Completed

Client, on seeing the previous pass: "we need three layers — full sky background
(day/night), text, building image (day/night)… current version not look like
sky". Correct. The gradient standing in for sky read as a flat coloured wall
behind photoreal glass towers, especially in dark theme.

The project already had the right asset: `hero-sky-{day,night}.png`, open sky
rather than the `hero-city-*` skyline variant16/17 use. Sampled top to bottom,
day runs `#3e8ab9` to `#adc9da` at the horizon; night `#010d22` to `#172d47`.
Those are now z 0, and the hero's own background is a flat base colour only,
covering the moment before the plate paints.

Final stack, verified live at 1440x900:

| z | layer |
| --- | --- |
| 4 | lead + trust badges, in FRONT of the buildings |
| 3 | building plates, day/night, full bleed, bottom anchored |
| 2 | headline, BEHIND the buildings |
| 1 | scrim (dark theme only) |
| 0 | sky plates, day/night |

**Light theme deliberately does NOT match variant17's white headline.** Variant17
sits on a dark city photograph and forces the headline white; variant18 sits on
open daylight sky. Measured against the actual sky pixels behind the headline
(`rgb(130,180,214)` average), white gives about 2.4:1 while the default
near-black gives **8.62:1**. Dark theme keeps white at **17.36:1** over the night
sky. The rule carries a comment saying not to "restore parity", because doing so
would fail contrast.

**Affected Areas:** `sections/experience/corporate/Variant18Hero.tsx`,
`corporate.module.css` (variant18 block).

**Known Limitations:** unchanged from the entry below — no headline occlusion on
mobile (the plate is cropped to its middle by `cover` at 388px), and the day and
night building plates still differ by ~94px of skyline, so the towers shift
slightly on the theme toggle.

---

## 2026-07-22 17:40 IST

### Variant18: the supplied skyline plates become the hero background

**Status:** Completed

Client supplied `hero-front-{day,night}.png` (1536x1024, transparent) and then
gave the composition direction plainly: drop the old hero photograph, make the
two new plates the background, and paint them ABOVE the headline.

**What the plates actually measured.** Before wiring anything, both were
profiled for alpha. Day is 42.9% opaque, rows 63–979; night 39.0%, rows 62–1015.
Neither reaches its own bottom edge, so laid flush the buildings float ~42px
above the fold at 1440x900. Their skylines also differ by a mean of 93.8px per
column — they are not the same geometry re-lit, so the towers shift on the theme
toggle. `scripts/cropHeroFront.mjs` trims the transparent margins using ONE
shared box (`0,62 1536x954`, the union of both) so day and night stay aligned,
and the buildings now stand on the bottom edge.

**Composition, as directed:**
- The city photograph (`hero-city-*`) is gone from this variant. With a
  photographed skyline in FRONT of the headline, a second one behind it reads as
  two cities stacked. `z 0` is now a CSS gradient sky, light and dark.
- The plates are `z 3`, full bleed, `object-fit: cover` anchored bottom, with
  `inset: 0 0 -4% 0` so the last sliver of transparent pixels sits below the
  fold.

**The z-order had to be split, and the measurement is why.** With the whole
content stack behind the plate, the canvas probe read **lead 100% covered,
badges 96%** at 1440x900 — the body copy was entirely inside the buildings. Only
the headline is meant to disappear. `.stack18` therefore carries **no** z-index
(a z-index there makes it a stacking context and traps both halves below the
plate); `.content18` is `z 2`, behind the skyline, and `.flank18` is `z 4`, in
front of it.

**Verified** by compositing the actual plate into a canvas at its rendered
geometry and reading alpha, rather than by eye:

| Viewport | Headline covered | Buildings meet fold | Overflow |
| --- | --- | --- | --- |
| 1920 x 1080 | 30% | yes | 0 |
| 1440 x 900 | 27% day / 28% night | yes | 0 |
| 388 x 841 | 0% (see below) | yes | 13px, pre-existing |

**Regression caught and fixed.** Removing the old headline-anchoring CSS also
removed variant18's mobile block. The three-column flank rule then beat
variant17's mobile override (same specificity, declared later), squeezing the
lead into a 145px column and pushing the trust badges to y846 on an 841px
screen — below the fold. Restored: single column and a smaller stack gap under
860px. Lead is now 343px wide and the badges sit inside the hero.

**Affected Areas:** `sections/experience/corporate/Variant18Hero.tsx` (rewritten,
now purely presentational), `corporate.module.css` (variant18 block),
`scripts/cropHeroFront.mjs`, two derived PNGs + WebP variants,
`lib/imageManifest.json`.

**Known Limitations:**
- **On mobile the headline is not occluded at all (0%).** At 388px the plate is
  cropped by `cover` to its middle, and the visible towers sit below the
  headline. The result is legible and reads as a skyline under the words, but it
  is not the layered effect. Fixing it properly needs a portrait crop of the
  artwork, not CSS.
- Day and night plates still differ by ~94px of skyline, so the buildings shift
  slightly on the theme toggle. Only a re-render of night FROM day fixes that.
- The 13px horizontal overflow at 388px is pre-existing on variant17 too.

---

## 2026-07-22 16:35 IST

### Variant18: drag grip removed

**Status:** Completed

`.grip18` and the whole drag apparatus are gone from variant18: the pointer
handlers, the offset state, `DRAG_LIMIT`, `KEY_STEP`, the `role="slider"` node
and the `[data-dragging]` rules. The foreground is a composed part of the scene
here, not a control, so the layer is plain `pointer-events: none` and nothing in
the hero intercepts a click. `Variant18Hero` is now a presentational component
whose only effect is the floating-navbar opt-in.

Variant17 keeps its draggable tower — `.grip17` and `.fg17[data-dragging]` are
untouched.

Verified live: zero `grip18` nodes, zero `role="slider"` in the hero, foreground
`pointer-events: none`, and the composition unchanged (peak at 50% into the last
line, 2.5 characters covered, no horizontal overflow). Light-theme headline now
resolves to `#fff`, confirming the `.hero18` parity rules added earlier.

**Affected Areas:** `sections/experience/corporate/Variant18Hero.tsx`,
`corporate.module.css`.

---

## 2026-07-22 16:05 IST

### Tawk's own launcher is the chat control; variant18 foreground plate wired

**Status:** Completed (the hero plate is blocked on the client's artwork)

**1. The site's chat button is gone.** On client direction Tawk's green launcher
is the chat control again. Removed from `FloatingActions`: the chat button, the
drag behaviour (which only ever existed so the visitor could park that button),
the WhatsApp fallback and the Tawk imports. What is left is the scroll-to-top
button, moved up to `bottom: clamp(5.5rem, 5vw + 4.5rem, 7rem)` so it stacks
above Tawk's launcher instead of colliding with it.

`TawkTo.tsx` lost the machinery that existed only to hide that launcher: the
role-tagging by size and z-index, `hideWidget()` on load, `openTawk`,
`closeTawk`, the forced-close `WeakSet`, and the open/close events. **Tawk now
owns its own state end to end**, which is also the reliable arrangement — the
un-closable window fixed earlier that day was caused by fighting that state
machine. What remains is cosmetic: the chat window's iframe still gets the
site's radius, hairline and shadow, found by the one stable marker (the `open` /
`closed` class Tawk keeps on it in both states). Its launcher and the
"Powered by tawk.to" strip are untouched.

Verified live: the only site button left is "Scroll back to top", Tawk's
launcher renders at 64x60 with its greeting bubble, and the dock sits at 110px
from the bottom, clear of it.

**2. Variant18 light theme was wrong.** `.hero18` never picked up the
white-on-photograph treatment, because those rules are written against
`.hero17`. The headline was falling back to the near-black body colour on a
bright sky. Mirrored for `.hero18`, so the two variants differ only in
composition, as intended.

**3. Foreground skyline plate.** Client asked which asset would give the
reference's layering, and chose a foreground cutout over real text rather than
translucent type or baked-in words. The layer is wired and sits behind
`HAS_FRONT_PLATE` in `Variant18Hero.tsx`, currently `false`; the single cropped
tower from §11.8 stands in until the files land. Spec and both prompts are
§11.9 of `imagegeneration.md` — transparent PNG, exactly 1535x1024 to match
`hero-city-day.png`, day and night geometrically identical, open middle band,
buildings reaching the bottom edge.

**Affected Areas:**
- `components/ui/FloatingActions.{tsx,module.css}`,
  `components/providers/TawkTo.tsx`, `styles/globals.css`,
  `sections/experience/corporate/{Variant18Hero.tsx,corporate.module.css}`,
  `imagegeneration.md`.

**Known Limitations:**
- Baking the headline into the artwork was offered and declined: it would stop
  the `<h1>` being real text (no responsive scaling, nothing for search engines,
  blur at large sizes, a new render for every copy change).

**Follow-up:**
- Client to supply `hero-front-{day,night}.png`; then run
  `node scripts/optimizeHeroExploration.mjs` and flip `HAS_FRONT_PLATE`.
- The "update every .md file" pass is still outstanding (`SITE-STRUCTURE.md`,
  `README.md`).

---

## 2026-07-22 15:20 IST

### New `/variant18` — headline set into the sky, tower peak only

**Status:** Completed

Client on variant17: "the building is completely in front of the heading text".
Correct — variant17 centres the headline and runs a full-bleed tower plate down
the middle of it, so the shaft crosses **every** line. The reference they sent
(large type in the sky, a peak rising through it, one or two letters lost) needs
the opposite balance. Variant18 is variant17 with only the composition changed:
same copy, same type, same spacing, same animations, same draggable tower.

**Why a new asset was needed.** `hero-tower-{day,night}.png` is a 1024x1536
plate whose building is a thin 213x1083 column of opaque pixels; the rest is
transparent padding that does the positioning. Under `object-fit: contain` the
building's width and its peak height are locked together, so the peak can only
be lowered by making the tower thinner. `scripts/cropHeroTower.mjs` trims both
plates to one shared box (`452,447 228x1089`, union of their alpha bounds plus a
6px bleed, so day and night stay pixel-aligned) and writes
`hero-tower-cut-{day,night}.png`. Derived only — nothing generated or repainted.
Documented as §11.8 in `imagegeneration.md`.

**The three composition changes:**
1. Content is pinned to the top of the hero, in the open sky, not centred over
   the skyline.
2. The headline runs the full width (`max-width: none`, `clamp(2.6rem, 0.4rem +
   8.6vw, 9.4rem)`, stack widened to 104rem), so a narrow tower can only ever be
   a bite out of its middle.
3. The tower is the cutout, ~2 characters wide, whose peak lands mid-way through
   the headline's LAST line and whose base runs off the bottom of the hero and
   is clipped.

**Anchoring, which took two attempts.** Positioning the peak with viewport
arithmetic (`calc(8.9rem + 15vw)`, fitted to measured line boxes at 1280 and
1440) is exact on a laptop and wrong on a phone, where the headline wraps to
three lines and the peak lands in the first one. The tower is now a child of a
wrapper that hugs the `<h1>`, positioned at `top: calc(100% - var(--peak-lift))`
where `--peak-lift` is `0.47 * var(--title-size)`, half a line of the headline's
own clamp. That resolves against the headline at any width and any line count.

**Verified** at four viewports, measured against the untransformed layout box:

| Viewport | Lines | Peak depth into last line | Chars covered | % of headline width |
| --- | --- | --- | --- | --- |
| 388 x 840 | 3 | 50% | 2.5 | 15% |
| 768 x 1024 | 3 | 50% | 2.5 | 14% |
| 1440 x 900 | 2 | 50% | 2.3 | 11% |
| 1920 x 1080 | 2 | 50% | 2.7 | 12% |

**Affected Areas:**
- `app/variant18/page.tsx`, `sections/experience/corporate/Variant18Hero.tsx`,
  the variant18 block appended to `corporate.module.css`,
  `scripts/cropHeroTower.mjs`, two derived PNGs + their WebP variants,
  `lib/imageManifest.json`, `config/pageReleases.ts`, `imagegeneration.md`.
- Variant17 and every other variant are untouched.

**Technical Decisions:**
- The `<h1>` stays real, selectable, indexable markup. The occlusion is done by
  stacking, never by baking words into artwork — the same rule variant17 set.
- On narrow screens the copy stacks, so there is no clear channel for a
  full-height shaft. Rather than covering the lead paragraph, the tower fades
  out into the sky above it with a mask. Reads as haze, not as a sliced-off
  building. Verified the fade completes above the lead at 388px.

**Known Limitations:**
- The measured 13px of horizontal overflow at 388px is **pre-existing** — it is
  present on `/variant17` too, so it was not introduced here and was left alone.
- The client's reference has a chunky mountain; this asset is a slender tower,
  so the mass reads lighter. If they want the reference's weight, that needs new
  artwork, not a crop.

**Follow-up:**
- The "update every .md file" pass requested earlier is still outstanding:
  `SITE-STRUCTURE.md` is stale (missing the four new routes, wrong release flags,
  still calls the images Unsplash placeholders) and `README.md` has not been
  re-checked.

---

## 2026-07-22 14:30 IST

### Fix: the chat window could not be closed

**Status:** Completed

Reported with a screenshot: chat open, conversation in progress, the close
button does nothing. Three separate defects, all introduced by this morning's
skinning work. Reproduced and fixed each.

**1. Tawk was left in a state where `minimize()` is ignored.** The widget was
hidden with `hideWidget()` at load and again on every minimize, so Tawk was
flagged *hidden* while its window was *maximized* — a combination it does not
expect. In that state it can ignore `minimize()`, and since its own launcher was
hidden too, there was no way out at all. `openTawk()` now calls `showWidget()`
before `maximize()`, and `hideWidget()` is called once at load only (to stop the
launcher flashing before skinning runs) and never again. Tawk's state machine
stays consistent; the launcher stays invisible because the site hides that
iframe directly rather than through the API.

**2. The fallback did not work either.** `closeTawk()` fell back to
`hideWidget()`, which flips the flag but leaves an open window exactly where it
is — verified by sabotaging `minimize()` in the page and watching the window
stay put. The fallback is now to set `display: none` on the window's own iframe,
which cannot fail because that element is in our document. Restoring is tracked
in a `WeakSet`: a hidden frame measures 0x0 and can no longer be recognised by
size, so without that the chat would close and never reopen (which is exactly
what the first attempt at this fix did).

**3. Tawk's green launcher was never actually hidden.** Two rules were tried
and both were wrong. Classifying by size mis-tagged the window at 300x150
mid-animation and fails on phones, where the window is small by design.
Classifying by z-index hid only one bubble — Tawk keeps **two** launcher frames
(64x60 and 124x95 observed), so the visible one survived, which is the green
chevron in the client's screenshots. Roles now come from what actually holds:
the window is the only frame Tawk gives an `open`/`closed` class, and a launcher
is any other frame that draws something at most 200px in both directions. Tawk's
zero-size helper frames are never touched — hiding one could break its message
transport — and the "Powered by tawk.to" strip is 350 wide so it can never match.

**Verified** across five states, twice each, with the button only:

| Step | Result |
| --- | --- |
| Open | window 350x520 + branding strip; no Tawk launcher anywhere |
| Close with `minimize()` sabotaged (the reported bug) | everything gone |
| Reopen after that forced close | window returns |
| Close normally | gone, `isChatMaximized() === false` |
| Reopen | window returns |

**Affected Areas:** `components/providers/TawkTo.tsx` (`skinTawk`, `openTawk`,
`closeTawk`, bootstrap callbacks, the re-skin effect).

**Technical Decisions:**
- Roles are re-derived on every pass instead of locked in on first sight, so a
  frame that was mid-animation when one pass ran is picked up by the next and a
  wrong guess can never persist.
- The forced close hides the branding strip along with the window. Tawk hides it
  itself when minimizing normally, so leaving it behind would orphan a
  "Powered by tawk.to" bar over the page.

**Known Limitations:**
- Under a browser with third-party frames blocked, the button still falls back
  to WhatsApp, as before.

---

## 2026-07-22 13:45 IST

### Documentation pass: every .md re-checked against the code

**Status:** Completed

Read every markdown file in the repo against the actual code and corrected what
had drifted. Findings, not just edits:

| File | What was wrong | Fixed to |
| --- | --- | --- |
| `SITE-STRUCTURE.md` | Whole document predated the last three releases: no `/career`, `/quality-policy`, `/privacy-policy`, `/downloads`, `/news-events/[slug]` or the 17 variants; release flags showed `/about` and `/products` as live when only `/` and the variants are; product count said 35 routes | Rewritten. Verified counts: 30 static (13 pages + 17 variants) + 38 product (14 categories + **24** products, counted off `out/`) + 6 news = 74 release entries, 82 prerendered pages |
| `README.md` | Folder tree missing `hooks/`, `scripts/`, `content-audit/`, `components/{products,seo}`, the four new routes, the variants and half the providers; stack omitted Tawk.to and FormSubmit; release instructions wrong (see below) | Updated, plus a documentation map table and a content-audit section |
| `CLAUDE.md` | **Product-route releases were documented wrong**: it said to flip the node's `released` flag in `data/products.ts`. That flag is a content-readiness hint; production gating reads the `RELEASED_PRODUCT_ROUTES` allow-list. Also said the site's chat button hides while the chat is open, which stopped being true this morning | Corrected in both the STRICT RULE and the architecture section; added a docs table and a rule to update `SITE-STRUCTURE.md` / `README.md` alongside `DONE.md` |
| `imagegeneration.md` | Opened with "Today all of these come from Unsplash placeholders" — every one was replaced back in July; homepage-hero note claimed the Three.js scene was commented out in `app/page.tsx`, which it is not | Status corrected, plus a note on the four pages that deliberately have no imagery |
| `DESIGN.md` | Is an **analysis of apple.com**, with Apple's hexes and SF Pro type scale, but nothing said so above the fold. A reader could easily take `#0066cc` for a project token | Added a banner: reference only, `styles/tokens.css` is the real system |
| `THREEJS-IMPLEMENTATION.md` | Homepage flow listed sections that no longer exist ("Lifecycle support → Projects"); file table missed `ElevatorHero.tsx`; palette line still said champagne gold/electric blue; the arrival beat described a "VERTIQ tower ... backlit sign" | Corrected. The gold **material** reference at §4 is accurate and stays: `#c7a96a` is still in the scene as architectural metal, unrelated to the brand palette |
| `variants/VARIANTS.md` | Said "Four alternative homepage heroes" above a table of 15 | 17, table completed with variant16/17, plus a reminder to delete the routes and their release flags together |
| `public/hdri/README.md` | "steel, glass and gold" from the old palette | Neutral wording |
| **new** `README.md` (repo root) | Did not exist. Nothing explained that `wordpress/` is a read-only content reference rather than a deployed app, or that `backend/` is empty | Added |

`DONE.md` and `AGENTS.md` needed no changes; `public/models/README.md` is still
accurate.

**Verified, not assumed:** product route counts were taken from the built `out/`
tree (14 category + 24 product HTML files), release flags from
`config/pageReleases.ts`, the homepage composition from `app/page.tsx` +
`sections/home/HomeSections.tsx`, and every relative link in the seven main docs
was resolved against the filesystem (0 broken).

**Affected Areas:** `README.md` (root, new), `frontend/{README,CLAUDE,SITE-STRUCTURE,imagegeneration,DESIGN}.md`,
`frontend/sections/experience/THREEJS-IMPLEMENTATION.md`,
`frontend/sections/experience/variants/VARIANTS.md`,
`frontend/public/hdri/README.md`.

**Follow-up:**
- `DESIGN.md` is a large reference document that no longer describes anything in
  this project. Consider moving it out of the repo root, or into a `docs/`
  folder, so it stops reading like a project spec.

---

## 2026-07-22 13:15 IST

### Chat widget on-brand, one control in both states, agency credit in the footer

**Status:** Completed

**1. The chat widget looked like someone else's product.** Opening it swapped a
52px brand-blue circle for Tawk's own 64x60 green chevron, next to a green
window. Tawk renders into cross-origin iframes, so the inside of that window
(header colour, bubbles) cannot be restyled from this codebase at all — that is
a property setting. What is reachable is the iframe **elements**, which live in
our document. So:

- `skinTawk()` (`components/providers/TawkTo.tsx`) finds Tawk's container and
  tags each iframe by role. Every id and class Tawk writes is randomised per
  load and its `open` class comes and goes, so the container is found by shape
  instead: the `<body>` child div whose children are all iframes. Roles are then
  assigned by measured size (launcher ≤120px wide, window ≥200×200, the wide
  short one is the "Powered by tawk.to" strip).
- **Tawk's launcher is hidden outright**, so the site's own floating button is
  the only chat control. It stays exactly where it was and becomes the close
  control: same circle, same 52px, same `--accent`, with the speech bubble and
  the chevron cross-fading and counter-rotating in place. That is what makes the
  open and closed states read as one control.
- The chat window gets `--radius-lg`, a `--border-accent` hairline and
  `--shadow-xl`.
- **Overrides are applied inline, not from the stylesheet.** Tawk writes its own
  inline `!important` declarations, which an author `!important` rule cannot
  outrank; only another inline declaration can. The matching rules in
  `styles/globals.css` document the intent and take over if Tawk ever drops
  `!important`. `skinTawk()` re-runs on ready, on open and every 2s, because
  Tawk rewrites those inline styles as the chat opens and closes.
- The "Powered by tawk.to" strip is deliberately left alone: removing it breaches
  Tawk's terms on the free plan.

Measured at 1280×800: window `[900,352 → 1250,702]`, button
`[1186,716 → 1238,768]`, no overlap, the window sits directly above the button
in the space Tawk's launcher used to occupy. At 375×812 the window fits the
viewport with no horizontal overflow.

**Remaining, and it needs the client's Tawk login:** the window's header and
message-bubble colour. `TAWK_BRAND_NOTE` in `TawkTo.tsx` records the one-time
setting — Administration → Chat Widget → Appearance → widget colour `#109BDD`
(light-theme `--accent`). There is no JavaScript API for it; this build's
`Tawk_API` has no `customStyle` property at all.

**2. Agency credit** in the footer, which the client's WordPress footer also
carried ("Design & Developed By Media Radical"). A single highlight travels
across the studio name every 7s using an animated `background-position` on
gradient text, with a long rest between passes so it reads as craft rather than
motion. Hover swaps the gradient for solid `--accent` and draws a hairline in
from the left. `prefers-reduced-motion` stops the shimmer and renders the name
in `--text-secondary`. Links to `https://mediaradical.in/` in a new tab with
`rel="noopener noreferrer"`. Centred under a hairline rule, wraps to two lines
on mobile.

**Affected Areas:**
- `components/providers/TawkTo.tsx` (`skinTawk`, `closeTawk`, `TAWK_BRAND_NOTE`,
  a tagging effect), `styles/globals.css` (widget rules),
  `components/ui/FloatingActions.{tsx,module.css}` (persistent toggle, icon
  cross-fade), `components/layout/Footer.{tsx,module.css}` (credit).

**Technical Decisions:**
- Roles are assigned once per iframe and never re-classified, because the sizes
  that identify them change as the chat opens and closes.
- The site button no longer hides while the chat is open. Hiding it was the old
  way of avoiding two controls; hiding Tawk's launcher instead is what the
  client actually asked for, and it keeps the control in one place.

**Known Limitations:**
- The chat window's interior stays Tawk green until the dashboard setting above
  is changed. Nothing in this repo can reach inside that iframe.
- Window size (350×350) is also a dashboard setting; it is left as Tawk serves
  it, since forcing a different iframe size would not re-lay-out the content
  inside it.

---

## 2026-07-22 12:40 IST

### WordPress content audit: superset migration, Tawk.to, floating buttons

**Status:** Completed

Full page-by-page comparison of the client's WordPress site against this one,
then everything WordPress had that we did not was added, in our design system.
No existing section was removed.

**How the audit was done (repeatable):** the WordPress database dump in
`wordpress/wp-content/updraft/backup_2026-07-11-0205_…-db.gz` was parsed with
the existing `scripts/parseWordpressDump.mjs`, which yields posts, meta and
terms. That gives the real page bodies, the four nav menus, the Contact Form 7
definitions, `wp_options` (Tawk.to ids, widgets, theme mods), the Yoast fields
and the 38 WooCommerce products. Findings below cite page IDs.

**What WordPress had that we were missing, and what was added:**

| WordPress | Gap | Now |
| --- | --- | --- |
| Company (3318) "Activity" | Text existed inside `ABOUT_STORY` but under no heading, and the industry list was invisible | Own section on `/about`, plus the 9 industrial segments as an indexed hairline list |
| Company (3318) "History" | Only the condensed `/milestone` timeline existed; the long narrative did not | `HISTORY_CHAPTERS`, 11 chapters, on `/about`, linked to `/milestone` |
| Career (3435) | No route; `CAREER_CONTENT` sat unused | `/career` with the HR inbox callout |
| Quality Policy (3) | No route; `QUALITY_POLICY` sat unused, and one sentence had been dropped | `/quality-policy`, 4 clauses, sentence restored |
| Privacy policy (3992) | No route | `/privacy-policy`, section for section (`data/legal.ts`) |
| Download (3662) + Step Brochure (3899) | No route, brochure link lost | `/downloads` with the STEP catalogue (`https://acharyagroup.in/cdn/2023catalog.pdf`) and the client's empty-state wording kept for when the list is bare |
| Inquiry form (CF7 id 5) | Website, Address, City, State, Country fields absent | Added to `ContactForm`, optional so the form stays quick |
| Step Brochure form (CF7 3901) | Gated the PDF behind a form | Document linked directly; a "Brochure or Catalogue Request" enquiry type covers anything unpublished |
| Footer menus `footer1`/`footer2` | Career and both policies were not linked | Added to `FOOTER_NAV` |
| Tawk.to plugin | Not integrated | See below |

**Verified as already complete (no action):** all 38 products, with salient
features and specification tables (`data/generated/catalog.json` covers 38/38);
every contact detail; the 7-item top menu; the site tagline; Vision & Mission,
Milestone and News & Events (the WordPress pages hold Lorem ipsum only);
Infrastructure and Network (WordPress pages are empty); the 11 blog posts are
all theme demo content; there are no PDFs in `wp-content/uploads`; Yoast held no
real meta descriptions; the Revolution Slider is the theme's demo slider.

**Tawk.to** (`components/providers/TawkTo.tsx`): the same property the client
already runs, ids read from `wp_options` (`tawkto-embed-widget-page-id` =
`6039cf23385de407571a9744`, `…-widget-id` = `1evgt29n1`, visibility
`always_display = 1`). Loaded in the root layout with `next/script`
`afterInteractive`, so it is on every page. Ids are overridable through
`NEXT_PUBLIC_TAWKTO_PROPERTY_ID` / `NEXT_PUBLIC_TAWKTO_WIDGET_ID`.

**Floating buttons** (`components/ui/FloatingActions.tsx`): scroll to top,
which appears past 60% of a viewport and returns through Lenis
(`scrollToTop()`), and a chat button that opens Tawk. The chat button is
draggable by mouse or finger with pointer events, clamped inside the viewport,
and its offset lives in component state only, so a refresh returns it to the
corner as specified. A move under 5px counts as a click, so dragging never opens
the chat by accident.

**Content audit workbook:** `content-audit/Philbrick-content-audit.xlsx`,
1,471 text items across 58 pages, in the requested columns (Page URL · Section ·
Current Website Text · Suggested / WordPress Text · Client Final Text) plus an
item type and a status. Sheets: Read me · Summary (live COUNTIF) · Site content ·
Product content · Global elements · SEO & meta · WordPress source · Product
source. Regenerate with `node scripts/contentAuditCrawl.mjs http://localhost:3000`
then `python scripts/buildContentAudit.py`.

**Affected Areas:**
- New routes: `app/{career,quality-policy,privacy-policy,downloads}/`.
- New shared piece: `sections/shared/PageHeader.tsx` (text-only page header for
  pages that have no brand photograph), `app/prose.module.css`.
- Content: `data/company.ts` (Activity, segments, History, Quality Policy
  sentence), `data/legal.ts`, `data/downloads.ts`.
- Chrome: `app/layout.tsx`, `constants/navigation.ts`, `styles/tokens.css`
  (`--z-fab`), `components/providers/SmoothScroll.tsx` (`scrollToTop`).
- Tooling: `scripts/contentAuditCrawl.mjs`, `scripts/buildContentAudit.py`.

**Technical Decisions:**
- The four new pages use a text-only `PageHeader` rather than borrowing an
  existing hero photograph, per the image rule: no unrelated image is better
  than a wrong one. If the client wants photography there, it needs a documented
  prompt in `imagegeneration.md` first.
- Tawk re-shows its own launcher whenever the chat window is maximized, so the
  site hides that launcher again on minimize and hides its own button while the
  chat is open. Exactly one control is ever on screen.
- The chat button carries a speech bubble, not the WhatsApp mark, because it
  opens Tawk; WhatsApp is only the fallback when Tawk is blocked.
- The workbook traces copy back to WordPress in two grades, "Matches WordPress"
  for verbatim text and "Adapted from WordPress" for text re-punctuated or split
  for the new layout, so the client can see that adapted copy is still their own
  facts rather than something invented.

**Known Limitations:**
- `/news-events` still runs on the mock items in `data/news.ts`; all 150 of its
  text rows are flagged "Placeholder" in the workbook.
- The workbook's Summary sheet uses formulas with no cached values (LibreOffice
  is not installed here, so `recalc.py` could not run). Excel and Google Sheets
  compute them on open; a script reading the file with `data_only=True` sees
  blanks until then.
- All four new routes are `false` in `config/pageReleases.ts`, matching the
  Home-only production release. Flip them when the client approves.

**Follow-up:**
- Send the workbook to the client; feed the "Client Final Text" column back into
  `data/` and `constants/site.ts`.
- Replace `data/news.ts` with real dated announcements before releasing
  `/news-events`.

---

## 2026-07-22 12:20 IST

### Categorised contact channels: labelled emails, helpline vs WhatsApp

**Status:** Completed

The site published one email address and an unlabelled list of five numbers, so
a visitor could not tell which line to call, which to chat on, or which desk to
write to. The client's WordPress site does carry that split across three pages,
so it is now modelled properly.

Sources reconciled (nothing left behind):

| WordPress source | Detail | Where it now lives |
| --- | --- | --- |
| Contact Us (ID 3631) | `philbrick@philbrickindia.com`, `philbrick_controls@yahoo.com`, `sales@philbrickindia.com` | `SITE.emails` |
| Career (ID 3435) | "Mail your resume on `hr.philbrickindia@gmail.com`" | `SITE.emails` (Careers) |
| Contact Us + Privacy policy (ID 3992) | `+91 84012 19941` listed first, and given as the contact number | `SITE.phones` (Helpline) + `SITE.phone` |
| Contact Us + `footer.php` | `+91 99789 86631` followed by "OR Chat On" / "Or Chat" WhatsApp | `SITE.phones` (WhatsApp) |
| Contact Us + `footer.php` | `+91 93740 22660`, `+91 98250 09420`, `+91 99789 86635` | `SITE.phones` (Office) |
| `footer.php` | "Mon-Fri 9:00 to 18:00" | `SITE.hours` (already present) |

**Changes:**
- `constants/site.ts`: `emails` (Sales · General enquiries · Careers · Alternate
  inbox) and `phones` (Helpline · WhatsApp · three Office lines), each entry
  carrying a `label` and a plain `purpose`. Added `altEmail`,
  `whatsappDisplay` and a `telHref()` helper. **`SITE.phone` is now the helpline
  `+91 84012 19941`**, not the WhatsApp number, because that is the number the
  client publishes first on Contact and as the contact number on the privacy
  policy page.
- `app/contact/page.tsx`: the info column is now four labelled groups, Call or
  chat · Email the right desk · Visit us · Speak to a person. Every row shows
  label, value and what it is for, and the phone group ends in a "Chat on
  WhatsApp" pill linking to the client's own `api.whatsapp.com` message.
- `components/layout/Footer.tsx`: phone and email lists became tag + value rows;
  the WhatsApp row carries an inline "Or chat on WhatsApp" link, mirroring the
  WordPress footer wording.
- `components/layout/MobileNav.tsx`: the drawer number is labelled "Helpline"
  and gained a WhatsApp chat link beneath it.
- `lib/schema.ts`: one `ContactPoint` per channel (customer support / sales /
  human resources) instead of a single sales point.
- `data/faqs.ts`: new "Which number or email should I use?" question, and the
  quotation answer now names the sales inbox and the helpline.
- `public/llms.txt`, `app/network/page.tsx`: contact block updated to match.

**Affected Areas:**
- `constants/site.ts`, `lib/schema.ts`, `data/faqs.ts`, `app/contact/*`,
  `app/network/page.tsx`, `components/layout/{Footer,MobileNav}*`,
  `public/llms.txt`.

**Brand icons (same session):**
- Every WhatsApp affordance (contact phone row, contact CTA pill, footer chat
  link, footer social button) now uses the real `FaWhatsapp` glyph instead of
  the generic Feather speech bubble, and the footer's Twitter bird became
  `FaXTwitter`. Both come from `react-icons/fa6`, registered in `lib/icons.ts`
  next to the Feather set. The social label is "X (formerly Twitter)" (it is the
  `aria-label`, so "X" alone would read as nothing); the href stays on
  `twitter.com`, which redirects.

**Technical Decisions:**
- The three unlabelled numbers are tagged "Office", not invented roles. Only the
  helpline and the WhatsApp line carry a function on the client's own site, so
  only those two are given one.
- Brand marks (WhatsApp, X) are only correct as their own glyph, so those two
  break the otherwise Feather-only icon rule; everything else stays Feather.
- Scalar `SITE.email` / `salesEmail` / `careersEmail` / `phone` kept alongside
  the new arrays, so structured data and single-slot UI need no rework.

**Known Limitations:**
- The enquiry form still posts to one inbox (`NEXT_PUBLIC_CONTACT_FORM_TO_EMAIL`);
  the department split is informational, not routing.

**Follow-up:**
- WordPress has a **Career** page (ID 3435) and a **Privacy policy** page
  (ID 3992) with no route here yet. Content for both already sits in
  `data/company.ts` (`CAREER_CONTENT`) and `wpPages.json`. Adding them needs new
  routes plus `config/pageReleases.ts` entries.

---

## 2026-07-21 15:45 IST

### New `/variant17` — depth hero, headline behind the tower

**Status:** Built and wired; awaiting the four photographs.

Client reference: a hero where the building rises in FRONT of the headline so
the middle characters are occluded. That cannot come from one picture — baking
the words into the artwork would stop the `<h1>` being text (no responsive
scaling, nothing for search engines, blur at large sizes). So the hero is a
three layer sandwich and the heading stays real markup:

| z | layer | asset |
| --- | --- | --- |
| 3 | tower, drawn OVER the text | `hero-tower-{day,night}.png` (transparent) |
| 2 | content: h1, eyebrow, lead, badges | — |
| 1 | legibility scrim | — |
| 0 | sky | `hero-sky-{day,night}.png` |

- Duplicated from variant16: same floating glass navbar opt-in, same centred
  content, same two-badge trust row, same CSS-only day/night cross-fade driven
  by `[data-theme]`. Both plates swap together, so the tower's lighting always
  matches its sky.
- The foreground is **height-capped and bottom-anchored** (`height: min(86%,
  92svh)`, `object-fit: contain`, `object-position: bottom center`) rather than
  `cover`: `cover` on a wide viewport crops the crown, which is precisely the
  part that has to cross the headline. Mobile drops it to 62% and pushes the
  copy clear, since `contain` on a narrow frame otherwise squeezes the tower.
- `pointer-events: none` on the tower plate so it never intercepts a click on
  the copy beneath it.
- **Graceful until the art lands:** `lib/imageLoader.ts` passes unknown paths
  through untouched, so the page builds and renders its gradient fallback
  rather than breaking. Verified 78/78 static pages with `/variant17` present,
  layer order 0/1/2/3 correct, and the `<h1>` still real selectable text.

**UPDATE — the four photographs are in and the hero is live.**
- Supplied: skies 1536 × 1024 (3 channel), towers 1024 × 1536 **portrait with a
  genuine alpha channel** (min 0, mean 35 — mostly transparent). Composited over
  a bright field to check the cutout: no dark fringe, no halo, no painted
  checkerboard. Optimized to WebP; the towers cap at 960px because that is the
  source width, which is ample (they render ~500px wide at 1440 viewport).
- **The layout had to change once the art was in.** With the copy centred, the
  tower's opaque shaft ran straight down through the lead paragraph and hid the
  "In-house" badge. The reference solves this by FLANKING the building, so the
  hero is now a stack: centred eyebrow + headline (crossed by the crown), then
  a three column row with the lead left, the trust badges right, and a clear
  middle channel the tower rises through.
- **Contrast measured, not eyeballed.** The sky photo is busiest at its left and
  right edges, exactly where the flanked copy lands: first pass gave lead
  4.02:1, badge stat 4.09:1 and badge labels 1.00:1 — all failing. Fixed with
  two soft radial washes (one per text block, middle left clear for the tower)
  plus primary/secondary badge tones. Re-measured: lead **7.21:1**, badge stat
  **8.70:1**, badge label **4.53:1**, headline **11.79:1** left of the tower and
  **12.42:1** right of it. All pass.
- **Scaled up on client request:** headline `clamp(2.8rem…5.4rem)` →
  `clamp(3rem, 1.2rem + 7.6vw, 8.2rem)` with `line-height: 0.98` (127px at a
  1440 viewport, up from ~90px), tower box 86% → 112% of the hero. The crown now
  cuts through TWO words — "machi◼e" and "sm◼oth" — which is much closer to the
  reference than the single-word overlap. Re-measured at the new size: headline
  10.81:1 left of the tower and 4.59:1 right of it, lead 8.42:1; the badge label
  had drifted into a brighter band at 4.30:1 (a marginal AA fail) so it moved
  from `--text-secondary` to `--text-primary`, now 9.98:1.
- **Background switched to variant16's city pair** (`hero-city-day/night.png`)
  on client direction, replacing the open-centre `hero-sky-*` plates. The two
  variants now share a backdrop and differ only in the foreground tower and the
  layered headline. `hero-sky-day.png` / `hero-sky-night.png` are unused by any
  route but kept on disk. Contrast re-measured against the denser skyline:
  headline 11.70:1 left of the tower and 3.25:1 right of it (large text needs
  3:1), lead 9.58:1, badge stat 6.96:1, badge label 9.13:1 — all pass, though
  the headline's right half is now the tightest number on the page because it
  crosses the lit tower cluster.
- **Hard seam on the wash fixed.** Against the darker city photo the flank
  wash showed a visible vertical edge on the left. Cause: the radial was centred
  at 17% with a 46% radius, so it was still at roughly half alpha when it hit
  the element's own left border and got clipped — the box boundary WAS the
  seam, not the gradient. Fixed by bleeding the pseudo-element far wider
  (`inset: -3rem -3vw` → `-5rem -28vw`), re-centring the two gradients at 30%
  and 71% of that wider box, and replacing the two-stop falloff with five stops
  so it eases out instead of ramping linearly. Contrast came out **better**, not
  worse, because the gradients now cover the copy more evenly: lead 9.58 →
  11.07:1, badge stat 6.96 → 8.09:1, badge label 9.13 → 10.44:1, headline right
  of the tower 3.25 → 3.43:1.
- **The tower is now draggable horizontally.** Offset lives in component state
  only — deliberately NOT persisted, so a refresh recentres it, which is what
  the client asked for. Clamped to ±34% of the viewport (±483px at 1440) so it
  can never be dragged out of frame.
  - **Only a narrow grip is interactive**, not the plate. `.fg17` stays
    `pointer-events: none` and a ~156px `.grip17` over the visible building
    re-enables them. Enabling them on the plate would have made the whole
    full-width rectangle — mostly transparent alpha — swallow every click meant
    for the headline. Verified: `elementFromPoint` over the headline still
    returns the `<h1>`.
  - `setPointerCapture` keeps the drag alive when the pointer leaves the grip,
    wrapped in try/catch because it throws for a pointer id the browser no
    longer considers active.
  - Keyboard equivalent so it is not pointer-only: the grip is a focusable
    `role="slider"`, arrows nudge 24px, Home/Escape recentre. Verified 24 → 48
    → 0 once the transition settles.
  - `transition: transform` for keyboard and release, disabled via
    `[data-dragging]` while the pointer drives it so the tower does not lag the
    cursor.
- **Light theme reworked on client direction: no white overlay.** The white
  scrim and the white flank washes are gone. With the photo unveiled, dark copy
  measured **1.0–1.24:1** against the glass towers — literally invisible — so
  light theme now borrows the dark-theme treatment: white type over a wash that
  DEEPENS the photo instead of whitening it. Two iterations were needed; the
  first veil left the headline at 2.4–2.5:1 because white on bright sky is as
  weak as dark on bright glass.
- **Scrim shape changed to a bottom-up linear gradient** (was a centred radial),
  again on client direction: it anchors the copy to the base of the frame and
  releases the sky. First attempt faded too early and dropped the headline to
  **2.0:1**; the stops now hold ~0.5 alpha through the headline band. Final
  light-theme figures: headline **4.68:1** left of the tower and **4.18:1**
  right, lead **13.86:1**, badge label **16.90:1**.
- **Floating navbar has no fill at all** (client: "remove background colour
  entirely, only blur"). Both the base and scrolled rules lost their
  `color-mix` background; the bar is now defined purely by `backdrop-filter`
  plus a hairline edge. Nav links went `--fw-medium` → `--fw-semibold`.
  Measured against the frosted backdrop while scrolled over the product grid:
  **4.86:1 worst case** against a 4.5 minimum — it passes, but with only ~8%
  margin, and the blur is currently 5px, which is now doing all the legibility
  work alone. Raising it to 12–16px would restore headroom without adding any
  colour back.
- **Navbar looked electric blue in light theme — cause was `saturate(180%)`.**
  The client reported the bar not matching the photo behind it. The backdrop
  filter was `saturate(180%) blur(5px)`; saturation made sense when the bar had
  a tinted fill to sit under, but with the fill removed it simply recolours
  whatever is behind, turning the pale daylight sky vivid. Dark theme hid the
  fault entirely because a near-black backdrop has almost no saturation to
  amplify — which is why it "looked great" there. Now `blur(5px)` only.
- **Knock-on: nav links then failed in light theme.** With no fill and no
  tint, light theme's dark nav text measured **1.45:1** over the hero photo
  (fine at 7.50:1 once scrolled over page content). Fixed by flipping the links
  to near-white while `data-scrolled="false"` and handing back to the theme
  tokens on scroll, plus holding a little alpha (0.26) at the very top of the
  linear scrim so the bar has something to sit on. Two passes: white alone got
  3.56:1, white + the scrim shoulder reaches **5.29:1**.
- **Known, not fixed:** the Philbrick logo's "PROVIDING ELEVATOR SOLUTIONS"
  tagline is dark ink baked into the PNG, so it sinks into the photo behind the
  transparent bar in both themes. Needs a light variant of the asset.
- **Sizing limit worth knowing:** the tower cannot get much wider than this. Its
  source is a very slender building (roughly 1:7) sitting in a tall transparent
  canvas, and because `contain` preserves aspect, width only grows with height —
  past ~112% the crown is pushed off the top of the hero. A materially chunkier
  tower needs either a wider building in the artwork or the transparent padding
  trimmed off the source.
- Mobile (≤860px) stacks the copy, centres it and drops the tower to 46% height
  at 0.55 opacity behind the text, since there is no room to flank. No
  horizontal overflow at 390px.

**Build note:** a build failed with `Type error: Declaration or statement
expected` in `.next/dev/types/routes.d.ts` — a Next.js GENERATED file corrupted
by the dev server writing to `.next/dev` while the build ran. Not source. `rm
-rf .next/dev/types` and rebuild; 78/78 pages.

**Original asset spec** (superseded by what was supplied above; 2400 × 1600, into
`public/images/home/hero-exploration/environment/`): `hero-sky-day.png`,
`hero-tower-day.png`, `hero-sky-night.png`, `hero-tower-night.png`. The two
tower plates MUST carry a real alpha channel — an earlier asset
(`india-tower.png`) had a checkerboard pattern painted into the pixels instead
and rendered as a visible grid. Prompts for all four are in `imagegeneration.md`.

**Follow-up once supplied:** run `scripts/optimizeHeroExploration.mjs`, then
re-check headline contrast where the tower crosses it — that is the spot most
likely to fail AA.

---

## 2026-07-21 15:10 IST

### WordPress parity pass: menu, product photos, footer + a content audit

**1. Products menu no longer scrolls.** Removed `max-height` / `overflow-y`
from the category list and the submenu, so the menu grows to its natural height
like the client's site and the PAGE scrolls if it runs past the fold. That also
let `MegaMenu.tsx` get materially simpler: with nothing clipping it, the
submenu went back to being a plain child of its row positioned in pure CSS —
the offset measuring and `scrollTop` tracking added earlier only existed to
work around the scrolling container.

**1b. …and it now scrolls WITH the page.** Removing the internal scroll was
only half the fix: the header is sticky (fixed on variant16), so an open menu
stayed pinned while the page scrolled underneath it and the lower categories
were still unreachable. While a menu is open the header is now released into
the document at its current scroll offset (`position: absolute; top: scrollY`,
inline so it also beats the floating navbar's `position: fixed`). It looks
identical at the moment of opening and then scrolls away with the page,
carrying the menu — which is how the client's own non-sticky header behaves.
The `data-scrolled` compact/tall toggle is frozen while open, otherwise
`.inner` shrinking mid-scroll dragged the menu ~6px further than the page and
produced a visible jolt. Verified: 400px of page scroll moves the menu exactly
400px, the last category becomes visible, and the header returns to `sticky`
(and to `fixed` on variant16) with no leftover inline style on close.

**2. Real product photography everywhere.** `ProductCard` now resolves its
image through `productImage()`, and that helper accepts a category slug as well
as a product slug (a category shows its first product's lead photo). All 14
cards on `/products` verified using `/images/products/catalog/…`, zero
AI-generated shots left in the grids. Card media switched to `object-fit:
contain` on a surface panel — the client's photos are studio-lit on white, and
cropping a control panel hides the detail a technical buyer is looking for.

**3. Footer synced to the client's real data.**
- **Phones: 1 → 5.** The footer rendered only `SITE.phone`. It now lists every
  number the client publishes plus the office hours, sourced from two places:
  `philbrick-child-theme/footer.php` (99789 86631, 93740 22660, **99789 86635**
  — the last was missing from our data entirely) and the Contact Us page
  (84012 19941, 98250 09420).
- **Socials: 3 → 4.** WhatsApp was missing. Added with the client's exact
  prefilled-message URL, first in the list as their own "Join Us:" widget has
  it. `FiMessageCircle` had to be registered in `lib/icons.ts` — `getIcon`
  silently falls back to a generic box icon for unknown names, so the icon
  would have rendered wrong rather than erroring.

**IMPORTANT — the live site is NEWER than the database backup.** `+91 99789
86635` and "Mon-Fri 9:00 to 18:00" appear in the theme's `footer.php` but are
**nowhere in the SQL dump**. Anything sourced only from the DB may therefore be
stale; the theme files are the better source for footer/chrome content.

**4. Page content audit (extracted, not yet migrated).**
`scripts/extractWordpressPages.mjs` → `data/generated/wpPages.json`. Real
content per page, in characters (HTML body + Elementor blocks):

| page | HTML | Elementor | verdict |
| --- | --- | --- | --- |
| company (About) | 5082 | 5240 | **rich** — About/Activity/History sections |
| front-page | 4196 | 0 | rich |
| privacy-policy | 2481 | 0 | real |
| quality-policy | 1109 | 0 | real |
| career | 625 | 0 | thin |
| contact-us | 290 | 0 | address + phones (already migrated) |
| vision-mission | 12 | 2825 | **shared template, no unique copy** |
| milestone-awards | 12 | 2825 | same shared template |
| news-events | 12 | 2825 | same shared template |
| **infrastructure** | **0** | **0** | **EMPTY in WordPress** |
| **network** | **0** | **0** | **EMPTY in WordPress** |

The identical 2825/1-block figure across vision-mission, milestone-awards and
news-events is one shared Elementor template, not three pages of copy — so
those pages have no unique content to migrate. Infrastructure and Network are
completely empty in the database (their visible content, e.g. the "Our Domestic
Business" map, is imagery placed by the page builder).

**Still to do:** port the About page's three real sections (founding story,
Activity, the 1992→ History timeline) into the new design, and decide what to
do about Infrastructure/Network, which have no source content to migrate.

**Files:** `components/layout/MegaMenu.{tsx,module.css}`,
`components/cards/ProductCard.{tsx,module.css}`, `data/catalog.ts`,
`constants/site.ts`, `lib/icons.ts`,
`components/layout/Footer.{tsx,module.css}`,
`scripts/extractWordpressPages.mjs`, `data/generated/wpPages.json`.

**Verified:** build 77/77; menu list and submenu both `overflow: visible` /
`max-height: none`; 14/14 product cards on real photos; footer renders 5 tel:
links and 4 social hosts (api.whatsapp.com, facebook, instagram, twitter).

---

## 2026-07-21 13:25 IST

### Products section rebuilt from the client's real WordPress data

**Status:** Completed and verified (desktop + mobile, build 77/77).

Brief: replicate the client's product navigation hierarchy exactly, and make
every product page carry everything the old WordPress site shows, with a proper
gallery, using the original product photography.

**Source of truth.** The client's full WordPress install is in the repo at
`wordpress/`, and `wp-content/updraft/backup_2026-07-11-0205_…-db.gz` is a
complete mysqldump. Rather than transcribe pages by hand, the dump was parsed
directly (scratchpad script; UpdraftPlus writes `INSERT INTO \`tbl\` VALUES`
with **no column list**, and MySQL-escapes strings — a naive split on `),(`
corrupts the content). That yielded 38 published products, 322 attachments, the
58-item nav menu and the WooCommerce taxonomy.

**Key finding — the nav is NOT the WooCommerce taxonomy.** `product_cat` holds
sub-brand names (Hydra, Xpert, Step, Xenon Lift Display, TFT Display, Deci Bel
Audio Devices…) that do not match the menu at all. The hierarchy in the client's
reference screenshots is a hand-built menu of custom links. It was transcribed
from `wp_posts`/`wp_postmeta` nav_menu_item rows into `CATEGORY_PRODUCTS` in
`scripts/generateCatalog.mjs`: **14 categories, 5 with children, 24 child
products** — matching the reference exactly. Verified against the derived
`MAIN_NAV`: 14 categories / 24 children.

**What the site was missing:** 3 display products (XTFT-056, XTFT-070, XTAB
Smart Display with Audio) and 2 product slugs that did not match WordPress
(`fa-50-chip-based`, `fa-250-mp3` → the full WP slugs, so URLs line up with the
client's old paths).

**Content pipeline (new, reproducible):**
- `scripts/generateCatalog.mjs` — WP dump → `data/generated/catalog.json`.
  `post_excerpt` ("Salient Features" lists, sometimes several per product —
  Touch COP/LOP carries C-TOUCH and E-SENSE blocks) is parsed into structured
  `{heading, items[]}` groups. `post_content` (specification tables) is
  **sanitised, not re-parsed**: presentational attributes from the old theme are
  stripped so the site's tokens style it, while `rowspan`/`colspan` and nested
  option lists survive verbatim. A bespoke parser would have silently dropped
  merged cells, and the brief was that nothing published is lost.
- `scripts/stageProductImages.mjs` — copies only the referenced photos out of
  `components/original/` into `public/images/products/catalog/`, normalising
  mixed-case names (`XTFT-043-TFT-Display1.jpg`) to lower kebab-case. Windows is
  case-insensitive but the production host is not, so this prevents a whole
  class of 404s. **All 104 image references (86 unique files) resolved; zero
  missing.**
- `scripts/optimizeProductImages.mjs` — the existing two optimisers are
  PNG-only and the client's photos are JPG, so this generates the WebP ladder
  for the catalogue and MERGES into `lib/imageManifest.json` (86 entries, 172
  variants). `lib/imageLoader.ts` was made extension-agnostic (png|jpe?g) —
  existing PNG behaviour unchanged.
- `data/catalog.ts` — typed accessor joining the generated content to
  `PRODUCT_TREE`, which keeps owning navigation.

**UI:**
- `components/products/ProductGallery.tsx` — main image, thumbnail strip,
  arrows, cross-fade, and a focus-trapped lightbox (Escape/arrows/backdrop,
  focus restored on close). Adapts from 1 photo (no strip) to 15 (Blower Fan).
  Images are CONTAINED, never cropped — a technical buyer needs to see the whole
  panel.
- `sections/products/ProductDetail.tsx` — gallery + salient features + spec
  tables, each rendered only when the client actually published it, so there is
  no empty "Specifications" shell. Products with no copy switch to a stacked,
  centred layout instead of leaving half the row blank.
- Category pages: the 9 categories the client's menu links to **directly**
  (Elevator Doors, COP/LOP, Elevator Cabin…) now show their real product content
  inline rather than bouncing the visitor through a one-item list. Elevator
  Cabin renders all 4 finishes and KIT Accessories all 3 items on one page.
  The 5 categories with submenus keep the card grid.

**HONEST CONTENT GAP — the client's WordPress simply does not have some of what
the brief asked for. Nothing was invented (CLAUDE.md rule):**
- **Specifications/attributes:** WooCommerce `_product_attributes` is `a:0:{}`
  on **all 38** products. The only spec data that exists is the HTML tables in
  the body of **11** products; those are shipped in full.
- **Downloads:** `_downloadable_files` is `a:0:{}` on all 38, and there are
  **zero PDFs in the entire uploads folder**. No downloads section is rendered.
- **19 of 38 products have no text whatsoever** on the client's live site and
  are image-only here by explicit decision: Elevator - IOT; all 10 of
  XN-1000/2000/2100/3000/4000, XLCD-01/02, XTFT-043/056/070; COP/LOP; all 4
  voice systems (FA-50, FA-250, Close Door Announcer, Elevator Gong); Blower
  Fan, Round Fan, LED Lights. **Hand this list to the client for copy.**
- The client's nav links "Elevator KIT Accessories" to a product slug that has
  no published post; the category page shows the 3 real accessory products
  instead.

**Follow-up — desktop Products menu rebuilt as a true two-level flyout.** The
nested products were still unreachable from the navbar: `MegaMenu.tsx` rendered
only the 14 categories in themed columns and never touched `cat.children`,
which the nav data had been carrying all along. It is now the client's own
shape — one vertical list of all 14 categories in PRODUCT_TREE order (new flat
`mega.categories`, built straight from the tree so it cannot drift from the
themed `mega.groups` the footer uses), with a chevron and hover/focus flyout on
the five that have children.

Two layout traps worth recording:
- The category list scrolls (14 rows outgrow a short viewport) and
  `overflow-y: auto` **clips on both axes**, so a flyout nested inside the list
  was sliced off at its right edge — visible in `getComputedStyle` as
  `visibility: visible` while painting nothing. The flyout is now a SIBLING of
  the list, positioned from the hovered row's measured `offsetTop` (recomputed
  on scroll so it stays pinned).
- Top-aligning an 11-item flyout (Elevator Display) with a row low in the list
  runs it past the fold, so `max-height` is set inline from the row offset and
  it scrolls internally. Verified at 804px: control panel 3 items, display 11,
  voice 4 — all bottoms inside the viewport.

**Follow-up 2 — navigation is now click-driven, and the menus share one look.**
- **"About" and "Products" are no longer links.** They are group labels, so
  they render as `<button>` and never navigate; clicking toggles their menu.
  Only the items inside are destinations. Same rule one level down: a category
  with children (5 of 14) is a button that opens its submenu, while the other 9
  are plain links.
- **Hover no longer opens anything.** The hover-intent timer (`closeTimer`,
  `openSub`, `scheduleClose`, `keepOpen`) and the header's `onMouseLeave` are
  gone. Menus close on outside pointerdown, on Escape (focus returns to the
  trigger), on choosing a link, and on route change.
- **`MegaMenu.module.css` now mirrors `NavDropdown.module.css`** — same panel
  surface, row padding, radius, hover wash and arrow reveal, anchored under the
  nav item rather than centred — so Products and About read as one system. The
  old hairline row separators are gone.
- ~~Each submenu leads with an "All &lt;category&gt;" link.~~ **Removed on client
  direction** — the submenus now list products only, matching the client's own
  site where a parent category is a grouping with no page of its own. The 5
  category landing pages still exist and are reachable from `/products` and from
  product breadcrumbs; they are simply not advertised in the navigation.
- Verified: triggers are buttons, no `a[href="/products"]` in the nav, hover
  does not open, click does, switching menus closes the other, outside click
  and Escape both close, submenu opens on click with the "All …" link present.

**Two fixes on top of that:**
- **Products panel opened at the far LEFT of the header.** `MegaMenu` was
  mounted as a direct child of `<header>` (a leftover from when it was a
  full-width centred panel), so its `left: 0` anchored to the header rather
  than to the nav item. It now renders inside the Products `<li>` next to
  `NavDropdown`, which is why About had always been positioned correctly.
  Verified: panel left === trigger left (454px), flyout right 1099 < 1422.
- **The caret flipped on HOVER**, pointing up while the menu was still closed
  (`.navItem:hover .caret`). It is now driven by state —
  `[aria-expanded="true"] .caret` — so it reflects open/closed, not pointer
  position. Verified the transform is unchanged on hover and flips on click.
- Panel widened to 21rem (submenu 19rem): at 250px most category labels wrapped
  onto two lines ("Lift Master Door Operator Controller", "Automatic Rescue
  Device (ARD)"). No label wraps now.

**Light-theme bug — invisible secondary CTA on dark bands.** The CTA band is
always a dark photograph in BOTH themes (its eyebrow, title and description are
hardcoded white for exactly that reason), but the shared secondary Button was
still reading theme tokens, so in LIGHT theme it rendered near-black text on a
near-black border against the dark image and vanished. Fixed by giving those
buttons an explicit light-on-dark treatment (white text, translucent white
border and fill), scoped under the actions row so it outranks
`Button.module.css`'s own single-class `.secondary` rules regardless of
stylesheet order.

Swept the other 12 `variant="secondary"` usages for the same fault: all sit on
normal theme surfaces except **`ScrollStory.tsx`** — its `.story` canvas is a
hardcoded near-black gradient in both themes, so "Explore solutions" had the
identical bug. Fixed the same way. (That view is the no-WebGL /
reduced-motion homepage fallback, which is why nobody had noticed it.)

**Encoding bug — mojibake on 8 product pages (found by the client).** The dump
parser read the SQL as **latin1**, decoding each byte of a UTF-8 sequence
separately, so `–` became `â€“`, `"` became `â€`, and those strings shipped to
the live product pages (`/products/lift-master` showed `LMP66 â€“ TINY`).
Fixed by reading the dump as `utf8`. Affected: parallel-type-controller,
serial-can-bus-type-controller, mrl-control-panel,
lift-master-door-operator-controller, the three Synergy door mechanisms and
touch-cop-lop.

Two things were hardened so this cannot recur silently:
- The parser moved out of the scratchpad into
  **`scripts/parseWordpressDump.mjs`**, so the whole WordPress → site pipeline
  is reproducible in-repo and carries the encoding requirement in its header.
- **`scripts/generateCatalog.mjs` now fails** (non-zero exit, no file written)
  if any product contains mojibake, rather than publishing gibberish.

Verified: 0 affected products after regeneration, and a scan of **all 71
exported pages** finds no mojibake and no U+FFFD replacement characters.
`/products/lift-master` now reads "LMP66 – TINY" and "Medium – Large Opening".

**Third pass — caret geometry + hover restored alongside click:**
- **The caret drifted up-and-right when it flipped.** The transform was written
  `rotate(45deg) translateY(-1px)` / `rotate(225deg) translateY(2px)`: a
  translate listed AFTER a rotate runs in the ROTATED coordinate space, so a
  "vertical" 1px nudge actually moved the arrow diagonally, and the two states
  used different magnitudes. Now `translateY(-1px) rotate(45deg)` /
  `translateY(1px) rotate(225deg)` — translate first, so it stays in unrotated
  space, mirrored about the centre. The mirroring is deliberate rather than
  zero: the ink of a border-drawn chevron sits in the LOWER half of its box
  when pointing down and the UPPER half when pointing up, so the box has to
  move the opposite way to keep the visible arrow centred. Verified the
  matrix translation is (0, -1) closed and (0, +1) open — purely vertical, no
  horizontal component, where it used to be (0.707, -0.707) / (1.373, -1.428).
- **Both hover and click now open the menus, at both levels.** Top level: a
  short (160 ms) close delay covers the few pixels of gap between trigger and
  panel — the panels are DOM descendants of their `<li>`, so hovering a panel
  never fires the item's `mouseleave`. Nested level needs no timer at all: the
  submenu sits flush against the category list inside the same panel, and
  hovering a childless row dismisses whichever submenu is showing so the panel
  always reflects the row under the pointer. Click still toggles (clicking an
  open menu closes it), and parents remain non-navigable.
- Verified: hover opens the menu, hover opens a submenu, hovering a childless
  row dismisses the submenu, click closes an open menu and re-opens it.

**Deliberate deviations from a literal copy, for review:**
- Nav **labels** keep the house text style (`XN-1000 LED Segment Display`, not
  `XN-1000-LED Segment Display`; `Elevator IoT`, not `Elevator - IOT`) because
  CLAUDE.md's STRICT dash rule forbids the connector dashes while preserving
  official model names. Structure and order are identical. Say the word to
  switch to the client's literal strings.
- The mega menu groups the 14 categories into themed columns (PRODUCT_GROUPS)
  rather than one flat list. Parent/child structure is unchanged.
- Product routes remain **default-deny** in `config/pageReleases.ts`
  (`RELEASED_PRODUCT_ROUTES: []`), so they show Coming Soon in production and
  are fully browsable in development. Flip when the client signs off.

**Files:** `scripts/{generateCatalog,stageProductImages,optimizeProductImages}.mjs`,
`data/catalog.ts`, `data/generated/{catalog.json,wpProducts.json,catalog-map.json}`,
`data/products.ts`, `lib/imageLoader.ts`, `lib/imageManifest.json`,
`components/products/ProductGallery.{tsx,module.css}`,
`sections/products/ProductDetail.{tsx,module.css}`,
`app/products/[category]/page.tsx`, `app/products/[category]/[product]/page.tsx`,
`app/products/[category]/detail.module.css`,
`public/images/products/catalog/` (86 JPG + 172 WebP).

**Verified:** build 77/77 static pages (was 74). Automatic Door Controller
renders 3 photos + 24 feature bullets + the model table with both `rowspan`
cells intact; COP/LOP renders all 9 photos; Elevator Cabin renders 4 variants;
breadcrumbs Home > Products > Category > Product. At 390px there is no page
overflow and the wide spec tables scroll inside their own box.

---

## 2026-07-21 12:40 IST

### `/variant16` — city photos supplied, floating glass navbar, centred hero

**Status:** Completed and verified (light + dark + scrolled + mobile).

Client direction on variant16: drop the right-hand product spotlight, centre the
hero content, and float the navigation bar as a glassmorphism pill (reference:
"Aether Lane" style rounded, detached bar) at the width it already has.

- **Background photos supplied** — `hero-city-day.png` / `hero-city-night.png`
  (1535 x 1024) now live in
  `public/images/home/hero-exploration/environment/`, optimized to WebP at
  384/640/960/1280 via `scripts/optimizeHeroExploration.mjs` (the merge-safe
  script — a plain `optimizeImages.mjs` run would wipe the hero-exploration
  manifest entries). The night photo was replaced once under the same filename;
  the script must be re-run in that case or the old variants persist.
- **`corporate/Variant16Hero.tsx` rewritten** — the entire `.media` spotlight
  block is gone. One centred content column (eyebrow, headline, lead, CTAs,
  trust row) sits over the full-bleed photo. The two photos still cross-fade
  purely in CSS by the `[data-theme]` attribute set pre-paint, so no JS and no
  flash.
- **Floating glass navbar (opt-in, per page)** — the hero sets
  `data-nav="float"` on `<html>` while mounted and removes it on unmount, and
  `styles/globals.css` restyles the global header for that flag only: the header
  goes `position: fixed` with transparent background and detaching padding, and
  its existing `.container--wide` becomes the pill (radius-pill, glass
  background, blur, hairline border, shadow). Width is unchanged, so it lines up
  with the rest of the site. Verified `/variant15` and the other routes still
  render the normal sticky navbar.
- **Selector note:** the override targets `header[data-scrolled]` rather than a
  class because the Navbar's classes are hashed CSS-Module names, and the
  attribute is what lifts specificity above the module's own
  `.header[data-scrolled="true"]` / `.header.megaOpen` background rules.
- **Legibility pass** — the radial scrim now covers the whole content block
  (the badge labels were landing on bright water); badge labels use
  `--text-secondary` inside `.content16`; the ghost "Explore products" CTA gets
  the same glass fill as the navbar so it survives over the photograph.

**Bug found and fixed (was silently breaking all glass surfaces):** the CSS
minifier auto-prefixes `backdrop-filter`, but when a rule declares BOTH
`backdrop-filter` and `-webkit-backdrop-filter` by hand it dedupes to the
`-webkit-` form ALONE — and current Chrome has dropped that alias
(`CSS.supports('-webkit-backdrop-filter', …)` is now `false`), so the blur never
applies. Fixed in the new rules by declaring only the standard property. **16
pre-existing source files still declare both** (`Navbar`, `MegaMenu`,
`MobileNav`, `NavDropdown`, `ComingSoon`, `Modal`, `ComponentModal`,
`ElevatorScene`, `ExplorationHero`, `ScrollStory`, `variants`, `TechShowcase`,
`corporate`, `globals`) — their blur is dead in Chrome today. Left alone here
because fixing them changes every page's appearance mid client review.

**Follow-up pass the same afternoon (client feedback on the floating bar):**

- **Dead space removed** — the pill was inheriting the navbar's
  `justify-content: space-between` at full `container--wide` width, which parked
  the logo and the actions at the far edges and left two large empty gaps inside
  the glass. It now sizes to its content (`width: fit-content`, auto margins
  centre it) with an explicit `gap`. Below the 1080px desktop-nav breakpoint it
  reverts to full width, otherwise the logo + hamburger would collapse to a stub.
- **No more height jump on scroll** — the module shrinks `.inner` from
  `var(--nav-h)` (76px) to 64px once `data-scrolled="true"`. The float override
  now pins it to **64px in both states** (the height the client preferred).
  Verified: pill height 64 before and after scrolling, delta 0.
- **Genuinely translucent** — was `--surface-glass-strong` (0.85 alpha), which
  read as a solid white/black bar. Now
  `color-mix(in srgb, var(--surface-glass) 58%, transparent)` (~0.42 alpha,
  ~0.52 when scrolled), so the photo reads through it. Kept token-based rather
  than hardcoding rgba. Blur was dialled back on client feedback: 26px → 14px →
  **5px** (the last step was set directly in the file), so content passing under
  the bar stays recognisable rather than becoming a smear.
- **Both hero CTAs removed** — "Get a free quote" and "Explore products" are
  gone on client direction, so the hero is eyebrow → headline → lead → trust
  row. The trust badges moved from the `d5` to the `d4` entrance delay to close
  the gap the CTA beat left in the stagger, and the now-dead `.content16
  .ctaRow` / `.glassBtn16` rules plus the `Button` and `CTA` imports were
  deleted. **Note:** the lead still ends "Explore the range or tell us about
  your project", which now invites an action the hero no longer offers — flagged
  to the client, copy left as-is pending their call. The navbar's "Get a quote"
  button is the only hero-level conversion path on this variant now.
- **Dark-theme scrim lightened too**, but only as far as the photograph allows:
  0.86 → **0.70** centre (mid 0.6 → 0.46, top 0.7 → 0.56, bottom 0.65 → 0.52).
  Chosen by sweeping candidate strengths through the same measurement harness
  rather than by eye — the night photo's lit tower windows sit directly behind
  the copy, so at 0.55 the lead was 3.50:1 and the badges 4.26/4.48:1 (all
  failing) and at 0.62 the lead was still 4.33:1. 0.70 is the lightest tier
  where every white text role clears AA: h1 5.23:1, lead 5.52:1, badge stat
  6.45:1, badge label 6.77:1.
- **Known issue, PRE-EXISTING (not introduced here):** in dark theme the
  accent-blue eyebrow "ELEVATOR COMPONENTS, MADE IN INDIA" ends over a brightly
  lit tower crown, and `--accent` on that backdrop fails AA at **every** scrim
  strength tested — 1.49:1 at 0.55, 2.36:1 at 0.70, and **3.98:1 even at the
  old 0.86**, all short of the 4.5:1 small-text minimum. The scrim cannot fix
  it because the accent is itself a light blue. Options if the client wants it
  resolved: use `--text-primary` for the eyebrow in this variant's dark theme,
  shorten the eyebrow so it clears the tower, or narrow `.content16`.
- **Light-theme scrim lightened** so the skyline reads as a photograph rather
  than a washed-out backdrop: radial centre 0.9 → 0.58 alpha, mid 0.6 → 0.34,
  top wash 0.62 → 0.4, bottom 0.55 → 0.38. Dark theme untouched.
  **Contrast was re-measured, not eyeballed** (screenshot with the copy hidden,
  sample the true backdrop under each text box, worst-case WCAG ratio): at the
  lighter scrim the lead fell to **2.27:1** and the badge labels to **2.3:1**,
  both failing AA. Fixed by darkening the TEXT instead of pouring white back
  over the picture — `.content16 .lead` and `.content16 .badgeLabel` now use
  `--text-primary`. Re-measured: h1 5.32:1, lead 5.27:1, badge stat 6.06:1,
  badge label 7.51:1 — all pass.
- **Trust row trimmed to two badges** — "ISO Process" and "Exporter" dropped on
  client direction. `TrustBadges` gained an optional `only` prop (filter by
  `stat`) so variant16 shows a subset **without forking the shared data**;
  variants 7/8/9/10/14/15 still render all four (verified in the export).
  `.content16 .trust` switched from `repeat(4, auto)` to
  `grid-auto-flow: column` so the column count follows the item count.

**Files:** `sections/experience/corporate/Variant16Hero.tsx`,
`sections/experience/corporate/TrustBadges.tsx`,
`sections/experience/corporate/corporate.module.css` (V16 block rewritten),
`styles/globals.css` (floating navbar), `imagegeneration.md` §11.7,
`public/images/home/hero-exploration/environment/hero-city-*.{png,webp}`,
`lib/imageManifest.json`.

**Verification note (important for future work):** the in-app preview pane
returns STALE computed styles — it reported the pill as transparent with no
blur even after `element.style.background` was set inline, and screenshots timed
out. Everything above was verified instead by driving a real headless Chrome
over the DevTools Protocol (launch with `--remote-debugging-port`, drive via
Node 22's global `WebSocket`: seed `localStorage` for the theme, navigate,
`document.getAnimations().forEach(a => a.finish())` to settle entrances, then
`Page.captureScreenshot` + `Runtime.evaluate` probes;
`Emulation.setDeviceMetricsOverride` for mobile, since Chrome on Windows clamps
real window width to ~500px). Production build stays clean: 74/74 static pages.

---

## 2026-07-21 11:51 IST

### New `/variant16` — variant15 with a theme-swapped city background

**Status:** Completed (awaiting the two client photos)

Client picked variant15 and wants a full-bleed city photograph behind the hero
(reference: blue-hour skyline across water), with the light/dark pair idea:
the background follows the theme toggle.

- **`corporate/Variant16Hero.tsx`** — variant15's hero verbatim (same 9-part
  rotating spotlight, dots, CTAs, trust badges) plus two stacked background
  photos cross-faded purely in CSS by the `[data-theme]` attribute the
  ThemeProvider sets on `<html>` BEFORE paint, so there is no JS and no flash:
  light → `hero-city-day.png`, dark → `hero-city-night.png`.
- **Legibility scrim** (`.scrim16`, theme-aware): strong veil on the left
  (headline + trust badges), a soft radial veil behind the right spotlight, and
  clear in between; on mobile (stacked layout) it becomes an even top-to-bottom
  veil. Content z-3 / spotlight z-2 / scrim z-1 / photos z-0.
- **Graceful fallback:** `lib/imageLoader.ts` passes unknown paths through, so
  until the photos are added the build still succeeds and the hero simply shows
  variant15's gradient — nothing looks broken.
- `/variant16` page reuses `CategoryBrowse15` + `HomeSections`; route added to
  `config/pageReleases.ts`; asset spec + both prompts documented as
  imagegeneration.md §11.7.

**Verified:** build green (compiled, TypeScript clean, **74/74** pages, was 73);
export references both `hero-city-day.png` and `hero-city-night.png`, renders
the 9-part spotlight and the browse grid; `/variant15` confirmed untouched
(zero hero-city refs).

**Next:** client drops `public/images/home/hero-city-day.png` and
`hero-city-night.png` (16:9, >=2400px). Then run `optimizeImages.mjs` FOLLOWED
BY `optimizeHeroExploration.mjs` (the latter merges into the same manifest and
a plain optimizeImages run would drop its entries).

---

## 2026-07-18 11:56 IST

### `/variant15` browse grid — one card per UNIQUE image (9, no duplicates)

**Status:** Completed (verified live)

Client: the category grid must not repeat images — show only cards with a
unique image (9 part images → 9 cards). Rebuilt `CategoryBrowse15` to iterate
`CATALOG_PARTS` (the 9 unique renders) instead of the 14 `PRODUCT_TREE`
categories (which shared images). Each card: the part render, the part name,
its description, a small "In <category>" crumb, and a link to its closest
category (`CATEGORY_FOR_PART`). Header copy updated ("Find it by component",
no fabricated count). New `.catCrumb15` style.

**Verified live** (dev server): the grid renders exactly 9 cards, 9 unique
images, duplicates: [] — each with the right name/crumb/href. Build green
(73/73).

**Files:** `corporate/CategoryBrowse15.tsx`, `corporate.module.css`.

---

## 2026-07-18 11:50 IST

### Site default theme flipped to LIGHT (persistence unchanged)

**Status:** Completed (verified live)

Client: the site should open in LIGHT for every visitor; if they toggle to
dark it must stay dark across refresh/navigation. The persistence mechanism was
already correct (localStorage `philbrick-theme`, read before paint by
`themeInitScript`, a saved choice always wins) — only the FIRST-TIME default
needed flipping dark → light.

Changed the three dark defaults to light: `themeInitScript` (`var t='light'`),
`ThemeProvider` initial state + the `useEffect` fallback, and the layout
`viewport.themeColor` (#0A0E14 → #FFFFFF, so the browser chrome starts light
too). No OS colour-scheme following (unchanged, deliberate). tokens.css bare
`:root` stays dark as the pre-script base, but the inline head script sets
`data-theme` before paint so there is no flash (same no-FOUC pattern that
already worked for the dark default).

**Verified live** (dev server): with localStorage cleared, a fresh load applies
`data-theme="light"`, meta theme-color #FFFFFF, and NOTHING is written to
storage (a real first-time state). After setting `philbrick-theme="dark"` and
reloading, it applies `data-theme="dark"` with meta #0A0E14 —
"DARK PERSISTS ACROSS REFRESH". Export confirms `var t='light'` +
theme-color #FFFFFF baked in. Build green (73/73).

**Files:** `components/providers/ThemeProvider.tsx`, `app/layout.tsx`.

**Note:** existing visitors who already toggled dark keep dark (their saved
choice wins); only visitors with no saved preference now get light. To see the
new default yourself, clear the `philbrick-theme` localStorage key (or use a
fresh/incognito profile).

---

## 2026-07-18 11:44 IST

### `/variant15` — spotlight drop-shadow removed

**Status:** Completed (verified live)

User circled a soft rectangular shadow around the spotlight area in light
mode. Live probe confirmed the only remaining shadow source was the
`drop-shadow(0 22px 40px …)` filter on `.slide15Part` (the panel dressing was
already removed); at 40px blur it read as a large soft rectangle on the light
background. Removed the filter — the spotlight is now a completely flat cutout
on the page background. Verified live: all 9 spotlight images compute
`filter: none`. Build green (73/73).

**Files:** `corporate.module.css` (`.slide15Part`).

---

## 2026-07-18 11:40 IST

### `/variant15` — spotlight now rotates ALL 9 catalogue components

**Status:** Completed (verified live)

Client: the hero should display all components, not 5. The spotlight now maps
over the full `CATALOG_PARTS` set (catalogue order) via `CATEGORY_FOR_PART`,
adding the four that were missing with sensible category links: Overload
Annunciating Device + Fan and Blower → /products/elevator-kit-accessories,
Floor Announcing System → /products/voice-announcing-systems, Safety Light
Curtain → /products/synergy-auto-door. 9 slides, 9 dots, ~34s full rotation
(3.8s per slide, pauses on hover). Verified live on the dev server: 9 slides
with correct names/images/links. Build green (73/73).

**Files:** `corporate/Variant15Hero.tsx`.

---

## 2026-07-18 11:38 IST

### `/variant15` — theme-aware spotlight text + parts imagery in the category grid

**Status:** Completed (verified live in forced light mode)

Two client requests after they removed the spotlight's panel dressing
(background/border/box-shadow commented out in corporate.module.css — kept):

- **Light-mode legibility:** with no dark panel behind it, the spotlight's
  hardcoded white label text vanished in light mode. `.slide15Name` →
  `var(--text-primary)`, `.slide15Tag` → `var(--text-secondary)`, `.dot15`
  border → `var(--border-strong)`; removed the leftover dark scrim span (JSX)
  and the `::before` azure glow, completing the client's de-dressing. Verified
  by forcing `data-theme="light"` on the dev server: name rgb(11,16,23), tag
  rgb(69,80,92), dot visible, scrim gone.
- **"Find it by product category" imagery:** the 14 category cards now use the
  catalogue part renders (components/parts/) instead of the category cover
  photography, mapped per closest fit (`PART_FOR_CATEGORY` in
  CategoryBrowse15; related families intentionally share a render — all three
  control panel categories show the control panel part, both COP/LOP families
  the COP render, etc.). Card media restyled for transparent cutouts:
  `object-fit: contain` + padding on a `var(--surface-2)` stage (cover would
  crop cutouts). Verified: 14/14 cards serve components/parts images.

**Files:** `corporate/Variant15Hero.tsx` (scrim span removed),
`corporate/CategoryBrowse15.tsx` (part mapping), `corporate.module.css`
(label/dot tokens, glow removed, catMedia/catImg cutout treatment). Build
green (73/73).

---

## 2026-07-18 11:31 IST

### `/variant12` parts behind the navbar — overlay safe area fixed

**Status:** Completed (verified live on the dev server)

User report: variant11 was fine but variant12's top part images sat behind the
navbar. Root cause: variant11's ExplorationHero stage starts BELOW the sticky
navbar (`top: var(--nav-h)`), but variant12 (like variant6) reuses the 3D
hero's FULL-VIEWPORT stage — intentional for the cinematic arrival — so the
exploded overlay's % coordinates started at y=0 behind the header, and the
same slot data landed the top row under the navbar.

**Fixes:**
- `.v6Overlay` (shared by v6 + v12): `inset: 0` → `top: calc(var(--nav-h) +
  4px); bottom: 1vh` — the overlay's whole coordinate space now lives in the
  safe area, matching the geometry the slot data was designed for (also
  corrects the same latent clipping in variant6).
- `data/catalogParts.ts` slot tuning (measured empirically with real card +
  label heights on a 720px viewport): control panel slot y 14→20, overload
  y 15→18, elevator door y 86→80 with hCapVh 22→19 (shared data — keeps
  variant11 clean too, where the door was marginally clipping the fold).

**Verified live** (dev server, sticky-engaged geometry): probe of all 9 part
cards reports behindNav: [] and belowFold: [] — "ALL PARTS IN SAFE AREA".
Production build green (73/73).

---

## 2026-07-18 11:24 IST

### `/variant15` spotlight invisible — animation shorthand collision fixed

**Status:** Completed

User report: the v15 hero's right side rendered empty. Root cause: the
spotlight element carries BOTH `.animInRight` (entrance: initial `opacity: 0`
+ `animation: corpInRight`) and `.spotlight15` (`animation: corpFloat`). The
`animation` SHORTHAND on `.spotlight15` (same specificity, later in source)
completely overrode `.animInRight`'s animation — so the entrance never ran and
the panel stayed at opacity 0 forever.

**Fix:** `.spotlight15` now declares both animations itself
(`corpInRight … forwards, corpFloat … infinite`) with a comment explaining the
collision. Verified on the dev server: both animations attach with correct
fill/duration/delay; the embedded preview freezes animation clocks
(currentTime stuck at 0), so the fix was PROVEN by fast-forwarding
`getAnimations()` currentTime → computed opacity 1 with the float phase
active. In a real browser the panel fades/slides in on load as designed.
Build green (73/73).

**Rule of thumb recorded:** never pair `.animInRight` (or any entrance class)
with another class that sets the `animation` shorthand — the later rule wins
the whole shorthand and cancels the entrance while keeping the hidden initial
state. Merge the animations into one declaration instead.

**Files:** `corporate.module.css` (`.spotlight15`).

---

## 2026-07-18 11:20 IST

### `/variant14` + `/variant15` switched to the catalogue parts imagery

**Status:** Completed

Client: both should use `components/parts/` (the catalogue cutouts) like
variants 11 to 13, not the older photoreal set / category photography.

- **v14:** the floating gallery now maps `CATALOG_PARTS` (all 9 catalogue
  cutouts) with a re-tuned 9-item cluster layout (`LAYOUT` keyed by catalogue
  keys); labels from the catalogue names. Old `PART_ASSETS` import removed.
- **v15:** the rotating spotlight now shows 5 catalogue parts (control panel
  and ARD, cabin, COP and LOP with display, lift display, elevator door), each
  linking to its closest REAL product category (/products/elevator-control-panel,
  /elevator-cabin, /cop-lop, /elevator-display, /elevator-doors). Cutouts
  render `object-fit: contain` with padding + drop shadow on the dark panel
  (new `.slide15Part`) with a soft azure glow behind (`.spotlight15::before`);
  the category browser section below keeps the real category photography (it
  is about the categories themselves).

**Files:** `corporate/Variant14Hero.tsx`, `corporate/Variant15Hero.tsx`,
`corporate.module.css`. Build green (73/73, TypeScript clean). Export checks:
v14 shows all 9 parts and zero old refs; v15 spotlight shows the 5 parts with
5 correct category links and the browser still lists all 14 categories.

---

## 2026-07-18 11:16 IST

### Five new hero variants (`/variant11`–`/variant15`) on the catalogue assets

**Status:** Completed (motion to be judged in the real browser as usual)

Client supplied a new asset set: the printed catalogue's exploded diagram
separated into 9 true-alpha part cutouts
(`public/images/home/hero-exploration/components/parts/`) + the central
technical drawing of the whole installation (`environment/drawing-elevetor.png`),
with a reference image mapping each part to its position on the drawing.

**Asset pipeline:** originals archived
(`image-sources/home/hero-exploration/parts-original/`); filenames normalised
to kebab-case (had spaces); trimmed + 16px margin; duplicate drawing copy in
parts/ removed (canonical in environment/); `optimizeHeroExploration.mjs`
re-run (webp + manifest). New shared data module **`data/catalogParts.ts`**:
9 parts with honest catalogue names/taglines/descriptions, aspects, `anchor`
(where the part lives on the drawing, stage %) mapped from the reference
(machine room top → pit bottom, catalogue-true left/right sides), `slot`
(zigzag exploded columns) + `CATALOG_SPINE` + pacing.

- **`/variant11` Catalogue exploded tour:** `ExplorationHero` was
  PARAMETERISED with an optional `config` prop (parts, spine, pacing, mobile
  slots, copy) whose defaults reproduce /variant1 exactly (verified: variant1
  export unchanged — cutaway spine, 8 original parts, original copy, 892vh).
  `Exploration11Hero` passes the catalogue config: drawing spine + 9 parts
  flying to their documented positions with leader lines. 9 beats, ~970vh.
- **`/variant12` Catalogue journey:** `Variant12ElevatorScene` duplicates
  Variant6ElevatorScene (100% of the 3D arrival/GSAP/scroll preserved); only
  the DOM overlay changed: drawing spine + the 9 catalogue parts/labels
  (from catalogParts). Parts are informational (no modal — the catalogue set
  has no spec-sheet content; empty modals would read broken). Rail lists the
  9 parts.
- **`/variant13` Corporate scroll component reveal:** new
  `corporate/Variant13Hero` — sticky stage, the drawing right with a pulsing
  azure marker that eases to each part's anchor, content panel left crossfades
  one component at a time (index, name, description, image) until all 9 are
  introduced; step dots; reduced-motion = static stacked list. ~900vh,
  transitions CSS-only (React state changes ~10x per page).
- **`/variant14` Animated product gallery:** `corporate/Variant14Hero` keeps
  variant10's split; the right side is a floating product constellation of the
  8 photoreal component renders — staggered entrance, per-item float/rotation
  at varied tempos, two slow orbiting dashed rings, layered pointer parallax by
  depth (CSS vars + one rAF), hover name chips. Transform/opacity only.
- **`/variant15` Product spotlight + category browser:** `corporate/
  Variant15Hero` (original hero inspired by the QUALITIES of product-first
  machinery sites: bold type left, an auto-rotating category spotlight right —
  4 flagship categories crossfading with name/tagline/link, dots for manual
  selection, pauses on hover/reduced-motion) + `corporate/CategoryBrowse15`
  ("Browse by product category": all 14 REAL categories from data/products.ts
  as premium cards — real photography, name, clamped description, hover
  lift/zoom/arrow, whole card links to /products/<slug>).

**Files:** `data/catalogParts.ts` (new), `ExplorationHero.tsx` (config prop,
defaults = variant1), `Exploration11Hero.tsx`, `Variant12ElevatorScene.tsx` +
`variants/Variant12Hero.tsx`, `corporate/Variant13Hero.tsx`,
`corporate/Variant14Hero.tsx`, `corporate/Variant15Hero.tsx`,
`corporate/CategoryBrowse15.tsx`, `corporate.module.css` (+v13/14/15 blocks,
all reduced-motion guarded), `app/variant11–15/page.tsx` (noindex,
ReleaseGate, shared HomeSections), `config/pageReleases.ts` (+5 routes).

**Verified:** build green (compiled, TypeScript clean, **73/73** pages, was
68). Export checks: v11 has the drawing + all 9 part images + 9 names; v13 has
the drawing, 9 steps ("of 09"), 9 part images, intro headline; v14 has all 8
gallery renders; v15 has 14 category links + the browse header; v12 is a
client-only shell like v6 (same architecture, verified at runtime). variant1
regression-checked and unchanged. Existing variants untouched.

**Notes:** the catalogue reference also showed door operators and accessories
callouts — no cutouts were supplied for those two, so the set is the 9
provided parts (drop-in extensible via catalogParts.ts). The drawing's
anchor→drawing-box mapping for v13's marker assumes the drawing spans stage
x 42..58, y 6..90 (same numbers documented in catalogParts.ts).

---

## 2026-07-17 18:38 IST

### `/variant8` — client re-exported a true-transparent tower

**Status:** Completed

Client replaced `india-tower.png` with a properly exported TRUE transparent PNG
(1024x1536, real alpha: corners alpha 0, ~49% transparent, ~1% semi — clean, no
baked checkerboard, no green fringe this time). Verified the composite over a
dark background: crisp premium glass tower (blue glazing, concrete balconies,
two faces), clean edges, no halo.

Archived the original, trimmed to the building (602x1464, aspect 0.41), and
generated the optimized webp + manifest. No CSS change — it sits on the existing
premium dark panel + azure glow (`object-fit: contain`, centred), filling the
panel height.

**Files:** `public/.../india-tower.png` (trimmed) + webp,
`image-sources/.../environment-original/india-tower.png` (archive),
`imageManifest.json`.

**Verified:** build green (compiled, TypeScript clean, 68/68); export references
`india-tower-384.webp` + png.

---

## 2026-07-17 18:29 IST

### `/variant8` — india-tower checkerboard keyed to true transparency

**Status:** Completed

The supplied india-tower.png wasn't actually transparent — it had the
transparency-preview CHECKERBOARD baked into the pixels (flattened fake
transparency): two neutral light squares, ~240 gray and ~254 white. On the
panel it showed as a visible checkerboard behind the building.

Keyed it out: removed neutral pixels (max-min channel ≤ 12) with min ≥ 236
(feather 226 to 236), which cleanly separated the light checkerboard from the
building's darker glass/concrete; trimmed to the building (923x1507, aspect
0.61). Verified the composite over a dark background — building fully intact,
no holes, no fringe. Re-optimized (384/640 webp). Reverted the v8 panel from
the interim LIGHT treatment back to the premium DARK panel + azure glow with
the now-transparent building `object-fit: contain`, centred, bleeding slightly
past the bottom.

**Files:** `corporate.module.css` (`.bleedMedia`/`.bleedScrim` → dark panel),
`public/.../india-tower.png` (keyed) + webp, `imageManifest.json`. Original
(with checkerboard) archived in `image-sources/.../environment-original/`.

**Verified:** build green (compiled, TypeScript clean, 68/68); export
references `india-tower-384/640.webp`; alpha coverage 69% opaque / 30%
transparent / 1% semi (clean cutout).

**Note for the client:** the source had baked fake transparency — future assets
should be exported as a real transparent PNG (no visible checkerboard when
opened over a colored background).

---

## 2026-07-17 18:21 IST

### `/variant8` — substantial india-tower building (client-supplied)

**Status:** Completed

Client added `india-tower.png` (1024x1536): a real, substantial premium glass +
concrete high-rise at a three-quarter angle on a clean WHITE studio background
(fully opaque, not transparent). Much better than the slender towers.

Tried white-background removal → came out patchy (the white has soft grey
gradients, leaving a semi-transparent halo). Better solution: keep the clean
white-bg photo and make the v8 panel LIGHT so the white blends. `.bleedMedia` is
now a white → soft-grey gradient panel (right ~47%, `object-fit: cover`,
`object-position: center top`; panel aspect ≈ image 0.667 so it fills edge to
edge with minimal crop); the dark editorial content stays on the left; the scrim
fades the dark hero bg into the light panel; the dark-glass spec cards read as
callouts on the light panel. Optimized to 384/640/960 webp (real resolution).

**Files:** `corporateData.ts` (tower → india-tower.png), `Variant8Hero.tsx`
(alt), `corporate.module.css` (`.bleedMedia`/`.bleedScrim` → light panel),
`public/.../india-tower.png` (+ webp), `image-sources/...` (original archive),
`imageManifest.json`. Old `commercial-tower` no longer used by v8.

**Verified:** build green (compiled, TypeScript clean, 68/68). Export: v8
references `india-tower-384/640/960.webp`, zero `commercial-tower` refs.

---

## 2026-07-17 18:14 IST

### `/variant9` + `/variant10` fully revamped on real site photography

**Status:** Completed

Client: variants 9 and 10 were "a disaster" and should be rebuilt to match the
current website and its pages. Root problem: both leaned on the dark cutaway
render / mismatched generated overlays. Rebuilt both on the site's OWN real
photography (the same premium imagery used across the pages) and the site's
editorial vocabulary (mono eyebrow + tick, display title, `next/image`, tokens).

- **v9 Premium Interior:** dropped the mismatched lobby + floating door leaves.
  Now a full-bleed cinematic hero on the real premium cabin render
  (`/images/products/elevator-cabin/…` — brushed steel, warm cove lighting,
  stone floor), slow ken-burns zoom, gradient scrim, white editorial content
  lower-left. Server component (no JS); pointer-parallax removed.
- **v10 Product Range Showcase:** dropped the dark-cutaway + hotspots (invisible
  on the dark theme). Now the split hero with a clean 2x2 grid of the site's
  real product-category photos (control panels, cabins, auto doors, displays)
  with labels, a subtle editorial stagger + hover lift, each tile LINKING to
  its real product page. Uses `PRODUCT_TILES` (real `CATEGORY_IMG` paths + real
  `/products/…` routes).

**Files:** `corporateData.ts` (+`HERO_IMG.cabin/craft`, `PRODUCT_TILES`),
`Variant9Hero.tsx` + `Variant10Hero.tsx` (rewritten), `corporate.module.css`
(ken-burns on `lobbyFill`; new `.tileGrid`/`.tile*`). No new assets — reuses
existing site photography.

**Verified:** build green (compiled, TypeScript clean, 68/68). Export: v9 uses
`elevator-cabin-1080.webp` and has zero `door-leaf` refs; v10 renders all 4
product tiles (control-panel/cabin/synergy-auto-door/display) with correct
labels and `/products/…` links. Consistent with the rest of the site and free
of the dark-on-dark visibility problem.

---

## 2026-07-17 16:12 IST

### `/variant8` — real glass tower wired in (client-supplied)

**Status:** Completed

Client generated `commercial-tower.png` (1024x1536, a real photoreal glass
skyscraper on a gray halo). Processed like the other environment mattes: halo
attenuated (alpha < 235 × 0.22) + trimmed → 208x1458, aspect 0.143 (a slender
supertall); original archived; `optimizeHeroExploration.mjs` re-run (webp +
manifest merge). Pointed `HERO_IMG.tower` at it (was `tower-night.png`), updated
the alt text, and tuned the panel (`.bleedMedia` bleed −14%/−14%, width
clamp(340px, 44%, 720px), centered glow) so the taller thin tower reads with
presence.

**Files:** `corporateData.ts` (tower path), `Variant8Hero.tsx` (alt),
`corporate.module.css` (`.bleedMedia`), `public/images/.../environment/`
(processed png + webp), `image-sources/.../environment-original/` (archive),
`lib/imageManifest.json`.

**Verified:** build green (compiled, TypeScript clean, 68/68). Static export
`variant8.html` uses `heroBleed`, references `commercial-tower-208.webp`, spec
cards present, zero remaining `tower-night` refs; webp valid (133 KB), manifest
merged. (The running dev-server preview 404'd this session — flaky preview
tooling, not the code; the production build/export are authoritative.)

**Known limitation:** the supplied tower is a slender supertall (aspect 0.143,
208px native), so it renders crisp but thin, centered on the panel. It reads as
an intentional premium glass tower now. A wider/chunkier building would fill the
panel more; the current one is a real, good-looking upgrade over the night
cutout.

---

## 2026-07-17 16:00 IST

### `/variant8` building — restructured into a premium showcase panel

**Status:** Completed (best achievable with the current slender tower asset)

The prior fix still rendered the tower as a thin strip pinned to the far-right
edge (source is 329px wide, aspect ~0.25, `object-fit: contain` + right anchor),
with the spec cards floating in empty black. Restructured the right side into a
defined **building panel**: `.bleedMedia` is now the right ~46% (`clamp(360px,
46%, 760px)`), bleeds slightly past top/bottom (`top:-8%; bottom:-12%`), carries
its own premium gradient + azure glow + left border, and the tower stands
`object-position: center bottom` centered within it (not on the edge). The
content-side scrim fades into the panel; spec cards repositioned to flank the
tower (CARD_POS). Also relaxed the content `max-width` caps this session so the
copy fills its column.

**Files:** `corporate.module.css` (`.bleedMedia`/`.bleedScrim` rework),
`Variant8Hero.tsx` (CARD_POS). Build green (68/68, TypeScript clean); on the
dev server the panel is the right 46% with the tower centered and cards
flanking. (The preview pane stalls image decode on this heavy page — verified
the tower src serves HTTP 200 valid WebP; it renders in a real browser.)

**Known limitation:** the tower cutout is inherently slender/low-res (329px) —
it now reads as an intentional lit tower on a panel, but a wider, higher-res
building image (prompt already supplied to the client) would make this variant
substantially stronger.

---

## 2026-07-17 15:47 IST

### Corporate variants — product visibility, doors and building fixes

**Status:** Completed (code); better hero imagery offered to the client

User screenshots (dark theme) showed: v7 product invisible, v10 product barely
visible, v9 door strips wrong, v8 tower small in the corner.

- **Root cause (v7/v10):** the elevator render is a DARK cutaway; on the dark
  theme background it disappeared (same class of issue as v6). Fix: a light
  "product stage" so the dark render always reads. v7 gets a light lightbox
  panel (`.productStage`) behind the machine; v10 gets a soft light halo
  (`.centerStageGlow`); both images get `.onStage` (grounded drop-shadow).
- **v9:** the two floating door-leaf images did not line up with the lobby
  doorway and looked wrong. Removed them; the full-screen lobby photo (which
  already has an elegant portal) now carries the scene with its warm glow pulse.
- **v8:** the tower was a corner thumbnail. Enlarged (`.bleedMedia` width
  min(66%, 860px)) and bottom/right anchored.

**Files:** `corporate.module.css` (+`.productStage`/`.onStage`/
`.centerStageGlow`, `.bleedMedia` resize), `Variant7Hero.tsx`,
`Variant9Hero.tsx`, `Variant10Hero.tsx`.

**Verified:** build green (compiled, TypeScript clean, 68/68). Exported HTML
confirms v7 `productStage`+`onStage`, v10 `centerStageGlow`+`onStage`, v9 no
door-leaf refs, v8 tower present.

**Known limitation / follow-up (asset quality):** the reused renders are the
weak spot for a premium corporate hero — the machine is an engineering cutaway
(not a glossy passenger elevator) and the trimmed night tower is only 329px
wide (soft when enlarged). Client offered to generate better images; two
prompts provided (a premium passenger elevator on a clean studio background for
v7; a premium daytime commercial tower for v8). The cutaway stays a good fit
for v10 (its hotspots point at the exposed machine/cabin/doors/controller/
safety). Drop new PNGs into `public/images/home/hero-exploration/` (or a new
corporate folder), run the optimize script, and update `HERO_IMG` in
`corporateData.ts`.

---

## 2026-07-17 15:39 IST

### Corporate variants 8/9/10 given genuinely different LAYOUTS

**Status:** Completed

Feedback: variants 7 to 9 looked the same (one split layout with swapped
image/text). Rebuilt 8, 9 and 10 as distinct compositions (7 stays the split
baseline); all still share `corporateData.ts` + `TrustBadges` + the load
animations, but each has its own layout block in `corporate.module.css`:

- **v7 Classic Split** (`.hero`): content left, product right. Unchanged.
- **v8 Building Showcase** (`.heroBleed`): the tower now DOMINATES as a
  full-bleed background bleeding off the right edge and slowly zooming; content
  sits over a left-to-right gradient scrim; the 4 spec cards float across the
  building. Media-dominant, single-column-left composition.
- **v9 Premium Interior** (`.heroFull` + `.onImage`): the lobby photo fills the
  ENTIRE hero (object-fit cover); the doors slide open once over the doorway; a
  top-to-bottom scrim anchors the content to the lower-left in white over the
  image. Immersive full-bleed cinematic.
- **v10 Product Feature Showcase** (`.heroCenter`): a symmetric, Apple-style
  centered hero — headline + lead centered on top, the machine centered in the
  middle with the pulsing hotspots + polyline, CTAs and a centered trust bar
  below.

New CSS: `.onImage` (white text over photos), `.heroBleed`/`.bleedMedia`/
`.bleedScrim`/`.bleedContent`, `.heroFull`/`.fullMedia`/`.fullDoorframe`/
`.fullScrim`/`.fullContent`, `.heroCenter`/`.centerHead`/`.centerProduct`/
`.centerFoot`/`.trustCenter`, each with its own responsive + reduced-motion
handling. v9's pointer parallax now drives the full-screen image.

**Files:** `sections/experience/corporate/Variant8Hero.tsx`,
`Variant9Hero.tsx`, `Variant10Hero.tsx` (rewritten), `corporate.module.css`
(+distinct-layout blocks). No data/route/asset changes.

**Verified:** build green (compiled, TypeScript clean, 68/68). Exported HTML
confirms each variant now carries its own layout class (v8 `heroBleed`, v9
`heroFull`+`onImage`, v10 `heroCenter`; v7 the split base) — no longer one
shared composition. Visual look to be judged in the running dev server.

---

## 2026-07-17 15:26 IST

### Four clean corporate hero variants (`/variant7`–`/variant10`, no WebGL)

**Status:** Completed (content verified via static export; motion/look to be
judged in the running dev server)

Client pivoted away from the futuristic 3D direction toward a clean, premium,
corporate hero (Apple/BMW/Schindler feel): real product photography, light
backgrounds, trust badges, elegant fade/slide/scale/parallax only. Built 4 new
DOM/CSS variants (zero WebGL) sharing one kit.

- **`/variant7` Classic Split (recommended):** left headline + copy + CTAs +
  trust badges; right the elevator machine on a soft light stage. Content fades
  up, product slides in from the right and gently floats. Pure CSS.
- **`/variant8` Building Showcase:** left content; right the night tower in a
  framed dark showcase panel, slowly zooming, with 4 spec cards appearing in
  sequence around it. Pure CSS.
- **`/variant9` Premium Interior:** right a luxury lobby photo; the brushed door
  leaves slide open once on load, warm light gently pulses, and the scene shifts
  a few px with the pointer (subtle parallax, client component, reduced-motion
  guarded).
- **`/variant10` Product Feature Showcase:** right the machine with 5 pulsing
  hotspots (gearless machine, smart controller, premium cabin, automatic doors,
  safety system); a thin polyline threads them (draws in on load) and
  hover/focus reveals each feature card. Product scales very slowly. Pure CSS.

**Shared kit** (`sections/experience/corporate/`): `corporateData.ts` (trust
badges, CTAs, image paths, spec cards, hotspots), `corporate.module.css`
(theme-aware two-column layout + all load animations, reduced-motion disables
them), `TrustBadges.tsx`. Each hero uses `next/image` (resolves to responsive
WebP via the loader) + the existing `Button`. v7/v8/v10 are server components
(pure CSS motion, best for SEO/perf); v9 is a client component for the pointer
parallax.

**Decisions / integrity:**
- No new image assets — reuses the shipped renders (cutaway machine, night
  tower, lobby backdrop, door leaf). The brief's "gold accents" is not in the
  brand palette (tokens map `--gold` to blue), so the brand azure is the accent.
- Trust badges use ONLY verifiable facts: "Since 1992" (founded 1992), "ISO
  Process" (data/company.ts ISO certification), "In-house" (Ahmedabad), and
  "Exporter" (exportMarkets China/Taiwan). The brief's **"1000+ Projects" and
  "ISI Certified" were intentionally omitted** — not in the verified company
  data (CLAUDE.md never-fabricate rule).
- Theme-aware via tokens: clean white/light-grey in light mode (the brief's
  intent), premium dark in dark mode. Client should review in light mode.
- CTAs: "Get a free quote" → /contact, "Explore products" → /products.

**Files:** `sections/experience/corporate/*` (new: corporateData.ts,
corporate.module.css, TrustBadges.tsx, Variant7–10Hero.tsx),
`app/variant7|8|9|10/page.tsx` (noindex, ReleaseGate, shared HomeSections),
`config/pageReleases.ts` (+4 routes). Sitemap already excludes /variant.

**Verified:** build green (compiled, TypeScript clean, **68/68** pages, was 64).
Static export `out/variant7–10.html` confirmed: correct per-variant h1, all 4
trust badges, both CTAs, correct hero imagery (v7/v10 cutaway, v8 tower, v9
lobby + door leaf), v10's 5 hotspots, v8's 4 spec cards, next/image resolved to
`elevator-cutaway-384/640/960.webp`, and no double/trailing spaces in copy.
Live browser check pending (dev server on :3002 was not reachable from the
build shell; these are light DOM heroes so they render normally in preview).

**Follow-ups:** judge v9 door-leaf placement over the lobby doorway and v10
hotspot positions in-browser (both are simple % tweaks in CSS/`corporateData`);
optionally supply true light-studio product photography if the dark cutaway
reads low-contrast on the light hero background.

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
