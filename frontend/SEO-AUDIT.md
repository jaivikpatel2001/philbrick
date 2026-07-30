# Philbrick — SEO / GEO / AEO Audit & Improvements

**Audited:** philbrickindia.com (code-level audit of the shipped Next.js source —
more authoritative than an HTML fetch) · staging: philbrick.onrender.com
**Date:** 2026-07-25 · **Type:** Full audit + implemented fixes

> **GEO** = Generative Engine Optimization (being cited by AI answer engines:
> ChatGPT Search, Perplexity, Google AI Overviews, Gemini).
> **AEO** = Answer Engine Optimization (featured snippets, People-Also-Ask,
> voice). **SEO** = classic search ranking.

## Scores

| Dimension | Before | After fixes | Status |
|---|---|---|---|
| SEO | 8.5/10 | **9/10** | Strong |
| GEO | 7/10 | **8.5/10** | Strong |
| AEO | 6.5/10 | **7.5/10** | On track |
| **Combined** | 22/30 | **25/30** | |

The site started in genuinely good shape — this is a well-built codebase, not a
rescue job. Every route already had a self-referencing canonical, a breadcrumb
trail, page-specific title/description, and JSON-LD; the sitemap and robots are
generated from a single release-gated source of truth; `/llms.txt` already
exists for AI crawlers. The fixes below close specific gaps rather than rebuild.

---

## What was implemented (this pass)

### 1. Organization → Organization + LocalBusiness (GEO / local) — HIGH
`lib/schema.ts`. The company owns a physical plant with real coordinates and
opening hours (`SITE.geo`, `SITE.hours`) that were **not** in the structured
data. Added the `LocalBusiness` type facet plus:
- `geo` (GeoCoordinates 23.03676, 72.68678)
- `hasMap` (Google Maps pin)
- `openingHoursSpecification` (Mon–Fri 09:00–18:00)
- `logo` + statutory `identifier`s (GSTIN, CIN, IEC) as proper `PropertyValue`s.

Why it matters: gives Google's local pack and AI answer engines a precise,
verifiable business entity (address + geo + hours + registration numbers), which
is exactly the kind of factual density GEO rewards for citation.

### 2. Product images → absolute URLs (SEO correctness) — HIGH
`productSchema()` emitted `image: "/images/…png"` (root-relative). Crawlers can't
resolve a relative URL in JSON-LD, so the product image was effectively invisible
to rich results. Now absolute (`https://philbrickindia.com/images/…`). Also added
`brand.name` alongside the `@id` reference.

### 3. Homepage WebPage + Speakable (AEO / voice) — MEDIUM
Added a `WebPage` node (`homePageSchema()`, injected in `app/page.tsx`) tying the
homepage into the entity graph (WebPage → isPartOf WebSite → publisher
Organization) and marking the `<h1>` `speakable` for voice assistants. Also added
`alternateName` (legal name) to the WebSite node.

**Verified in the built output:** all JSON-LD parses; homepage carries
Organization+LocalBusiness / WebSite / WebPage; product pages emit absolute
images. `npx tsc` clean, `next build` clean (56 pages).

---

## What's already strong (leave as-is)

- **Structured data coverage** — Organization, WebSite, BreadcrumbList (every
  page), Product (category + product pages), ItemList (`/products`), FAQPage
  (`/contact` + `/products`), AboutPage, ContactPage, Person (leadership). This
  is well above the typical B2B manufacturer site.
- **Metadata** — title template `%s · Philbrick`, per-page descriptions,
  keyword set, Open Graph (1200×630 branded image), Twitter `summary_large_image`,
  `robots: index,follow, max-image-preview:large`, `metadataBase` set.
- **Canonicals** — self-referencing on every route (homepage via the root layout).
- **Crawl hygiene** — sitemap lists only released routes (no "Coming Soon"
  leakage), robots points to it, `host` set, `/llms.txt` present for AI crawlers.
- **Entity graph** — `sameAs` (WhatsApp, Facebook, Instagram, X), `knowsAbout`,
  three typed `contactPoint`s. Strong for GEO entity recognition.

---

## Recommended next (not done — need a content or product decision)

| Priority | Item | Dimension | Effort | Notes |
|---|---|---|---|---|
| 🟠 High | **Blog / Resources / technical guides** | GEO | Large | The single biggest GEO lever left. AI engines cite pages with original, factual, in-depth content. "How an ARD works", "Choosing an elevator control panel", spec explainers — each becomes citable. No blog exists today. |
| 🟡 Medium | **Per-page OG images** | SEO/social | Small | Every page shares the one brand OG card. Each page has its own hero image; using it as the page's `openGraph.images` improves social CTR. |
| 🟡 Medium | **FAQ block on the homepage** | AEO | Small | FAQ schema is on `/contact` + `/products`; a short homepage FAQ with question-phrased headings would win more People-Also-Ask / voice results. |
| 🟡 Medium | **Question-phrased H2/H3s** on product/category pages | AEO | Small | "What is an Automatic Rescue Device?", "How does a serial CAN-bus controller work?" — matches how buyers and voice search phrase queries. |
| 🟢 Quick win | **Tighten the root meta description** to ~155 chars | SEO | Tiny | Current is ~220 chars; the tail is truncated in SERPs. Front-load the primary keywords. |
| 🟢 Quick win | **Category pages: `CollectionPage` / `ProductGroup`** | SEO | Small | Categories are currently typed as `Product`; `ProductGroup` with `hasVariant` (or `CollectionPage`) is a truer fit and can surface variant rich results. |

## Can't assess from source (use a live tool)

- **Core Web Vitals / real page speed** — run pagespeed.web.dev. (A recent
  PageSpeed run showed **92 desktop / 78 mobile**; the mobile gap is dominated by
  the intro Preloader overlay, a product decision already flagged in `DONE.md`.)
- **Backlink profile / domain authority** — needs Ahrefs/Semrush.
- **Index coverage / actual SERP appearance** — needs Google Search Console
  (also submit `sitemap.xml` there if not already).

---

*Files changed this pass: `lib/schema.ts`, `app/page.tsx`. Audit framework:
the `seo-geo-aeo` skill (claudeseoskill.com), adapted to a code-level audit.*
