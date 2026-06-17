import type { Feature } from "@/types";
import { TECH_IMG } from "./images";

/** Core technology pillars — homepage preview + /technology overview. */
export const TECH_PILLARS: Feature[] = [
  {
    iconName: "FiCpu",
    title: "AI Destination Dispatch",
    description:
      "Machine-learning traffic control groups passengers before they board, cutting waits by up to 30%.",
  },
  {
    iconName: "FiWifi",
    title: "Pulse™ IoT Platform",
    description:
      "200+ sensors per unit stream 1.2M live data points to the cloud for predictive service.",
  },
  {
    iconName: "FiZap",
    title: "Regenerative Drive",
    description:
      "Permanent-magnet gearless machines recover braking energy and return it to the grid.",
  },
  {
    iconName: "FiMonitor",
    title: "Digital Twin",
    description:
      "A live virtual model of every elevator simulates wear, traffic and energy in real time.",
  },
  {
    iconName: "FiSmartphone",
    title: "Touchless & Mobile",
    description:
      "Call, authenticate and ride from your phone — no buttons, no contact, no queues.",
  },
  {
    iconName: "FiShield",
    title: "Predictive Safety",
    description:
      "Continuous diagnostics on brakes, ropes and doors flag risk long before failure.",
  },
];

/** Showcase blocks for the /technology page (paired with imagery). */
export const TECH_SHOWCASES = [
  {
    eyebrow: "Intelligence",
    title: "A brain for every building",
    description:
      "VERTIQ Pulse™ turns a group of elevators into a single, learning system — balancing traffic, energy and wear across the whole fleet.",
    image: TECH_IMG.ai,
    badge: { value: "1.2M", label: "Live data points" },
    features: [
      {
        iconName: "FiCpu",
        title: "Predictive dispatch",
        description: "Anticipates demand by time, floor and event to pre-position cars.",
      },
      {
        iconName: "FiBarChart2",
        title: "Traffic analytics",
        description: "Dashboards reveal how people actually move through your building.",
      },
      {
        iconName: "FiActivity",
        title: "Self-learning",
        description: "Every ride trains the model, so performance improves over time.",
      },
    ] as Feature[],
  },
  {
    eyebrow: "Efficiency",
    title: "Energy that pays you back",
    description:
      "Regenerative drives and eco-standby modes make VERTIQ systems some of the most efficient vertical transport on earth.",
    image: TECH_IMG.drive,
    badge: { value: "−50%", label: "Energy use" },
    features: [
      {
        iconName: "FiZap",
        title: "Power recovery",
        description: "Braking energy is fed back into the building's electrical system.",
      },
      {
        iconName: "FiThermometer",
        title: "Eco standby",
        description: "Lighting, ventilation and drives idle down when cars are unused.",
      },
      {
        iconName: "FiTrendingUp",
        title: "VDI 4707 Class A",
        description: "Independently certified to the highest elevator energy class.",
      },
    ] as Feature[],
  },
];

/** Forward-looking R&D for /innovation. */
export const INNOVATIONS: Feature[] = [
  {
    iconName: "FiNavigation",
    title: "Carbon-fibre rope",
    description:
      "Belts seven times lighter than steel unlock travel heights beyond 1,000 metres in a single rise.",
  },
  {
    iconName: "FiCpu",
    title: "Self-healing controls",
    description:
      "Controllers that reconfigure around faults autonomously, keeping cars running while parts ship.",
  },
  {
    iconName: "FiGrid",
    title: "Ropeless multi-car",
    description:
      "Linear-motor cabins that move vertically and horizontally — multiple cars per shaft.",
  },
  {
    iconName: "FiThermometer",
    title: "Hydrogen-ready sites",
    description:
      "Manufacturing powered by green hydrogen as we drive toward net-zero by 2035.",
  },
  {
    iconName: "FiEye",
    title: "Computer-vision safety",
    description:
      "On-board vision detects obstructions, crowding and misuse to protect passengers.",
  },
  {
    iconName: "FiSmartphone",
    title: "Building OS integration",
    description:
      "Open APIs let elevators talk to access control, BMS and robots that ride between floors.",
  },
];
