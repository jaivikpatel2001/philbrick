/* =============================================================================
   VERTIQ — DOMAIN TYPES
   Shared TypeScript models for the entire application.
   ========================================================================== */
import type { IconType } from "react-icons";

export type ThemeMode = "dark" | "light";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}

export interface MegaMenuFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
  mega?: {
    columns: MegaMenuColumn[];
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
  image: string;
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
