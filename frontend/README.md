# Philbrick — Elevator Components Website

A flagship, cinematic marketing website for **Philbrick Technologies India Pvt.
Ltd.**, an Ahmedabad-based elevator-component manufacturer, exporter and supplier
(founded 1992). The homepage opens with a real-time Three.js elevator experience
and flows into the brand's product range, capabilities and applications —
designed to feel like a premium engineered product, not a corporate template.

It also ships an **environment-based page-release system** so pages can be
released to the client one at a time in production (all pages stay open in
development). See the STRICT RULE in [`CLAUDE.md`](CLAUDE.md).

> **Note on Next.js:** this project runs a newer Next.js than most references
> assume. Read the relevant guide in `node_modules/next/dist/docs/` before
> writing routing/rendering code (see [`AGENTS.md`](AGENTS.md)).

---

## Project overview (business purpose)

The site exists to **generate qualified leads and product enquiries** for an
elevator-component manufacturer, while communicating in-house engineering,
quality and safety. Primary audiences: elevator installers, OEMs, modernisers,
builders and consultants specifying elevator components. The experience is the
pitch — it should make dependable elevator components feel considered and premium.

See [`CLAUDE.md`](CLAUDE.md) for the full vision, brand positioning and standards.

---

## Technology stack

| Tool | Role |
|---|---|
| **Next.js (App Router)** | Routing, server components, metadata, image optimization |
| **TypeScript (strict)** | Type safety across the app |
| **Three.js** | Real-time 3D elevator hero (`sections/experience/ElevatorScene.tsx`) |
| **GSAP + ScrollTrigger** | Scroll-scrubbed timelines and reveal animation |
| **Lenis** | Smooth scrolling (wired into the GSAP ticker globally) |
| **Custom CSS (CSS Modules + tokens)** | All styling — **no Tailwind, no UI kit** |
| **Framer Motion** | Small entrance/interaction animations |
| **react-icons** | Iconography (Feather set) |

---

## Folder structure

```
frontend/
├── app/             # Next.js App Router — one folder per route
│   ├── layout.tsx   #   global chrome: ThemeProvider, Lenis SmoothScroll,
│   │                #   Navbar, <main>, Footer, RevealObserver + site metadata
│   ├── page.tsx     #   HOMEPAGE — elevator hero + full content flow
│   ├── about/ vision-mission/ milestone/ infrastructure/ network/ news-events/
│   ├── products/  products/[category]/  products/[category]/[product]/  contact/
│   ├── icon.png  apple-icon.png  sitemap.ts  robots.ts  not-found.tsx
├── components/      # Reusable, presentational building blocks
│   ├── layout/      #   Navbar, Footer, MegaMenu, NavDropdown, MobileNav
│   ├── ui/          #   Button, Logo, SectionHeader, Counter, Reveal, …
│   ├── cards/       #   ProductCard, ServiceCard, IndustryCard, TeamCard, …
│   ├── forms/       #   ContactForm
│   ├── release/     #   ReleaseGate + ComingSoon (page-release gating)
│   └── providers/   #   ThemeProvider, SmoothScroll (Lenis), RevealObserver
├── sections/        # Page-level composed sections (the "blocks" of a page)
│   ├── home/        #   AboutPreview, ProductsShowcase, ServiceEcosystem
│   │                #   (what we offer), IndustriesShowcase (applications)
│   ├── experience/  #   ElevatorScene (Three.js hero), ScrollStory (CSS
│   │                #   fallback)  +  THREEJS-IMPLEMENTATION.md
│   └── shared/      #   PageHero, StatsBand, FeatureGrid, TechShowcase, CTASection, …
├── config/          # pageReleases.ts (route → release map, single source of truth)
├── data/            # Content as typed data (products = the tree, company,
│                    # services, stats, faqs, images, elevatorComponents)
├── constants/       # site.ts (real brand/contact), navigation.ts (nav + footer)
├── lib/             # fonts.ts, icons.ts, schema.ts, release.ts (gating logic)
├── styles/          # tokens.css (design tokens — single source of truth),
│                    # animations.css, globals.css
├── types/           # Shared TypeScript domain models
├── utils/           # cn (classnames), format
└── public/          # Static assets, public/models/ (optional GLTF drop-in)
```

**Responsibilities, in one line each:**
- `app/` owns routes + the global layout/chrome and SEO metadata.
- `sections/` composes `components/` + `data/` into the visible page blocks.
- `components/` are reusable and dumb; they read tokens, not hard-coded colors.
- `data/` + `constants/` are the single source of content; never hard-code copy/URLs/images in components.
- `styles/tokens.css` is the **single source of truth for color, type, spacing and motion**.

---

## Design principles

- **Premium** — Philbrick azure blue + signal red on navy-black / clean white; generous space; editorial type.
- **Architectural** — restraint, alignment, real materials and light, museum-quality layout.
- **Engineering-focused** — the elevator's precision is the story; details earn trust.
- **Conversion-oriented** — every section leads toward a quote/consultation CTA.

---

## Development guidelines

- **No Tailwind / no CSS frameworks.** Custom CSS only — **CSS Modules** per
  component/section, driven by the tokens in `styles/tokens.css`.
- **One design system.** Use semantic tokens (`var(--accent)`, `var(--bg-primary)`,
  `var(--fs-h2)`, …). Don't introduce new colors/spacings outside tokens.
- **Reusable sections.** New page blocks go in `sections/`, built from `components/`
  and fed by `data/`.
- **Performance-first.** `next/image` for all imagery; lazy/IO-driven reveals;
  cap Three.js pixel ratio; dispose GPU resources; respect `prefers-reduced-motion`.
- **Mobile-first, responsive.** Fluid `clamp()` type/spacing; test small screens;
  the 3D hero falls back to a CSS experience on no-WebGL / reduced-motion.
- **TypeScript strict.** Avoid `any`; model content in `types/`.
- **Accessibility.** Semantic HTML, focus states, `aria-*`, skip link, reduced-motion.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000  (development → every page accessible)
npm run build    # static export → frontend/out/ (production → release flags enforced)
npm run lint     # eslint
```

### Page releases & environments

Copy `.env.example` → `.env.local` to control the release mode via
`NEXT_PUBLIC_APP_ENV` (`development` = all pages open; `production` = only routes
flagged `true` in [`config/pageReleases.ts`](config/pageReleases.ts) show real
content, the rest render the animated Coming Soon screen). Unset, it follows
`NODE_ENV` — `next dev` is development, `next build` is production. To release a
page to the client, flip its flag in `config/pageReleases.ts` (static route) or
its node's `released` in `data/products.ts` (product route), then rebuild.

**Deployment:** the app is fully prerendered and exports to plain HTML/CSS/JS
in `out/`. `next start` does not apply in export mode — serve `out/` statically.

- **Render Static Site (staging):** Root Directory `frontend` · Build Command
  `npm ci && npm run build` · Publish Directory `out`. Clean URLs and
  `404.html` are handled by Render automatically.
- **cPanel (production):** run `npm run build` locally, then upload the
  **contents** of `out/` into `public_html` (zip → upload → extract). The
  bundled `public/.htaccess` (shipped inside `out/`) provides clean URLs,
  the 404 page, compression and cache headers on Apache. At launch: set
  `SITE.url` in `constants/site.ts` to the real domain, rebuild, re-upload,
  enable AutoSSL in cPanel, and uncomment the HTTPS/www redirect block in
  the `.htaccess`.

The cinematic hero lives at `/` — see
[`sections/experience/THREEJS-IMPLEMENTATION.md`](sections/experience/THREEJS-IMPLEMENTATION.md)
for how it works and how to tune it.
