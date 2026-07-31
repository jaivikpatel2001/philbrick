import type { Value, TeamMember, Feature } from "@/types";

/* =============================================================================
   PHILBRICK — COMPANY CONTENT
   Content sourced from the WordPress website backup (acharyagroup.in /
   philbrickindia.com). Mission/Vision are brand-voice statements (the WP
   pages said "Coming soon", so the existing editorial copy is retained).
   ========================================================================== */

export const MISSION =
  "To engineer dependable elevator control, safety and signalling systems, built in-house to a consistent standard, so that every ride is safe, smooth and reliable.";

export const VISION =
  "To be a trusted partner to elevator makers and modernisers across India, known for quality components, honest engineering and long-term support.";

/* "About the Philbrick Technologies (India) Pvt. Ltd." — the opening section of
   the WordPress Company page (ID 3318). The page's other two sections, Activity
   and History, follow below and are rendered as their own sections on /about. */
export const ABOUT_STORY = [
  "philbrick was founded in 1992 in Ahmedabad, a city of Gujarat, India with a main focus on providing automation solution by research and development and production of Control Instruments and Control Panels. A teamwork of young and professional entrepreneurial and engineers with apex of providing technical solution with economy, the proficiency, in depth techno-commercial knowledge has brought the results in front of you.",
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
    iconName: "FiMapPin",
    title: "Reach across India",
    description:
      "We supply installers, OEMs and modernisers throughout India, held to the same standard everywhere.",
  },
];

/* Manufacturing & engineering infrastructure — Infrastructure page + About.
   Reflects philbrick's real in-house units (procurement, design, QC, warehousing,
   packaging) and modern machinery. No invented plant counts or capacities. */
export const INFRASTRUCTURE: Feature[] = [
  {
    iconName: "FiTool",
    title: "In-house manufacturing",
    description:
      "A well-organized campus with 10,000+ sq feet of working area with latest manufacturing facilities and LAN connectivity, doubled in 2019 to meet growing market demand.",
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
      "Strict quality checks, records and test certificates as per ISO certification. Each part undergoes stage-wise and final inspection as per Q.A. plan and tested as per Indian standard specification.",
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
      "In-house warehousing and packaging units protect finished goods and keep dispatch organised for orders across India.",
  },
  {
    iconName: "FiTruck",
    title: "Supply across India",
    description:
      "From our Ahmedabad facility we supply customers throughout India, from installers to OEMs and modernisers.",
  },
];

/* Quality Policy — verbatim from the official site (philbrickindia.com/
   quality-policy.html). Wording preserved exactly; only structured for layout. */
export const QUALITY_PRINCIPLES: { title: string; text: string }[] = [
  { title: "Exceeding Expectations", text: "Constantly meeting customer needs with total safety at premises." },
  { title: "100% Tested Materials", text: "Every batch is 100% chemically and physically tested." },
  { title: "Zero Defect Guarantee", text: "Strict quality checks ensure high finish without manufacturing defects." },
  { title: "Consultant Approved", text: "QA plans approved by leading engineering consultants & industrial giants." },
];

export const QUALITY_POLICY: { heading: string; body: string }[] = [
  {
    heading: "Commitment to Product Excellence",
    body: "Philbrick Technologies (India) Pvt. Ltd. products and services constantly meet or exceed customer's expectations and implied needs together with safety at customer's premises. Each produced part undergoes strict quality inspection as per the quality plan according to International and Indian Standards.",
  },
  {
    heading: "Order Execution & Material Supervision",
    body: "Philbrick Technologies (India) Pvt. Ltd. prepares and submits the quality plan for order execution and upkeeps quality records as per ISO certification requirements. The procured raw material is 100% chemically and physically tested and undergoes strict quality supervision by the company before entering production.",
  },
  {
    heading: "Defect-Free Guarantee & Certification",
    body: "Strict quality checks, detailed records, and official test certificates edge the final finished product of high quality without any manufacturing defects. Thus, Philbrick Technologies (India) Pvt. Ltd. always guarantees their products.",
  },
  {
    heading: "Stage-Wise Inspection & Industry Approvals",
    body: "The quality assurance plan approved by all leading engineering consultants and industrial giants is strictly followed with the upkeep of certifications until the dispatch of the parts. Each part undergoes stage-wise and final inspection as per the Q.A. plan and is rigorously tested as per Indian standard specifications.",
  },
];

/* Career content — from the WordPress Career page (page ID 3435). */
export const CAREER_CONTENT = [
  "Working at philbrick might seem anarchic at times, but it's never dreary. There is always something happening that keeps the passion flowing continually. The work is such, after all. It requires fervor that comes from inside and builds brands that endure.",
  "philbrick is not a single, person-centric company. It is a family where every person and his ideas are treated equally. We even undertake training programmes at various levels, so as to ensure that every employee works to the best of his or her capabilities.",
];

/* Concise milestone summaries for the About page graphical timeline (2026-07-25).
   Condensed from the History narrative above — one scannable line each. */
export const ABOUT_MILESTONES: { year: string; title: string; summary: string }[] = [
  { year: "1992", title: "Founded in Ahmedabad", summary: "Started with low-cost, high-performing digital temperature indicators, controllers and scanners." },
  { year: "1994", title: "PC-2000 replaces an import", summary: "The PC-2000 profile controller became the preferred replacement for imported dyeing-machine controllers." },
  { year: "1997", title: "Into control panels & elevators", summary: "Built Ahmedabad's first microcontroller-based elevator control panel and entered industrial control panels." },
  { year: "2001", title: "E203 controller series", summary: "Launched the E203 elevator controllers with car displays, announcers and COP accessories." },
  { year: "2008", title: "Elevator+, I-Auto & Lift Master", summary: "New controllers plus the indigenous Lift Master door operator and LCD/TFT/touch COP." },
  { year: "2009", title: "New campus & Synergy", summary: "Moved to a 10,000 sq ft campus and launched Synergy automatic door operators." },
  { year: "2012", title: "Xpert motherboard series", summary: "Introduced the Xpert series with FA300, RFID and biometric lift access." },
  { year: "2014", title: "STEP partnership", summary: "Tied up with STEP and incorporated as Philbrick Technologies (India) Pvt. Ltd." },
  { year: "2019", title: "Infrastructure doubled", summary: "Doubled the manufacturing facility to meet growing demand." },
  { year: "Today", title: "High-tech R&D & manufacturing", summary: "A high-tech R&D and manufacturing operation serving customers across India." },
];

/** The Career page's closing instruction, verbatim in intent. */
export const CAREER_CTA = "Mail your resume on";

/* Real, named people only — no stock portraits stand in for real individuals.
   TeamCard renders an initials monogram when no `image` is provided. */
export const LEADERSHIP: TeamMember[] = [
  {
    name: "Vasant Patel",
    role: "CEO & Founder",
    bio: "Founded philbrick in 1992 and leads the company with deep elevator-industry experience.",
  },
  {
    name: "Prakash Patel",
    role: "CTO",
    bio: "Heads engineering and technology, guiding product development across control, door and signalling systems.",
  },
  {
    name: "Saransh Patel",
    role: "Management Head",
    bio: "Drives day-to-day operations, quality standards and customer relationships.",
  },
];
