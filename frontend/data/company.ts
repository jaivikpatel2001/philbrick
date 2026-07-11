import type { TimelineItem, Value, TeamMember, Feature } from "@/types";

/* =============================================================================
   PHILBRICK — COMPANY CONTENT
   Real, publicly-verifiable content only. Mission/Vision are brand-voice
   statements (not factual claims). No fabricated stats, awards or people.
   ========================================================================== */

export const MISSION =
  "To engineer dependable elevator control, safety and signalling systems — built in-house to a consistent standard — so that every ride is safe, smooth and reliable.";

export const VISION =
  "To be a trusted partner to elevator makers and modernisers in India and beyond, known for quality components, honest engineering and long-term support.";

export const ABOUT_STORY = [
  "Philbrick Technologies began in 1992 in Ahmedabad, Gujarat, with a focus on the systems that make an elevator work: control panels, safety devices, doors and signalling.",
  "Guided by founder and mentor Mr. Vasant Patel and led today by Mr. Saransh Patel, the company has grown into a manufacturer, exporter and supplier of a broad range of elevator components — from control and integrated panels to the Automatic Rescue Device, door operators, cabins, displays and passenger fixtures.",
  "Everything is engineered and built under one roof, across dedicated units for procurement, design, quality control, warehousing and packaging. That in-house control is what lets Philbrick keep quality consistent, support both new installations and modernisation, and supply customers across India and export markets including China and Taiwan.",
];

export const VALUES: Value[] = [
  {
    iconName: "FiShield",
    title: "Safety first",
    description:
      "Elevators carry people. Products like the Automatic Rescue Device exist because passenger safety is the first requirement, never an afterthought.",
  },
  {
    iconName: "FiCpu",
    title: "Engineer in-house",
    description:
      "We design and build our control, door and signalling systems ourselves — so we understand them completely and can stand behind them.",
  },
  {
    iconName: "FiCheckCircle",
    title: "Consistent quality",
    description:
      "Dedicated procurement, design and quality-control units keep fit, finish and function consistent from one batch to the next.",
  },
  {
    iconName: "FiUsers",
    title: "Support the customer",
    description:
      "From specification to after-sales, our team supports installers and building owners for the long life of the equipment.",
  },
  {
    iconName: "FiLayers",
    title: "A complete range",
    description:
      "Panels, drives, doors, cabins, fixtures and displays from a single source make it simpler to build, upgrade and maintain a lift.",
  },
  {
    iconName: "FiGlobe",
    title: "Reach beyond India",
    description:
      "Alongside customers across India, we supply export markets including China and Taiwan — held to the same standard everywhere.",
  },
];

/* Manufacturing & engineering infrastructure — Infrastructure page + About.
   Reflects Philbrick's real in-house units (procurement, design, QC, warehousing,
   packaging) and modern machinery. No invented plant counts or capacities. */
export const INFRASTRUCTURE: Feature[] = [
  {
    iconName: "FiTool",
    title: "In-house manufacturing",
    description:
      "Modern machinery and assembly lines produce control panels, doors, cabins and fixtures in-house, giving us end-to-end control of quality and lead time.",
  },
  {
    iconName: "FiCpu",
    title: "Design & R&D",
    description:
      "A dedicated design and R&D function develops and refines our control, door-operator, safety and display products for real-world elevator conditions.",
  },
  {
    iconName: "FiCheckCircle",
    title: "Quality control",
    description:
      "A dedicated quality-control unit checks components before dispatch so that what leaves the factory meets a consistent standard.",
  },
  {
    iconName: "FiPackage",
    title: "Procurement",
    description:
      "A structured procurement unit sources materials and parts reliably, keeping production supplied and consistent.",
  },
  {
    iconName: "FiBox",
    title: "Warehousing & packaging",
    description:
      "In-house warehousing and packaging units protect finished goods and keep dispatch organised for domestic and export orders.",
  },
  {
    iconName: "FiTruck",
    title: "Domestic & export supply",
    description:
      "From our Ahmedabad facility we supply customers across India and export markets including China and Taiwan.",
  },
];

/* Factual milestones only. Undated events are described without inventing a year. */
export const TIMELINE: TimelineItem[] = [
  {
    year: "1992",
    title: "Founded in Ahmedabad",
    description:
      "Philbrick Technologies is established in Ahmedabad, Gujarat, focused on elevator control and safety systems.",
    milestone: true,
  },
  {
    year: "2014",
    title: "Incorporated as a Private Limited company",
    description:
      "The business is incorporated as Philbrick Technologies India Pvt. Ltd. (CIN U31501GJ2014PTC078837).",
  },
  {
    year: "2017",
    title: "GST-registered operations",
    description:
      "Operations are GST-registered as the product range and customer base continue to expand.",
  },
  {
    year: "Today",
    title: "A complete elevator-component range",
    description:
      "From the Ahmedabad facility, Philbrick manufactures and supplies control panels, ARD, door mechanisms, cabins, displays and fixtures across India and export markets.",
    milestone: true,
  },
];

/* Real, named people only — no stock portraits stand in for real individuals.
   TeamCard renders an initials monogram when no `image` is provided. */
export const LEADERSHIP: TeamMember[] = [
  {
    name: "Vasant Patel",
    role: "Founder & Mentor",
    bio: "Founded Philbrick Technologies in 1992 and continues to guide the company with deep elevator-industry experience.",
  },
  {
    name: "Saransh Patel",
    role: "Chief Executive Officer",
    bio: "Leads Philbrick Technologies today, driving its product range, quality standards and customer relationships.",
  },
];
