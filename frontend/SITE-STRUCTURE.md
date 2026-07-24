# Philbrick — Site Structure & Page Breakdown

A top-to-footer map of every route, how navigation is organised, and how the
environment-based page-release system gates pages in production. Generated from
the codebase (`app/`, `config/pageReleases.ts`, `data/products.ts`,
`data/news.ts`, `constants/navigation.ts`).

_Last verified against the code on 2026-07-22._

---

## 1. Sitemap (all routes)

Release status is the **production** flag from `config/pageReleases.ts`
(`✓` = live, `–` = Coming Soon). **In development every route is accessible**,
which is what makes local review and the content audit possible.

```
/                                          ✓  Home — Three.js elevator hero + page body
├─ /about                                  –  About Us (story · Activity · History · values · leadership)
├─ /vision-mission                         –  Vision & Mission
├─ /network                                –  Network
├─ /products                               –  Products index (14 categories)
│  ├─ /products/<category>                 –  14 category pages
│  └─ /products/<category>/<product>       –  24 nested product pages
├─ /contact                                –  Contact Us (channels + enquiry form + map + FAQ)
├─ /career                                 –  Career
├─ /quality-policy                         –  Quality Policy
├─ /privacy-policy                         –  Privacy Policy
└─ /downloads                              –  Downloads (STEP brochure)

System routes:  /sitemap.xml   /robots.txt   /icon.png   /apple-icon.png   /_not-found (404)
```

The homepage hero is `Variant18Hero` (single-photo scene). The client-review
`/variant1…18` A/B pages were removed 2026-07-23.

**Counts:** 13 static real-page entries + 38 product routes (14 categories + 24
products) + 6 news detail routes = **57 entries in the release map**; `next
build` prerenders **65 pages** including the system routes.

**Current production release:** only `/` and the 17 variant pages are live.
Everything else renders the animated **Coming Soon** screen and is excluded from
`sitemap.xml`. Flip a flag in `config/pageReleases.ts` to release a page.

---

## 2. Environment-based page-release system

| Piece | File |
|---|---|
| Route → release map (single source of truth) | `config/pageReleases.ts` |
| Env + gating logic (`isReleased`, `releasedRoutes`, `validateReleaseConfig`) | `lib/release.ts` |
| Reusable gate + Coming Soon screen | `components/release/{ReleaseGate,ComingSoon}.tsx` |
| Env template | `.env.example` (`NEXT_PUBLIC_APP_ENV`) |

- **development** → all routes open (flags ignored). **production** → only
  `true`-flagged routes show real content.
- Every `page.tsx` wraps its content in `<ReleaseGate route="…">`.
- `assertReleaseConfig()` runs at build (via `sitemap.ts`) and fails the build on
  any missing/duplicate/invalid route. **See the STRICT RULE in `CLAUDE.md`.**

**Three allow-lists, one map.** Static routes are literal booleans in
`STATIC_ROUTE_RELEASES`; product and news detail routes are enumerated from their
data and default to **denied** unless their path is listed in
`RELEASED_PRODUCT_ROUTES` / `RELEASED_NEWS_ROUTES` (both currently empty). The
`released` flag on a node in `data/products.ts` is a **content-readiness hint
only** — it does not gate production. To release a product page, add its path to
`RELEASED_PRODUCT_ROUTES`.

---

## 3. Global chrome (every page)

Defined once in `app/layout.tsx`:

| Element | What it is |
|---|---|
| **Navbar** (`components/layout/Navbar.tsx`) | Sticky bar: Philbrick logo · primary nav · theme toggle · **Get a quote** · mobile hamburger. |
| **About dropdown** (`NavDropdown.tsx`) | About Us · Vision & Mission · Milestone & Awards. |
| **Products mega menu** (`MegaMenu.tsx`) | Two-pane: category rail (left) → sub-products + flagship **ARD** feature (right). |
| **Mobile nav** (`MobileNav.tsx`) | Slide-in drawer with nested accordion, plus the helpline and a WhatsApp chat link. |
| **Footer** (`Footer.tsx`) | Wordmark · address · labelled phone list · categorised inboxes · 4 link groups · GST/CIN/IEC · socials · agency credit. |
| **Floating actions** (`components/ui/FloatingActions.tsx`) | Bottom-right pair: scroll to top (appears past 60% of a viewport) and a draggable chat button. |
| **Live chat** (`components/providers/TawkTo.tsx`) | Tawk.to, the client's own property, on every page. Tawk's own launcher is hidden so the floating button is the only chat control. |
| **Providers** | `ThemeProvider` (light/dark), `SmoothScroll` (Lenis + GSAP ticker), `Preloader`, `RevealObserver`. |

**Primary nav:** Home · About ▾ · Products ▾ · Infrastructure · Network ·
News & Events · Contact Us

**Footer link groups** (`constants/navigation.ts`):

| Group | Links |
|---|---|
| Company | About Us · Vision & Mission · Milestone & Awards · Infrastructure · Network · Career |
| Products | 7 key categories · All products |
| Resources | News & Events · Downloads · Quality Policy · Privacy Policy |
| Get in touch | Contact Us · Request a quote · Career |

---

## 4. Product hierarchy (`data/products.ts`)

Two-level tree — category → product. Every category is also backed by the
client's real WordPress product records (photos, salient features, specification
tables) in `data/generated/catalog.json`, which covers **38/38** products.

| Category | Route | Sub-products |
|---|---|---|
| Elevator Control Panel | `/products/elevator-control-panel` | Automatic · Manual · Hydraulic door controller |
| Integrated Control Panel | `/products/integrated-control-panel` | Parallel · Serial CAN-bus · MRL |
| Elevator IoT | `/products/elevator-iot` | — |
| Automatic Rescue Device (ARD) | `/products/ard` | — |
| Lift Master Door Operator Controller | `/products/lift-master` | — |
| Synergy Auto Door | `/products/synergy-auto-door` | 2-Panel Centre · 2-Panel Telescopic/Side · 4-Panel Centre |
| Elevator Doors | `/products/elevator-doors` | — |
| Elevator Cabin | `/products/elevator-cabin` | — |
| Elevator Display | `/products/elevator-display` | XN-1000 · XN-2000 · XN-2100 · XN-3000 · XN-4000 · XLCD-01 · XLCD-02 · XTFT-043 · XTFT-056 · XTFT-070 · XTAB |
| COP / LOP | `/products/cop-lop` | — |
| Touch COP / LOP | `/products/touch-cop-lop` | — |
| Voice Announcing Systems | `/products/voice-announcing-systems` | FA-50 · FA-250 · Close Door Announcer · Elevator Gong |
| Elevator KIT & Accessories | `/products/elevator-kit-accessories` | — |
| STEP Products | `/products/step-products` | — |

A category **without** children renders its catalogue content inline (photos,
salient features, spec table) rather than sending the visitor through another
click; a category **with** children keeps the card grid. See
`app/products/[category]/page.tsx`.

---

## 5. Where content lives

| Content | File |
|---|---|
| Real company data (name, address, labelled phones, categorised emails, GST/CIN/IEC, socials) | `constants/site.ts` |
| Navigation + footer (derived from the product tree) | `constants/navigation.ts` |
| Product tree + content-readiness flags | `data/products.ts` |
| WordPress product content (features, spec tables, photos) | `data/generated/catalog.json` · read via `data/catalog.ts` |
| Company story, Activity, History, mission/vision, values, infrastructure, timeline, quality policy, career, leadership | `data/company.ts` |
| Privacy Policy | `data/legal.ts` |
| Downloads (STEP brochure + empty state) | `data/downloads.ts` |
| News & Events articles (⚠ mock) | `data/news.ts` |
| What we offer (home section) | `data/services.ts` |
| Stats · FAQs · dealer network | `data/stats.ts` · `data/faqs.ts` · `data/network.ts` |
| 3D hero components / exploded tour | `data/elevatorComponents.ts` · `data/catalogParts.ts` · `data/heroExploration.ts` |
| Image paths (all custom brand photography, no external images) | `data/images.ts` · `lib/imageManifest.json` |
| Page-release config | `config/pageReleases.ts` |
| Design tokens (Philbrick azure blue + signal red) | `styles/tokens.css` |

**Client review:** the full text of every page, next to the equivalent text on
the client's WordPress site, is exported to
`content-audit/Philbrick-content-audit.xlsx` by
`scripts/contentAuditCrawl.mjs` + `scripts/buildContentAudit.py`.

> Regenerate this document if routes or page sections change.
