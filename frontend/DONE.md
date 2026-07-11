# DONE — Implementation History

A permanent, dated log of completed work on the Philbrick website. Read this
before starting a task (see the rule in `CLAUDE.md`); append a new entry after
completing one. Newest entries at the top.

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
