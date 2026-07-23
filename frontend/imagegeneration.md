# Philbrick — Image Generation Checklist

A complete, page-by-page list of **every image the website renders**, with the
prompt and aspect ratio for each. Generate one image per entry using its **file
name** and **aspect ratio**, then hand back the folder and the images will be
wired into `data/images.ts` / product data by file name.

> **Status (2026-07-22): all 60 catalogued images are supplied and integrated.**
> There are **no Unsplash or other external images left** anywhere in the site —
> never reintroduce one. §8 records the delivery and §9 is the authoritative
> asset mapping. Sections §1–§7 remain the brief that produced those assets, and
> the template for anything new.
>
> **Pages with no imagery by design:** `/career`, `/quality-policy`,
> `/privacy-policy` and `/downloads` use the text-only
> `sections/shared/PageHeader.tsx` rather than a photographic hero, because no
> brand photograph exists for them and borrowing an unrelated one would be worse
> than none. If the client wants photography there, add the requirement here
> first (prompt + exact aspect ratio), then generate and wire it.

> **Homepage hero:** `app/page.tsx` renders the Three.js scene
> (`sections/experience/ElevatorHero.tsx`). The scroll-driven exploded component
> tour (`ExplorationHero.tsx`) is the `/variant1` review page, and its asset spec
> + prompts are **§11**; the other hero directions under review are listed in
> `sections/experience/variants/VARIANTS.md`. The logo, favicon, app icons and
> OG card are already custom (`public/brand/`). The `/news-events` photos are
> for the **currently mock** newsroom — regenerate with real event photography
> when real news is published.
>
> **Planned hero upgrade:** §10 is the complete **video-generation prompt suite**
> for replacing the procedural hero with a photoreal, scroll-scrubbed cinematic
> elevator sequence (city → building → lobby → cabin → component reveals).

---

## 0. How to use this file

- **Status (2026-07-11):** these images have been generated and **integrated**. Source
  files are **PNG**, reorganised into page-wise folders under `public/images/…`, and
  delivered as responsive **WebP** by `lib/imageLoader.ts` (static-export safe). The
  authoritative list of final paths + status is the **Image Asset Mapping (§9)**.
- **File names** are lowercase-kebab. The per-entry names in §1–§7 are the original
  generation names; their final in-repo paths (page-wise) are listed in §9.
- **Aspect ratio** is stated in every entry **and inside every prompt**. Images are
  rendered with `object-fit: cover`, so **keep the key subject centred with margin
  on all sides** — several product images are cropped to more than one frame
  (card 4:3, page-hero 16:9, overview panel 4:5).
- **Generate the full set for one consistent "brand shoot" look** — same camera
  language, same colour grade, so every page feels like the same company.

### Global brand & photography style (apply to EVERY prompt)

> Premium, modern, cinematic, **ultra-realistic editorial photography** for an
> **Indian elevator-component manufacturer (Philbrick, Ahmedabad, Gujarat)**. Shot
> on a full-frame camera, 35–50mm, natural + controlled studio light, medium depth
> of field, crisp detail. **Cool, clean colour grade** — neutral whites, soft
> shadows, restrained saturation, with **subtle azure-blue (#109BDD) accents** in
> lighting/reflections and the occasional **signal-red safety accent**, never
> overdone. **Indian context throughout**: modern Indian cities, architecture,
> commercial/residential/industrial interiors; any people are **Indian (South
> Asian), professional, natural**. **Technically accurate** elevator hardware —
> real control panels, wiring, drives, cabins, doors, displays and machine rooms.
> **Avoid:** any text, watermarks, brand names or fake logos; distorted or gibberish
> button/display labels; warped machinery or impossible engineering; extra
> fingers/warped faces; plastic "AI" sheen; Western-only settings; stocky/clichéd
> compositions. Photorealistic, sharp, professional.

*(Each prompt below is self-contained but assumes the style above. The aspect ratio
is repeated inside each prompt as required.)*

---

## 1. Page Hero Images — aspect ratio **16:9** (≈ 2400×1350)

Full-bleed background heroes (`sections/shared/PageHero`); a dark scrim + white
headline sits over the lower-left, so keep the **lower-left third calmer/darker**
and the visual interest upper-right.

### 1.1 Products — hero
- **File name:** `hero-products.png`
- **Page:** Products (`/products`)
- **Section:** Page hero ("Complete elevator components, engineered in-house")
- **Aspect ratio:** 16:9
- **Prompt:** Cinematic wide shot inside a clean, modern Indian elevator-component factory floor: rows of finished stainless-steel elevator control cabinets and car-operating panels on an assembly line, soft daylight from high industrial windows, subtle azure-blue equipment glow, an out-of-focus Indian technician in the background. Premium industrial photography, cool clean colour grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

### 1.2 About Us — hero
- **File name:** `hero-about.png`
- **Page:** About Us (`/about`)
- **Section:** Page hero ("Elevator solutions, engineered in Ahmedabad since 1992")
- **Aspect ratio:** 16:9
- **Prompt:** Wide cinematic view of a modern Indian elevator engineering workshop in Ahmedabad: an Indian engineer in a light shirt studying a control panel wiring harness at a workbench, precision tools and PCBs around, tall factory windows with soft morning light, faint blue equipment accents. Premium documentary-style realism, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

### 1.3 Vision & Mission — hero
- **File name:** `hero-vision-mission.png`
- **Page:** Vision & Mission (`/vision-mission`)
- **Section:** Page hero ("Vision & Mission")
- **Aspect ratio:** 16:9
- **Prompt:** Aspirational wide shot looking up a bright modern Indian atrium with a glass panoramic elevator rising through the space, clean lines, daylight, subtle azure reflections on glass and steel, sense of upward motion and possibility. Architectural cinematic photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

### 1.4 Milestone & Awards — hero
- **File name:** `hero-milestone.png`
- **Page:** Milestone & Awards (`/milestone`)
- **Section:** Page hero ("Milestone & Awards")
- **Aspect ratio:** 16:9
- **Prompt:** Cinematic wide shot of a Philbrick-style elevator quality-control test area in an Indian factory: a tall test tower / calibration rig with a control cabinet, warm-cool mixed lighting, a sense of engineering heritage and precision, one Indian QC engineer checking a panel in soft focus. Premium industrial realism, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

### 1.5 Infrastructure — hero
- **File name:** `hero-infrastructure.png`
- **Page:** Infrastructure (`/infrastructure`)
- **Section:** Page hero ("Built in-house, end to end")
- **Aspect ratio:** 16:9
- **Prompt:** Expansive wide shot of a modern Indian manufacturing facility interior: CNC and sheet-metal fabrication area with elevator cabin panels and door frames in production, organised bays, overhead lighting, safety markings on the floor, one or two Indian workers in PPE in the distance. Clean industrial cinematic photography, cool grade with subtle blue accents, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

### 1.6 Network — hero
- **File name:** `hero-network.png`
- **Page:** Network (`/network`)
- **Section:** Page hero ("From Ahmedabad, across India and beyond")
- **Aspect ratio:** 16:9
- **Prompt:** Cinematic aerial/elevated wide view of a modern Indian city skyline at golden hour (Ahmedabad / Mumbai character) with mixed high-rise residential and commercial towers, a sense of reach and distribution, warm-to-cool sky, subtle haze. Premium architectural photography, clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

### 1.7 News & Events — hero
- **File name:** `hero-news-events.png`
- **Page:** News & Events (`/news-events`)
- **Section:** Page hero ("News & Events")
- **Aspect ratio:** 16:9
- **Prompt:** Cinematic wide shot of a professional Indian industry exhibition / trade-show hall floor with clean modern exhibition stands showing elevator equipment, visitors and professionals (Indian) walking and talking, bright even lighting, corporate energy. Premium event photography, cool clean grade, ultra-realistic, no text or logos or brand names on stands, no AI artifacts. Aspect ratio 16:9.

### 1.8 Contact — hero
- **File name:** `hero-contact.png`
- **Page:** Contact (`/contact`)
- **Section:** Page hero ("Let's talk elevators")
- **Aspect ratio:** 16:9
- **Prompt:** Cinematic wide exterior of a modern Indian corporate/industrial building facade at dusk with warm interior lights, a clean approach/entrance, soft blue evening sky — welcoming, professional headquarters feel. Premium architectural photography, cool clean grade with warm window accents, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 16:9.

---

## 2. Section Media (portrait) — aspect ratio **4:5** (≈ 1000×1250)

Offset portrait media beside editorial text.

### 2.1 "01 Who We Are" — media
- **File name:** `section-who-we-are.png`
- **Page:** Home (`/`)
- **Section:** "01 Who we are" (`AboutPreview`)
- **Aspect ratio:** 4:5
- **Prompt:** Portrait shot of an Indian elevator engineer at a bright workbench assembling a stainless-steel car-operating panel, focused hands, tidy components and wiring, soft daylight, shallow depth of field, subtle azure highlights. Warm-professional, human, ultra-realistic editorial photography, cool clean grade, no text or logos, no AI artifacts. Aspect ratio 4:5.

### 2.2 About "Who we are" — story media
- **File name:** `section-about-story.png`
- **Page:** About Us (`/about`)
- **Section:** "Who we are" story
- **Aspect ratio:** 4:5
- **Prompt:** Portrait interior of a premium modern Indian elevator cabin (car interior): brushed stainless walls, a mirror wall, warm LED ceiling cove, a clean car-operating panel, subtle reflections — refined and calm. Architectural interior photography, cool clean grade with warm accents, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 4:5.

### 2.3 Infrastructure "Under one roof" — intro media
- **File name:** `section-infrastructure-intro.png`
- **Page:** Infrastructure (`/infrastructure`)
- **Section:** "Under one roof" intro
- **Aspect ratio:** 4:5
- **Prompt:** Portrait shot inside an Indian elevator factory quality-control bay: a control cabinet under test with neatly bundled wiring, a technician's gloved hand with a multimeter probe, calibrated and clean, cool light with a soft blue equipment glow. Precise industrial realism, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 4:5.

---

## 3. Applications / Industries (portrait cards) — aspect ratio **3:4** (≈ 1050×1400)

Carousel cards in the home "04 Applications" section (also reused as the CSS
fallback story tiles). A dark bottom gradient carries a white label, so keep the
**bottom quarter calmer**.

### 3.1 Residential
- **File name:** `application-residential.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait exterior of a modern Indian residential high-rise apartment tower at soft daylight, clean balconies and glazing, landscaped base — premium urban housing. Architectural photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

### 3.2 Commercial
- **File name:** `application-commercial.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait exterior of a sleek modern Indian commercial office tower with a glass-and-steel facade, reflecting a clear sky, corporate and clean. Architectural photography, cool clean grade with azure reflections, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

### 3.3 Healthcare
- **File name:** `application-healthcare.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait interior of a bright, clean modern Indian hospital corridor with a wide stretcher-capable elevator lobby, calm lighting, hygienic surfaces, a sense of care and order. Architectural interior photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

### 3.4 Hospitality
- **File name:** `application-hospitality.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait interior of an elegant modern Indian hotel lobby with a premium elevator entrance, warm ambient lighting, stone and metal finishes, refined hospitality atmosphere. Architectural interior photography, warm-cool balanced grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

### 3.5 Industrial
- **File name:** `application-industrial.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait interior of a large modern Indian warehouse / logistics facility with a heavy-duty goods elevator or freight lift, pallet racking, clean concrete floor with safety markings, industrial lighting. Industrial photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

### 3.6 Institutional
- **File name:** `application-institutional.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait exterior/interior of a modern Indian institutional building (university campus block or public building) with clean architecture, a spacious accessible lobby with an elevator, daylight, orderly and civic. Architectural photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

### 3.7 Transit
- **File name:** `application-transit.png`
- **Page:** Home (`/`) · **Section:** 04 Applications carousel
- **Aspect ratio:** 3:4
- **Prompt:** Portrait interior of a modern Indian metro station concourse with escalators and a public elevator, clean signage-free surfaces, cool daylight, commuters (Indian) in soft motion blur, transit-grade architecture. Architectural transit photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 3:4.

---

## 4. Product Category Images — aspect ratio **4:3** (≈ 1600×1200)

One per product category (`data/products.ts` → `CATEGORY_IMG`). Each is used on the
products index card, the category page hero (cropped 16:9) and the overview panel
(cropped 4:5) and the mega menu — so **centre the product with margin on all
sides**. These must **accurately depict the specific product**. Studio-industrial
look on a clean neutral/graphite surface with soft azure key light, OR shown
in-situ in a real elevator context.

### 4.1 Elevator Control Panel
- **File name:** `category-elevator-control-panel.png`
- **Page:** Products · Product category · Home "02 The range" · Mega menu
- **Section:** Category: Elevator Control Panel (Control & Drives)
- **Aspect ratio:** 4:3
- **Prompt:** A tall metal elevator control panel cabinet with its door open, revealing neatly organised and colour-coded wiring, contactors, relays, a VFD drive module, terminal blocks and control PCBs, standing in a clean workshop, soft azure key light, shallow depth of field on the front. Technically accurate elevator controller, premium industrial product photography, cool clean grade, ultra-realistic, no text or logos or gibberish labels, no AI artifacts. Aspect ratio 4:3.

### 4.2 Integrated Control Panel
- **File name:** `category-integrated-control-panel.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Integrated Control Panel (Control & Drives)
- **Aspect ratio:** 4:3
- **Prompt:** A compact all-in-one integrated elevator control cabinet that combines the drive, controller and signalling in one tidy enclosure, clean two-wire CAN-bus style wiring, mounted against a light workshop wall, soft studio light with subtle blue accents. Accurate elevator control hardware, premium industrial product photography, cool clean grade, ultra-realistic, no text or logos or gibberish labels, no AI artifacts. Aspect ratio 4:3.

### 4.3 Elevator IoT
- **File name:** `category-elevator-iot.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Elevator IoT (Safety & Intelligence)
- **Aspect ratio:** 4:3
- **Prompt:** A small IoT connectivity module / gateway PCB with a status LED and antenna, wired into an elevator controller, with a softly blurred laptop or wall dashboard in the background implying live lift status and cloud monitoring; cool tech lighting with azure glow. Accurate electronics, premium product-tech photography, cool clean grade, ultra-realistic, no readable text or logos, no AI artifacts. Aspect ratio 4:3.

### 4.4 Automatic Rescue Device (ARD)
- **File name:** `category-ard.png`
- **Page:** Products · Product category · Mega menu feature card
- **Section:** Category: ARD — Automatic Rescue Device (Safety & Intelligence)
- **Aspect ratio:** 4:3
- **Prompt:** A compact wall-mounted Automatic Rescue Device unit with a backup battery pack and a small control board, installed beside an elevator control cabinet in a machine area, one indicator LED lit, conveying emergency/safety readiness, soft cool light with a subtle red safety accent. Technically accurate elevator safety hardware, premium industrial product photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 4:3.

### 4.5 Lift Master — Door Operator Controller
- **File name:** `category-lift-master.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Lift Master Door Operator Controller (Doors & Mechanism)
- **Aspect ratio:** 4:3
- **Prompt:** A door-operator controller unit mounted on the header of an elevator car, driving the sliding car-door mechanism via a belt and small motor, brushed-metal and black plastic housing, clean install, soft cool light. Technically accurate elevator door operator, premium industrial product photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 4:3.

### 4.6 Synergy Auto Door
- **File name:** `category-synergy-auto-door.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Synergy Auto Door — Door Mechanism (Doors & Mechanism)
- **Aspect ratio:** 4:3
- **Prompt:** A stainless-steel automatic elevator door mechanism seen at the car entrance — the header operator, hangers and centre-opening sliding panels, brushed finish, precise engineering, in a clean modern lobby, soft daylight. Technically accurate automatic elevator doors, premium architectural product photography, cool clean grade, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 4:3.

### 4.7 Elevator Doors
- **File name:** `category-elevator-doors.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Elevator Doors (Doors & Mechanism)
- **Aspect ratio:** 4:3
- **Prompt:** A set of closed brushed stainless-steel elevator landing doors in a modern Indian building lobby, precise even gap, subtle grain, a floor position indicator above, clean surrounding wall, soft daylight and reflections. Architectural product photography, cool clean grade, ultra-realistic, no readable text or logos, no AI artifacts. Aspect ratio 4:3.

### 4.8 Elevator Cabin
- **File name:** `category-elevator-cabin.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Elevator Cabin (Cabin & Fixtures)
- **Aspect ratio:** 4:3
- **Prompt:** Interior of a premium modern elevator car (cabin): brushed stainless and glass walls, a stone-look floor, a mirrored back wall, a warm LED ceiling light cove, a slim handrail and a clean car-operating panel, refined and spacious. Architectural interior photography, cool clean grade with warm accents, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 4:3.

### 4.9 Elevator Display
- **File name:** `category-elevator-display.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Elevator Display (Signalling)
- **Aspect ratio:** 4:3
- **Prompt:** A close product shot of an elevator floor-position indicator display mounted in a brushed-steel car panel, a crisp dot-matrix/TFT screen showing a floor number and a direction arrow (simple generic numerals, not words), glowing cleanly against dark glass, soft studio light. Accurate elevator display hardware, premium product photography, cool clean grade, ultra-realistic, no words/logos (only a plain floor numeral + arrow), no AI artifacts. Aspect ratio 4:3.

### 4.10 COP / LOP
- **File name:** `category-cop-lop.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: COP / LOP (Cabin & Fixtures)
- **Aspect ratio:** 4:3
- **Prompt:** A brushed stainless-steel elevator Car Operating Panel (COP) with a vertical column of round tactile floor buttons with faint braille, an emergency alarm button, and a small position display at the top, mounted in a cabin wall, soft directional light and subtle reflections. Accurate elevator fixture, premium product photography, cool clean grade, ultra-realistic, no readable text/logos (plain button glyphs only), no AI artifacts. Aspect ratio 4:3.

### 4.11 Touch COP / LOP
- **File name:** `category-touch-cop-lop.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Touch COP / LOP (Cabin & Fixtures)
- **Aspect ratio:** 4:3
- **Prompt:** A premium capacitive-touch elevator operating panel behind a smooth black glass fascia, backlit round touch floor points glowing soft blue, a sleek modern car interface, subtle reflections, cool studio light. Accurate premium elevator fixture, product photography, cool clean grade with azure glow, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.

### 4.12 Voice Announcing Systems
- **File name:** `category-voice-announcing-systems.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Voice Announcing Systems (Signalling)
- **Aspect ratio:** 4:3
- **Prompt:** A small elevator voice-announcement electronic module — a compact PCB with a speaker grille and connectors — resting on a clean neutral surface beside an elevator car panel, subtle sound-wave lighting suggestion, cool tech light with azure accent. Accurate audio electronics, premium product-tech photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.

### 4.13 Elevator KIT & Accessories
- **File name:** `category-elevator-kit-accessories.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: Elevator KIT & Accessories (Cabin & Fixtures)
- **Aspect ratio:** 4:3
- **Prompt:** A neat flat-lay / knolling arrangement of elevator kit components on a clean graphite surface — push buttons, a small display, guide rollers, door hangers, brackets, cabling and fixtures — organised and premium, soft even studio light with subtle blue accent. Accurate elevator parts, premium product photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.

### 4.14 STEP Products
- **File name:** `category-step-products.png`
- **Page:** Products · Product category · Mega menu
- **Section:** Category: STEP Products (Control & Drives)
- **Aspect ratio:** 4:3
- **Prompt:** Elevator drive and controller components arranged as a product set — a VFD variable-frequency drive unit and an integrated controller board with heat sinks and connectors — on a clean neutral surface, cool studio light with azure accent, precise and modern. Accurate drive/control electronics, premium product photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.

---

## 5. Individual Product Images (nested products) — aspect ratio **4:3** (≈ 1600×1200)

Optional but recommended for the individual product detail pages
(`/products/<category>/<product>`), which today reuse their category image. Same
studio-industrial style; **centre the product**. Each must match the exact product.

### Elevator Control Panel → sub-products
- **`product-automatic-door-controller.png`** — /products/elevator-control-panel/automatic-door-controller · Aspect 4:3 — *Prompt:* An elevator control panel configured for automatic power doors: an open metal cabinet with a door-operator interface module and neatly wired contactors and controller boards, in a clean workshop, soft azure light. Accurate elevator controller, premium industrial product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-manual-door-controller.png`** — …/manual-door-controller · Aspect 4:3 — *Prompt:* An elevator control panel for manual swing/collapsible doors: a compact metal control cabinet with relays, contactors and terminal blocks, simpler door interface, clean workshop, soft cool light. Accurate elevator controller, premium industrial product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-hydraulic-controller.png`** — …/hydraulic-controller · Aspect 4:3 — *Prompt:* A hydraulic elevator control panel beside a hydraulic power pack (valve block, motor, oil tank), neat wiring and valve-control electronics, clean machine room, soft cool light with subtle blue accent. Accurate hydraulic elevator hardware, premium industrial photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.

### Integrated Control Panel → sub-products
- **`product-parallel-type-controller.png`** — …/parallel-type-controller · Aspect 4:3 — *Prompt:* A parallel-wired integrated elevator control panel where each signal runs on its own conductor — an open cabinet with dense, tidy multi-wire looms and controller boards, clean workshop, soft cool light. Accurate elevator controller, premium industrial product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-serial-can-bus-type-controller.png`** — …/serial-can-bus-type-controller · Aspect 4:3 — *Prompt:* A serial CAN-bus integrated elevator control panel with minimal, elegant two-wire bus cabling replacing bundled travelling cables, a compact controller board with a bus connector, clean modern enclosure, azure accent. Accurate elevator controller, premium industrial product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-mrl-control-panel.png`** — …/mrl-control-panel · Aspect 4:3 — *Prompt:* A compact machine-room-less (MRL) elevator control panel sized to fit within the hoistway/door frame — a slim wall enclosure with an integrated drive and controller, mounted near the shaft, cool light. Accurate MRL elevator hardware, premium industrial photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.

### Synergy Auto Door → sub-products
- **`product-2-panel-centre-opening.png`** — …/2-panel-centre-opening · Aspect 4:3 — *Prompt:* A stainless-steel 2-panel centre-opening automatic elevator door at the car entrance, the two panels parting symmetrically from the centre, header operator visible above, clean modern lobby, soft daylight. Accurate elevator doors, premium architectural product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-2-panel-telescopic-side-opening.png`** — …/2-panel-telescopic-side-opening · Aspect 4:3 — *Prompt:* A stainless-steel 2-panel telescopic side-opening automatic elevator door, both panels sliding and stacking to one side to maximise clear opening width, header operator above, clean lobby, soft light. Accurate elevator doors, premium architectural product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-4-panel-centre-opening.png`** — …/4-panel-centre-opening · Aspect 4:3 — *Prompt:* A wide stainless-steel 4-panel centre-opening automatic elevator door (two telescoping panels each side) giving a very wide clear entrance suited to hospital/freight, header operator above, clean lobby, soft light. Accurate elevator doors, premium architectural product photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 4:3.

### Elevator Display → sub-products *(plain floor numeral + arrow only, no words)*
- **`product-xn-1000-led-segment-display.png`** — …/xn-1000-led-segment-display · Aspect 4:3 — *Prompt:* A close product shot of a seven-segment LED elevator floor indicator, bright high-contrast red/blue segments showing a single floor numeral and a direction arrow behind dark glass in a brushed-steel car panel, soft studio light. Accurate segment display, premium product photography, cool clean grade, ultra-realistic, only a plain numeral + arrow (no words/logos), no AI artifacts. Aspect ratio 4:3.
- **`product-xn-2000-dot-matrix-display.png`** — …/xn-2000-dot-matrix-display · Aspect 4:3 — *Prompt:* A dot-matrix elevator position indicator showing a crisp floor numeral and scrolling arrow in fine LED dots behind dark glass, brushed-steel bezel, soft studio light. Accurate dot-matrix display, premium product photography, cool clean grade, ultra-realistic, plain numeral + arrow only (no words/logos), no AI artifacts. Aspect ratio 4:3.
- **`product-xn-2100-dot-matrix-display.png`** — …/xn-2100-dot-matrix-display · Aspect 4:3 — *Prompt:* A dot-matrix elevator floor display in an alternative slim fascia format, glowing floor numeral and direction arrow in LED dots, brushed-steel bezel, soft light. Accurate dot-matrix display, premium product photography, cool clean grade, ultra-realistic, plain numeral + arrow only, no AI artifacts. Aspect ratio 4:3.
- **`product-xn-3000-dot-matrix-display.png`** — …/xn-3000-dot-matrix-display · Aspect 4:3 — *Prompt:* A larger dot-matrix elevator position display for long-range legibility, big bright floor numeral and arrow in LED dots behind glass, clean bezel, soft light. Accurate dot-matrix display, premium product photography, cool clean grade, ultra-realistic, plain numeral + arrow only, no AI artifacts. Aspect ratio 4:3.
- **`product-xn-4000-date-time-temperature-display.png`** — …/xn-4000-date-time-temperature-display · Aspect 4:3 — *Prompt:* A dot-matrix elevator display that also shows date, time and temperature alongside the floor numeral and arrow (plain digits like 24°C and a clock, no sentences), behind dark glass, brushed bezel, soft light. Accurate display, premium product photography, cool clean grade, ultra-realistic, digits/symbols only (no words/logos), no AI artifacts. Aspect ratio 4:3.
- **`product-xlcd-01-monochrome-lcd-display.png`** — …/xlcd-01-monochrome-lcd-display · Aspect 4:3 — *Prompt:* A monochrome LCD elevator position indicator with a crisp graphical floor numeral and direction arrow on a grey LCD behind glass, brushed-steel bezel, soft even light. Accurate monochrome LCD, premium product photography, cool clean grade, ultra-realistic, plain numeral + arrow only, no AI artifacts. Aspect ratio 4:3.
- **`product-xlcd-02-monochrome-lcd-display.png`** — …/xlcd-02-monochrome-lcd-display · Aspect 4:3 — *Prompt:* A monochrome LCD elevator display in an alternative size/layout, sharp graphical floor numeral and arrow on grey LCD, brushed bezel, soft light. Accurate monochrome LCD, premium product photography, cool clean grade, ultra-realistic, plain numeral + arrow only, no AI artifacts. Aspect ratio 4:3.
- **`product-xtft-043-tft-display.png`** — …/xtft-043-tft-display · Aspect 4:3 — *Prompt:* A 4.3-inch full-colour TFT elevator display showing a rich but simple floor numeral and arrow with a clean UI (no readable words), vivid screen behind glass in a premium car panel, soft studio light with azure reflection. Accurate colour TFT display, premium product photography, cool clean grade, ultra-realistic, numeral + arrow/icon only (no words/logos), no AI artifacts. Aspect ratio 4:3.

### Voice Announcing Systems → sub-products
- **`product-fa-50-chip-based.png`** — …/fa-50-chip-based · Aspect 4:3 — *Prompt:* A compact chip-based voice-announcement module for elevators — a small PCB with a memory chip, connectors and a tiny speaker — on a clean neutral surface, cool tech light with azure accent. Accurate electronics, premium product-tech photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-fa-250-mp3.png`** — …/fa-250-mp3 · Aspect 4:3 — *Prompt:* An MP3-based elevator voice-announcement module — a slightly larger PCB with a memory-card slot, audio amplifier and speaker connector — on a clean surface, cool tech light with azure glow. Accurate electronics, premium product-tech photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-close-door-announcer.png`** — …/close-door-announcer · Aspect 4:3 — *Prompt:* A small elevator close-door audible alert unit — a compact speaker module with a warning indicator — mounted near a car door header, cool light with a subtle red safety accent. Accurate elevator alert hardware, premium product photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.
- **`product-elevator-gong.png`** — …/elevator-gong · Aspect 4:3 — *Prompt:* An elevator arrival gong unit — a small round chime/speaker device mounted above a landing door, clean brushed surround, soft light. Accurate elevator signalling hardware, premium product photography, cool clean grade, ultra-realistic, no readable text/logos, no AI artifacts. Aspect ratio 4:3.

---

## 6. News & Events (mock newsroom) — aspect ratio **16:9** (≈ 1600×900)

For the **currently mock** `data/news.ts` cards + detail heroes. Regenerate with
real photography when real news is published.

- **`news-serial-can-bus.png`** — /news-events · News card + detail ("Serial CAN bus control panel enters full production") · Aspect 16:9 — *Prompt:* Close cinematic shot of a serial CAN-bus elevator control board with elegant two-wire bus cabling on a clean assembly bench in an Indian factory, azure equipment glow, shallow depth of field. Premium industrial photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 16:9.
- **`news-expo.png`** — /news-events ("Philbrick at the India elevator technology expo") · Aspect 16:9 — *Prompt:* A modern Indian elevator-technology exhibition stand with control panels and door mechanisms on display and professional Indian visitors, bright even hall lighting, corporate energy. Premium event photography, cool clean grade, ultra-realistic, no readable text/logos on signage, no AI artifacts. Aspect ratio 16:9.
- **`news-training.png`** — /news-events ("Installer training program for control and safety systems") · Aspect 16:9 — *Prompt:* An Indian trainer demonstrating elevator control-panel commissioning to a small group of installer technicians around a control cabinet in a clean training room, engaged and hands-on, cool light. Premium documentary photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 16:9.
- **`news-facility-upgrade.png`** — /news-events ("Door-mechanism assembly line upgraded") · Aspect 16:9 — *Prompt:* A modern automated assembly line for elevator door mechanisms in an Indian factory, stainless door panels and header operators moving through stations, clean floor markings, industrial lighting. Premium industrial photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 16:9.
- **`news-ard-safety.png`** — /news-events ("Why every lift benefits from an Automatic Rescue Device") · Aspect 16:9 — *Prompt:* A clean elevator machine area showing an Automatic Rescue Device with a backup battery beside a control cabinet, one calm safety indicator lit, conveying reliability during a power failure, cool light with a subtle red accent. Premium industrial photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 16:9.
- **`news-network.png`** — /news-events ("Growing our component supply network") · Aspect 16:9 — *Prompt:* Two Indian business professionals shaking hands over a table with elevator components and a laptop in a bright modern office, partnership and distribution feel, cool clean light. Premium corporate photography, cool clean grade, ultra-realistic, no text/logos, no AI artifacts. Aspect ratio 16:9.

---

## 7. Call-to-Action Band — aspect ratio **21:9** (≈ 2520×1080)

Full-bleed banner behind the closing CTA on most pages (`CTASection`, dark scrim +
left-aligned heading over it).

- **File name:** `cta-band.png`
- **Page:** Most pages · **Section:** Closing CTA band
- **Aspect ratio:** 21:9
- **Prompt:** Ultra-wide cinematic low-angle shot looking up a modern Indian high-rise facade at dusk with a glass panoramic elevator ascending, warm interior lights against a deep blue evening sky, a sense of upward momentum and ambition, calm left side for text. Premium architectural photography, cool clean grade with warm accents, ultra-realistic, no text or logos, no AI artifacts. Aspect ratio 21:9.

---

## 8. Delivery & wiring — DONE (2026-07-11)

- The 58 supplied images were archived (full-res) to `image-sources/` (git-ignored),
  reorganised into page-wise folders under `public/images/…`, and optimised by
  `scripts/optimizeImages.mjs` into responsive **WebP** width variants + a
  web-sized **PNG** source of record, recorded in `lib/imageManifest.json`.
- Every Unsplash URL is gone: `data/images.ts` was rewritten to local paths (no
  `img()`/`ID`), `data/products.ts` wires per-node category/product images, and
  `data/news.ts` uses `NEWS_IMG`. `lib/imageLoader.ts` rewrites each local `.png`
  request to the nearest pre-generated WebP variant, so next/image keeps full
  responsive `srcset` with no server.
- **All 60 images are now supplied and integrated** (2026-07-11). The Hospitality
  applications card is live and the Synergy category uses its own dedicated cover.

---

## 9. Image Asset Mapping (final implementation)

`Requirement → Page → Section → Final path (delivered as WebP) → Status`
Source of record is the `.png`; the browser receives responsive WebP variants.
**60 / 60 implemented.**

### Page heroes — 16:9
| Ref | Page | Section | Final path | Status |
|-----|------|---------|------------|--------|
| IMG-001 | Products | Page hero | `/images/products/products-hero.png` | ✅ Implemented |
| IMG-002 | About Us | Page hero | `/images/about/about-hero.png` | ✅ Implemented |
| IMG-003 | Vision & Mission | Page hero | `/images/vision-mission/vision-mission-hero.png` | ✅ Implemented |
| IMG-004 | Milestone & Awards | Page hero | `/images/milestone/milestone-hero.png` | ✅ Implemented |
| IMG-005 | Infrastructure | Page hero | `/images/infrastructure/infrastructure-hero.png` | ✅ Implemented |
| IMG-006 | Network | Page hero | `/images/network/network-hero.png` | ✅ Implemented |
| IMG-007 | News & Events | Page hero | `/images/news-events/news-events-hero.png` | ✅ Implemented |
| IMG-008 | Contact | Page hero | `/images/contact/contact-hero.png` | ✅ Implemented |

### Section media — 4:5
| Ref | Page | Section | Final path | Status |
|-----|------|---------|------------|--------|
| IMG-009 | Home | 01 Who we are | `/images/home/who-we-are.png` | ✅ Implemented |
| IMG-010 | About Us | Who we are story | `/images/about/about-story.png` | ✅ Implemented |
| IMG-011 | Infrastructure | Under one roof | `/images/infrastructure/infrastructure-intro.png` | ✅ Implemented |

### Applications — 3:4 (Home · 04 Applications)
| Ref | Item | Final path | Status |
|-----|------|------------|--------|
| IMG-012 | Residential | `/images/home/application-residential.png` | ✅ Implemented |
| IMG-013 | Commercial | `/images/home/application-commercial.png` | ✅ Implemented |
| IMG-014 | Healthcare | `/images/home/application-healthcare.png` | ✅ Implemented |
| IMG-015 | Hospitality | `/images/home/application-hospitality.png` | ✅ Implemented |
| IMG-016 | Industrial | `/images/home/application-industrial.png` | ✅ Implemented |
| IMG-017 | Institutional | `/images/home/application-institutional.png` | ✅ Implemented |
| IMG-018 | Transit | `/images/home/application-transit.png` | ✅ Implemented |

### Product categories — 4:3 (Products · category · mega menu)
| Ref | Category | Final path | Status |
|-----|----------|------------|--------|
| IMG-019 | Elevator Control Panel | `/images/products/elevator-control-panel/elevator-control-panel.png` | ✅ Implemented |
| IMG-020 | Integrated Control Panel | `/images/products/integrated-control-panel/integrated-control-panel.png` | ✅ Implemented |
| IMG-021 | Elevator IoT | `/images/products/elevator-iot/elevator-iot.png` | ✅ Implemented |
| IMG-022 | ARD | `/images/products/ard/ard.png` | ✅ Implemented |
| IMG-023 | Lift Master | `/images/products/lift-master/lift-master.png` | ✅ Implemented |
| IMG-024 | Synergy Auto Door (cover) | `/images/products/synergy-auto-door/synergy-auto-door.png` | ✅ Implemented |
| IMG-025 | Elevator Doors | `/images/products/elevator-doors/elevator-doors.png` | ✅ Implemented |
| IMG-026 | Elevator Cabin | `/images/products/elevator-cabin/elevator-cabin.png` | ✅ Implemented |
| IMG-027 | Elevator Display | `/images/products/elevator-display/elevator-display.png` | ✅ Implemented |
| IMG-028 | COP / LOP | `/images/products/cop-lop/cop-lop.png` | ✅ Implemented |
| IMG-029 | Touch COP / LOP | `/images/products/touch-cop-lop/touch-cop-lop.png` | ✅ Implemented |
| IMG-030 | Voice Announcing Systems | `/images/products/voice-announcing-systems/voice-announcing-systems.png` | ✅ Implemented |
| IMG-031 | Elevator KIT & Accessories | `/images/products/elevator-kit-accessories/elevator-kit-accessories.png` | ✅ Implemented |
| IMG-032 | STEP Products | `/images/products/step-products/step-products.png` | ✅ Implemented |

### Individual products — 4:3 (`/products/<category>/<product>`)
| Ref | Product | Final path | Status |
|-----|---------|------------|--------|
| IMG-033 | Automatic Door Controller | `/images/products/elevator-control-panel/automatic-door-controller.png` | ✅ Implemented |
| IMG-034 | Manual Door Controller | `/images/products/elevator-control-panel/manual-door-controller.png` | ✅ Implemented |
| IMG-035 | Hydraulic Controller | `/images/products/elevator-control-panel/hydraulic-controller.png` | ✅ Implemented |
| IMG-036 | Parallel Type Controller | `/images/products/integrated-control-panel/parallel-type-controller.png` | ✅ Implemented |
| IMG-037 | Serial CAN Bus Type Controller | `/images/products/integrated-control-panel/serial-can-bus-type-controller.png` | ✅ Implemented |
| IMG-038 | MRL Control Panel | `/images/products/integrated-control-panel/mrl-control-panel.png` | ✅ Implemented |
| IMG-039 | 2 Panel Centre Opening | `/images/products/synergy-auto-door/2-panel-centre-opening.png` | ✅ Implemented |
| IMG-040 | 2 Panel Telescopic / Side Opening | `/images/products/synergy-auto-door/2-panel-telescopic-side-opening.png` | ✅ Implemented |
| IMG-041 | 4 Panel Centre Opening | `/images/products/synergy-auto-door/4-panel-centre-opening.png` | ✅ Implemented |
| IMG-042 | XN-1000 LED Segment | `/images/products/elevator-display/xn-1000-led-segment-display.png` | ✅ Implemented |
| IMG-043 | XN-2000 Dot Matrix | `/images/products/elevator-display/xn-2000-dot-matrix-display.png` | ✅ Implemented |
| IMG-044 | XN-2100 Dot Matrix | `/images/products/elevator-display/xn-2100-dot-matrix-display.png` | ✅ Implemented |
| IMG-045 | XN-3000 Dot Matrix | `/images/products/elevator-display/xn-3000-dot-matrix-display.png` | ✅ Implemented |
| IMG-046 | XN-4000 Date/Time/Temp | `/images/products/elevator-display/xn-4000-date-time-temperature-display.png` | ✅ Implemented |
| IMG-047 | XLCD-01 Monochrome LCD | `/images/products/elevator-display/xlcd-01-monochrome-lcd-display.png` | ✅ Implemented |
| IMG-048 | XLCD-02 Monochrome LCD | `/images/products/elevator-display/xlcd-02-monochrome-lcd-display.png` | ✅ Implemented |
| IMG-049 | XTFT-043 TFT | `/images/products/elevator-display/xtft-043-tft-display.png` | ✅ Implemented |
| IMG-050 | FA-50 Chip Based | `/images/products/voice-announcing-systems/fa-50-chip-based.png` | ✅ Implemented |
| IMG-051 | FA-250 MP3 | `/images/products/voice-announcing-systems/fa-250-mp3.png` | ✅ Implemented |
| IMG-052 | Close Door Announcer | `/images/products/voice-announcing-systems/close-door-announcer.png` | ✅ Implemented |
| IMG-053 | Elevator Gong | `/images/products/voice-announcing-systems/elevator-gong.png` | ✅ Implemented |

### News & Events — 16:9 (mock newsroom)
| Ref | Item | Final path | Status |
|-----|------|------------|--------|
| IMG-054 | Serial CAN bus in production | `/images/news-events/news-serial-can-bus.png` | ✅ Implemented |
| IMG-055 | India elevator technology expo | `/images/news-events/news-expo.png` | ✅ Implemented |
| IMG-056 | Installer training program | `/images/news-events/news-training.png` | ✅ Implemented |
| IMG-057 | Door-mechanism line upgrade | `/images/news-events/news-facility-upgrade.png` | ✅ Implemented |
| IMG-058 | Why every lift benefits from an ARD | `/images/news-events/news-ard-safety.png` | ✅ Implemented |
| IMG-059 | Growing our supply network | `/images/news-events/news-network.png` | ✅ Implemented |

### Call to action — 21:9
| Ref | Scope | Final path | Status |
|-----|-------|------------|--------|
| IMG-060 | Shared CTA band (most pages) | `/images/shared/cta-band.png` | ✅ Implemented |

### Regenerating / adding images later
To change or add an image: drop the PNG at its final page-wise path, run
`node scripts/optimizeImages.mjs` (regenerates the WebP variants + manifest), then
reference it via `data/images.ts` / `data/products.ts` / `data/news.ts`. See the
image-asset rule in `CLAUDE.md`.

**Source PNGs are required — do not delete them.** Each `.png` is the `og:image`
(social share card) and the Product/Article JSON-LD (SEO) image for its page:
crawlers fetch the raw `.png` URL directly, without the WebP loader. Normal
visitors only ever download the small WebP variants.

---

## 10. Cinematic Hero Video — scroll sequence (video-generation prompt suite)

**Status: prompts ready · generation pending.** One continuous cinematic shot
that replaces the procedural Three.js hero: a night city establishes the world,
the camera pushes forward in a single unbroken move toward the main tower,
through its glass lobby, into the waiting elevator, and — once inside — reveals
the elevator's components one by one. Stitched together, the clips become a
**scroll-scrubbed video hero**: page scroll drives the playhead, so the story
beats land exactly where the current 3D hero's beats land (arrival → approach →
threshold → the call → inside → components).

### 10.0 Production strategy (read before generating)

- **Why multiple prompts:** no current video model reliably holds one identical
  building, elevator, cabin and light rig across ~50 seconds of complex motion
  in a single generation. The sequence is therefore **6 chained clips of ~8 s**
  (48 s total at 24 fps). If your tool generates ≥ 50 s continuous shots with
  start-frame conditioning, use the single-prompt variant in §10.9 instead.
- **The chaining rule (this is what makes it seamless):** generate the clips in
  order. After each clip, **export its final frame as a PNG** and supply it as
  the **start frame / image-conditioning input** of the next clip, together
  with that clip's prompt. Every clip's prompt below begins with the same
  **MASTER CONSISTENCY BLOCK (§10.1) pasted verbatim** — the start frame pins
  the geometry; the master block pins the style; the per-clip "START STATE"
  and "END STATE" lines pin the motion continuity. If the tool has an "extend
  video" mode, prefer extending over fresh generations.
- **Fixed camera grammar (identical in every clip):** ONE continuous move, no
  cuts. Translation is always straight forward along the same axis (due
  "north" into the scene). Eye height locks at 1.60 m once the camera reaches
  the ground. Speed is slow and constant within each beat — no speed ramps, no
  shake, no rack-focus tricks. Lens: 35 mm spherical (no anamorphic ovals),
  f/4 exterior, f/2.8 interior, 24 fps, 180° shutter. Inside the cabin,
  forward translation decays to zero and the ONLY remaining motion is one
  slow, continuous **clockwise** pan — a single rotational direction, never
  reversing (§10.7–10.8).
- **Deliverables:** 16:9, 3840×2160, 24 fps, highest bitrate offered. Keep the
  tower/elevator centred so a 9:16 centre crop survives for mobile. Name the
  files `hero-clip-01.mp4 … hero-clip-06.mp4`; final stitch
  `philbrick-hero-full.mp4` → they will live in `public/videos/hero/`.
- **Post:** stitch at 24 fps; one shared LUT/grade across all clips; a 2–3
  frame cross-blend at each joint hides residual seam drift. Do not colour
  grade clips individually.
- **Branding:** every prompt forbids readable text and logos. The Philbrick
  wordmark on the elevator header is **composited in post** from
  `public/brand/logo.png` (AI-generated lettering would drift between clips —
  the same reason the site's 3D decal uses the real file).

### 10.1 MASTER CONSISTENCY BLOCK — paste verbatim at the top of EVERY prompt

> Ultra-realistic cinematic architectural film, physically-based materials,
> filmic contrast, deep clean blacks, restrained highlights. Cool, clean colour
> grade with two fixed accents: azure-blue #109BDD for all indicator lights,
> displays and cool practicals; warm amber (approx #FFC57A) for interior
> architectural lighting and lit windows. Clear, dry night; no fog, no rain, no
> wind debris; a full moon fixed high in the upper-right sky; the scene is
> deserted — no people, no animals, no moving vehicles.
>
> THE MAIN TOWER (identical in every shot): a slender 34-storey rectangular
> tower, graphite-aluminium mullions and vertical fins, floor-to-ceiling glass
> with warm amber light glowing from scattered occupied floors, a dark stone
> podium, a double-height ground-floor lobby in clear glass, and one thin steel
> entrance canopy. No signage, lettering or flags anywhere. It is flanked by
> shorter, cooler-lit background towers left and right that never change.
>
> THE ELEVATOR (identical in every shot): a single elevator centred on the
> lobby's far wall. Brushed stainless-steel two-panel CENTRE-OPENING doors with
> fine vertical brush grain, a graphite door frame, and above the doors a slim
> azure dot-matrix floor-position display showing only a numeral and an up
> arrow. A soft warm downlight washes the doors.
>
> THE CABIN (identical in every shot): interior about 2.0 m wide and 2.6 m
> high. Brushed stainless side walls; a full-width MIRROR back wall with one
> slim brushed handrail at 0.9 m; a dark stone floor; a warm LED ceiling light
> cove around a central panel. On the front-right return pillar beside the
> doors: a brushed-steel car-operating panel (COP) with one vertical column of
> round tactile buttons with soft white halo rings and a small azure display at
> its top. Inside, above the doors, a matching azure floor indicator. All metal
> shows realistic anisotropic brushing and true reflections.
>
> CAMERA GRAMMAR: one continuous unbroken shot, 35 mm spherical lens, 24 fps,
> eye height 1.60 m at ground level, slow constant speed, translation ONLY
> straight forward along one axis; no cuts, no shake, no speed ramps, no zooms.
>
> NEGATIVE — strictly avoid: cuts, scene changes, fades, camera direction
> reversal, teleporting; people, faces, animals, birds, moving vehicles;
> readable text, words, logos, signage, flags (the ONLY glyphs allowed are the
> floor display's single numeral and arrow); rain, fog, lightning, or any
> time-of-day change; lens flare bloom, fisheye or anamorphic distortion;
> warped, melting or morphing architecture; flickering lights; changes to the
> tower's height, facade, canopy, lobby, elevator doors, display, cabin
> materials, colours or layout between frames; cartoon, CGI-toy or video-game
> look.

### 10.2 VID-001 · Clip 1 "The City" — 8 s
- **File:** `hero-clip-01.mp4` · 16:9 · 24 fps
- **START STATE:** camera hovering 12 m above a broad, empty granite boulevard,
  90 m from the main tower, looking straight down the boulevard's axis; the
  tower dead-centre ahead, flanking towers framing it like a canyon; moon upper
  right.
- **CAMERA:** begin a slow, perfectly straight forward dolly (~1.5 m/s) while
  descending on a smooth linear ramp from 12 m toward 6 m; no pan, no tilt
  beyond the gentle downward-settling horizon; f/4, focus at infinity.
- **BEATS:** 0–3 s the skyline breathes (windows glow warm amber, azure
  aviation beacons blink on distant roofs); 3–8 s the main tower slowly grows
  to dominate the frame; its lit double-height lobby becomes visible at street
  level as a warm band under the canopy.
- **END STATE (freeze for clip 2):** camera 55 m from the entrance at 6 m
  height, still centred on the axis; the full tower fills the upper frame, the
  glowing lobby band centred low; boulevard leading lines converge on the
  entrance.

### 10.3 VID-002 · Clip 2 "The Approach" — 8 s
- **File:** `hero-clip-02.mp4` · start frame = final frame of clip 1
- **START STATE:** exactly the clip-1 end state above.
- **CAMERA:** continue the identical forward dolly (~1.2 m/s), descending
  smoothly from 6 m to lock at eye height 1.60 m by 6 s; f/4 easing focus from
  infinity to the entrance glass.
- **BEATS:** 0–4 s the canopy edge slides overhead into the top of frame; the
  lobby interior resolves through the glass — stone floor, warm cove lighting,
  and far ahead, small but already visible, the brushed-steel elevator doors
  with their azure display; 4–8 s the entrance's clear-glass double doors part
  silently outward as the camera nears (an automatic entrance), never breaking
  stride.
- **END STATE (freeze for clip 3):** camera 18 m from the elevator wall, at
  1.60 m, exactly on axis, half a metre outside the entrance plane; open glass
  doors framing the shot left and right; the elevator centred ahead with its
  azure display reading a single numeral "G" with no arrow.

### 10.4 VID-003 · Clip 3 "The Threshold" — 8 s
- **File:** `hero-clip-03.mp4` · start frame = final frame of clip 2
- **START STATE:** exactly the clip-2 end state above.
- **CAMERA:** same forward dolly, slowing to ~0.9 m/s as the space compresses;
  aperture opens to f/2.8 as interior light takes over; eye height constant.
- **BEATS:** 0–2 s the camera crosses the entrance plane — exterior night
  sounds fall away visually: reflections of the boulevard slide off the glass
  as warm interior light wraps the frame; 2–8 s the lobby reveals itself while
  passing through: dark stone floor with soft mirror-like sheen, a hairline of
  azure cove light along the ceiling, two plain graphite columns passing left
  and right at 4 s and 6 s; the elevator doors grow steadily, their brushed
  grain and the warm downlight wash now clearly readable.
- **END STATE (freeze for clip 4):** camera 10 m from the elevator, centred;
  the doors occupy the middle third of frame; display reads "G"; everything
  else calm and symmetrical.

### 10.5 VID-004 · Clip 4 "The Call" — 8 s
- **File:** `hero-clip-04.mp4` · start frame = final frame of clip 3
- **START STATE:** exactly the clip-3 end state above.
- **CAMERA:** the same forward glide, decelerating gently from 0.9 m/s to
  0.5 m/s; f/2.8; focus locked on the door seam.
- **BEATS:** 0–2 s the azure display's up arrow illuminates beside the "G"
  (the car answering the call); 2–5 s at ~4 m out, the two stainless panels
  part from the centre in one smooth, mechanically believable motion — fine
  brush grain catching the downlight, the dark seam widening symmetrically;
  the warm cabin interior and its mirror back wall are revealed, reflecting
  the approaching lobby; 5–8 s the camera glides through the fully open doors
  to the cabin threshold without touching either panel.
- **END STATE (freeze for clip 5):** camera exactly in the door plane at
  1.60 m; the cabin interior fills the frame: mirror back wall with handrail,
  stainless side walls, stone floor, warm ceiling cove; in the mirror, the
  camera-side lobby glows behind; the COP column of halo-lit buttons visible
  on the front-right return pillar at the frame's right edge.

### 10.6 VID-005 · Clip 5 "Inside" — 8 s
- **File:** `hero-clip-05.mp4` · start frame = final frame of clip 4
- **START STATE:** exactly the clip-4 end state above.
- **CAMERA:** forward drift decays smoothly from 0.4 m/s to a full stop at the
  cabin's centre by 3 s — the LAST forward translation of the sequence; after
  the stop the camera is perfectly still; f/2.8, focus on the mirror wall.
- **BEATS:** 0–3 s entering: the ceiling cove's warm light slides over the
  frame's top edge; the stone floor's reflection passes below; 3–6 s in the
  MIRROR the two door panels glide shut behind the camera in one clean motion,
  sealing the warm cabin; 6–8 s the reflected azure indicator above the doors
  ticks from "G ▲" to "1 ▲" and a barely perceptible downward light-sweep
  over the brushed walls sells the ascent beginning — the cabin itself never
  shakes.
- **END STATE (freeze for clip 6):** camera static at cabin centre facing the
  mirror; doors closed (seen in reflection); indicator reflected as "2 ▲";
  composition calm, symmetrical, softly lit.

### 10.7 VID-006 · Clip 6 "The Machine, Revealed" — 8 s
- **File:** `hero-clip-06.mp4` · start frame = final frame of clip 5
- **START STATE:** exactly the clip-5 end state above.
- **CAMERA:** zero translation. One slow, perfectly continuous **clockwise
  pan** (yaw only, ~45°/s peak, easing at both ends) — the single rotational
  move of the whole film, never reversing; f/2.8.
- **BEATS — the component reveals, one per arc:**
  - 0–2 s (0°→90°): panning off the mirror across the RIGHT stainless side
    wall — anisotropic brushing and the handrail's end catch the cove light
    (reveal: cabin wall finish + handrail).
  - 2–4.5 s (90°→170°): the front-right return pillar enters frame — the
    brushed-steel COP in close view: the vertical column of round tactile
    buttons with soft white halos, its small azure display glowing at top; one
    button's halo brightens as if just pressed (reveal: COP).
  - 4.5–6.5 s (170°→180°, settling): the closed doors dead-centre; above them
    the azure dot-matrix indicator counting "6 ▲ … 7 ▲"; beneath the ceiling
    line, the slim graphite door-operator header reads as precise machinery
    (reveal: doors, display, door-operator header).
  - 6.5–8 s (locked at 180°): the indicator settles on "8" and the arrow
    blinks off — arrival; the two panels begin to part from the centre,
    revealing a dim, elegant sky-lobby and a wall of night-city lights beyond
    glass (the end frame invites the page content below).
- **END STATE (final frame of the film):** doors one-third open on the glowing
  night skyline, camera still, cabin's warm light spilling forward — a
  composition that dissolves cleanly into the page content.

### 10.8 Why the cabin pan does not break the "one direction" rule
The film has exactly two motions, each in one unwavering direction: a single
straight-forward translation (clips 1–5) and, only after translation fully
stops, a single clockwise rotation (clip 6). Neither ever reverses, jumps or
mixes — this is the same "one consistent flow" the scroll hero needs, and it is
the only practical way to show components mounted on three different cabin
walls without cuts.

### 10.9 Single-prompt variant (only for tools that hold ≥ 50 s with one shot)
Paste the MASTER CONSISTENCY BLOCK (§10.1), then:

> One continuous unbroken 50-second shot, 16:9, 24 fps. Begin 12 m above a
> deserted granite boulevard at night, 90 m from the main tower, centred on its
> axis. Dolly straight forward the entire film, first descending smoothly to
> lock at 1.60 m eye height. The tower grows; its thin steel canopy passes
> overhead; the double-height glass entrance parts automatically; continue
> without pause through the warm stone lobby, straight toward the single
> brushed-steel centre-opening elevator on the far wall, its azure display
> reading "G". As the camera nears, the arrow lights, the panels part from the
> centre, and the camera glides inside, easing to a complete stop at the cabin
> centre facing the mirror back wall. In the mirror the doors close and the
> azure indicator begins counting upward with a soft downward light-sweep. With
> translation fully stopped, perform one slow continuous clockwise pan: across
> the brushed right wall and handrail, onto the COP's halo-lit round buttons
> and small azure display, settling on the closed doors and their counting
> indicator with the slim door-operator header above. On "8" the arrow blinks
> off and the doors part onto a dim sky-lobby with a wall of night-city lights.
> End with the doors one-third open, camera still.

### 10.10 After generation — QA + integration checklist
1. Verify per clip: identical tower/facade/canopy, identical door grain and
   frame, identical cabin materials, moon fixed upper-right, palette unchanged,
   no text/logos anywhere, no people/vehicles, no cuts or shakes.
2. Verify at each joint: the first frame of clip N+1 matches the last frame of
   clip N (geometry + exposure) before stitching; a 2–3 frame blend hides
   residual drift.
3. Grade once (single LUT), stitch to `philbrick-hero-full.mp4` (24 fps, H.265
   + H.264 fallback, ~12–16 Mbps), plus a 960-wide preview encode for mobile
   data saver.
4. Composite the Philbrick wordmark (`public/brand/logo.png`) onto the door
   header in clips 4–6 in post, tracked to the header plane — never
   AI-generated lettering.
5. Deliver to `public/videos/hero/`; integration (scroll-scrubbed playback
   replacing/augmenting `ElevatorScene`) is a separate implementation task —
   raise it when the final video is approved.

---

## 11. Exploration Hero assets — exploded component tour (LIVE with interim art)

**Status: hero SHIPPED 2026-07-16 with interim art · final assets pending.**
The homepage hero (`sections/experience/ExplorationHero.tsx`) is a scroll-driven
exploded component tour: the assembled machine stands centred, and as the user
scrolls each component flies out to its catalogue position with a leader line
and label. Interim art = the built-in blueprint SVG spine + the 8 real part
photos (`public/images/3D_Elevetor`) framed as component cards. The final look
swaps in the assets below. All layout is config only (`data/heroExploration.ts`).

### 11.1 Folder structure (drop assets exactly here)

```
public/images/home/hero-exploration/
  spine/
    elevator-cutaway.png        # the central assembled system (see 11.2)
  components/                   # one TRANSPARENT cutout per part (see 11.3)
    01-control-panel-ard.png
    02-overload-device.png
    03-door-operator.png
    04-fan-blower.png
    05-traction-machine.png
    06-floor-announcing-system.png
    07-cop-lop-display.png
    08-safety-light-curtain.png
    09-lift-display.png
    10-landing-door.png
    11-accessories.png
```

Then run `node scripts/optimizeHeroExploration.mjs` (writes WebP variants next
to each PNG and MERGES them into `lib/imageManifest.json`), update
`data/heroExploration.ts` (SPINE config + part image paths + `treatment:
"cutout"`), and keep the source PNGs (CLAUDE.md image rule).

> Pipeline caveat: `scripts/optimizeImages.mjs` rebuilds the manifest from
> scratch — after running it, re-run BOTH `scripts/optimize3DElevator.mjs` and
> `scripts/optimizeHeroExploration.mjs` to restore their merged entries.

### 11.2 Center elevator (spine) — generation prompt
- **Status: SUPPLIED + INTEGRATED (2026-07-16).** Client render (1024x1536,
  grey studio backdrop) processed with feathered alpha edges so it melts into
  the stage; wired via `SPINE` in `data/heroExploration.ts`. Original archived
  at `image-sources/home/hero-exploration/elevetorhero-original.png`. A future
  re-render with a TRUE transparent background (prompt below) can replace it
  at the same path for an even cleaner cutout, especially in light theme.
- **File:** `spine/elevator-cutaway.png` · tall portrait (2:5 to 9:16), ≥1600px
  tall, **transparent background PNG**
- **Prompt:**

> Ultra realistic cinematic industrial product render of a complete traction
> elevator system shown as a tall vertical technical cutaway, viewed straight
> on, centred, for a premium engineering website hero. At the top a compact
> machine room platform with a geared traction machine: electric motor, brake
> and steel wire ropes running over a sheave. Below it an open steel hoistway
> frame with two vertical T section guide rails, an overspeed governor, and a
> framed counterweight running beside a brushed stainless passenger car with a
> warm softly lit interior and a slim door operator header. At the bottom a
> service pit with two spring buffers and a small maintenance ladder. Photoreal
> brushed steel, anodised aluminium, cast iron, copper cabling, realistic
> reflections, soft volumetric key light from the upper left, cool rim light.
> TRANSPARENT BACKGROUND: a true alpha PNG cutout with no backdrop, no floor,
> no wall, no cast ground shadow. No people. Absolutely no text, numbers,
> labels, arrows, callout lines or logos. Tall portrait composition, the
> machine fills the frame with a small margin on every side.

### 11.3 Component cutouts — the 8 live-tour prompts (+ extended set)

**Status: SUPPLIED + INTEGRATED (2026-07-16).** 7 of 8 arrived as true-alpha
cutouts and are live (trimmed + 16px margin in-pipeline; originals archived in
`image-sources/home/hero-exploration/components-original/`).
`07-interior-design` arrived with a painted checkerboard background — cropped
to the cabin and kept as a framed card (a room reads well framed); regenerate
with real transparency to make it a bare cutout too.

**Files (drop into `components/`, exact names):** `01-traction-machine.png`,
`02-security-key-switch.png`, `03-door-mechanism.png`,
`04-car-operating-panel.png`, `05-safety-system.png`, `06-display-screen.png`,
`07-interior-design.png`, `08-emergency-call.png` — one per part currently in
the tour (full prompts delivered 2026-07-16, chat; each = the template below
with that part's description; traction machine gets a yellow painted sheave and
the safety unit yellow accents to tie into the spine render). The extended
catalogue parts (overload device, fan and blower, floor announcing,
accessories) reuse the same template when the tour grows to 11.

### Template — per-part requirements + prompt
Every component image must be: **true alpha transparent PNG**, a single
component only, ≥1200px on the long edge, ~5% padding on all sides, the SAME
key light direction (upper left) and the same slightly front-on perspective in
every render, no baked ground shadows, no text or labels. Consistency across
the set matters more than any single image.

- **Prompt template** (swap the [PART] description per file):

> Ultra realistic industrial product photograph style render of a single
> elevator [PART], isolated on a TRANSPARENT background (true alpha PNG cutout,
> no backdrop, no shadow), viewed slightly from the front, soft volumetric key
> light from the upper left, cool rim light, photoreal brushed steel and
> engineering materials, premium product catalogue quality. No text, numbers,
> labels, arrows or logos.

- **[PART] descriptions:** control panel cabinet with VVVF drive, contactors,
  circuit boards and the automatic rescue device (door open showing the
  interior) · overload weighing device with load cell bracket · belt driven
  door operator with motor, toothed belt, track and arms · compact cabin axial
  ventilation fan · geared traction machine with motor, sheave and brake ·
  green floor announcing circuit board with a small speaker · brushed stainless
  COP LOP panel with round halo lit buttons and a colour LCD · pair of slim
  vertical safety light curtain strips with controller cable · LED dot matrix
  and colour TFT lift display modules · brushed stainless two panel landing
  door with frame · small elevator accessory hardware set.

### 11.4 Environment matte set — variant5 / variant6 (SUPPLIED + INTEGRATED 2026-07-17)

**Status:** all four assets supplied by the client, processed (gray halo
attenuation on tower/skyline, trim, door leaf cropped out of its glow field;
originals archived in `image-sources/home/hero-exploration/environment-original/`)
and integrated: variant5 uses tower + skyline + door leaves (its lobby stays
real 3D geometry for parallax); variant6 uses all four via its `MATTES` map.
Processed aspects: tower 0.248 · skyline 3.046 · lobby 0.679 · leaf 0.321.

Original spec (kept for regeneration):

The variant5 hero (`sections/experience/variants/Variant5Scene.tsx`) currently
builds its night world procedurally, which reads as a mockup next to the real
renders. The fix is the same technique that made the products real: photoreal
TRANSPARENT image planes, staged like film matte paintings. Four assets:

**Folder:** `public/images/home/hero-exploration/environment/` (the optimize
script scans recursively — run `node scripts/optimizeHeroExploration.mjs`
after dropping the PNGs).

- **`tower-night.png`** · tall portrait (9:16 or 2:3), ≥1600px tall, TRUE
  transparent background · the §10.1 main tower, straight on, night; warm
  amber lit windows scattered across a dark glass and aluminium facade; a dark
  stone podium with a glowing double height glass lobby centred at street
  level and one thin steel entrance canopy. The lobby entrance MUST sit
  centred at the bottom edge. No text, logos, signage or people.
- **`skyline-strip.png`** · wide (21:9 or wider), ≥2000px wide, TRUE
  transparent background · a row of varied dark high rise silhouettes at
  night, dimmer and cooler than the main tower, scattered warm windows,
  transparent sky above the rooflines. Used twice (mirrored) at different
  depths, so avoid a recognisable landmark shape. No text or logos.
- **`lobby-backdrop.png`** · 16:9, ≥1920px wide, full bleed (no transparency
  needed) · a premium night lobby interior seen straight on: dark polished
  stone floor, warm downlights, and a brushed stainless elevator portal
  centred with an OPEN, completely DARK doorway (no doors, no cabin visible —
  pure black opening; the door leaves ship separately). An azure indicator
  above the portal showing a simple up arrow only. No text, logos or people.
- **`door-leaf.png`** · tall portrait (~1:3), ≥1400px tall, TRUE transparent
  background · a single brushed stainless elevator door leaf, perfectly
  front on, flat lighting consistent with the lobby backdrop. It will be
  mirrored into the centre opening pair and slid apart in 3D.

**Shared style block for all four prompts:** ultra realistic night
architectural photography style, clear dry night, azure #109BDD used only for
indicator light accents, warm amber #FFC57A for interior and window light,
photoreal materials, no text, no lettering, no logos, no signage, no people,
no vehicles. For transparent assets: true alpha PNG cutout, no backdrop, no
ground shadow.

### 11.5 Variant 6 "The original, photoreal" — asset mapping

`/variant6` (sections/experience/variants/Variant6Scene.tsx) remakes the
original homepage journey with photoreal imagery. It consumes:
- the machine + 8 component cutouts (§11.1 to §11.3 — already shipped), and
- the §11.4 environment matte set: `tower-night.png`, `skyline-strip.png`
  (used mirrored at two depths), `lobby-backdrop.png`, `door-leaf.png`
  (mirrored into the centre opening pair, slid apart in 3D).

Until those four land, the scene renders clean procedural stand-ins. To
activate a matte: drop the PNG in
`public/images/home/hero-exploration/environment/`, run
`node scripts/optimizeHeroExploration.mjs`, then set that asset's
`ready: true` (and correct `aspect`) in the `MATTES` map (variant5 only —
variant6 was later rebuilt as a direct duplicate of ElevatorScene, see §11.6).


### 11.6 Variant 6 — exact ElevatorScene duplicate with real imagery (2026-07-17)

`/variant6` was rebuilt (superseding the earlier matte-slot version) as a
verbatim copy of the homepage hero `sections/experience/ElevatorScene.tsx`
(`sections/experience/Variant6ElevatorScene.tsx`, export
`Variant6ElevatorScene`). The night-city arrival, dolly-zoom, threshold,
camera choreography, day/night cycle, postprocessing and outro are byte
identical. Two clearly-marked "V6 BLOCK" edits are the only difference:
- BLOCK 1 (after the car build): hides the modelled interior detail
  (`cop`, `sidePanels`, `backMirror`, `handrail`) and hangs the real renders —
  the cutaway machine (`SPINE_ASSET`) at cabin centre and the 8 component
  cutouts (`PART_ASSETS`) at their `FRAMING` anchors, unlit + billboarded +
  depthTest off.
- BLOCK 2 (in `pose`, before `updateHotspots`): billboards each plane and
  fades each component in when it becomes the active component; the spine
  reveals as the camera settles inside and returns for the outro.
No new image assets — it reuses the machine + 8 component renders already
shipped (§11.1–§11.3). Env mattes (§11.4) are NOT used by variant6.

### 11.7 Variant 16 hero background pair (theme-swapped city skyline)

`/variant16` = variant15 with a full-bleed city photograph behind the hero that
follows the theme toggle (light theme → day photo, dark theme → night photo,
cross-faded in CSS by `[data-theme]`; no JS).

**Status: SUPPLIED** (2026-07-21). Both photos are in place at 1535 x 1024 and
optimized to WebP at 384/640/960/1280.

**Files** (normal photos, NO transparency), landscape, placed in
`public/images/home/hero-exploration/environment/`:

| File | Used in | Prompt |
| --- | --- | --- |
| `hero-city-day.png` | light theme | bright daylight skyline across water |
| `hero-city-night.png` | dark theme | night skyline across water, lit towers |

Composition constraint for BOTH: the hero is now a single CENTRED content block
over the full-bleed photo (the right-hand product spotlight was removed on
client direction), so the frame needs a calm, uncluttered middle band; keep the
densest towers to one side. No text, logos, people, boats or watermarks.

Day prompt:
"Ultra realistic wide photograph of a modern city business district skyline seen
across calm open water on a bright clear day, clusters of glass and steel high
rise towers, soft blue sky with a few light clouds, gentle reflections on the
water surface, crisp clean daylight, airy and optimistic. Wide cinematic
landscape composition, the tallest towers grouped right of centre, open sky and
calm water on the left. Photoreal, high resolution, premium corporate feel. No
text, no logos, no people, no boats, no watermarks."

Night prompt:
"Ultra realistic wide photograph of a modern city skyline at night seen across
dark calm water, deep navy black sky, high rise towers brightly lit with warm
and cool window lights, glowing reflections shimmering on the water, dramatic
and premium. Wide cinematic landscape composition, tower cluster right of
centre, deep calm darkness on the left. Photoreal, high resolution, moody and
elegant, rich contrast. No text, no logos, no people, no boats, no watermarks."

Because these live under `hero-exploration/`, regenerate them with
`node scripts/optimizeHeroExploration.mjs`. If you also run
`node scripts/optimizeImages.mjs`, run it FIRST and the hero exploration script
afterwards: the exploration script MERGES its entries into the same manifest and
a plain optimizeImages run drops them. Re-run the exploration script whenever a
photo is replaced under the same filename, or the stale WebP variants stay.

### 11.8 Variant 18 tower cutout (derived, no new artwork)

`/variant18` = variant17 with the hero recomposed: the headline sits high in the
open sky and only the building's PEAK reaches it, taking a character or two out
of the last line. Variant17's `hero-tower-{day,night}.png` cannot drive that
composition, because the building is a thin column of opaque pixels inside a
1024 x 1536 plate whose transparent padding does the positioning — with
`object-fit: contain` the tower's width and its peak height are locked together,
so the peak can only be lowered by making the building thinner.

**Status: DERIVED (2026-07-22).** Nothing new was generated or repainted. The
plates are trimmed to the building itself so width and peak height can be set
independently, and the top edge of the image becomes the peak.

| File | Derived from | Used in |
| --- | --- | --- |
| `hero-tower-cut-day.png` | `hero-tower-day.png` | `/variant18`, light theme |
| `hero-tower-cut-night.png` | `hero-tower-night.png` | `/variant18`, dark theme |

Both live in `public/images/home/hero-exploration/environment/`.

**Crop:** `scripts/cropHeroTower.mjs` measures the alpha bounds of both plates,
takes their union plus a 6px bleed, and extracts that ONE box from both, so the
day and night cutouts stay pixel-aligned and the CSS cross-fade never shifts.
The current box is `left 452, top 447, 228 x 1089` (aspect 0.2094). The intrinsic
size is repeated in `Variant18Hero.tsx` as `CUT`, because the images are rendered
with explicit `width`/`height` rather than `fill`.

Regenerate after either source plate is replaced:

```bash
node scripts/cropHeroTower.mjs
node scripts/optimizeHeroExploration.mjs
```

The same manifest caveat as §11.7 applies: a plain `optimizeImages.mjs` run drops
these entries, so run the exploration script after it.

### 11.9 Variant 18 foreground skyline plate (REQUESTED from the client)

**Status: NOT SUPPLIED.** `Variant18Hero.tsx` has the layer wired behind a flag,
`HAS_FRONT_PLATE`. Flip it to `true` once both files below are in place; until
then the single cropped tower from §11.8 stands in.

The effect: the hero headline runs BEHIND the front row of towers, so the
skyline crosses the letters wherever it naturally falls. The `<h1>` stays real
markup — the occlusion is done by stacking, never by baking words into artwork.

| File | Theme | Pairs with |
| --- | --- | --- |
| `hero-front-day.png` | light | `hero-city-day.png` |
| `hero-front-night.png` | dark | `hero-city-night.png` |

Both go in `public/images/home/hero-exploration/environment/`.

**Hard requirements** (alignment is the whole game here):

1. **Transparent PNG.** Only the front row of towers is opaque. Sky, distant
   towers, water and everything else must be fully transparent.
2. **Exactly 1535 x 1024**, the same frame as `hero-city-day.png`. Same camera,
   same horizon line, same perspective. The plate is laid over the photo at
   `inset: 0`, so any difference in framing shows immediately as a double
   skyline.
3. **Day and night must be geometrically identical.** Same towers, same pixels,
   only the lighting differs — the two cross-fade on the theme toggle, and any
   shift makes the buildings jump.
4. Keep an **open middle band**: the tallest towers grouped left and right of
   centre so the middle of the headline stays readable. One or two towers may
   cross the centre — that is the point — but not a solid wall.
5. Buildings should reach the BOTTOM edge of the frame. The plate is
   `object-fit: cover, bottom center`, so a gap at the base leaves them floating.
6. No text, no logos, no people, no watermarks.

Day prompt:
"Ultra realistic photograph of the front row of a modern city business district,
tall glass and steel high rise towers seen from across calm water on a bright
clear day, crisp daylight, soft reflections on the glass. ONLY the nearest row
of buildings, cut out on a fully transparent background, no sky, no background
buildings, no water. Buildings extend to the bottom edge of the frame. Tallest
towers grouped left and right of centre with an open gap through the middle.
Photoreal, high resolution, premium corporate feel. No text, no logos, no
people, no watermarks. Transparent PNG."

Night prompt:
"Ultra realistic photograph of the front row of a modern city business district
at night, tall high rise towers brightly lit with warm and cool window lights,
dramatic and premium. ONLY the nearest row of buildings, cut out on a fully
transparent background, no sky, no background buildings, no water. Buildings
extend to the bottom edge of the frame. Identical buildings, identical
positions and identical framing to hero-front-day.png — only the lighting
changes. Photoreal, high resolution, moody and elegant. No text, no logos, no
people, no watermarks. Transparent PNG."

If the generator cannot match the existing photograph's framing, supply a
matched SET instead — a new background (sky and distant skyline, no front row)
plus its front-row plate, generated from one scene — and the background pair in
§11.7 is swapped for it.

After the files land:

```bash
node scripts/optimizeHeroExploration.mjs
```

then set `HAS_FRONT_PLATE = true` in `Variant18Hero.tsx`. Same manifest caveat
as §11.7: a plain `optimizeImages.mjs` run drops these entries, so run the
exploration script after it.

### 11.10 Variant 18 single-scene hero plates (sky + buildings + headline)

**Status: PROMPTS ONLY — files not supplied yet.** Target filenames:
`hero-scene-day.png` and `hero-scene-night.png`, in
`public/images/home/hero-exploration/environment/`.

**What this is.** A one-image-per-theme version of the variant18 hero: sky,
buildings AND the headline all baked into a single flat photograph, so the page
only has to set a background. It replaces the three-layer build (§11.7 sky +
§11.9 building plates + live `<h1>`).

**Keep these prompts.** They are recorded here precisely so the headline can be
changed later without reverse-engineering the look: edit the two text lines in
the prompt, regenerate both images, drop them in, re-run the optimizer. Nothing
in the codebase needs to change.

**Read before using this route:**

1. **Image models garble text.** The headline is six words; misspellings,
   doubled letters and malformed glyphs are common. Check every character before
   accepting a render.
2. **The headline stops being real text.** No responsive scaling, nothing for
   search engines, and a re-render for every copy change. Mitigation used in the
   build: the `<h1>` stays in the DOM visually hidden, so screen readers and
   crawlers still get it.
3. **16:9 crops badly on phones.** A 100svh hero at 388x841 is portrait; a 16:9
   image is cropped to its middle and baked text gets cut off. A second portrait
   pair is likely needed for mobile.
4. **Alternative that avoids risk 1 entirely:** generate the same two images with
   NO text (sky + buildings only, flat, no transparency) and composite the
   headline in with sharp using the site's own font. Pixel-perfect spelling,
   exact brand blue, and precise control over which characters the towers cover.

#### Day prompt — `hero-scene-day.png`

```text
Ultra realistic wide photograph of a modern city business district, tall glass and steel high-rise towers seen from across calm water on a bright clear day, deep blue sky with soft wispy clouds, crisp daylight, soft reflections on the glass facades, subtle atmospheric haze at the base of the buildings. Photoreal, premium corporate feel, cinematic depth.

Composition: the towers occupy the lower two thirds and rise into the upper third. Tallest towers grouped left of centre and right of centre, with one slender tower crossing the middle. Open clear sky across the top third.

Text integrated INTO the scene, set in the open sky BEHIND the towers, so the buildings pass in front of the letters and hide one or two characters. Two centred lines of large geometric sans-serif type, tight letter spacing, spanning almost the full width of the frame, positioned in the upper third:
Line 1, deep near-black navy: The machine behind
Line 2, bright azure blue #109BDD: every smooth ride.
The text must sit behind the buildings, never on top of them. Spell the words exactly as written.

Keep the lower left and lower right corners visually calm and slightly darker, with no bright highlights, so overlaid caption text stays readable.

3840x2160, 16:9. No other text, no logos, no people, no boats, no watermarks.
```

#### Night prompt — `hero-scene-night.png`

```text
The exact same scene, same buildings, same camera, same composition and same text layout as the previous image, at night. Modern city business district, high-rise towers brightly lit with warm and cool window lights, deep navy black sky, glowing reflections shimmering on dark calm water, dramatic and premium, rich contrast.

Text integrated INTO the scene, set in the night sky BEHIND the towers, so the buildings pass in front of the letters and hide one or two characters. Two centred lines of large geometric sans-serif type, tight letter spacing, spanning almost the full width of the frame, in the upper third:
Line 1, clean white: The machine behind
Line 2, bright azure blue #109BDD: every smooth ride.
The text must sit behind the buildings, never on top of them. Spell the words exactly as written.

Do not move, add or remove any building; only the lighting and the text colour change from the day version. Keep the lower left and lower right corners calm and dark so overlaid caption text stays readable.

3840x2160, 16:9. No other text, no logos, no people, no boats, no watermarks.
```

#### Current headline, for reference

The two lines above must match `sections/experience/corporate/Variant18Hero.tsx`:

> The machine behind *every smooth ride.*

The italic part is the `<em>`, which the site renders in the brand accent. If the
copy changes in the component, change it in both prompts too, or the hidden `<h1>`
and the picture will disagree.

#### After the files land

```bash
node scripts/optimizeHeroExploration.mjs
```

The full-bleed ladder (§11.11) generates up to 3072px for `hero-scene-*`, so a
3840px source finally renders sharp on large and 2x-DPR screens.

### 11.11 Full-bleed responsive ladder

`scripts/optimizeHeroExploration.mjs` builds two ladders. Component cutouts,
which render in ~300px cards, get `384/640/960/1280` at quality 80. Plates that
cover the whole hero get `640/960/1280/1536/1920/2560/3072` at quality 88,
matched by filename: `environment/hero-(sky|city|front|tower|scene)*`.

This exists because the single 1280-wide ladder was being stretched 1.5x across a
1920px hero and the towers came out visibly soft. Tiers larger than the source
are skipped, never upscaled, so a 1536px original simply stops at 1536 and a
3840px one uses every tier.
