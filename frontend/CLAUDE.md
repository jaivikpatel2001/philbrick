@AGENTS.md

# Philbrick — Project Context for AI-Assisted Development

This is the primary context document. Read it before making changes. Keep it in
sync when architecture, standards, or vision change.

> **Critical (from `AGENTS.md`):** this repo runs a newer Next.js than your
> training data assumes. Before writing routing/rendering/config code, read the
> relevant guide in `node_modules/next/dist/docs/` and heed deprecations.

---

## ⚠ STRICT RULE — Page release configuration must stay in sync with routes

The site uses an **environment-based page-release system** (static-export safe):

- **Single source of truth:** [`config/pageReleases.ts`](config/pageReleases.ts).
  Static routes are literal in `STATIC_ROUTE_RELEASES`; product and news detail
  routes are enumerated from [`data/products.ts`](data/products.ts) /
  [`data/news.ts`](data/news.ts) and are **default-deny** unless their path is
  listed in `RELEASED_PRODUCT_ROUTES` / `RELEASED_NEWS_ROUTES`. The `released`
  flag on a product node is a **content-readiness hint only** and does not gate
  production.
- **Logic:** [`lib/release.ts`](lib/release.ts) → `isReleased()`,
  `releasedRoutes()`, `validateReleaseConfig()`, `assertReleaseConfig()`.
- **Gate:** every page wraps its content in
  [`components/release/ReleaseGate.tsx`](components/release/ReleaseGate.tsx)
  (`<ReleaseGate route="/…">…</ReleaseGate>`), which renders the real page when
  released (or in development) and the animated
  [`ComingSoon`](components/release/ComingSoon.tsx) screen otherwise.
- **Behaviour:** in **development** every route is accessible (flags ignored); in
  **production** only routes flagged `true` show real content.

**Whenever you add, remove, rename or move a route you MUST, in the same change:**
1. Update `config/pageReleases.ts` — the flag in `STATIC_ROUTE_RELEASES` for a
   normal page, or the path in `RELEASED_PRODUCT_ROUTES` / `RELEASED_NEWS_ROUTES`
   for a product or news detail page.
2. Wrap the new page in `<ReleaseGate route="…">`.
3. Keep the config exhaustive and exact — **no missing, duplicate, outdated or
   invalid routes**. `assertReleaseConfig()` runs at build (via `sitemap.ts`) and
   fails the build on any mismatch; `robots.ts`/`sitemap.ts` only advertise
   released routes. Verify before finishing any route-related task.

---

## STRICT RULE — Text formatting (no unnecessary dashes)

Do **not** use unnecessary hyphens, en dashes (`–`) or em dashes (`—`) between
normal words in **user-facing website content**. Use a single normal space (or a
grammatical comma/colon) between words.

Dashes may only be used when: grammatically required, technically required, part
of an official product/model name (e.g. `XN-1000`, `XLCD-01`, `FA-50`,
`XTFT-043`), a compound modifier that is standard English (`in-house`,
`machine-room-less`, `chip-based`, `dot-matrix`), a route slug, URL, file name,
package name, code syntax, or another intentional identifier. Never touch
JS/TS syntax, negative numbers, math, CSS, CLI commands, or slugs.

Also keep copy clean of **double spaces, leading spaces and trailing spaces**.
Whenever website content is created or updated, verify text formatting before
completing the task.

---

## STRICT RULE — DONE.md implementation log

[`DONE.md`](DONE.md) records completed implementation history and prior technical
decisions. It and this file are **linked context documents**: `CLAUDE.md` defines
permanent rules, `DONE.md` records what was done.

**Before starting a development task:** read `DONE.md`, review related previous
changes, understand existing technical decisions, avoid reimplementing completed
work, and preserve earlier architectural decisions unless the new requirement
explicitly changes them.

**After completing any implementation task:** update `DONE.md` — add the current
date + timestamp, document the changes, list the major files/areas affected,
record important technical decisions, note known limitations, and add any
follow-up work. Use the real current date/time; never invent historical entries.
**A task is not complete until `DONE.md` is updated.**

---

## STRICT RULE — Website Performance & Asset Optimization

To maintain high Pingdom / Lighthouse speed scores (Grade A / 90+), minimal initial page weight (< 1 MB initial load), and fast Largest Contentful Paint (LCP):

1. **HTTP Caching Headers (Expires / Cache-Control):**
   - Content-hashed static JS/CSS (`/_next/static/*`) and static fonts (`/fonts/*`) MUST be served with `Cache-Control: public, max-age=31536000, immutable`.
   - Local brand photography (`/images/*` and `/brand/*`) MUST be served with `Cache-Control: public, max-age=2592000`.
   - **Render Deployment Note:** Render static hosting ignores `render.yaml` if deployed as a manual dashboard service. Headers MUST be verified in the Render Dashboard (**Settings → Headers**) or deployed via Blueprint ([`render.yaml`](../render.yaml)).

2. **Image Sizing & Responsive Ladders:**
   - **Static Export Pipeline:** All local images in `public/images/` MUST be optimized via [`scripts/optimizeImages.mjs`](scripts/optimizeImages.mjs) to generate responsive WebP width variants recorded in [`lib/imageManifest.json`](lib/imageManifest.json).
   - **Rendered Size Matching:** Brand logos, icons, and hero images MUST be stored at efficient resolutions matching max rendered DPR sizes (e.g. `public/brand/logo.png` capped at 536px width for 34px container height rather than 1200+px raw assets).
   - **Image `sizes` Prop:** Every `<Image>` component MUST include a tight, accurate `sizes` attribute matching its container CSS width (e.g. `sizes="(max-width: 640px) 100vw, 340px"`) so `imageLoader` requests appropriate WebP variants instead of full-resolution 100vw fallbacks.
   - **Lazy Loading & Priority:** ONLY the primary hero image above the fold should carry `priority`. All secondary, carousel, card, and footer images MUST use default lazy loading (`loading="lazy"`).

---

## STRICT RULE — Image asset management

All site imagery is custom, India-focused brand photography catalogued in
[`imagegeneration.md`](imagegeneration.md) (prompts §1–§7 + the authoritative
**Image Asset Mapping §9**). Sources live page-wise under `public/images/<page>/…`
as PNG and are delivered as responsive **WebP** by
[`lib/imageLoader.ts`](lib/imageLoader.ts) via
[`lib/imageManifest.json`](lib/imageManifest.json), generated by
[`scripts/optimizeImages.mjs`](scripts/optimizeImages.mjs). Full-resolution
originals are archived in `image-sources/` (git-ignored). There are **no
external/Unsplash images** — never reintroduce one.

**Whenever a new page or section needs an image:**
1. Review `imagegeneration.md` and check whether a suitable asset already exists.
2. Do **not** reuse an unrelated image just to fill the UI.
3. If a new image is genuinely required, add a documented requirement (prompt +
   exact aspect ratio) to `imagegeneration.md`.
4. Store the final source in the correct page-wise folder
   (`public/images/<page>/…`; use `shared/` only if used on 2+ pages, never duplicate).
5. Use a descriptive kebab-case filename (preserve official model names, e.g.
   `xtft-043-tft-display`).
6. Run `node scripts/optimizeImages.mjs` to (re)generate the WebP variants +
   `lib/imageManifest.json`, then reference the `.png` path through next/image.
7. Update the Image Asset Mapping (§9) with the final path + status.
8. Update all code references (`data/images.ts` / `data/products.ts` /
   `data/news.ts` or the consuming component).
9. Give the image descriptive `alt` text; set accurate responsive `sizes`; use
   `priority` only for above-the-fold images (lazy-load the rest).
10. Update `DONE.md`.

**Whenever an image is removed, renamed or moved:** update every code reference,
update `imagegeneration.md` + the mapping (§9), and verify no broken image paths
remain before finishing.

All 60 catalogued images are supplied and integrated. **Never delete the `.png`
source files** under `public/images/`: each one is the `og:image` (social share
card) and the Product/Article JSON-LD (SEO) image for its page — crawlers and
social scrapers fetch the raw `.png` URL directly, and the next/image WebP loader
does not run for them. Normal visitors only ever download the small WebP variants,
so the PNGs are not redundant.

---

## Project vision

**Philbrick** (Philbrick Technologies India Pvt. Ltd.) is an Ahmedabad-based
**elevator-component manufacturer, exporter and supplier**, founded 1992. The
website is its flagship brand experience.

**What it offers:** elevator control panels (automatic/manual/hydraulic),
integrated control panels (parallel / serial CAN-bus / MRL), the Automatic
Rescue Device (ARD), Elevator IoT, the Lift Master door-operator controller,
Synergy automatic door mechanisms, elevator doors & cabins, displays (LED /
dot-matrix / LCD / TFT), COP/LOP & touch COP/LOP, voice announcing systems,
elevator kits/accessories and STEP products. All engineered in-house.

**Target audience:** elevator installers, OEMs, modernisers, builders and
consultants — technical buyers specifying elevator components.

**Content integrity:** use only real, publicly-verifiable Philbrick data
(constants/site.ts). **Never fabricate** phone numbers, emails, GST/CIN, awards,
certifications, product specs, statistics or client names. If unverified, use a
clearly-marked placeholder or gate the page behind Coming Soon.

## Business goals

The website must:
1. **Generate leads** and **increase quotation/consultation requests** (primary KPI).
2. **Build trust** — safety, certifications, reliability, decades of engineering.
3. **Showcase engineering expertise** and innovation.
4. **Project a premium brand** worthy of multi-million-dollar architectural systems.

Every section should move the visitor toward a CTA (Request a consultation /
Explore products). Conversion is a design constraint, not an afterthought.

## Brand positioning

Premium elevator solutions provider. Brand keywords: **Reliability · Precision ·
Innovation · Safety · Engineering Excellence.** Tone: confident, calm,
engineered — never gimmicky or "salesy".

## Design philosophy

Inspired by **Apple, Tesla, Porsche, and high-end architectural firms.** The site
should feel **premium, cinematic, modern, and engineered** — not corporate /
template-driven. Restraint over decoration; real materials and light over effects.

---

## UI standards

All of these are encoded as tokens in `styles/tokens.css` — **use the tokens, never raw values.**

- **Color (single source of truth):** Philbrick palette derived from the logo —
  **azure blue** (primary, `--accent`/`--blue`, from the wordmark) + **signal
  red** (accent, `--accent-2`, from the emblem), on a navy-black / cool-white
  neutral base. Blue leads; red is a restrained accent. Values are AA-tuned per
  theme in `styles/tokens.css`. **Use the tokens, never raw hex.** No other
  color systems.
- **Typography:** display = Space Grotesk (`--font-display`), body = Inter
  (`--font-body`); fluid scale (`--fs-display-1 … --fs-xs`); tight tracking on
  headings (`--ls-tight`), mono uppercase eyebrows with a machined tick
  (`.eyebrow`), `.statement` for editorial display-voice paragraphs.
- **"Engineered Editorial" direction (2026-07):** oversized display statements
  (display-1 tops at ~8rem) vs small mono technical labels; content sits on
  **hairline rules with index numerals**, not icon-box cards; radii are sharp
  (`--radius-*` 3–22px; pills only on buttons/controls); one full-bleed moment
  per page (`.bleed`). Don't reintroduce icon-badge card grids or pill badges.
- **Section headers are CENTERED (2026-07-11):** all section-level eyebrows +
  headings use `SectionHeader`/`FeatureGrid` default `align="center"` (custom
  section intros centered too). Page **heroes keep their dedicated left-aligned
  styling**. Don't centre card/metadata/breadcrumb/nav labels.
- **Alternating section backgrounds (2026-07-11):** top-level page sections
  (`main > section`) alternate `--section-bg-a`/`--section-bg-b` via a positional
  `nth-of-type` rule in `globals.css` (hero = section 1, keeps its media bg).
  Both light values are a touch off-white so white `--surface` cards stay visible.
- **Spacing & layout:** the spacing scale + `--section-y`; containers
  (`.container--wide/--narrow/--prose`); one max-width system; consistent section padding.
- **Motion:** smooth, premium, intentional. Eases `--ease-out`/`--ease-in-out`;
  GSAP ScrollTrigger for scroll, IntersectionObserver `[data-reveal]` for entrances.
  Avoid flashy/random motion and excessive parallax. Respect `prefers-reduced-motion`.
- **Components:** consistent across hero, sections and footer — reuse `components/`
  and `sections/`; no section designed in isolation.

## Development standards

- **TypeScript strict mode.** Model content in `types/`; avoid `any`.
- **Component-first architecture.** `components/` (reusable, presentational) →
  `sections/` (composed page blocks) → `app/` (routes). Content lives in `data/`.
- **Custom CSS only.** CSS Modules per file + design tokens. **No Tailwind, no UI kit.**
- **Reusable design patterns.** Prefer extending existing components/tokens over new ones.
- **Accessibility.** Semantic HTML, focus-visible, `aria-*`, skip link, reduced-motion fallbacks.
- **Performance.** `next/image`; code-split heavy client modules (Three.js is
  client-only); dispose GPU resources; cap DPR; lazy reveals.

## Hero (no more Three.js — 2026-07-23)

The homepage hero is `sections/experience/corporate/Variant18Hero.tsx`: a
single photograph per theme (`hero-scene-{day,night}`, sky + skyline + headline
baked in), cross-faded by `[data-theme]` in CSS, with the live lead + trust
badges (`TrustBadges`) in front and the `<h1>` kept `sr-only` for semantics.
Below it the homepage shows `CategoryBrowse15` then the shared `HomeSections`.

The Three.js elevator scene and the whole client-review variant system
(variants 1–17, the WebGL scenes, `ScrollStory`, `ExplorationHero`,
`heroSceneKit`) were **removed** on 2026-07-23 once the client chose this hero.
The `three` package is no longer imported anywhere. If a 3D hero is ever
reintroduced, restore the standards from git history (they lived here).

## Documentation standards

Every major module should document: **purpose · architecture · dependencies ·
extension points.** Keep the docs in sync with the code so a new developer (or
AI) can get productive fast:

| File | Covers |
|---|---|
| `CLAUDE.md` (this file) | Vision, standards, STRICT RULES |
| `README.md` | Stack, folder structure, getting started, deployment |
| `SITE-STRUCTURE.md` | Every route + release flag, chrome, product tree, content map |
| `DONE.md` | Dated implementation history (append after every task) |
| `imagegeneration.md` | Image briefs + the authoritative asset mapping (§9) |
| `DESIGN.md` | **External reference** (apple.com analysis), not this project's system |

**Whenever routes, sections, content files or chrome change, update
`SITE-STRUCTURE.md` and `README.md` in the same task**, not just `DONE.md`.

---

## Current architecture (high level)

- **Homepage `/` is the flagship experience:** `app/page.tsx` renders
  `<Variant18Hero />` (single-photo hero) + `<CategoryBrowse15 />` then
  `<HomeSections />` — About → Products (the range) → What we offer →
  Applications → stats → Contact/CTA. The global `app/layout.tsx` sets
  `data-nav="float"` on `<html>` (floating glass navbar site-wide) and adds
  Navbar, Lenis smooth scroll, Preloader, Footer, the floating action buttons,
  Tawk.to live chat, theme + reveal providers. (The Three.js hero and the
  `/variant1…17` A/B review pages were removed 2026-07-23.)
- There is **no standalone `/experience` route** — the experience IS the homepage.
- **Navigation:** Home · About ▾ (About Us · Vision & Mission) ·
  Products ▾ (two-pane mega menu, `components/layout/MegaMenu.tsx`) ·
  Network · Contact Us. Nav + footer are derived
  from the product tree in `constants/navigation.ts`.
- **Routes:** `/`, `/about`, `/vision-mission`, `/network`, `/products`,
  `/products/[category]`, `/products/[category]/[product]`, `/contact`,
  `/career`, `/quality-policy`, `/privacy-policy`, `/downloads`
  (+ `/sitemap.xml`, `/robots.txt`, app icons). Product routes come from the
  tree in `data/products.ts` (14
  categories, 24 nested products). **Every route must appear in
  `config/pageReleases.ts` — see the STRICT RULE at the top.** A full route map
  with release flags lives in [`SITE-STRUCTURE.md`](SITE-STRUCTURE.md).
- Real Philbrick company data lives in `constants/site.ts`; product data in
  `data/products.ts`; company content in `data/company.ts`. Logo assets are in
  `public/brand/` (`logo.png` full lockup, `philbrick-mark.png` emblem)
  with app icons at `app/icon.png` / `app/apple-icon.png`.
- **Contact form delivery:** `components/forms/ContactForm.tsx` POSTs to
  FormSubmit.co's AJAX endpoint (static-export safe — no backend, no API route,
  no nodemailer, no `mailto:`). The recipient comes from
  `NEXT_PUBLIC_CONTACT_FORM_TO_EMAIL` (see `.env.example`; inlined at build).
  Spam protection = honeypot `_honey` + FormSubmit filtering. Never hardcode the
  address in components and never put secret API keys in `NEXT_PUBLIC_*` vars.
- **Live chat + floating buttons:** `components/providers/TawkTo.tsx` loads the
  client's own Tawk.to property (ids from `NEXT_PUBLIC_TAWKTO_*`, defaults in the
  file) on every page; `components/ui/FloatingActions.tsx` renders the
  bottom-right pair at `--z-fab` — scroll to top, and a draggable chat button.
  **Tawk's own launcher is hidden and the site button is the only chat control**,
  staying in place and switching to a close glyph when the window opens, so the
  two states read as one control. Tawk writes inline `!important` styles that no
  stylesheet can outrank, so `skinTawk()` applies the overrides inline and
  re-runs as the chat opens and closes. The window's interior colours are a Tawk
  dashboard setting (`TAWK_BRAND_NOTE`) and are unreachable from this codebase.
- **Content parity with the client's WordPress site is a requirement.** The new
  site must remain a **superset**: nothing published on WordPress may be missing
  here. The audit workbook and its generators live in `content-audit/` and
  `scripts/{contentAuditCrawl.mjs,buildContentAudit.py}` — regenerate after any
  content change so the client review sheet stays current.
