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
| **react-icons** | Iconography — the Feather set throughout, plus the `fa6` brand marks for WhatsApp and X, which are only correct as their own glyph |
| **Tawk.to** | Live chat on every page (`components/providers/TawkTo.tsx`) |
| **FormSubmit.co** | Contact-form delivery from a static export (no backend) |

---

## Folder structure

```
frontend/
├── app/             # Next.js App Router — one folder per route
│   ├── layout.tsx   #   global chrome: ThemeProvider, Lenis SmoothScroll,
│   │                #   Preloader, Navbar, <main>, Footer, FloatingActions,
│   │                #   RevealObserver, TawkTo + site metadata
│   ├── page.tsx     #   HOMEPAGE — ElevatorHero + HomeSections
│   ├── about/ vision-mission/ milestone/ infrastructure/ network/
│   ├── news-events/  news-events/[slug]/
│   ├── products/  products/[category]/  products/[category]/[product]/
│   ├── contact/  career/  quality-policy/  privacy-policy/  downloads/
│   ├── variant1/ … variant17/   #   client-review hero A/B pages (noindex)
│   ├── prose.module.css  company.module.css   #   shared page-level styles
│   ├── icon.png  apple-icon.png  sitemap.ts  robots.ts  not-found.tsx
├── components/      # Reusable, presentational building blocks
│   ├── layout/      #   Navbar, Footer, MegaMenu, NavDropdown, MobileNav
│   ├── ui/          #   Button, Logo, SectionHeader, Timeline, Stats,
│   │                #   FloatingActions (scroll-to-top + draggable chat), …
│   ├── cards/       #   ProductCard, ServiceCard, IndustryCard, TeamCard, …
│   ├── forms/       #   ContactForm
│   ├── products/    #   ProductGallery, ProductSpecs (catalogue content)
│   ├── release/     #   ReleaseGate + ComingSoon (page-release gating)
│   ├── seo/         #   JsonLd
│   └── providers/   #   ThemeProvider, SmoothScroll (Lenis), Preloader,
│                    #   RevealObserver, TawkTo (live chat)
├── sections/        # Page-level composed sections (the "blocks" of a page)
│   ├── home/        #   HomeSections + AboutPreview, ProductsShowcase,
│   │                #   ServiceEcosystem (what we offer), IndustriesShowcase
│   ├── experience/  #   ElevatorHero / ElevatorScene (Three.js), ExplorationHero,
│   │                #   ScrollStory (CSS fallback), corporate/ + variants/
│   │                #   +  THREEJS-IMPLEMENTATION.md, variants/VARIANTS.md
│   ├── products/    #   ProductDetail
│   ├── network/     #   dealer-network sections
│   └── shared/      #   PageHero (photo hero), PageHeader (text-only hero),
│                    #   StatsBand, FeatureGrid, TechShowcase, FAQSection, CTASection
├── config/          # pageReleases.ts (route → release map, single source of truth)
├── data/            # Content as typed data — products (the tree), company,
│                    # legal, downloads, news, services, network, stats, faqs,
│                    # images, catalog(+ generated/ from the WordPress dump)
├── constants/       # site.ts (real brand/contact), navigation.ts (nav + footer)
├── hooks/           # useLockBody, …
├── lib/             # fonts, icons, schema (JSON-LD), release (gating logic),
│                    # motion, imageLoader + imageManifest.json
├── scripts/         # image optimisation, WordPress dump parsing, catalogue
│                    # generation, content-audit crawl + workbook builder
├── content-audit/   # Philbrick-content-audit.xlsx — the client review sheet
├── styles/          # tokens.css (design tokens — single source of truth),
│                    # animations.css, globals.css
├── types/           # Shared TypeScript domain models
├── utils/           # cn (classnames), format
└── public/          # Static assets: images/ (page-wise), brand/, models/, hdri/
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
npm run start    # serve the built out/ at http://localhost:3000 (preview production)
npm run lint     # eslint
```

> **`next start` is not used** — `output: "export"` produces static files, so
> `npm run start` (and `npm run preview`) serve the `out/` folder with a tiny
> dependency-free static server (`scripts/serve.mjs`, clean URLs + 404). Run
> `npm run build` first. `npm run start` shows the **production** experience
> (only released routes; everything else Coming Soon); use `npm run dev` to work
> on any page.

### Page releases & environments

Copy `.env.example` → `.env.local` to control the release mode via
`NEXT_PUBLIC_APP_ENV` (`development` = all pages open; `production` = only routes
flagged `true` in [`config/pageReleases.ts`](config/pageReleases.ts) show real
content, the rest render the animated Coming Soon screen). Unset, it follows
`NODE_ENV` — `next dev` is development, `next build` is production.

To release a page to the client, edit `config/pageReleases.ts` and rebuild:
flip the flag in `STATIC_ROUTE_RELEASES` for a normal page, or add the path to
`RELEASED_PRODUCT_ROUTES` / `RELEASED_NEWS_ROUTES` for a product or news detail
page. The `released` flag on a node in `data/products.ts` is a
**content-readiness hint only** and does not gate production.

Today only `/` and the `/variant1…17` review pages are live in production.

### Live chat

`components/providers/TawkTo.tsx` loads the client's own Tawk.to property on
every page (ids in `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` /
`NEXT_PUBLIC_TAWKTO_WIDGET_ID`, defaults in the file). Tawk's own launcher is
hidden so the site's floating button is the only chat control, in both the open
and closed state. The chat window's **interior** colours are a Tawk dashboard
setting and cannot be reached from this codebase — see `TAWK_BRAND_NOTE` in that
file for the one-time setting.

### Content audit (client review)

Every text item on every page, next to the equivalent text on the client's
WordPress site, exports to `content-audit/Philbrick-content-audit.xlsx`:

```bash
npm run dev                                              # in one terminal
node scripts/contentAuditCrawl.mjs http://localhost:3000 # crawl (dev = all pages open)
python scripts/buildContentAudit.py                      # build the workbook
```

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

---

## Documentation map

| File | What it covers |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | **Start here.** Vision, brand, standards and the STRICT RULES (page releases, text formatting, image assets, `DONE.md`, WordPress content parity). |
| [`SITE-STRUCTURE.md`](SITE-STRUCTURE.md) | Every route with its release flag, the global chrome, the product tree, and where each piece of content lives. |
| [`DONE.md`](DONE.md) | Dated implementation history and the reasoning behind past decisions. Read before starting; append after finishing. |
| [`imagegeneration.md`](imagegeneration.md) | Every image the site renders, its prompt and aspect ratio, plus the authoritative asset mapping (§9). |
| [`sections/experience/THREEJS-IMPLEMENTATION.md`](sections/experience/THREEJS-IMPLEMENTATION.md) | How the homepage 3D hero is built, scroll-synced and tuned. |
| [`sections/experience/variants/VARIANTS.md`](sections/experience/variants/VARIANTS.md) | The 17 client-review homepage hero alternatives. |
| [`DESIGN.md`](DESIGN.md) | External reference: an analysis of apple.com's design language. **Not** this project's design system — that is `styles/tokens.css`. |
| [`AGENTS.md`](AGENTS.md) | Next.js version warning for AI assistants. |

The cinematic hero lives at `/` — see
[`sections/experience/THREEJS-IMPLEMENTATION.md`](sections/experience/THREEJS-IMPLEMENTATION.md)
for how it works and how to tune it.
