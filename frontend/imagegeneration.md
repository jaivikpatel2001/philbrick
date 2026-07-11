# Philbrick — Image Generation Checklist

A complete, page-by-page list of **every image the website renders**. Today all
of these come from Unsplash placeholders (`data/images.ts`); this document is the
brief for generating **custom, India-focused replacements**. Generate one image
per entry using its **file name** and **aspect ratio**, then hand back the folder
and the images will be wired into `data/images.ts` / product data by file name.

> **Not included (no photo needed):** the homepage hero is a real-time Three.js
> 3D elevator scene (procedural, no image file); the logo, favicon, app icons and
> OG card are already custom (`public/brand/`). The `/news-events` photos are for
> the **currently mock** newsroom — regenerate with real event photography when
> real news is published.

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
