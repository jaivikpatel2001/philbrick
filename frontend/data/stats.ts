import type { Stat } from "@/types";

/** Headline trust metrics — homepage hero band. */
export const TRUST_METRICS: Stat[] = [
  { value: 57, label: "Years of engineering", description: "Founded in Pune, 1968" },
  { value: 1.4, decimals: 1, suffix: "M", label: "Units in service", description: "Across India" },
  { value: 28, suffix: "+", label: "States & UTs", description: "Pan-India network" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Fleet uptime", description: "Pulse™ monitored" },
];

/** Big statistics band — homepage statistics section. */
export const COMPANY_STATS: Stat[] = [
  { value: 1.2, decimals: 1, suffix: "M", label: "Sensors monitored live", description: "Streaming to Pulse™ every second" },
  { value: 30, suffix: "%", label: "Average wait reduced", description: "With destination dispatch" },
  { value: 50, suffix: "%", label: "Less energy used", description: "Regenerative drive systems" },
  { value: 12000, suffix: "+", label: "Projects delivered", description: "From homes to supertalls" },
];

export const SUSTAINABILITY_STATS: Stat[] = [
  { value: 2035, label: "Net-zero target", description: "Across operations" },
  { value: 50, suffix: "%", label: "Energy recovered", description: "Regenerative fleet" },
  { value: 92, suffix: "%", label: "Recyclable materials", description: "By unit weight" },
  { value: 18, suffix: "k t", label: "CO₂ avoided in 2025", description: "Versus 2018 baseline" },
];

export const CAREERS_STATS: Stat[] = [
  { value: 9000, suffix: "+", label: "Employees" },
  { value: 28, suffix: "+", label: "States & UTs" },
  { value: 38, suffix: "%", label: "Women in engineering" },
  { value: 4.6, decimals: 1, suffix: "/5", label: "Glassdoor rating" },
];

export const GLOBAL_STATS: Stat[] = [
  { value: 120, suffix: "+", label: "Cities served" },
  { value: 4, label: "Manufacturing sites" },
  { value: 3, label: "R&D centres" },
  { value: 320, suffix: "+", label: "Service branches" },
];
