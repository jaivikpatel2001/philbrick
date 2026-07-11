import type { Service } from "@/types";
import { SERVICE_IMG } from "./images";

/* =============================================================================
   PHILBRICK — WHAT WE OFFER
   Honest capability framing for a component manufacturer (not a lift OEM).
   No fabricated uptimes, response times or sensor counts.
   ========================================================================== */
export const SERVICES: Service[] = [
  {
    slug: "manufacturing",
    name: "In-house Manufacturing",
    shortName: "Manufacturing",
    tagline: "Elevator components, built under one roof.",
    description:
      "We design and manufacture control panels, doors, cabins, fixtures and signalling in-house, keeping quality and lead time in our own hands.",
    heroImage: SERVICE_IMG.installation,
    iconName: "FiTool",
    benefits: [
      { iconName: "FiTool", title: "In-house production", description: "Panels, doors, cabins and fixtures made on our own lines." },
      { iconName: "FiCheckCircle", title: "Consistent quality", description: "A dedicated QC unit checks components before dispatch." },
      { iconName: "FiLayers", title: "Range of finishes", description: "Options to match the cabin, building and budget." },
    ],
  },
  {
    slug: "custom-oem",
    name: "Custom & OEM Supply",
    shortName: "Custom & OEM",
    tagline: "Configured for your project.",
    description:
      "From a single controller to a complete component set, we supply installers and OEMs with parts configured for their elevators.",
    heroImage: SERVICE_IMG.maintenance,
    iconName: "FiSettings",
    benefits: [
      { iconName: "FiSettings", title: "OEM supply", description: "Components supplied to elevator makers and integrators." },
      { iconName: "FiCpu", title: "Configurable control", description: "Automatic, manual, hydraulic and MRL panel variants." },
      { iconName: "FiPackage", title: "Single-source parts", description: "Panels, doors, cabins and fixtures from one supplier." },
    ],
  },
  {
    slug: "modernisation",
    name: "Modernisation & Upgrades",
    shortName: "Modernisation",
    tagline: "Renew ageing lifts, in stages.",
    description:
      "Upgrade older elevators with modern control panels, the Automatic Rescue Device, new door operators, displays and fixtures.",
    heroImage: SERVICE_IMG.modernization,
    iconName: "FiRefreshCw",
    benefits: [
      { iconName: "FiCpu", title: "Control upgrades", description: "Replace legacy controllers with modern integrated panels." },
      { iconName: "FiShield", title: "ARD retrofits", description: "Add automatic rescue for safer power-failure behaviour." },
      { iconName: "FiMonitor", title: "Fixtures & displays", description: "Refresh COP/LOP, displays and signalling." },
    ],
  },
  {
    slug: "support-spares",
    name: "Support & Spares",
    shortName: "Support & Spares",
    tagline: "Kept running, long after.",
    description:
      "Elevator kits, accessories and spares from a single source, with technical support for installers and building owners.",
    heroImage: SERVICE_IMG.amc,
    iconName: "FiShield",
    benefits: [
      { iconName: "FiBox", title: "Spares & kits", description: "Parts, fixtures and complete kits to keep lifts running." },
      { iconName: "FiUsers", title: "Technical support", description: "Help with specification, fitment and troubleshooting." },
      { iconName: "FiGlobe", title: "Export supply", description: "Serving customers across India and export markets." },
    ],
  },
];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
