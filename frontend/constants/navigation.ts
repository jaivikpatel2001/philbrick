/* =============================================================================
   VERTIQ — NAVIGATION ARCHITECTURE (focused scope)
   Home · Products (12 categories) · Services · About · Testimonials · Contact
   ========================================================================== */
import type { NavItem } from "@/types";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { PRODUCT_IMG } from "@/data/images";

const productColumns = PRODUCT_GROUPS.map((group) => ({
  title: group.title,
  links: group.slugs.map((slug) => {
    const product = PRODUCTS.find((p) => p.slug === slug)!;
    return {
      label: product.name,
      href: `/products/${slug}`,
      description: product.category,
    };
  }),
}));

export const MAIN_NAV: NavItem[] = [
  {
    label: "Products",
    href: "/products",
    mega: {
      columns: productColumns,
      feature: {
        eyebrow: "Flagship",
        title: "VERTIQ Helix™",
        description:
          "Our gearless MRL platform — 40% more efficient, whisper-quiet, destination-dispatched.",
        href: "/products/passenger-elevators",
        image: PRODUCT_IMG.passenger,
      },
    },
  },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_NAV: FooterColumn[] = [
  {
    title: "Elevators",
    links: [
      { label: "Passenger Elevators", href: "/products/passenger-elevators" },
      { label: "Home Elevators", href: "/products/home-elevators" },
      { label: "High-Speed Elevators", href: "/products/high-speed-elevators" },
      { label: "MRL Elevators", href: "/products/mrl-elevators" },
      { label: "Panoramic Elevators", href: "/products/panoramic-elevators" },
      { label: "Capsule Elevators", href: "/products/capsule-elevators" },
    ],
  },
  {
    title: "Specialised & Mobility",
    links: [
      { label: "Hospital Elevators", href: "/products/hospital-elevators" },
      { label: "Freight Elevators", href: "/products/freight-elevators" },
      { label: "Dumbwaiter & Service", href: "/products/dumbwaiter-elevators" },
      { label: "Escalators", href: "/products/escalators" },
      { label: "Moving Walkways", href: "/products/moving-walkways" },
      { label: "Components", href: "/products/components" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About VERTIQ", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
      { label: "All Products", href: "/products" },
    ],
  },
];
