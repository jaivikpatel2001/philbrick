# VERTIQ — Site Structure & Page Breakdown

A top-to-footer map of every page on the platform, the sections each page is
built from, and where the content for each lives. Generated from the actual
codebase (`app/`, `sections/`, `data/`).

> **On "subcategories":** the site **does** have them. There are no extra *routes*
> below product pages, but every one of the 12 product families carries **3–6
> configurations** (sub-variants) shown as a dedicated section inside that
> product's page. They're listed in full in [§4](#4-products-deep-dive--the-12-families--their-configurations).

---

## 1. Sitemap (all routes)

```
/                         Home — the flagship 3D experience
├─ /about                 About Us (company story + manufacturing infrastructure)
├─ /products              Products (index — 12 families in 2 groups)
│  └─ /products/[slug]    Product detail  ×12  (each with 3–6 configurations)
│     ├─ /products/passenger-elevators
│     ├─ /products/home-elevators
│     ├─ /products/high-speed-elevators
│     ├─ /products/mrl-elevators
│     ├─ /products/panoramic-elevators
│     ├─ /products/capsule-elevators
│     ├─ /products/hospital-elevators
│     ├─ /products/freight-elevators
│     ├─ /products/dumbwaiter-elevators
│     ├─ /products/escalators
│     ├─ /products/moving-walkways
│     └─ /products/components
└─ /contact               Contact Us

System routes:  /sitemap.xml   /robots.txt   /_not-found (404)
```

**16 content pages** (Home, About, Products + 12 detail, Contact) are pre-rendered
as static HTML at build time — fast to load, SEO-friendly, no server required.

> **Removed:** there is **no `/services` route** and **no `/testimonials` route**.
> The company's lifecycle offerings (installation · maintenance · modernization ·
> AMC) live as a section on the homepage; enquiries route through **Contact**.

---

## 2. Global chrome (every page)

Defined once in `app/layout.tsx` and wrapped around all pages:

| Element | What it is |
|---|---|
| **Navbar** (`components/layout/Navbar.tsx`) | Sticky top bar: logo · primary nav · theme toggle · **"Get a quote"** button · mobile hamburger. |
| **Products mega-menu** (`MegaMenu.tsx`) | Opens on hover over "Products": two columns (Elevators / Specialised & Mobility) + a **flagship feature card** (VERTIQ Helix™). |
| **Mobile nav** (`MobileNav.tsx`) | Full-screen slide-in menu for small screens. |
| **Footer** (`components/layout/Footer.tsx`) | Brand + newsletter + HQ contact · 3 link columns · certifications (ISO 9001, ISO 14001, EN 81-20/50, LEED Platinum) · socials · copyright. |
| Providers | Theme (dark/light), Lenis smooth-scroll, scroll-reveal observer, "Skip to content" link. |

**Primary nav order:** Products (mega) · About · Contact
**Footer columns:** Elevators · Specialised & Mobility · Company (About VERTIQ · All Products · Contact)

---

## 3. Page-by-page breakdown (top → footer)

### 🏠 Home  `/`
The flagship storytelling page. Source: `app/page.tsx`.

| # | Section | What the visitor sees |
|---|---|---|
| 1 | **3D Elevator Experience** (`ElevatorScene`) | Scroll-driven WebGL hero — see [§5](#5-the-3d-hero-scroll-experience). Night city → zoom to the tower → through the glass → into the lobby → components reveal one by one. |
| 2 | **Who we are** (`AboutPreview`) | "Fifty-seven years of moving the world upward." — company intro + link to About. |
| 3 | **Products** (`ProductsShowcase`) | "One platform. Every kind of rise." — featured elevator product families. |
| 4 | **Lifecycle support** (`ServiceEcosystem`) | "We don't just install. We stay." — installation · maintenance · modernization · AMC, with a "Discuss your project" CTA to Contact. |
| 5 | **Portfolio / Projects** (`Projects`) | "The buildings that…" — landmark projects (Lodha Marquise, Prestige Financial Hub, Taj Skyline, Apollo Medicity). |
| 6 | **Industries** (`IndustriesShowcase`) | "Engineered for every kind of building." — residential, commercial, healthcare, hospitality, industrial. |
| 7 | **By the numbers** (`StatsBand`) | "Performance you can measure." — headline company metrics. |
| 8 | **Call to action** (`CTASection`) | "Ready to move your building into the future?" → Request a consultation / Explore products. |
|  | *Footer* | Global footer. |

> **Removed from Home:** *Trusted By* (`ClientMarquee`), *Technology* (`TechnologyPreview`)
> and *Testimonials* (`TestimonialsSection`) sections were taken out; the flow above
> is the current, complete order.

---

### 🏢 About Us  `/about`
Source: `app/about/page.tsx`.

1. **Page hero** — "Moving the world upward since 1968" + breadcrumb + 3 trust stats.
2. **Story** ("Who we are") — narrative paragraphs + facility image.
3. **Infrastructure & Manufacturing** *(new)* — "Manufacturing & engineering, built in-house" — a 6-card capability grid (manufacturing plants · fabrication & assembly · in-house component production · quality control & test towers · engineering & R&D · warehouse & logistics) plus a scale strip (manufacturing sites, R&D centres, service branches, cities served). Data: `INFRASTRUCTURE` + `GLOBAL_STATS`.
4. **Mission & Vision** — two statement cards.
5. **Values** — "Six values, one standard" — 6-item value grid.
6. **Timeline** — "Five decades of firsts" — milestone timeline.
7. **Leadership** — team cards for the executive team.
8. **Stats band** — full trust-metrics row.
9. **CTA** — "Build the future of mobility with us" → Get in touch / Our products.
10. *Footer.*

---

### 🛗 Products (index)  `/products`
Source: `app/products/page.tsx`.

1. **Page hero** — "Vertical mobility for every building" + 3 stats (12 families, 40+ countries, 1.4M units).
2. **Group 01 — Elevators** — product cards (6 families).
3. **Group 02 — Specialised & Mobility** — product cards (6 families).
4. **CTA** — "Not sure which system fits?" → Get expert advice / Why VERTIQ.
5. *Footer.*

---

### 🛗 Product Detail  `/products/[slug]`  *(×12)*
Source: `app/products/[slug]/page.tsx`. Each of the 12 families renders the same structure:

1. **Page hero** — product name, tagline, category, breadcrumb (Home › Products › _name_).
2. **Overview** — tech showcase: long description + capacity badge + top features.
3. **Highlights** — quick check-list band of headline selling points.
4. **Configurations (subcategories)** — "Choose the right variant" — the 3–6 sub-variants for this family. **← this is the subcategory layer.**
5. **Specifications** — technical spec table (capacity, speed, drive, etc.).
6. **Gallery** — product image gallery (when available).
7. **Related products** — 3 cross-links to other families.
8. **CTA** — "Specify your _product_" → Request a quote / All products.
9. *Footer.*

---

### 📞 Contact Us  `/contact`
Source: `app/contact/page.tsx`.

1. **Page hero** — "Let's build upward, together."
2. **Contact layout** (two columns):
   - **Left** — contact methods (call, email, HQ address, hours) · **24/7 emergency** line · "routed to your nearest office" note.
   - **Right** — **"Request a consultation"** lead form (`ContactForm`).
3. *Footer.*

---

## 4. Products deep-dive — the 12 families & their configurations

Grouped exactly as they appear in the mega-menu, index page, and footer.
The **Configurations** column is the subcategory layer (rendered on each product page).

### Group 01 — Elevators

| Product family | Route | Configurations (subcategories) |
|---|---|---|
| **Passenger Elevators** | `/products/passenger-elevators` | Gearless MRL · Geared Traction · Compact Roomless · High-Rise Group |
| **Home Elevators** | `/products/home-elevators` | Hydraulic Home Lift · Gearless Traction · Vacuum (Pneumatic) · Shaftless Platform |
| **High-Speed Elevators** | `/products/high-speed-elevators` | Express Shuttle · Double-Deck · Observation Express |
| **Machine-Room-Less (MRL)** | `/products/mrl-elevators` | Compact MRL · Mid-Rise MRL · Eco MRL |
| **Panoramic Elevators** | `/products/panoramic-elevators` | Round / Capsule Glass · Square Panoramic · Wall-Climbing |
| **Capsule Elevators** | `/products/capsule-elevators` | Indoor Capsule · Outdoor Wall-Mounted · Pneumatic Capsule |

### Group 02 — Specialised & Mobility

| Product family | Route | Configurations (subcategories) |
|---|---|---|
| **Hospital Elevators** | `/products/hospital-elevators` | Bed Elevator · Stretcher Elevator · Service / Utility · Emergency Evacuation |
| **Freight Elevators** | `/products/freight-elevators` | Industrial Freight · Goods-only Lift · Vehicle / Car (Automobile) Elevator · Heavy Platform |
| **Dumbwaiter & Service Lifts** | `/products/dumbwaiter-elevators` | Kitchen Dumbwaiter · Document / Service Lift · Floor-Level Service |
| **Escalators** | `/products/escalators` | Commercial · Heavy-Duty Transit · Crystal / Glass · Spiral |
| **Moving Walkways** | `/products/moving-walkways` | Horizontal Autowalk · Inclined Travelator |
| **Components & Controllers** | `/products/components` | Gearless Machines · Regenerative Drives · Pulse™ Controllers · COP / LOP Fixtures · Safety Gear · Landing Doors |

**Totals:** 12 product families · **43 configurations**. (Automobile/car elevators are
served as the *Vehicle / Car Elevator* configuration under Freight.)

---

## 5. The 3D hero scroll experience (Home)

The homepage hero (`sections/experience/ElevatorScene.tsx`) is a single
scroll-driven WebGL sequence — one continuous "camera move" from the street to
the machine. Beats, in scroll order:

1. **Arrival** — wide night shot of the VERTIQ tower (lit windows, gold sign, city skyline).
2. **The Approach** — camera pushes in toward the entrance (dolly-zoom).
3. **Threshold** — camera passes *through* the glass doors into the lobby.
4. **The Call** — the elevator doors part.
5. **Explore** — the camera auto-frames **8 elevator components** one by one, each with a clickable hotspot + detail panel (operating panel, key switch, display, emergency, doors, motor, safety, interior).
6. **Destination** — glide into the cabin; the pinned hero releases and the page scrolls on.

- **Fallback:** on no-WebGL or reduced-motion devices, a lightweight CSS/GSAP
  version (`ScrollStory.tsx`) plays the same outside→inside story.
- Full technical doc: [`sections/experience/THREEJS-IMPLEMENTATION.md`](sections/experience/THREEJS-IMPLEMENTATION.md).

---

## 6. Where the content lives (for editing)

All copy/data is separated from the components — edit these, no layout changes needed:

| Content | File |
|---|---|
| Products + configurations + specs | `data/products.ts` |
| Lifecycle support (installation / maintenance / modernization / AMC) — home section | `data/services.ts` |
| Company story, mission, values, **infrastructure**, timeline, leadership | `data/company.ts` |
| Stats / trust metrics / scale (manufacturing sites, R&D centres, service branches) | `data/stats.ts` |
| Industries | `sections/home/IndustriesShowcase.tsx` |
| Home projects / portfolio | `sections/experience/Projects.tsx` |
| 3D hero components | `data/elevatorComponents.ts` |
| Images (all sourced from Unsplash placeholders) | `data/images.ts` |
| Site name, contact, socials | `constants/site.ts` |
| Navigation + footer links | `constants/navigation.ts` |

> **Pre-launch note:** every image currently points at an Unsplash placeholder
> (`data/images.ts`). Swap these for licensed brand photography before launch —
> it's a one-file change, no component edits.

---

*This document reflects the codebase as of the current branch. Regenerate it if
routes or page sections change.*
