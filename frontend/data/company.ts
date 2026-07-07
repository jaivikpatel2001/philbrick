import type { TimelineItem, Value, TeamMember } from "@/types";
import { PEOPLE } from "./images";

export const MISSION =
  "To move people through the buildings that shape India's cities — safely, efficiently and beautifully — while leaving the lightest possible footprint.";

export const VISION =
  "A world where vertical mobility is invisible: always there, never noticed, endlessly intelligent.";

export const ABOUT_STORY = [
  "VERTIQ began in 1968 in a single Pune workshop with one conviction: that the elevator — the most-used vehicle on earth — deserved to be engineered like the most advanced one.",
  "Over five decades we grew from a regional manufacturer into one of India's leading vertical-mobility companies, never losing the engineering obsession we started with. Today our systems carry millions of people every day, from family homes in tier-2 towns to the country's tallest towers.",
  "What sets VERTIQ apart isn't only the hardware. It's the intelligence we wrap around it — the Pulse™ platform that turns every elevator into a connected, self-aware machine, and the people who keep 1.4 million of them running across India and 18 export markets.",
];

export const VALUES: Value[] = [
  {
    iconName: "FiShield",
    title: "Safety is sacred",
    description:
      "Every decision starts with the people who ride and service our equipment. We design for zero harm — and accept nothing less.",
  },
  {
    iconName: "FiCpu",
    title: "Engineer relentlessly",
    description:
      "We treat the elevator as a frontier, not a finished product. Better, quieter, greener — always.",
  },
  {
    iconName: "FiHeart",
    title: "Serve for the long term",
    description:
      "An elevator lasts decades. So do our relationships. We're measured by uptime over years, not sales in a quarter.",
  },
  {
    iconName: "FiFeather",
    title: "Tread lightly",
    description:
      "The most responsible building moves its people on the least energy. Sustainability is an engineering target, not a slogan.",
  },
  {
    iconName: "FiUsers",
    title: "One India team",
    description:
      "Twenty-eight states, one standard. Local hands, shared engineering, collective pride in the craft.",
  },
  {
    iconName: "FiEye",
    title: "Earn trust daily",
    description:
      "Transparency in performance, honesty in setbacks, clarity in cost. Trust is the contract behind the contract.",
  },
];

export const TIMELINE: TimelineItem[] = [
  { year: "1968", title: "The first workshop", description: "VERTIQ is founded in Pune with a handful of engineers and one geared traction elevator.", milestone: true },
  { year: "1981", title: "Going gearless", description: "We pioneer one of India's earliest permanent-magnet gearless drives." },
  { year: "1994", title: "Across the metros", description: "Operations expand to Mumbai, Delhi, Bengaluru, Chennai and Hyderabad." },
  { year: "2003", title: "Machine-room-less", description: "The MRL platform launches, freeing architects from the rooftop machine room." },
  { year: "2012", title: "Regeneration", description: "Regenerative drives become standard, cutting fleet energy use dramatically.", milestone: true },
  { year: "2016", title: "Made in India", description: "A new Pune mega-factory scales in-house manufacturing of machines, drives and fixtures." },
  { year: "2018", title: "Pulse™ goes live", description: "Our IoT platform connects the first 100,000 elevators across India to the cloud." },
  { year: "2022", title: "Carbon-fibre rope", description: "Carbon-fibre belt technology pushes travel heights past 600 metres." },
  { year: "2025", title: "Toward net-zero", description: "1.4M units in service across India and a committed path to net-zero operations by 2035.", milestone: true },
];

export const LEADERSHIP: TeamMember[] = [
  {
    name: "Aarti Deshpande",
    role: "Chief Executive Officer",
    bio: "Two decades in vertical transport; joined VERTIQ to scale intelligence across the fleet.",
    image: PEOPLE.b,
    linkedin: "https://linkedin.com",
  },
  {
    name: "Rohit Khanna",
    role: "Chief Technology Officer",
    bio: "Led the Pulse™ platform from prototype to 1.2 million live sensors.",
    image: PEOPLE.c,
    linkedin: "https://linkedin.com",
  },
  {
    name: "Neha Verma",
    role: "Chief Operating Officer",
    bio: "Runs delivery and service across 28 states with a zero-harm obsession.",
    image: PEOPLE.d,
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sundar Krishnan",
    role: "Chief Sustainability Officer",
    bio: "Architect of VERTIQ's net-zero-by-2035 roadmap.",
    image: PEOPLE.a,
    linkedin: "https://linkedin.com",
  },
];
