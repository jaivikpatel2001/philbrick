/* =============================================================================
   ELEVATOR COMPONENTS — content for the interactive hero explorer.
   Each component is focused by the scroll camera and exposes a clickable
   hotspot that opens a detail panel. 3D anchors / camera framing live in
   sections/experience/ElevatorScene.tsx, keyed by `key`.
   ========================================================================== */

export interface ElevatorComponent {
  key: string;
  index: string; // "01" … "08"
  name: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  benefits: string[];
  iconName: string;
}

export const ELEVATOR_COMPONENTS: ElevatorComponent[] = [
  {
    key: "control-panel",
    index: "01",
    name: "Car Operating Panel",
    tagline: "Command, beautifully simple.",
    description:
      "A full height brushed stainless car operating panel with flush capacitive call buttons, tactile braille, and a soft touch feel. Every control is reachable, legible and accessible, engineered to ADA / EN 81-70 standards.",
    specs: [
      { label: "Material", value: "Hairline brushed 316 stainless" },
      { label: "Buttons", value: "Capacitive, halo-lit, anti-vandal" },
      { label: "Accessibility", value: "Braille + tactile, IS 14665 / EN 81-70" },
      { label: "Finishes", value: "Steel · bronze · black · mirror" },
    ],
    benefits: [
      "Intuitive at a glance, no learning curve",
      "Vandal and wear resistant for decades of use",
      "Inclusive by design for every passenger",
    ],
    iconName: "FiGrid",
  },
  {
    key: "key-switch",
    index: "02",
    name: "Security Key Switch",
    tagline: "Access on your terms.",
    description:
      "A keyed security switch enables independent service, firefighter mode, and floor lockout. Integrated with access control and the building management system for secure, role based operation.",
    specs: [
      { label: "Modes", value: "Independent · Firefighter · Lockout" },
      { label: "Integration", value: "Access control / BMS ready" },
      { label: "Standard", value: "IS 14665 & EN 81-72 firefighter" },
      { label: "Cylinder", value: "Restricted profile, anti pick" },
    ],
    benefits: [
      "Restrict floors and cars to authorised users",
      "Code-compliant firefighter operation",
      "Centralised control from the BMS",
    ],
    iconName: "FiSettings",
  },
  {
    key: "display",
    index: "03",
    name: "Display Screen",
    tagline: "Information, in motion.",
    description:
      "A high resolution TFT display shows position, direction, destination dispatch assignments and live building media. Crisp typography and smooth transitions keep passengers informed and at ease.",
    specs: [
      { label: "Panel", value: '10.4" TFT, 1080p, IPS' },
      { label: "Shows", value: "Position · direction · messages · media" },
      { label: "Dispatch", value: "Destination control aware" },
      { label: "Brightness", value: "Auto dimming, 450 nits" },
    ],
    benefits: [
      "Clear wayfinding reduces perceived wait",
      "A canvas for branding and announcements",
      "Pairs with destination dispatch",
    ],
    iconName: "FiMonitor",
  },
  {
    key: "emergency",
    index: "04",
    name: "Emergency Call",
    tagline: "Help, always one press away.",
    description:
      "A clearly marked alarm and two way emergency intercom with battery backup and automatic light. Connects directly to a 24/7 monitoring centre, with hands free audio and visual confirmation.",
    specs: [
      { label: "Comms", value: "Two way hands free intercom" },
      { label: "Backup", value: "Battery backed alarm + light" },
      { label: "Monitoring", value: "24/7 centre, auto dial" },
      { label: "Standard", value: "IS 14665 & EN 81-28 alarm" },
    ],
    benefits: [
      "Reassurance for every passenger",
      "Operates through power loss",
      "Instant connection to live support",
    ],
    iconName: "FiHeart",
  },
  {
    key: "doors",
    index: "05",
    name: "Door Mechanism",
    tagline: "Silent, sensing, sure.",
    description:
      "A belt driven, VVVF controlled door operator opens and closes with whisper quiet precision. A full height infrared light curtain and anti crush sensing keep passengers safe at the threshold.",
    specs: [
      { label: "Operator", value: "VVVF belt driven, closed loop" },
      { label: "Safety", value: "Full height IR light curtain" },
      { label: "Protection", value: "Anti crush force monitoring" },
      { label: "Cycle life", value: "> 5 million cycles" },
    ],
    benefits: [
      "Smooth, quiet, reassuring operation",
      "Never closes on a passenger or bag",
      "Built for relentless public duty",
    ],
    iconName: "FiLayers",
  },
  {
    key: "motor",
    index: "06",
    name: "Traction Machine",
    tagline: "The heart of the rise.",
    description:
      "A gearless permanent magnet traction machine drives the car with exceptional efficiency and a vibration free ride. A regenerative VVVF drive feeds braking energy back into the building grid.",
    specs: [
      { label: "Type", value: "Gearless permanent magnet, MRL" },
      { label: "Drive", value: "Regenerative VVVF, IGBT" },
      { label: "Energy", value: "Up to −40% vs geared; VDI 4707 A" },
      { label: "Ride", value: "Active vibration control" },
    ],
    benefits: [
      "Dramatically lower energy and running cost",
      "Smooth, silent acceleration",
      "No machine room required",
    ],
    iconName: "FiZap",
  },
  {
    key: "safety",
    index: "07",
    name: "Safety System",
    tagline: "Engineered to never fail quietly.",
    description:
      "Progressive safety gear, an overspeed governor and energy absorbing buffers arrest the car smoothly in milliseconds if anything exceeds limits, backed by continuous condition diagnostics.",
    specs: [
      { label: "Brake", value: "Progressive safety gear, IS 14665" },
      { label: "Governor", value: "Bi directional overspeed" },
      { label: "Buffers", value: "Polyurethane / oil energy absorbing" },
      { label: "Monitoring", value: "Predictive condition diagnostics" },
    ],
    benefits: [
      "Multiple independent layers of protection",
      "Stops the car gently, not abruptly",
      "Faults flagged before they become failures",
    ],
    iconName: "FiShield",
  },
  {
    key: "interior",
    index: "08",
    name: "Interior Design",
    tagline: "A room you want to ride in.",
    description:
      "Floor to ceiling glass, hairline steel, a stone floor, a mirrored wall and a warm linear light cove. Finishes are configured to the architecture, so the cabin becomes part of the building's design.",
    specs: [
      { label: "Walls", value: "Glass · steel · stone · veneer · leather" },
      { label: "Lighting", value: "Hidden warm LED cove, tunable" },
      { label: "Handrail", value: "Brushed stainless, solid" },
      { label: "Ceiling", value: "Backlit, custom patterns" },
    ],
    benefits: [
      "Bespoke to the building's interior language",
      "Calm, premium, spacious feel",
      "Durable, low maintenance materials",
    ],
    iconName: "FiFeather",
  },
];
