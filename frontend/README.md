# VERTIQ — Premium Vertical-Mobility Website

A flagship, cinematic marketing website for **VERTIQ**, a premium elevator &
vertical-transportation manufacturer. The homepage opens with a real-time
Three.js elevator experience and flows into the brand's products, lifecycle
support, projects and industries — designed to feel like a premium
architectural product, not a traditional corporate template.

> **Note on Next.js:** this project runs a newer Next.js than most references
> assume. Read the relevant guide in `node_modules/next/dist/docs/` before
> writing routing/rendering code (see [`AGENTS.md`](AGENTS.md)).

---

## Project overview (business purpose)

The site exists to **generate qualified leads and quotation requests** for a
premium elevator brand, while communicating engineering excellence, safety and
innovation. Primary audiences: architects, builders, developers, consultants,
and commercial / industrial property owners. The experience is the pitch — it
should make a multi-million-dollar vertical-transport system feel desirable.

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
│   ├── about/  products/  products/[slug]/  contact/
│   ├── sitemap.ts  robots.ts  not-found.tsx
├── components/      # Reusable, presentational building blocks
│   ├── layout/      #   Navbar, Footer, MegaMenu, MobileNav
│   ├── ui/          #   Button, Logo, SectionHeader, Counter, Reveal, …
│   ├── cards/       #   ProductCard, ServiceCard, IndustryCard, …
│   ├── forms/       #   ContactForm
│   └── providers/   #   ThemeProvider, SmoothScroll (Lenis), RevealObserver
├── sections/        # Page-level composed sections (the "blocks" of a page)
│   ├── home/        #   AboutPreview, ProductsShowcase, ServiceEcosystem
│   │                #   (lifecycle support), IndustriesShowcase
│   ├── experience/  #   ElevatorScene (Three.js hero), ScrollStory (CSS
│   │                #   fallback), Projects  +  THREEJS-IMPLEMENTATION.md
│   └── shared/      #   PageHero, StatsBand, FeatureGrid, TechShowcase, CTASection, …
├── data/            # Content as typed data (products, services, company,
│                    # stats, images, model — services feeds the home section)
├── constants/       # site.ts (brand/contact), navigation.ts (nav + footer)
├── lib/             # fonts.ts (next/font), icons.ts (icon registry)
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

- **Premium** — champagne gold + electric blue on deep black; generous space; editorial type.
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
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

The cinematic hero lives at `/` — see
[`sections/experience/THREEJS-IMPLEMENTATION.md`](sections/experience/THREEJS-IMPLEMENTATION.md)
for how it works and how to tune it.
