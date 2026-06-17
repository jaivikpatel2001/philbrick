import type { Service } from "@/types";
import { SERVICE_IMG } from "./images";

export const SERVICES: Service[] = [
  {
    slug: "installation",
    name: "Installation & Commissioning",
    shortName: "Installation",
    tagline: "Precision delivery, on schedule, every time.",
    description:
      "From shaft survey to final handover, our certified crews install and commission your vertical transport with millimetre accuracy and zero surprises.",
    heroImage: SERVICE_IMG.installation,
    iconName: "FiTool",
    benefits: [
      {
        iconName: "FiClock",
        title: "On-time delivery",
        description:
          "BIM-coordinated planning and pre-fabrication keep installation on the critical path — not on it.",
      },
      {
        iconName: "FiShield",
        title: "Safety-first crews",
        description:
          "Factory-certified technicians work to a single global safety standard on every site.",
      },
      {
        iconName: "FiCheckCircle",
        title: "Commissioned & certified",
        description:
          "Every unit is load-tested, ride-tuned and certified to local code before handover.",
      },
    ],
    process: [
      { step: "01", title: "Survey & BIM", description: "Laser shaft survey and BIM coordination with your structure and MEP." },
      { step: "02", title: "Pre-fabrication", description: "Components pre-assembled and tested in the factory to cut site time." },
      { step: "03", title: "Installation", description: "Certified crews install rails, car, drive and fixtures to spec." },
      { step: "04", title: "Commissioning", description: "Load tests, ride tuning, code certification and full handover." },
    ],
    stats: [
      { value: 99.2, suffix: "%", decimals: 1, label: "On-time handover" },
      { value: 14, suffix: " days", label: "Avg. install (low-rise)" },
      { value: 0, label: "Lost-time incidents 2025" },
    ],
  },
  {
    slug: "maintenance",
    name: "Predictive Maintenance",
    shortName: "Maintenance",
    tagline: "Service that sees problems before you do.",
    description:
      "VERTIQ Pulse™ monitors your fleet around the clock, turning maintenance from a calendar into a conversation between your equipment and our engineers.",
    heroImage: SERVICE_IMG.maintenance,
    iconName: "FiActivity",
    benefits: [
      {
        iconName: "FiWifi",
        title: "Always connected",
        description:
          "200+ sensors per unit stream condition data to the Pulse™ cloud in real time.",
      },
      {
        iconName: "FiTrendingUp",
        title: "Predict, don't react",
        description:
          "Machine-learning models flag wear weeks ahead — 6 in 10 issues resolved remotely.",
      },
      {
        iconName: "FiClock",
        title: "99.9% uptime",
        description:
          "Condition-based service keeps availability high and call-backs rare.",
      },
    ],
    process: [
      { step: "01", title: "Connect", description: "Pulse™ gateway links your equipment to the VERTIQ cloud." },
      { step: "02", title: "Monitor", description: "Continuous diagnostics across 200+ data points per unit." },
      { step: "03", title: "Predict", description: "ML models forecast wear and schedule the right part, the first time." },
      { step: "04", title: "Resolve", description: "Remote fixes where possible, dispatched technicians where needed." },
    ],
    stats: [
      { value: 99.9, suffix: "%", decimals: 1, label: "Fleet uptime" },
      { value: 60, suffix: "%", label: "Issues fixed remotely" },
      { value: 35, suffix: "%", label: "Fewer call-backs" },
    ],
  },
  {
    slug: "modernization",
    name: "Modernization & Retrofit",
    shortName: "Modernization",
    tagline: "Renew the ride without rebuilding the shaft.",
    description:
      "Bring ageing elevators up to modern standards of performance, efficiency and safety — in stages, with minimal disruption to your building.",
    heroImage: SERVICE_IMG.modernization,
    iconName: "FiRefreshCw",
    benefits: [
      {
        iconName: "FiZap",
        title: "Up to 50% greener",
        description:
          "Swap legacy drives for regenerative VFD systems and slash energy bills.",
      },
      {
        iconName: "FiLayers",
        title: "Phased upgrades",
        description:
          "Modernize controllers, drives, cabs or doors independently — keep cars running.",
      },
      {
        iconName: "FiShield",
        title: "Code-compliant",
        description:
          "Bring older equipment up to current EN 81-20/50 and accessibility standards.",
      },
    ],
    process: [
      { step: "01", title: "Audit", description: "Full condition and energy audit of your existing equipment." },
      { step: "02", title: "Plan", description: "A staged roadmap that fits your budget and minimises downtime." },
      { step: "03", title: "Upgrade", description: "Drives, controls, fixtures or full replacement — your choice." },
      { step: "04", title: "Verify", description: "Performance, energy and safety re-certified after each phase." },
    ],
    stats: [
      { value: 50, suffix: "%", label: "Energy reduction" },
      { value: 30, suffix: "%", label: "Faster ride times" },
      { value: 25, suffix: "+ yrs", label: "Life extension" },
    ],
  },
  {
    slug: "amc",
    name: "Annual Maintenance Contracts",
    shortName: "AMC",
    tagline: "One contract. Total peace of mind.",
    description:
      "Flexible AMC plans — from essential cover to fully comprehensive — backed by guaranteed response times and our 24/7 command centre.",
    heroImage: SERVICE_IMG.amc,
    iconName: "FiShield",
    benefits: [
      {
        iconName: "FiClock",
        title: "Guaranteed response",
        description:
          "Contracted response times, 24/7, with entrapment calls prioritised within 30 minutes.",
      },
      {
        iconName: "FiBarChart2",
        title: "Transparent reporting",
        description:
          "A live portal shows every visit, part and KPI across your portfolio.",
      },
      {
        iconName: "FiCheckCircle",
        title: "Predictable cost",
        description:
          "Fixed annual fees with comprehensive parts cover — no surprise invoices.",
      },
    ],
    process: [
      { step: "01", title: "Assess", description: "We survey your equipment and recommend the right cover tier." },
      { step: "02", title: "Agree", description: "Choose Essential, Plus or Comprehensive — clear SLAs, fixed fee." },
      { step: "03", title: "Maintain", description: "Scheduled visits plus Pulse™ monitoring keep cars healthy." },
      { step: "04", title: "Report", description: "Live KPIs and quarterly reviews keep you fully informed." },
    ],
    stats: [
      { value: 30, suffix: " min", label: "Entrapment response" },
      { value: 24, suffix: "/7", label: "Command centre" },
      { value: 98, suffix: "%", label: "Contract renewal" },
    ],
  },
];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
