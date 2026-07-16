/* =============================================================================
   PHILBRICK — PRODUCT CATALOGUE (single source of truth)

   Philbrick's real product hierarchy, modelled as a two-level tree:
     Category  (/products/<category>)
       Product (/products/<category>/<product>)

   Content is drawn from Philbrick's public product range. Descriptions are
   honest and qualitative: NO fabricated specifications, capacities or numbers.
   `released` is a content-readiness hint; production gating is governed centrally
   by config/pageReleases.ts (secure default-deny). In development every route is
   accessible regardless.
   ========================================================================== */
import type { ProductNode } from "@/types";

/* Local brand photography (see imagegeneration.md + scripts/optimizeImages.mjs).
   Category cover:      /images/products/<slug>/<slug>.png
   Individual product:  /images/products/<category>/<product>.png
   Delivered as responsive WebP by lib/imageLoader.ts. */
const cover = (slug: string) => `/images/products/${slug}/${slug}.png`;
const leaf = (categorySlug: string, productSlug: string) =>
  `/images/products/${categorySlug}/${productSlug}.png`;

export const PRODUCT_TREE: ProductNode[] = [
  {
    slug: "elevator-control-panel",
    name: "Elevator Control Panel",
    category: "Control & Drives",
    tagline: "The brain of every ride.",
    description:
      "Control panels that manage motion, safety, signalling and door operation for a smooth, reliable elevator, engineered and built in-house.",
    longDescription:
      "The elevator control panel is the intelligence behind the ride: it drives the machine, levels the car, sequences the doors and supervises every safety circuit. Philbrick builds control panels in-house using RISC microprocessor-based High Speed clocked design for automatic-door, manual-door and hydraulic elevators. Features include Multi Functional keypad with LCD display, Programmable configuration, Self Diagnostic/Debugging Mode, Opto Coupler based Galvanic Isolation for all Inputs and Outputs, and PTC protected Digital I/O.",
    highlights: [
      "RISC microprocessor-based High Speed design",
      "Automatic, manual and hydraulic variants",
      "Self Diagnostic/Debugging Mode for onsite troubleshooting",
      "Opto Coupler based Galvanic Isolation",
    ],
    image: cover("elevator-control-panel"),
    released: true,
    children: [
      {
        slug: "automatic-door-controller",
        name: "Automatic Door Controller",
        category: "Elevator Control Panel",
        description:
          "Xpert Main Board based Auto Door V3F Type Control Panel available in 8, 12 and 16 landing floor configurations with Full Collective Logic. Options include customized MRL enclosure, ARD functionality and control panel for Synchronous Motor (Gearless Machine).",
        image: leaf("elevator-control-panel", "automatic-door-controller"),
        released: true,
      },
      {
        slug: "manual-door-controller",
        name: "Manual Door Controller",
        category: "Elevator Control Panel",
        description:
          "Available in V3F Drive and Single Speed variants with Elevat+ and Xpert Main Board options. V3F panels in 8 to 16 landing configurations with Down/Full Collective Logic. Options include customized MRL enclosure, ARD functionality, Phase Sequence Corrector and Synchronous Motor control.",
        image: leaf("elevator-control-panel", "manual-door-controller"),
        released: true,
      },
      {
        slug: "hydraulic-controller",
        name: "Hydraulic Controller",
        category: "Elevator Control Panel",
        description:
          "Xpert and Elevat+ Main Board based Hydraulic Lift Control Panels for up to 8 landing floors, available for Automatic and Manual Door configurations. Options include DOL/Star-Delta Main Pump Starter, MRL application, Phase Sequence Corrector and Front & Rear Door operation.",
        image: leaf("elevator-control-panel", "hydraulic-controller"),
        released: true,
      },
    ],
  },
  {
    slug: "integrated-control-panel",
    name: "Integrated Control Panel",
    category: "Control & Drives",
    tagline: "Drive and control, in one cabinet.",
    description:
      "All-in-one elevator control that integrates the drive, controller and signalling into a single, space-saving cabinet, in parallel, serial CAN-bus and MRL configurations.",
    longDescription:
      "Philbrick's integrated control panels bring the drive, controller and signalling together in one compact cabinet, cutting wiring, footprint and commissioning time. The range spans traditional parallel wiring, modern serial CAN-bus communication and dedicated machine-room-less control, so the right architecture is available for every building.",
    highlights: [
      "Drive, controller and signalling combined",
      "Parallel and serial CAN-bus options",
      "Machine-room-less (MRL) ready",
      "Faster to wire and commission",
    ],
    image: cover("integrated-control-panel"),
    released: true,
    children: [
      {
        slug: "parallel-type-controller",
        name: "Parallel Type Controller",
        category: "Integrated Control Panel",
        description:
          "AS360 based Integrated Control Panel available in 10, 12 and 16 landing configurations with Down Collective and Full Collective Logic. Options include customized MRL enclosure, Pre Door opening, Duplex Control, Analog Weighing Device Interface and Double Door Function.",
        image: leaf("integrated-control-panel", "parallel-type-controller"),
        released: true,
      },
      {
        slug: "serial-can-bus-type-controller",
        name: "Serial CAN Bus Type Controller",
        category: "Integrated Control Panel",
        description:
          "AS380 based Integrated Control Panel with 64 Landing Full Collective. Options include customized MRL enclosure, Pre Door opening, Group/Duplex Control, Double Door Function, DDS (Destination Dispatching System), IoT for remote monitoring and Community Monitoring System.",
        image: leaf("integrated-control-panel", "serial-can-bus-type-controller"),
        released: true,
      },
      {
        slug: "mrl-control-panel",
        name: "MRL Control Panel",
        category: "Integrated Control Panel",
        description:
          "AS380 based Integrated Control Panel with 64 Landing Full Collective in a customized enclosure for MRL application. Features Pre Door opening, Group/Duplex Control, Double Door Function, DDS (Destination Dispatching System), IoT for remote monitoring and Community Monitoring System.",
        image: leaf("integrated-control-panel", "mrl-control-panel"),
        released: true,
      },
    ],
  },
  {
    slug: "elevator-iot",
    name: "Elevator IoT",
    category: "Safety & Intelligence",
    tagline: "Every lift, connected.",
    description:
      "A connectivity module that streams live status, fault and usage data from the elevator controller to the cloud for remote monitoring and faster response.",
    longDescription:
      "Philbrick's Elevator IoT links the controller to the cloud, turning each lift into a connected asset. Building and maintenance teams can watch live status, receive fault alerts and review usage remotely, shortening downtime and supporting condition-based, rather than purely scheduled, maintenance.",
    highlights: [
      "Live status and fault alerts",
      "Remote monitoring from anywhere",
      "Usage insight for smarter maintenance",
      "Works with Philbrick controllers",
    ],
    image: cover("elevator-iot"),
    released: true,
  },
  {
    slug: "ard",
    name: "Automatic Rescue Device (ARD)",
    category: "Safety & Intelligence",
    tagline: "Nobody stays trapped.",
    description:
      "On a power failure the Automatic Rescue Device moves the car to the nearest floor and opens the doors, releasing passengers safely. A core Philbrick safety product.",
    longDescription:
      "Lift Power LP440/LP220 is a specially designed High Starting Current type Inverter to operate the LIFT in Emergency Mode to rescue the passenger in power fail condition. When mains power fails, it automatically brings the elevator to the nearest landing on backup power and opens the doors so passengers are never left stranded between floors.",
    highlights: [
      "Automatic rescue on power failure",
      "Moves the car to the nearest floor",
      "Opens doors to free passengers",
      "Flagship Philbrick safety device",
    ],
    image: cover("ard"),
    released: true,
  },
  {
    slug: "lift-master",
    name: "Lift Master Door Operator Controller",
    category: "Doors & Mechanism",
    tagline: "Precise doors, every cycle.",
    description:
      "Philbrick's dedicated door-operator controller, driving the car-door mechanism with smooth, precisely profiled opening and closing and reliable obstruction handling.",
    longDescription:
      "Lift Master is Philbrick's dedicated door-operator controller available in two models: the LMP66 TINY with 66 Watt BLDC Motor suitable for small opening/light weight doors, and the LMP110 with 110 Watt BLDC Motor suitable for medium to large opening/medium to heavy weight doors. It drives the car-door mechanism with a smooth, tuned motion profile and handles obstructions gracefully.",
    highlights: [
      "Smooth, profiled door motion",
      "Reliable obstruction handling",
      "Accurate open and close positioning",
      "Built for high-cycle duty",
    ],
    image: cover("lift-master"),
    released: true,
  },
  {
    slug: "synergy-auto-door",
    name: "Synergy Auto Door",
    category: "Doors & Mechanism",
    tagline: "Quiet, precise automatic doors.",
    description:
      "Philbrick's automatic door mechanism for car and landing entrances: quiet and precise, in centre-opening and telescopic/side-opening panel configurations.",
    longDescription:
      "Synergy is Philbrick's automatic door mechanism for elevator car and landing entrances. Engineered for quiet, precise and repeatable operation, it is available in two- and four-panel centre-opening and telescopic/side-opening layouts to suit everything from compact residential lifts to wide hospital and freight openings.",
    highlights: [
      "Quiet, precise automatic operation",
      "Centre-opening and telescopic layouts",
      "Two- and four-panel configurations",
      "For car and landing entrances",
    ],
    image: cover("synergy-auto-door"),
    released: true,
    children: [
      {
        slug: "2-panel-centre-opening",
        name: "2 Panel Centre Opening",
        category: "Synergy Auto Door",
        description:
          "Two panels that part symmetrically from the centre. Available for openings from 600 to 1400 mm. Max. operator width: (2x Clear Opening) + 100 mm.",
        image: leaf("synergy-auto-door", "2-panel-centre-opening"),
        released: true,
      },
      {
        slug: "2-panel-telescopic-side-opening",
        name: "2 Panel Telescopic / Side Opening",
        category: "Synergy Auto Door",
        description:
          "Two panels that telescope to one side (Right/Left). Available for openings from 650 to 1500 mm. Max. operator width: (1.5x Clear Opening) + 100 mm.",
        image: leaf("synergy-auto-door", "2-panel-telescopic-side-opening"),
        released: true,
      },
      {
        slug: "4-panel-centre-opening",
        name: "4 Panel Centre Opening",
        category: "Synergy Auto Door",
        description:
          "Four telescoping panels opening from the centre. Available for openings from 700 to 1800 mm. Max. operator width: 1140 mm for 700 mm opening, (1.5x Clear Opening) + 50 mm for larger sizes.",
        image: leaf("synergy-auto-door", "4-panel-centre-opening"),
        released: true,
      },
    ],
  },
  {
    slug: "elevator-doors",
    name: "Elevator Doors",
    category: "Doors & Mechanism",
    tagline: "Built to align, made to last.",
    description:
      "Landing and car door sets engineered and finished in-house: robust and well-aligned, in a range of sizes and finishes to match the cabin and building.",
    longDescription:
      "Philbrick manufactures landing and car doors as complete, well-aligned sets. Sturdy construction and a choice of sizes and finishes let each door integrate cleanly with the cabin, the shaft and the building's interior, supplied as part of a full elevator package or on their own.",
    highlights: [
      "Landing and car door sets",
      "In-house fabrication and finishing",
      "Range of sizes and finishes",
      "Robust, well-aligned construction",
    ],
    image: cover("elevator-doors"),
    released: true,
  },
  {
    slug: "elevator-cabin",
    name: "Elevator Cabin",
    category: "Cabin & Fixtures",
    tagline: "Where the journey is felt.",
    description:
      "Passenger cabins built to order: durable construction with a choice of finishes, lighting, flooring and fixtures for residential and commercial elevators.",
    longDescription:
      "Philbrick builds cabins to order with homogeneous bottom and top structure with minimum welding joints. Available in MS Powder Coated, Galvanized Powder Coated and Stainless Steel material with customized designs in various combinations of Plain S.S., Designer S.S. Sheet Material, MS Powder Coated, Titanium Gold Designed, Mirror Finish and Full Glass Capsule Car configurations.",
    highlights: [
      "Homogeneous bottom and top structure",
      "MS Powder Coated, Galvanized and Stainless Steel options",
      "Customized design combinations",
      "Mirror Finish, Titanium Gold and Full Glass Capsule variants",
    ],
    image: cover("elevator-cabin"),
    released: true,
  },
  {
    slug: "elevator-display",
    name: "Elevator Display",
    category: "Signalling",
    tagline: "Clear signals, floor to floor.",
    description:
      "Car and landing position indicators: the XN, XLCD and XTFT range spans LED segment, dot-matrix, monochrome LCD and colour TFT displays.",
    longDescription:
      "Philbrick's display range covers every signalling need in the car and at the landings, from simple LED segment indicators to multi-line dot-matrix, crisp monochrome LCD and full-colour TFT screens. All show floor position, direction and travel information clearly, and can carry additional messaging where required.",
    highlights: [
      "LED segment, dot-matrix, LCD and TFT",
      "Car and landing indicators",
      "Clear floor, direction and info display",
      "The XN / XLCD / XTFT range",
    ],
    image: cover("elevator-display"),
    released: true,
    children: [
      {
        slug: "xn-1000-led-segment-display",
        name: "XN-1000 LED Segment Display",
        category: "Elevator Display",
        description:
          "A bright seven-segment LED position indicator with high-contrast floor and direction display for cars and landings.",
        image: leaf("elevator-display", "xn-1000-led-segment-display"),
        released: false,
      },
      {
        slug: "xn-2000-dot-matrix-display",
        name: "XN-2000 Dot Matrix Display",
        category: "Elevator Display",
        description:
          "A dot-matrix indicator showing floor, direction and scrolling information with smooth graphics.",
        image: leaf("elevator-display", "xn-2000-dot-matrix-display"),
        released: false,
      },
      {
        slug: "xn-2100-dot-matrix-display",
        name: "XN-2100 Dot Matrix Display",
        category: "Elevator Display",
        description:
          "A dot-matrix position indicator in the XN-2000 family, sized for a different fascia format.",
        image: leaf("elevator-display", "xn-2100-dot-matrix-display"),
        released: false,
      },
      {
        slug: "xn-3000-dot-matrix-display",
        name: "XN-3000 Dot Matrix Display",
        category: "Elevator Display",
        description:
          "A larger dot-matrix display for clear, long-range legibility in lobbies and landings.",
        image: leaf("elevator-display", "xn-3000-dot-matrix-display"),
        released: false,
      },
      {
        slug: "xn-4000-date-time-temperature-display",
        name: "XN-4000 Date/Time/Temperature Display",
        category: "Elevator Display",
        description:
          "A dot-matrix display that adds date, time and temperature to floor and direction signalling.",
        image: leaf("elevator-display", "xn-4000-date-time-temperature-display"),
        released: false,
      },
      {
        slug: "xlcd-01-monochrome-lcd-display",
        name: "XLCD-01 Monochrome LCD Display",
        category: "Elevator Display",
        description:
          "A monochrome LCD position indicator for crisp graphical floor and direction display.",
        image: leaf("elevator-display", "xlcd-01-monochrome-lcd-display"),
        released: false,
      },
      {
        slug: "xlcd-02-monochrome-lcd-display",
        name: "XLCD-02 Monochrome LCD Display",
        category: "Elevator Display",
        description:
          "A monochrome LCD indicator in the XLCD family, offered in an alternative size or layout.",
        image: leaf("elevator-display", "xlcd-02-monochrome-lcd-display"),
        released: false,
      },
      {
        slug: "xtft-043-tft-display",
        name: "XTFT-043 TFT Display",
        category: "Elevator Display",
        description:
          "A 4.3-inch full-colour TFT display for rich floor, direction and multimedia signalling.",
        image: leaf("elevator-display", "xtft-043-tft-display"),
        released: false,
      },
    ],
  },
  {
    slug: "cop-lop",
    name: "COP / LOP",
    category: "Cabin & Fixtures",
    tagline: "The passenger interface.",
    description:
      "Car Operating Panels and Landing Operating Panels: the buttons and indicators passengers use to call and command the lift, in durable finishes with clear signalling.",
    longDescription:
      "The Car Operating Panel (COP) and Landing Operating Panel (LOP) are how passengers interact with the elevator. Philbrick builds them in hard-wearing finishes with tactile buttons and clear indication, so calling and commanding the lift is intuitive at the landing and inside the car.",
    highlights: [
      "Car and landing operating panels",
      "Durable, hard-wearing finishes",
      "Tactile buttons, clear indication",
      "Configurable layouts",
    ],
    image: cover("cop-lop"),
    released: true,
  },
  {
    slug: "touch-cop-lop",
    name: "Touch COP / LOP",
    category: "Cabin & Fixtures",
    tagline: "A premium touch interface.",
    description:
      "Touch-based car and landing panels: capacitive touch buttons and glass fascias for a premium, easy-to-clean passenger interface.",
    longDescription:
      "Philbrick's Touch COP/LOP replaces mechanical buttons with capacitive touch controls behind a smooth glass fascia. The result is a premium, modern interface that is easy to clean and hard to wear out, a natural fit for showcase lobbies and contemporary interiors.",
    highlights: [
      "Capacitive touch controls",
      "Glass fascia, premium look",
      "Easy to clean, low wear",
      "Car and landing versions",
    ],
    image: cover("touch-cop-lop"),
    released: true,
  },
  {
    slug: "voice-announcing-systems",
    name: "Voice Announcing Systems",
    category: "Signalling",
    tagline: "The lift that speaks.",
    description:
      "Voice and audible signalling: floor and direction announcements, arrival gongs and door alerts that improve accessibility and the ride experience.",
    longDescription:
      "Philbrick's voice announcing systems add clear audible signalling to the elevator: spoken floor and direction announcements, arrival gongs and door alerts. Beyond a more comfortable ride, they support accessibility for passengers with visual impairment. The range spans chip-based and MP3 announcers, close-door alerts and gongs.",
    highlights: [
      "Spoken floor and direction announcements",
      "Arrival gong and door alerts",
      "Improves accessibility",
      "Chip-based and MP3 options",
    ],
    image: cover("voice-announcing-systems"),
    released: true,
    children: [
      {
        slug: "fa-50-chip-based",
        name: "FA-50 Chip Based Voice Announcement System",
        category: "Voice Announcing Systems",
        description:
          "A compact chip-based voice announcer delivering clear, pre-recorded floor and direction messages.",
        image: leaf("voice-announcing-systems", "fa-50-chip-based"),
        released: false,
      },
      {
        slug: "fa-250-mp3",
        name: "FA-250 MP3 Voice Announcement System",
        category: "Voice Announcing Systems",
        description:
          "An MP3-based announcer for higher-quality audio and easily customised announcement content.",
        image: leaf("voice-announcing-systems", "fa-250-mp3"),
        released: false,
      },
      {
        slug: "close-door-announcer",
        name: "Close Door Announcer",
        category: "Voice Announcing Systems",
        description:
          "An audible alert that warns passengers as the doors are about to close.",
        image: leaf("voice-announcing-systems", "close-door-announcer"),
        released: false,
      },
      {
        slug: "elevator-gong",
        name: "Elevator Gong",
        category: "Voice Announcing Systems",
        description:
          "An arrival gong that chimes as the car reaches a landing, signalling arrival and direction.",
        image: leaf("voice-announcing-systems", "elevator-gong"),
        released: false,
      },
    ],
  },
  {
    slug: "elevator-kit-accessories",
    name: "Elevator KIT & Accessories",
    category: "Cabin & Fixtures",
    tagline: "Everything, from one source.",
    description:
      "Complete elevator kits and accessories: the parts, fixtures and spares needed to build, upgrade or maintain a lift, supplied together.",
    longDescription:
      "Philbrick supplies complete elevator kits and the accessories that go with them: the assortment of parts, fixtures and spares needed to build a new lift, modernise an old one or keep an existing installation running. Sourcing them together simplifies procurement and keeps a project moving.",
    highlights: [
      "Complete elevator kits",
      "Fixtures, parts and spares",
      "For new builds and modernisation",
      "Single-source supply",
    ],
    image: cover("elevator-kit-accessories"),
    released: true,
  },
  {
    slug: "step-products",
    name: "STEP Products",
    category: "Control & Drives",
    tagline: "Proven drives and controls.",
    description:
      "Elevator products from the STEP range: drives, controllers and integrated components for new installations and modernisation.",
    longDescription:
      "In 2014 Philbrick partnered with STEP, the largest Chinese manufacturer of elevator products, to keep its image as a trend setter. Philbrick supplies elevator products from the STEP range, including drives, controllers and integrated control components, giving installers and modernisers a proven, widely-supported option that pairs with Philbrick's own panels, doors and fixtures.",
    highlights: [
      "STEP drives and controllers",
      "Integrated control components",
      "For new builds and modernisation",
      "Pairs with Philbrick systems",
    ],
    image: cover("step-products"),
    released: true,
  },
];

/* --------------------------------------------------------------------------
   Logical groups (used by the products index + mega menu left rail).
   Every category slug appears in exactly one group.
   -------------------------------------------------------------------------- */
export const PRODUCT_GROUPS: { title: string; slugs: string[] }[] = [
  {
    title: "Control & Drives",
    slugs: [
      "elevator-control-panel",
      "integrated-control-panel",
      "lift-master",
      "step-products",
    ],
  },
  {
    title: "Safety & Intelligence",
    slugs: ["ard", "elevator-iot"],
  },
  {
    title: "Doors & Mechanism",
    slugs: ["synergy-auto-door", "elevator-doors"],
  },
  {
    title: "Cabin & Fixtures",
    slugs: [
      "elevator-cabin",
      "cop-lop",
      "touch-cop-lop",
      "elevator-kit-accessories",
    ],
  },
  {
    title: "Signalling",
    slugs: ["elevator-display", "voice-announcing-systems"],
  },
];

/* --------------------------------------------------------------------------
   Lookups + route helpers (used by nav, footer, pages, release config,
   generateStaticParams and sitemap).
   -------------------------------------------------------------------------- */
export const categoryHref = (categorySlug: string) => `/products/${categorySlug}`;
export const productHref = (categorySlug: string, productSlug: string) =>
  `/products/${categorySlug}/${productSlug}`;

export const getCategory = (categorySlug: string) =>
  PRODUCT_TREE.find((c) => c.slug === categorySlug);

export const getProduct = (categorySlug: string, productSlug: string) =>
  getCategory(categorySlug)?.children?.find((p) => p.slug === productSlug);

/** Every product route (categories + nested products) with its release flag. */
export interface ProductRoute {
  path: string;
  released: boolean;
}
export function productRoutes(): ProductRoute[] {
  const routes: ProductRoute[] = [];
  for (const category of PRODUCT_TREE) {
    routes.push({ path: categoryHref(category.slug), released: category.released });
    for (const child of category.children ?? []) {
      routes.push({
        path: productHref(category.slug, child.slug),
        released: child.released,
      });
    }
  }
  return routes;
}

/** Params for app/products/[category]. */
export const categoryParams = () =>
  PRODUCT_TREE.map((c) => ({ category: c.slug }));

/** Params for app/products/[category]/[product]. */
export const productParams = () =>
  PRODUCT_TREE.flatMap((c) =>
    (c.children ?? []).map((p) => ({ category: c.slug, product: p.slug }))
  );
