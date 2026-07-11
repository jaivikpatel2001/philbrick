/* =============================================================================
   ⚠ MOCK / TEMPORARY CONTENT — for design & layout testing only.
   These News & Events items are PLACEHOLDER content, NOT verified Philbrick
   facts or history. Do not present them as real announcements. They deliberately
   avoid any fabricated awards, certifications, government approvals, customer
   contracts, revenue figures or export achievements. Replace with real, dated
   announcements before this page is released to production.
   ========================================================================== */
import { TECH_IMG, HERO, SERVICE_IMG, MISC } from "./images";

export interface NewsItem {
  title: string;
  category: "Product" | "Event" | "Training" | "Facility" | "Safety" | "Network";
  type: "News" | "Event";
  date: string; // ISO — placeholder dates for layout testing
  excerpt: string;
  image: string;
}

/** MOCK data — see the warning above. */
export const NEWS_ITEMS: NewsItem[] = [
  {
    title: "Serial CAN bus control panel enters full production",
    category: "Product",
    type: "News",
    date: "2026-06-18",
    excerpt:
      "Our serial CAN bus integrated control panel moves to full in-house production, cutting wiring and installation time for mid-rise elevators.",
    image: TECH_IMG.iot,
  },
  {
    title: "Philbrick at the India elevator technology expo",
    category: "Event",
    type: "Event",
    date: "2026-05-30",
    excerpt:
      "Meet the team and see our control panels, ARD and Synergy auto doors on display at an upcoming vertical-transport exhibition.",
    image: HERO.industries,
  },
  {
    title: "Installer training program for control and safety systems",
    category: "Training",
    type: "Event",
    date: "2026-05-12",
    excerpt:
      "A hands-on session for installer partners covering panel commissioning, ARD setup and door-operator tuning.",
    image: SERVICE_IMG.maintenance,
  },
  {
    title: "Door-mechanism assembly line upgraded",
    category: "Facility",
    type: "News",
    date: "2026-04-22",
    excerpt:
      "An upgrade to our Synergy auto door assembly line improves consistency and throughput at the Ahmedabad facility.",
    image: MISC.factory,
  },
  {
    title: "Why every lift benefits from an Automatic Rescue Device",
    category: "Safety",
    type: "News",
    date: "2026-04-05",
    excerpt:
      "A short explainer on how the ARD safely brings a car to the nearest floor during a power failure, and why it matters.",
    image: TECH_IMG.drive,
  },
  {
    title: "Growing our component supply network",
    category: "Network",
    type: "News",
    date: "2026-03-19",
    excerpt:
      "We continue to expand how we reach installers and OEMs across India and our export markets with single-source component supply.",
    image: HERO.dealer,
  },
];
