/* =============================================================================
   TRUST BADGES — shared content for the homepage hero (Variant18Hero via
   TrustBadges). Copy uses only verifiable Philbrick facts (constants/site.ts +
   data/company.ts): founded 1992 in Ahmedabad; ISO quality process tested to
   Indian standards; in-house manufacturing; exporter (India, China, Taiwan).

   (This file also held CTA / HERO_IMG / PRODUCT_TILES / SPEC_CARDS / HOTSPOTS
   for the corporate hero variants 7–15; those were removed with the variants on
   2026-07-23. Only the trust badges remain in use.)
   ========================================================================== */

export interface TrustBadge {
  stat: string;
  label: string;
}

export const TRUST_BADGES: TrustBadge[] = [
  { stat: "Since 1992", label: "Three decades of engineering" },
  { stat: "ISO Process", label: "Tested to Indian standards" },
  { stat: "In-house", label: "Built in Ahmedabad, India" },
  { stat: "Exporter", label: "India, China and Taiwan" },
];
