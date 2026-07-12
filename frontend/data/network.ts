/* =============================================================================
   PHILBRICK — DOMESTIC NETWORK DATA

   ⚠ SOURCE OF TRUTH: the client's own "Our Domestic Business" India map
   (artwork supplied 2026-07-12). The 31 cities below are exactly the cities
   marked on that map — Ahmedabad is its emphasised point (the HQ/factory).
   Do NOT add cities, dealer counts, service-centre counts or state-coverage
   claims that are not on that artwork or otherwise verified.

   (City spellings normalised: "Sri Nagar" → Srinagar, "Bhuvneswar" →
   Bhubaneswar. States are plain geographic fact.)

   labelDx/labelDy (map units) + labelAnchor place each city's permanent map
   label, hand-tuned per city (mirroring the client artwork's label sides) so
   labels never collide in the dense clusters (UP belt, Mumbai/Pune/Nashik,
   Gujarat). Keep each city on ONE line — scripts/checkNetworkMap.mjs parses
   this file line-wise to render the QA preview.
   ========================================================================== */

export interface NetworkCity {
  name: string;
  state: string;
  /** WGS84 — projected onto the map by projectIndia() from data/indiaMap.ts */
  lon: number;
  lat: number;
  /** Headquarters + factory (the emphasised point on the client's map). */
  hq?: boolean;
  /** Permanent label offset from the marker, in map (viewBox) units. */
  labelDx: number;
  labelDy: number;
  labelAnchor: "start" | "middle" | "end";
}

export const NETWORK_CITIES: NetworkCity[] = [
  { name: "Srinagar", state: "Jammu & Kashmir", lon: 74.8, lat: 34.08, labelDx: -8, labelDy: 4, labelAnchor: "end" },
  { name: "Amritsar", state: "Punjab", lon: 74.87, lat: 31.63, labelDx: 8, labelDy: 4, labelAnchor: "start" },
  { name: "Chandigarh", state: "Chandigarh", lon: 76.79, lat: 30.74, labelDx: 8, labelDy: 4, labelAnchor: "start" },
  { name: "New Delhi", state: "Delhi", lon: 77.21, lat: 28.61, labelDx: -8, labelDy: 4, labelAnchor: "end" },
  { name: "Jaipur", state: "Rajasthan", lon: 75.79, lat: 26.91, labelDx: -8, labelDy: 4, labelAnchor: "end" },
  { name: "Lucknow", state: "Uttar Pradesh", lon: 80.95, lat: 26.85, labelDx: 7, labelDy: -6, labelAnchor: "start" },
  { name: "Kanpur", state: "Uttar Pradesh", lon: 80.33, lat: 26.45, labelDx: -7, labelDy: 4, labelAnchor: "end" },
  { name: "Prayagraj", state: "Uttar Pradesh", lon: 81.85, lat: 25.44, labelDx: -7, labelDy: 12, labelAnchor: "end" },
  { name: "Varanasi", state: "Uttar Pradesh", lon: 82.99, lat: 25.32, labelDx: 5, labelDy: 14, labelAnchor: "start" },
  { name: "Patna", state: "Bihar", lon: 85.14, lat: 25.59, labelDx: 8, labelDy: -3, labelAnchor: "start" },
  { name: "Guwahati", state: "Assam", lon: 91.74, lat: 26.14, labelDx: -8, labelDy: -5, labelAnchor: "end" },
  { name: "Imphal", state: "Manipur", lon: 93.94, lat: 24.82, labelDx: -8, labelDy: 4, labelAnchor: "end" },
  { name: "Udaipur", state: "Rajasthan", lon: 73.71, lat: 24.58, labelDx: -8, labelDy: 1, labelAnchor: "end" },
  { name: "Kandla", state: "Gujarat", lon: 70.22, lat: 23.03, labelDx: -2, labelDy: -11, labelAnchor: "middle" },
  { name: "Ahmedabad", state: "Gujarat", lon: 72.57, lat: 23.02, hq: true, labelDx: -11, labelDy: 12, labelAnchor: "end" },
  { name: "Rajkot", state: "Gujarat", lon: 70.8, lat: 22.3, labelDx: 0, labelDy: 18, labelAnchor: "middle" },
  { name: "Bhopal", state: "Madhya Pradesh", lon: 77.41, lat: 23.26, labelDx: 8, labelDy: 2, labelAnchor: "start" },
  { name: "Ranchi", state: "Jharkhand", lon: 85.31, lat: 23.34, labelDx: -8, labelDy: 1, labelAnchor: "end" },
  { name: "Kolkata", state: "West Bengal", lon: 88.36, lat: 22.57, labelDx: 8, labelDy: 7, labelAnchor: "start" },
  { name: "Nagpur", state: "Maharashtra", lon: 79.09, lat: 21.15, labelDx: -8, labelDy: -3, labelAnchor: "end" },
  { name: "Raipur", state: "Chhattisgarh", lon: 81.63, lat: 21.25, labelDx: 8, labelDy: 2, labelAnchor: "start" },
  { name: "Bhubaneswar", state: "Odisha", lon: 85.82, lat: 20.3, labelDx: -9, labelDy: 7, labelAnchor: "end" },
  { name: "Nashik", state: "Maharashtra", lon: 73.79, lat: 19.99, labelDx: -8, labelDy: -4, labelAnchor: "end" },
  { name: "Mumbai", state: "Maharashtra", lon: 72.88, lat: 19.08, labelDx: 8, labelDy: -2, labelAnchor: "start" },
  { name: "Pune", state: "Maharashtra", lon: 73.86, lat: 18.52, labelDx: -7, labelDy: 11, labelAnchor: "end" },
  { name: "Hyderabad", state: "Telangana", lon: 78.49, lat: 17.39, labelDx: -9, labelDy: -5, labelAnchor: "end" },
  { name: "Goa", state: "Goa", lon: 73.83, lat: 15.49, labelDx: 7, labelDy: 4, labelAnchor: "start" },
  { name: "Bangalore", state: "Karnataka", lon: 77.59, lat: 12.97, labelDx: -9, labelDy: 4, labelAnchor: "end" },
  { name: "Chennai", state: "Tamil Nadu", lon: 80.27, lat: 13.08, labelDx: 8, labelDy: 4, labelAnchor: "start" },
  { name: "Kochi", state: "Kerala", lon: 76.27, lat: 9.93, labelDx: 8, labelDy: -2, labelAnchor: "start" },
  { name: "Thiruvananthapuram", state: "Kerala", lon: 76.94, lat: 8.52, labelDx: 4, labelDy: 19, labelAnchor: "middle" },
];

export const HQ_CITY = NETWORK_CITIES.find((c) => c.hq)!;

/* Decorative supply arcs from the Ahmedabad factory to a spread of network
   cities. Purely illustrative composition ("components ship from Ahmedabad
   across India" is verified company copy) — NOT specific logistics routes. */
export const ARC_TARGETS = [
  "New Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Guwahati",
  "Srinagar",
] as const;
