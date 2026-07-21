/* =============================================================================
   PHILBRICK — DOMAIN TYPES
   Shared TypeScript models for the entire application.
   ========================================================================== */
import type { IconType } from "react-icons";

export type ThemeMode = "dark" | "light";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

/** A product category shown in the mega menu (left rail → right detail pane). */
export interface MegaCategory {
  slug: string;
  label: string;
  href: string;
  description: string;
  image: string;
  /** Sub-products (may be empty for standalone categories). */
  children: NavLink[];
}

/** A titled group of categories in the mega-menu left rail. */
export interface MegaGroup {
  title: string;
  categories: MegaCategory[];
}

/**
 * A top-level nav entry. Three shapes:
 *   • simple   — just label + href
 *   • dropdown — a flat list (e.g. About)
 *   • mega     — the two-pane Products mega menu
 */
export interface NavItem {
  label: string;
  href: string;
  dropdown?: NavLink[];
  mega?: {
    /** Themed grouping, used by the footer and the mobile accordion. */
    groups: MegaGroup[];
    /** Flat list in the client's own nav order — what the desktop menu renders. */
    categories?: MegaCategory[];
    feature?: MegaMenuFeature;
  };
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description?: string;
  decimals?: number;
}

export interface Feature {
  icon?: IconType;
  iconName?: string;
  title: string;
  description: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Subcategory {
  name: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription?: string;
  heroImage: string;
  cardImage: string;
  gallery?: string[];
  highlights: string[];
  specs: ProductSpec[];
  features: Feature[];
  subcategories?: Subcategory[];
  capacityRange?: string;
  speedRange?: string;
  accent?: string;
}

/* -----------------------------------------------------------------------------
   PRODUCT CATALOGUE TREE (Philbrick)
   Two-level hierarchy: category → product. Descriptions are honest/qualitative;
   `specs` is optional and only ever populated with verified values.
   `released` is the production page-release flag (see config/pageReleases.ts).
   -------------------------------------------------------------------------- */
export interface ProductNode {
  slug: string;
  name: string;
  /** Group label (top-level) or parent category name (nested), for display + schema. */
  category: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  highlights?: string[];
  image: string;
  specs?: ProductSpec[];
  released: boolean;
  children?: ProductNode[];
}

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  heroImage: string;
  iconName: string;
  benefits: Feature[];
  process?: { step: string; title: string; description: string }[];
  stats?: Stat[];
}

export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  cardImage: string;
  iconName: string;
  solutions: string[];
  stat?: Stat;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  location: string;
  year: string;
  category: string;
  sector: string;
  summary: string;
  description?: string;
  heroImage: string;
  cardImage: string;
  gallery?: string[];
  scope: string[];
  stats: Stat[];
  units?: string;
  height?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: string;
  coverImage: string;
  tags: string[];
  body?: { type: "p" | "h2" | "h3" | "quote" | "list"; content: string | string[] }[];
  featured?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  logo?: string;
  rating?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  /** Optional — TeamCard renders an initials monogram when omitted. */
  image?: string;
  linkedin?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  milestone?: boolean;
}

export interface Value {
  iconName: string;
  title: string;
  description: string;
}

export interface DownloadItem {
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  href: string;
  image?: string;
}

export interface JobOpening {
  title: string;
  department: string;
  location: string;
  type: string;
  href: string;
}

export interface Office {
  region: string;
  city: string;
  country: string;
  address: string;
  type: "HQ" | "Regional" | "Manufacturing" | "R&D" | "Service";
  coordinates?: { x: number; y: number };
}

export interface Client {
  name: string;
  sector?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}
