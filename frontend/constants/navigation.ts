/* =============================================================================
   PHILBRICK — NAVIGATION ARCHITECTURE
   Home · About ▾ · Products ▾ (mega) · Infrastructure · Network ·
   News & Events · Contact Us

   Product navigation is derived from the product tree (data/products.ts) so the
   mega menu, mobile accordion and footer always match the real routes.
   ========================================================================== */
import type { NavItem, MegaGroup, MegaCategory } from "@/types";
import {
  PRODUCT_TREE,
  PRODUCT_GROUPS,
  getCategory,
  categoryHref,
  productHref,
} from "@/data/products";
import { CATEGORY_IMG } from "@/data/images";

/* The Products menu is a single vertical list of every category in the order
   the client's own site uses (PRODUCT_TREE order), with a flyout for the five
   categories that have children — see components/layout/MegaMenu.tsx. The
   themed `megaGroups` below are kept for the footer and the mobile accordion. */
const megaCategories: MegaCategory[] = PRODUCT_TREE.map((cat) => ({
  slug: cat.slug,
  label: cat.name,
  href: categoryHref(cat.slug),
  description: cat.tagline ?? cat.description,
  image: CATEGORY_IMG[cat.slug],
  children: (cat.children ?? []).map((child) => ({
    label: child.name,
    href: productHref(cat.slug, child.slug),
    description: child.description,
  })),
}));

/* Build the mega-menu groups from PRODUCT_GROUPS × PRODUCT_TREE. */
const megaGroups: MegaGroup[] = PRODUCT_GROUPS.map((group) => ({
  title: group.title,
  categories: group.slugs.map((slug) => {
    const cat = getCategory(slug)!;
    return {
      slug: cat.slug,
      label: cat.name,
      href: categoryHref(cat.slug),
      description: cat.tagline ?? cat.description,
      image: CATEGORY_IMG[cat.slug],
      children: (cat.children ?? []).map((child) => ({
        label: child.name,
        href: productHref(cat.slug, child.slug),
        description: child.description,
      })),
    };
  }),
}));

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "About Us", href: "/about", description: "Who we are and what we build" },
      { label: "Vision & Mission", href: "/vision-mission", description: "What drives us" },
      { label: "Milestone & Awards", href: "/milestone", description: "Our journey and recognition" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    mega: {
      groups: megaGroups,
      categories: megaCategories,
      feature: {
        eyebrow: "Flagship safety product",
        title: "Automatic Rescue Device (ARD)",
        description:
          "On power failure, it moves the car to the nearest floor and opens the doors, so nobody stays trapped.",
        href: categoryHref("ard"),
        image: CATEGORY_IMG["ard"],
      },
    },
  },
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Network", href: "/network" },
  { label: "News & Events", href: "/news-events" },
  { label: "Contact Us", href: "/contact" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

/* Key product categories for the footer (not every leaf — logical grouping). */
const footerProductLinks = [
  "elevator-control-panel",
  "integrated-control-panel",
  "ard",
  "elevator-iot",
  "synergy-auto-door",
  "elevator-display",
  "cop-lop",
].map((slug) => {
  const cat = PRODUCT_TREE.find((c) => c.slug === slug)!;
  return { label: cat.name, href: categoryHref(cat.slug) };
});

export const FOOTER_NAV: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Vision & Mission", href: "/vision-mission" },
      { label: "Milestone & Awards", href: "/milestone" },
      { label: "Infrastructure", href: "/infrastructure" },
      { label: "Network", href: "/network" },
      /* The client's WordPress footer menu also carries Career and the two
         policies, so they belong here rather than only in the legal row. */
      { label: "Career", href: "/career" },
    ],
  },
  {
    title: "Products",
    links: [
      ...footerProductLinks,
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "News & Events", href: "/news-events" },
      { label: "Downloads", href: "/downloads" },
      { label: "Quality Policy", href: "/quality-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Request a quote", href: "/contact" },
      { label: "Career", href: "/career" },
    ],
  },
];
