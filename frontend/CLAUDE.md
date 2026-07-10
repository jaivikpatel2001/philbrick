@AGENTS.md

# VERTIQ — Project Context for AI-Assisted Development

This is the primary context document. Read it before making changes. Keep it in
sync when architecture, standards, or vision change.

> **Critical (from `AGENTS.md`):** this repo runs a newer Next.js than your
> training data assumes. Before writing routing/rendering/config code, read the
> relevant guide in `node_modules/next/dist/docs/` and heed deprecations.

---

## Project vision

**VERTIQ** is a premium global **elevator & vertical-transportation
manufacturer**. The website is its flagship brand experience.

**What it offers:** passenger / home / high-speed / MRL / panoramic / capsule /
hospital / freight / dumbwaiter elevators, escalators, moving walkways,
components & controllers, plus lifecycle **services** (installation, maintenance,
**modernization**, AMC) and an intelligent IoT/AI platform (Pulse™).

**Target audience:** architects, builders, real-estate developers, consultants,
commercial property owners, industrial clients — technical, design-literate
buyers making high-value decisions.

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

- **Color (single source of truth):** Deep Black `--bg-primary`, Graphite
  surfaces, Brushed Steel `--silver`, Champagne Gold `--accent`/`--gold`,
  Electric Blue `--accent-2`/`--blue`, Pure White text. No other color systems.
- **Typography:** display = Space Grotesk (`--font-display`), body = Inter
  (`--font-body`); fluid scale (`--fs-display-1 … --fs-xs`); tight tracking on
  headings (`--ls-tight`), uppercase eyebrows (`--ls-eyebrow`).
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

## Three.js standards

The hero (`sections/experience/ElevatorScene.tsx`) is the brand centerpiece.
- **Realistic, physically-based materials** (metalness/roughness, anisotropy on
  brushed steel, real transmission glass, champagne gold — never glowing yellow).
- **Architectural lighting** + an environment map (IBL) doing most of the work;
  warm key / cool fill / rim / interior light.
- **Minimal bloom** — only true emissives (LEDs, indicators) should glow.
- **Performance budgets:** `pixelRatio ≤ 2`; one render loop; dispose geometries/
  materials/render-targets on unmount; keep the scene lean.
- **Mobile / capability fallback:** render the CSS `ScrollStory` on no-WebGL or
  `prefers-reduced-motion`.
- See [`sections/experience/THREEJS-IMPLEMENTATION.md`](sections/experience/THREEJS-IMPLEMENTATION.md).

## Documentation standards

Every major module should document: **purpose · architecture · dependencies ·
extension points.** Keep `README.md`, this file, and `THREEJS-IMPLEMENTATION.md`
in sync with the code so a new developer (or AI) can get productive fast.

---

## Current architecture (high level)

- **Homepage `/` is the flagship experience:** `app/page.tsx` renders the Three.js
  elevator hero, then About → Products → Lifecycle support (installation ·
  maintenance · modernization · AMC) → Projects → Industries → (stats) →
  Contact/CTA. The global `app/layout.tsx` adds Navbar, Lenis smooth scroll,
  Footer, theme + reveal providers.
- There is **no standalone `/experience` route** — the experience IS the homepage.
- Routes: `/`, `/about`, `/products`, `/products/[slug]`, `/contact` (+ `/sitemap.xml`,
  `/robots.txt`). There is **no `/services` or `/testimonials` route** — those pages
  were removed; the company's offerings live as the lifecycle-support section on the
  homepage, and the About page carries an **Infrastructure & manufacturing** section.
