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

/* "About the Philbrick Technologies (India) Pvt. Ltd." — the opening section of
   the WordPress Company page (ID 3318). The page's other two sections, Activity
   and History, follow below and are rendered as their own sections on /about. */
export const ABOUT_STORY = [
  "Philbrick Controls India was founded in 1992 in Ahmedabad, a city of Gujarat, India with a main focus on providing automation solution by research and development and production of Control Instruments and Control Panels. A teamwork of young and professional entrepreneurial and engineers with apex of providing technical solution with economy, the proficiency, in depth techno-commercial knowledge has brought the results in front of you.",
];

/* "Activity" — WordPress Company page, section 2. */
export const ACTIVITY_CONTENT = [
  "Company provides automation solution to various industries by producing microcontroller based instruments and control panels. We are specialized in understanding the application to fulfil the industrial requirements by providing the best efficient economical solutions. We offer our best proficient automation solutions by advance development techniques, hi-tech manufacturing process, systematic testing methodology and strong quality assessment.",
  "We have been catering our services to various industrial segments like Construction, Textile, Steel, Plastic, Paper, Glass, Power, Chemical and Pollution Control Equipment manufacturers etc. We have dedicated team with a special focus on Elevator Industry for providing Smarter, Safer and Simpler Control Panels and various accessories for the passenger lift.",
];

/** The industrial segments the Activity section names, listed individually. */
export const ACTIVITY_SEGMENTS = [
  "Construction",
  "Textile",
  "Steel",
  "Plastic",
  "Paper",
  "Glass",
  "Power",
  "Chemical",
  "Pollution Control Equipment",
];

/* "History" — WordPress Company page, section 3. The client's page runs it as
   one unbroken block; it is split here into the chapters the narrative itself
   marks out, with no facts added, removed or invented. The condensed
   year-by-year version lives on /milestone as the Timeline. */
export const HISTORY_CHAPTERS: {
  period: string;
  title: string;
  body: string;
}[] = [
  {
    period: "1992",
    title: "The first instruments",
    body: "Philbrick started with low cost high performing Digital Temperature Indicators, Temperature Controllers and scanners.",
  },
  {
    period: "1994",
    title: "PC-2000 replaces an import",
    body: "Introduction of Programmable Temperature Profile Controller PC-2000 for the Dyeing machine was accepted by most of the dyeing and printing process houses as a preferred option for the replacement of imported controller from outside India.",
  },
  {
    period: "1997",
    title: "Into control panels, and into elevators",
    body: "With a remarkable success story OEM demanded the complete solution from Philbrick, which led the company to enter the market of Industrial control panels, and Philbrick started manufacturing Automation Control Panels in 1997. Having the brand image as a quality manufacturer, Elevator Manufacturers approached us for a solution to the conventional relay logic based hardwired control panel for passenger lift. Philbrick had started the first Microcontroller based elevator controller panel in Ahmedabad in 1997.",
  },
  {
    period: "1997 to 2005",
    title: "The product basket fills",
    body: "As the preferred quality manufacturer image continued, manufacturers of other industries went on approaching, and the product basket filled with products like Digital Speed Indicator, Zero Speed Switch, Flame Failure Detection Unit, Burner Sequence Controller for boilers, various kinds of Timers, Bag filter sequential timers, Battery cell scanner, Flow totalizer for Asphalt Mixing Plant, Digital Weighing Scale, Weigh Feeder and Batch Weighing Controllers, Flame proof Equipments and so many customised automation and control solutions.",
  },
  {
    period: "2001",
    title: "A new elevator controller series",
    body: "Company again broke traditional approach for Elevator Controller and introduced more featured Elevator Controller Series E203DL, E203VF and E203ADVF. Philbrick started other electronics accessories like Car Position/Direction display, Dot Matrix Scrolling display, Digital Clock and Temperature Indicator for COP, Phase sequence Changer, Emergency Light and Alarm, Door Close Announcer and Floor Announcing System.",
  },
  {
    period: "2008",
    title: "Elevator+, I-Auto and Lift Master",
    body: "As innovation was the main principal, Philbrick kept the pace with the other Industrial Automation and started PLC and SCADA based control panels. The company's approach continued for the Elevator Industry also, and it introduced a new series of Elevator Controller, “Elevator+” and “I-Auto”, by 2008. During the same time other electronics accessories for elevators were also introduced, like Monochrome LCD, Full colour TFT and Touch Panel COP. Philbrick was worried about the high cost and failure of Imported Electronics Controllers for Automatic Door operators and started an indigenous solution for the door operator, “LIFT MASTER”, which was accepted everywhere.",
  },
  {
    period: "2009",
    title: "A new campus, and Synergy",
    body: "As the company was growing with good acceleration, to strengthen the infrastructure and manufacturing capabilities Philbrick shifted to a new well organised campus having 10,000 sq feet of working area with latest manufacturing facilities and campus wide LAN connectivity in May 2009. The new infrastructure came with a boost: as a first result Philbrick started manufacturing “Synergy” brand Automatic Door Operator, commencing with the “Ultima” series.",
  },
  {
    period: "2012",
    title: "The Xpert motherboard series",
    body: "The success journey continues, and in 2012 Philbrick introduced the new more featured motherboard series “Xpert”. We also added some advancement in other accessories and introduced FA300, RFID and Biometric access for Lift.",
  },
  {
    period: "2014",
    title: "Tie up with STEP",
    body: "In the year 2014 the new trend of Integrated Elevator Controller arose. Philbrick did the tie up with the largest Chinese manufacturer of Elevator products, named “STEP”, to keep its image as trend setter.",
  },
  {
    period: "2019",
    title: "Infrastructure doubled",
    body: "In 2019, to fulfil the market demand, Philbrick doubled its infrastructure facility.",
  },
  {
    period: "Today",
    title: "High tech R&D and manufacturing",
    body: "Today Philbrick is an organization having high tech equipped R&D manufacturing infrastructure backboned by a Highly Qualified Engineers' team, skilled technicians and ERP. Philbrick will endeavour to improve every aspect of daily life for people and bring new thoughts and new life to society.",
  },
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
  "Strict quality checks, records and test certificates ensure the final finished product is of high quality without any manufacturing defects. Philbrick Technologies (India) Pvt. Ltd. therefore always guarantees its products.",
  "The quality assurance plan approved by all leading engineering consultants and industrial giants is strictly followed with upkeep of certifications till the dispatch of the parts. Each part undergoes stage wise and final inspection as per Q.A. plan and tested as per Indian standard specification.",
];

/* Career content — from the WordPress Career page (page ID 3435). */
export const CAREER_CONTENT = [
  "Working at Philbrick Technologies (India) Pvt. Ltd. might seem anarchic at times, but it's never dreary. There is always something happening that keeps the passion flowing continually. The work is such, after all. It requires fervor that comes from inside and builds brands that endure.",
  "Philbrick Technologies (India) Pvt. Ltd. is not a single, person-centric company. It is a family where every person and his ideas are treated equally. We even undertake training programmes at various levels, so as to ensure that every employee works to the best of his or her capabilities.",
];

/** The Career page's closing instruction, verbatim in intent. */
export const CAREER_CTA = "Mail your resume on";

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
