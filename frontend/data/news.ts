/* =============================================================================
   ⚠ MOCK / TEMPORARY CONTENT — for design & layout testing only.
   These News & Events items are PLACEHOLDER content, NOT verified Philbrick
   facts or history. Do not present them as real announcements. They deliberately
   avoid any fabricated awards, certifications, government approvals, customer
   contracts, revenue figures or export achievements. Replace with real, dated
   announcements before this page is released to production.
   ========================================================================== */
import { TECH_IMG, HERO, SERVICE_IMG, MISC } from "./images";

export interface NewsBlock {
  type: "p" | "h2" | "list";
  content: string | string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: "Product" | "Event" | "Training" | "Facility" | "Safety" | "Network";
  type: "News" | "Event";
  date: string; // ISO — placeholder dates for layout testing
  eventDate?: string; // events only
  location?: string; // events only
  excerpt: string;
  content: NewsBlock[];
  image: string;
  imageAlt: string;
  author?: string;
  featured?: boolean;
}

/** MOCK data — see the warning above. */
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "n1",
    slug: "serial-can-bus-control-panel-in-production",
    title: "Serial CAN bus control panel enters full production",
    category: "Product",
    type: "News",
    date: "2026-06-18",
    excerpt:
      "Our serial CAN bus integrated control panel moves to full in-house production, cutting wiring and installation time for mid-rise elevators.",
    image: TECH_IMG.iot,
    imageAlt: "Elevator control electronics",
    author: "Philbrick Team",
    featured: true,
    content: [
      { type: "p", content: "Philbrick's serial CAN bus integrated control panel has moved into full in-house production. The panel replaces bundled travelling cables with a two-wire data bus, which means cleaner wiring, faster installation and stronger noise immunity on site." },
      { type: "h2", content: "What changes for installers" },
      { type: "p", content: "By carrying signalling over a serial bus rather than parallel lines, the panel reduces the number of conductors running through the shaft. That shortens commissioning time and makes fault-finding more straightforward." },
      { type: "list", content: ["Two-wire data bus in place of bundled cabling", "Lower wiring count through the shaft", "Faster commissioning and simpler diagnostics", "Built and tested in-house at Ahmedabad"] },
      { type: "p", content: "The serial panel joins the parallel-type and machine-room-less options in the integrated control panel range, so the right architecture is available for low-, mid- and high-rise installations." },
    ],
  },
  {
    id: "n2",
    slug: "philbrick-at-india-elevator-technology-expo",
    title: "Philbrick at the India elevator technology expo",
    category: "Event",
    type: "Event",
    date: "2026-05-30",
    eventDate: "2026-08-14",
    location: "Ahmedabad, Gujarat",
    excerpt:
      "Meet the team and see our control panels, ARD and Synergy auto doors on display at an upcoming vertical-transport exhibition.",
    image: HERO.industries,
    imageAlt: "Exhibition hall",
    author: "Philbrick Team",
    content: [
      { type: "p", content: "Philbrick will exhibit its elevator-component range at an upcoming vertical-transport technology exhibition. Visitors can see live demonstrations and talk to the engineering team about specification and supply." },
      { type: "h2", content: "On display" },
      { type: "list", content: ["Elevator and integrated control panels", "The Automatic Rescue Device (ARD)", "Synergy automatic door mechanisms", "Display and COP/LOP fixtures"] },
      { type: "p", content: "If you are planning a new installation or a modernisation, it is a good opportunity to discuss requirements in person. Reach out through the contact page to arrange a meeting at the stand." },
    ],
  },
  {
    id: "n3",
    slug: "installer-training-program-control-safety",
    title: "Installer training program for control and safety systems",
    category: "Training",
    type: "Event",
    date: "2026-05-12",
    eventDate: "2026-06-20",
    location: "Ahmedabad, Gujarat",
    excerpt:
      "A hands-on session for installer partners covering panel commissioning, ARD setup and door-operator tuning.",
    image: SERVICE_IMG.maintenance,
    imageAlt: "Technician working on elevator equipment",
    author: "Philbrick Team",
    content: [
      { type: "p", content: "Philbrick is running a hands-on training session for installer partners. The program walks through commissioning control panels, setting up the Automatic Rescue Device and tuning door-operator motion profiles." },
      { type: "h2", content: "What it covers" },
      { type: "list", content: ["Control panel commissioning and safety circuits", "ARD configuration and testing", "Lift Master door-operator tuning", "Fault-finding and best practice"] },
      { type: "p", content: "Places are limited. Installer partners can register their interest through the contact page." },
    ],
  },
  {
    id: "n4",
    slug: "door-mechanism-assembly-line-upgrade",
    title: "Door-mechanism assembly line upgraded",
    category: "Facility",
    type: "News",
    date: "2026-04-22",
    excerpt:
      "An upgrade to our Synergy auto door assembly line improves consistency and throughput at the Ahmedabad facility.",
    image: MISC.factory,
    imageAlt: "Manufacturing facility",
    author: "Philbrick Team",
    content: [
      { type: "p", content: "Philbrick has upgraded the assembly line for its Synergy automatic door mechanisms. The change improves build consistency and throughput while keeping quality control in-house." },
      { type: "p", content: "The Synergy range covers two- and four-panel centre-opening and telescopic layouts, so the upgraded line supports everything from compact residential entrances to wide hospital and freight openings." },
    ],
  },
  {
    id: "n5",
    slug: "why-every-lift-benefits-from-ard",
    title: "Why every lift benefits from an Automatic Rescue Device",
    category: "Safety",
    type: "News",
    date: "2026-04-05",
    excerpt:
      "A short explainer on how the ARD safely brings a car to the nearest floor during a power failure, and why it matters.",
    image: TECH_IMG.drive,
    imageAlt: "Elevator machine room",
    author: "Philbrick Team",
    content: [
      { type: "p", content: "When mains power fails, passengers can be left stranded between floors until power returns. The Automatic Rescue Device (ARD) removes that risk." },
      { type: "h2", content: "How it works" },
      { type: "p", content: "On a power failure the ARD automatically moves the car to the nearest landing on backup power and opens the doors, so passengers can step out safely rather than waiting inside." },
      { type: "list", content: ["Automatic operation on power failure", "Moves the car to the nearest floor", "Opens the doors to release passengers", "A core Philbrick safety product"] },
    ],
  },
  {
    id: "n6",
    slug: "growing-our-component-supply-network",
    title: "Growing our component supply network",
    category: "Network",
    type: "News",
    date: "2026-03-19",
    excerpt:
      "We continue to expand how we reach installers and OEMs across India and our export markets with single-source component supply.",
    image: HERO.dealer,
    imageAlt: "Business handshake",
    author: "Philbrick Team",
    content: [
      { type: "p", content: "Philbrick continues to grow how it reaches installers, OEMs and modernisers across India and its export markets. Supplying panels, doors, cabins, fixtures and displays from a single source keeps procurement simple for partners." },
      { type: "p", content: "If you are interested in supplying or specifying Philbrick components in your region, get in touch through the contact page." },
    ],
  },
];

export const getNewsItem = (slug: string) =>
  NEWS_ITEMS.find((n) => n.slug === slug);

export const newsParams = () => NEWS_ITEMS.map((n) => ({ slug: n.slug }));

/** Detail route paths for the page-release config. */
export const newsRoutes = () => NEWS_ITEMS.map((n) => `/news-events/${n.slug}`);
