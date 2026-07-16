import type { Stat } from "@/types";

/* =============================================================================
   PHILBRICK — STATISTICS
   Honest, verifiable facts only. No invented units-in-service, uptime, project
   counts, employee numbers or environmental figures.
     • Founded 1992 (Ahmedabad, Gujarat)      → 30+ years
     • 14 product categories, ~35 products/variants (see data/products.ts)
     • Dedicated in-house units: procurement, design, QC, warehousing, packaging
     • Exports to China & Taiwan
   ========================================================================== */

/** Headline trust metrics — page heroes / hero bands. */
export const TRUST_METRICS: Stat[] = [
  { value: 30, suffix: "+", label: "Years of engineering", description: "Since 1992, Ahmedabad" },
  { value: 14, label: "Product categories", description: "Control panels to fixtures" },
  { value: 5, label: "In-house units", description: "Design · QC · procurement · warehousing" },
  { value: 2, label: "Export markets", description: "China & Taiwan" },
];

/** Big statistics band — homepage statistics section. */
export const COMPANY_STATS: Stat[] = [
  { value: 1992, label: "Established", description: "Ahmedabad, Gujarat" },
  { value: 14, label: "Product categories", description: "One-source elevator supply" },
  { value: 35, suffix: "+", label: "Products & variants", description: "Panels, doors, cabins, displays" },
  { value: 2, label: "Export markets", description: "China & Taiwan" },
];

/** Infrastructure scale — About / Infrastructure page. */
export const GLOBAL_STATS: Stat[] = [
  { value: 5, label: "In-house units", description: "Procurement · design · QC · warehousing · packaging" },
  { value: 1, label: "Manufacturing facility", description: "10,000+ sq ft at GIDC Kathwada, Ahmedabad" },
  { value: 14, label: "Product categories", description: "Built under one roof" },
  { value: 2, label: "Export markets", description: "China & Taiwan" },
];
