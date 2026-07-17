import type { TimelineItem, Value, TeamMember, Feature } from "@/types";

/* =============================================================================
   PHILBRICK — COMPANY CONTENT
   Content sourced from the WordPress website backup (acharyagroup.in /
   philbrickindia.com). Mission/Vision are brand-voice statements (the WP
   pages said "Coming soon", so the existing editorial copy is retained).
   ========================================================================== */

export const MISSION =
  "To engineer dependable elevator control, safety and signalling systems, built in-house to a consistent standard, so that every ride is safe, smooth and reliable.";

export const VISION =
  "To be a trusted partner to elevator makers and modernisers in India and beyond, known for quality components, honest engineering and long-term support.";

export const ABOUT_STORY = [
  "Philbrick Controls India was founded in 1992 in Ahmedabad, a city of Gujarat, India with a main focus on providing automation solution by research and development and production of Control Instruments and Control Panels. A teamwork of young and professional entrepreneurial and engineers with apex of providing technical solution with economy, the proficiency, in depth techno-commercial knowledge has brought the results in front of you.",
  "Company provides automation solution to various industries by producing microcontroller based instruments and control panels. We are specialized in understanding the application to fulfil the industrial requirements by providing the best efficient economical solutions. We offer our best proficient automation solutions by advance development techniques, hi-tech manufacturing process, systematic testing methodology and strong quality assessment.",
  "We have been catering our services to various industrial segments like Construction, Textile, Steel, Plastic, Paper, Glass, Power, Chemical and Pollution Control Equipment manufacturers etc. We have dedicated team with a special focus on Elevator Industry for providing Smarter, Safer and Simpler Control Panels and various accessories for the passenger lift.",
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
      "We design and build our control, door and signalling systems ourselves, so we understand them completely and can stand behind them.",
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
      "Alongside customers across India, we supply export markets including China and Taiwan, held to the same standard everywhere.",
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
      "A well organised campus with 10,000+ sq feet of working area with latest manufacturing facilities and LAN connectivity, doubled in 2019 to meet growing market demand.",
  },
  {
    iconName: "FiCpu",
    title: "Design & R&D",
    description:
      "High tech equipped R&D infrastructure backed by Highly Qualified Engineers' team, skilled technicians and ERP, dedicated to developing control, door-operator, safety and display products.",
  },
  {
    iconName: "FiCheckCircle",
    title: "Quality control",
    description:
      "Strict quality checks, records and test certificates as per ISO certification. Each part undergoes stage wise and final inspection as per Q.A. plan and tested as per Indian standard specification.",
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

/* Milestones sourced from the WordPress Company page History section. */
export const TIMELINE: TimelineItem[] = [
  {
    year: "1992",
    title: "Founded in Ahmedabad",
    description:
      "Philbrick started with low cost high performing Digital Temperature Indicators, Temperature Controllers and scanners.",
    milestone: true,
  },
  {
    year: "1994",
    title: "Programmable Temperature Profile Controller",
    description:
      "Introduction of Programmable Temperature Profile Controller PC-2000 for the Dyeing machine, accepted by most dyeing and printing process houses as a preferred option for the replacement of imported controllers.",
  },
  {
    year: "1997",
    title: "First Microcontroller based Elevator Controller",
    description:
      "Philbrick started manufacturing Automation Control Panels and introduced the first Microcontroller based elevator controller panel in Ahmedabad.",
    milestone: true,
  },
  {
    year: "2001",
    title: "Advanced Elevator Controller Series",
    description:
      "Introduced more featured Elevator Controller Series E203DL, E203VF and E203ADVF along with electronics accessories like Car Position/Direction display, Dot Matrix Scrolling display, Digital Clock and Temperature Indicator for COP.",
  },
  {
    year: "2008",
    title: "New generation controllers",
    description:
      "Introduced new series of Elevator Controller \"Elevator+\" and \"I-Auto\" along with Monochrome LCD, Full colour TFT, Touch Panel COP and the indigenous door operator controller \"LIFT MASTER\".",
  },
  {
    year: "2009",
    title: "New manufacturing campus",
    description:
      "Shifted to a new well organised campus having 10,000 sq feet of working area with latest manufacturing facilities and LAN connectivity. Started manufacturing \"Synergy\" brand Automatic Door Operator with the \"Ultima\" series.",
    milestone: true,
  },
  {
    year: "2012",
    title: "Xpert motherboard series",
    description:
      "Introduced the new more featured motherboard series \"Xpert\" along with FA300, RFID and Biometric access for Lift.",
  },
  {
    year: "2014",
    title: "STEP partnership and incorporation",
    description:
      "Partnership with STEP, the largest Chinese manufacturer of elevator products. The business is incorporated as Philbrick Technologies (India) Pvt. Ltd.",
    milestone: true,
  },
  {
    year: "2017",
    title: "GST-registered operations",
    description:
      "Operations are GST-registered as the product range and customer base continue to expand.",
  },
  {
    year: "2019",
    title: "Doubled infrastructure",
    description:
      "To fulfil the market demand Philbrick doubled its infrastructure facility.",
  },
  {
    year: "Today",
    title: "High tech R&D and manufacturing",
    description:
      "Philbrick is an organization having high tech equipped R&D manufacturing infrastructure backboned by Highly Qualified Engineers' team, skilled technicians and ERP, serving customers across India and export markets.",
    milestone: true,
  },
];

/* Quality Policy — from the WordPress Quality Policy page (page ID 3). */
export const QUALITY_POLICY = [
  "Philbrick Technologies (India) Pvt. Ltd. products and services constantly meet or exceed customer's expectation and implied needs together with safety at customer's premises. Each produced part undergoes strict quality inspection as per the quality plan and applicable Standards.",
  "Philbrick Technologies (India) Pvt. Ltd. prepares and submits the quality plan for order execution and maintains the quality record as per ISO certification. The procured material is 100% chemically and physically tested under strict quality supervision.",
  "Strict quality checks, records and test certificates ensure the final finished product is of high quality without any manufacturing defects. The quality assurance plan approved by leading engineering consultants and industrial giants is strictly followed with upkeep of certifications till the dispatch of the parts. Each part undergoes stage wise and final inspection as per Q.A. plan and tested as per Indian standard specification.",
];

/* Career content — from the WordPress Career page (page ID 3435). */
export const CAREER_CONTENT = [
  "Working at Philbrick Technologies (India) Pvt. Ltd. might seem anarchic at times, but it's never dreary. There is always something happening that keeps the passion flowing continually. The work is such, after all. It requires fervor that comes from inside and builds brands that endure.",
  "Philbrick Technologies (India) Pvt. Ltd. is not a single, person-centric company. It is a family where every person and his ideas are treated equally. We even undertake training programmes at various levels, so as to ensure that every employee works to the best of his or her capabilities.",
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
