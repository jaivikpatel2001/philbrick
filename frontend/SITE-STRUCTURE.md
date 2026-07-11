# Philbrick — Site Structure & Page Breakdown

A top-to-footer map of every route, how navigation is organised, and how the
environment-based page-release system gates pages in production. Generated from
the codebase (`app/`, `config/pageReleases.ts`, `data/products.ts`,
`constants/navigation.ts`).

---

## 1. Sitemap (all routes)

Release status is the **production** flag from `config/pageReleases.ts`
(`✓` = live, `–` = Coming Soon). **In development every route is accessible.**

```
/                                          ✓  Home — flagship 3D elevator experience
├─ /about                                  ✓  About Us
├─ /vision-mission                         –  Vision & Mission
├─ /milestone                              –  Milestone & Awards
├─ /infrastructure                         –  Infrastructure
├─ /network                                –  Network
├─ /news-events                            –  News & Events
├─ /products                               ✓  Products (index — 14 categories)
│  ├─ /products/<category>                 ✓  14 category pages
│  └─ /products/<category>/<product>       ✓/–  21 nested product pages (thin SKUs gated)
└─ /contact                                ✓  Contact Us

System routes:  /sitemap.xml   /robots.txt   /icon.png   /apple-icon.png   /_not-found (404)
```

Gated routes render the animated **Coming Soon** screen in production and are
excluded from `sitemap.xml`. Total: **11 static pages + 35 product routes**.

---

## 2. Environment-based page-release system

| Piece | File |
|---|---|
| Route → release map (single source of truth) | `config/pageReleases.ts` |
| Env + gating logic (`isReleased`, `validateReleaseConfig`) | `lib/release.ts` |
| Reusable gate + Coming Soon screen | `components/release/{ReleaseGate,ComingSoon}.tsx` |
| Env template | `.env.example` (`NEXT_PUBLIC_APP_ENV`) |

- **development** → all routes open (flags ignored). **production** → only
  `true`-flagged routes show real content.
- Every `page.tsx` wraps its content in `<ReleaseGate route="…">`.
- `assertReleaseConfig()` runs at build (via `sitemap.ts`) and fails the build on
  any missing/duplicate/invalid route. **See the STRICT RULE in `CLAUDE.md`.**

---

## 3. Global chrome (every page)

Defined once in `app/layout.tsx`:

| Element | What it is |
|---|---|
| **Navbar** (`components/layout/Navbar.tsx`) | Sticky bar: Philbrick logo · primary nav · theme toggle · **Get a quote** · mobile hamburger. |
| **About dropdown** (`NavDropdown.tsx`) | About Us · Vision & Mission · Milestone & Awards. |
| **Products mega menu** (`MegaMenu.tsx`) | Two-pane: grouped category rail (left) → sub-products + flagship **ARD** feature (right). |
| **Mobile nav** (`MobileNav.tsx`) | Slide-in drawer with nested accordion (category → sub-products). |
| **Footer** (`Footer.tsx`) | Logo · contact · 4 link groups (Company · Products · Resources · Get in touch) · GST/CIN/IEC registry · copyright. |

**Primary nav:** Home · About ▾ · Products ▾ · Infrastructure · Network · News & Events · Contact Us

---

## 4. Product hierarchy (`data/products.ts`)

Two-level tree — category → product. Slugs are SEO-friendly and consistent.

| Category | Route | Sub-products |
|---|---|---|
| Elevator Control Panel | `/products/elevator-control-panel` | Automatic / Manual / Hydraulic door controller |
| Integrated Control Panel | `/products/integrated-control-panel` | Parallel · Serial CAN-bus · MRL |
| Elevator IoT | `/products/elevator-iot` | — |
| ARD (Automatic Rescue Device) | `/products/ard` | — |
| Lift Master (Door Operator Controller) | `/products/lift-master` | — |
| Synergy Auto Door | `/products/synergy-auto-door` | 2-Panel Centre · 2-Panel Telescopic · 4-Panel Centre |
| Elevator Doors | `/products/elevator-doors` | — |
| Elevator Cabin | `/products/elevator-cabin` | — |
| Elevator Display | `/products/elevator-display` | XN-1000/2000/2100/3000/4000 · XLCD-01/02 · XTFT-043 |
| COP / LOP | `/products/cop-lop` | — |
| Touch COP / LOP | `/products/touch-cop-lop` | — |
| Voice Announcing Systems | `/products/voice-announcing-systems` | FA-50 · FA-250 · Close Door Announcer · Elevator Gong |
| Elevator KIT & Accessories | `/products/elevator-kit-accessories` | — |
| STEP Products | `/products/step-products` | — |

Categories + functional sub-products are live; specific SKU pages (display
models, voice modules) ship as Coming Soon until real specs/photos are supplied
(their `released` flag is `false`).

---

## 5. Where content lives

| Content | File |
|---|---|
| Real company data (name, address, phone, GST/CIN/IEC, contacts) | `constants/site.ts` |
| Product tree + release flags | `data/products.ts` |
| Company story, mission/vision, values, infrastructure, timeline, leadership | `data/company.ts` |
| What we offer (home section) | `data/services.ts` |
| Stats / FAQs | `data/stats.ts` · `data/faqs.ts` |
| 3D hero components | `data/elevatorComponents.ts` |
| Images (Unsplash placeholders — replace with brand photography) | `data/images.ts` |
| Navigation + footer (derived from the product tree) | `constants/navigation.ts` |
| Page-release config | `config/pageReleases.ts` |
| Design tokens (Philbrick blue/red palette) | `styles/tokens.css` |

> Regenerate this document if routes or page sections change.
