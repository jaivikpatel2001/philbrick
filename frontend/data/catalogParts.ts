/* =============================================================================
   CATALOG PARTS — the client's product-catalogue component set (2026-07-18).

   Source imagery: public/images/home/hero-exploration/components/parts/
   (true-alpha cutouts separated by the client from the printed catalogue's
   exploded diagram) + the central technical drawing of the whole installation
   (public/images/home/hero-exploration/environment/drawing-elevetor.png).

   Now consumed only by the homepage category browser (CategoryBrowse15), which
   renders each part as a product card. The exploration/scroll hero variants
   that also used it (and the `anchor`/`slot` staging fields) were removed with
   the legacy variants on 2026-07-23; the fields are kept on the data so the
   set stays a faithful record of the client's catalogue.

   Copy is honest and qualitative — component names come from the client's own
   catalogue labels; no fabricated specs.
   ========================================================================== */

/* Types were previously imported from data/elevatorComponents + heroExploration
   (both removed with the variants). Inlined here so this file is self-contained. */
interface StagePoint {
  x: number;
  y: number;
}
interface ElevatorComponent {
  key: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  specs: string[];
  benefits: string[];
  iconName: string;
}
export interface ExplorationPart {
  key: string;
  component: ElevatorComponent;
  treatment: "cutout";
  image: string;
  aspect: number;
  size: { wCap: number; hCapVh: number };
  anchor: StagePoint;
  slot: StagePoint;
  side: "left" | "right";
}

const P = "/images/home/hero-exploration/components/parts";

interface CatalogSpec {
  key: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  aspect: number;
  size: { wCap: number; hCapVh: number };
  anchor: StagePoint;
  slot: StagePoint;
  side: "left" | "right";
}

const SPECS: CatalogSpec[] = [
  {
    key: "control-panel-ard",
    index: "01",
    name: "Control Panel and ARD",
    tagline: "The brain and the backup.",
    description:
      "The control panel drives the machine, sequences the doors and supervises every safety circuit, while the Automatic Rescue Device brings the car to the nearest landing if power fails.",
    image: `${P}/control-panel-ard.png`,
    aspect: 0.88,
    size: { wCap: 185, hCapVh: 21 },
    anchor: { x: 46, y: 15 },
    slot: { x: 30, y: 20 },
    side: "left",
  },
  {
    key: "overload-announcing-device",
    index: "02",
    name: "Overload Annunciating Device",
    tagline: "Never a kilogram too many.",
    description:
      "Senses when the car is loaded beyond its rated capacity, warns passengers and holds the elevator safely at the landing until the load is reduced.",
    image: `${P}/overload-announcing-device.png`,
    aspect: 1.334,
    size: { wCap: 225, hCapVh: 16 },
    anchor: { x: 54, y: 13 },
    slot: { x: 84, y: 18 },
    side: "right",
  },
  {
    key: "blower-fan",
    index: "03",
    name: "Fan and Blower",
    tagline: "Fresh air in every ride.",
    description:
      "Mounted on the car roof, the fan and blower keep air moving through the cabin for a fresh, comfortable ride in every season.",
    image: `${P}/blower-fan.png`,
    aspect: 1.681,
    size: { wCap: 235, hCapVh: 15 },
    anchor: { x: 47, y: 28 },
    slot: { x: 13, y: 32 },
    side: "left",
  },
  {
    key: "cabin",
    index: "04",
    name: "Elevator Cabin",
    tagline: "A room built to travel.",
    description:
      "The passenger room itself: wall panels, ceiling, lighting and floor, fabricated and finished to suit the building.",
    image: `${P}/cabin.png`,
    aspect: 0.677,
    size: { wCap: 165, hCapVh: 23 },
    anchor: { x: 53, y: 34 },
    slot: { x: 69, y: 36 },
    side: "right",
  },
  {
    key: "cop-lop-display",
    index: "05",
    name: "COP and LOP with Display",
    tagline: "Controls at every landing.",
    description:
      "The car operating panel and landing operating panels with integrated displays put calls, position and direction at every rider's fingertips.",
    image: `${P}/cop-lop-display.png`,
    aspect: 0.443,
    size: { wCap: 112, hCapVh: 30 },
    anchor: { x: 54, y: 36 },
    slot: { x: 86, y: 58 },
    side: "right",
  },
  {
    key: "floor-announcing-system",
    index: "06",
    name: "Floor Announcing System",
    tagline: "Every stop, spoken.",
    description:
      "Announces each floor and travel direction aloud as the car arrives, guiding passengers and improving accessibility.",
    image: `${P}/floor-announcing-system.png`,
    aspect: 1.843,
    size: { wCap: 245, hCapVh: 15 },
    anchor: { x: 51, y: 45 },
    slot: { x: 30, y: 52 },
    side: "left",
  },
  {
    key: "safety-light-curtain",
    index: "07",
    name: "Safety Light Curtain",
    tagline: "Doors that see you.",
    description:
      "An invisible infrared screen across the entrance reopens the doors the instant a person or object crosses the threshold.",
    image: `${P}/safety-light-curtain.png`,
    aspect: 1.87,
    size: { wCap: 245, hCapVh: 14 },
    anchor: { x: 46, y: 55 },
    slot: { x: 13, y: 72 },
    side: "left",
  },
  {
    key: "elevator-door",
    index: "08",
    name: "Elevator Door",
    tagline: "The first handshake.",
    description:
      "The landing entrance: rigid, quiet panels that seal the shaft and open the way to the car at every floor.",
    image: `${P}/elevator-door.png`,
    aspect: 0.621,
    size: { wCap: 150, hCapVh: 19 },
    anchor: { x: 44, y: 58 },
    slot: { x: 30, y: 80 },
    side: "left",
  },
  {
    key: "lift-display",
    index: "09",
    name: "Lift Display",
    tagline: "Position at a glance.",
    description:
      "Shows car position, direction and messages at the landing so riders always know where the car is.",
    image: `${P}/lift-display.png`,
    aspect: 1.673,
    size: { wCap: 225, hCapVh: 15 },
    anchor: { x: 52, y: 52 },
    slot: { x: 69, y: 84 },
    side: "right",
  },
];

/** minimal honest component records (no fabricated specs — arrays stay empty) */
const toComponent = (s: CatalogSpec): ElevatorComponent => ({
  key: s.key,
  index: s.index,
  name: s.name,
  tagline: s.tagline,
  description: s.description,
  image: s.image,
  specs: [],
  benefits: [],
  iconName: "FiBox",
});

export const CATALOG_PARTS: ExplorationPart[] = SPECS.map((s) => ({
  key: s.key,
  component: toComponent(s),
  treatment: "cutout",
  image: s.image,
  aspect: s.aspect,
  size: s.size,
  anchor: s.anchor,
  slot: s.slot,
  side: s.side,
}));
