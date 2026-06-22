/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  REGION CONTENT — the single source of truth for every regional page.
 * ─────────────────────────────────────────────────────────────────────────────
 *  This file is deliberately shaped like a headless-CMS schema (Sanity / Storyblok).
 *  In production each `Region` becomes a CMS document and each `Project` / `Service`
 *  / `Leader` a referenced entry the client edits themselves — no code change.
 *
 *  For the MVP the data lives here in code; the page components read from it
 *  exactly as they would read from a CMS query. Swapping the source later is a
 *  one-file change: replace `getRegion()` with a CMS fetch. The design never moves.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type RegionId = "us" | "uae" | "india";

export interface Service {
  name: string;
  description: string;
  /** lucide-react icon name — resolved in the UI layer */
  icon: string;
}

export interface Project {
  title: string;
  sector: string;
  location: string;
  image: string;
  blurb: string;
}

export interface Leader {
  name: string;
  role: string;
  bio: string;
}

export interface Region {
  id: RegionId;
  /** Short label for the selector tile, e.g. "USA" */
  label: string;
  /** Legal/operating entity name in this market */
  entity: string;
  country: string;
  flag: string;          // emoji — placeholder until SVG flags are supplied
  /** Selector + hero imagery */
  heroImage: string;
  /** Accent color for this region (overrides the brand ember per-market) */
  accent: string;
  accentSoft: string;

  /** Selector tile copy */
  tileTagline: string;
  tileStats: { value: string; label: string }[];

  /** Regional hub hero */
  headline: string;
  headlineAccent: string;   // the italic accent word inside the headline
  sub: string;

  about: string;
  established: string;

  services: Service[];
  projects: Project[];
  clients: string[];
  leadership: Leader[];

  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
}

/* ─────────────────────────────────────────────────────────────────────────── */

export const REGIONS: Record<RegionId, Region> = {
  /* ── UNITED STATES ──────────────────────────────────────────────────────── */
  us: {
    id: "us",
    label: "USA",
    entity: "Super Trades USA",
    country: "United States",
    flag: "🇺🇸",
    heroImage: "/regions/us-hero.jpg",
    accent: "#C8511F",
    accentSoft: "#FFB27A",
    tileTagline: "Passive fire protection for American commercial steel.",
    tileStats: [
      { value: "200+", label: "Projects delivered" },
      { value: "PA · MA", label: "Core markets" },
    ],
    headline: "Fireproofing &",
    headlineAccent: "structural protection",
    sub: "Cementitious and intumescent fireproofing, spray insulation and fire-barrier coatings for commercial structures across the Northeast.",
    about:
      "Super Trades USA brings NCCC's five decades of industrial lining expertise to the American commercial market. We apply passive fire protection, thermal and acoustical insulation, and code-compliant firestop systems to structural steel — keeping buildings and the people inside them safe.",
    established: "US operations since 2019",
    services: [
      { name: "Structural Fireproofing", description: "Intumescent and cementitious fireproofing applied over structural steel to meet UL-rated fire-resistance assemblies.", icon: "Flame" },
      { name: "Spray Insulation", description: "Spray-applied thermal and acoustical glass-fiber insulation (R-4.17/inch) for ceilings, decks and mechanical spaces.", icon: "Layers" },
      { name: "Fire-Barrier Coatings", description: "Air-barrier and weather-resistant fire-protective coatings for building envelopes.", icon: "ShieldCheck" },
      { name: "Firestop Systems", description: "Hilti firestop systems for through-penetrations and joints — sealing the gaps that fire and smoke travel through.", icon: "Shield" },
      { name: "Tank & Pipe Linings", description: "Protective containment linings for industrial vessels and piping.", icon: "Cylinder" },
      { name: "Water & Wastewater Lining", description: "Manhole and infrastructure relining for municipal water and wastewater systems.", icon: "Droplets" },
    ],
    projects: [
      { title: "King of Prussia Mall", sector: "Commercial Retail", location: "Pennsylvania", image: "/regions/project-construction.jpg", blurb: "Structural fireproofing across one of the largest retail complexes in the United States." },
      { title: "Goodman Building", sector: "Commercial", location: "Pennsylvania", image: "/regions/project-cad.jpg", blurb: "Cementitious fireproofing and firestop systems for a multi-storey commercial build." },
      { title: "Havre Street", sector: "Mixed-Use", location: "Boston, MA", image: "/regions/project-engineering.jpg", blurb: "Spray-applied insulation and fire-barrier coatings for a Boston development." },
    ],
    clients: ["E.L. Construction", "Greystar", "BZT", "Triconde", "MCD Construction"],
    leadership: [
      { name: "Arizul Islam", role: "Director, US Operations", bio: "Mechanical engineer and industrial coatings & linings specialist, leading NCCC's delivery across the United States and the Middle East." },
    ],
    contact: {
      email: "us@onenccc.com",
      phone: "+1 (610) 000-0000",
      address: "King of Prussia, Pennsylvania, USA",
      hours: "Mon–Fri · 7:00 AM – 5:00 PM ET",
    },
  },

  /* ── UNITED ARAB EMIRATES ───────────────────────────────────────────────── */
  uae: {
    id: "uae",
    label: "UAE",
    entity: "New Calcutta Technical Services LLC",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    heroImage: "/regions/uae-hero.jpg",
    accent: "#2B6E8F",
    accentSoft: "#7FD0E8",
    tileTagline: "Refractory, lining & insulation for Gulf heavy industry.",
    tileStats: [
      { value: "Oil & Gas", label: "Core sector" },
      { value: "UAE-wide", label: "Coverage" },
    ],
    headline: "Industrial lining for",
    headlineAccent: "the Gulf's heaviest plants",
    sub: "Acid-proof and chimney lining, refractory and high-temperature insulation for refineries, cement factories and paper mills across the Emirates.",
    about:
      "New Calcutta Technical Services delivers NCCC's specialist lining and insulation capability to the United Arab Emirates' most demanding industrial sites — from the Al Taweelah refinery to Sharjah's cement factories. We protect the assets that the Gulf economy runs on.",
    established: "Operating across the UAE",
    services: [
      { name: "Acid-Proof Lining", description: "Corrosion-resistant linings for chimneys, ducts and process equipment at cement plants and refineries.", icon: "ShieldCheck" },
      { name: "Refractory", description: "High-temperature refractory installation and gunniting for furnaces, kilns and boilers.", icon: "Flame" },
      { name: "Chimney & Borosilicate Lining", description: "Specialist lining systems for industrial stacks and corrosive flue-gas environments.", icon: "Factory" },
      { name: "Thermal Insulation", description: "High-temperature insulation for refineries, paper mills and process piping.", icon: "Layers" },
    ],
    projects: [
      { title: "EGA — Al Taweelah Refinery", sector: "Oil & Gas / Aluminium", location: "Abu Dhabi", image: "/regions/uae-hero.jpg", blurb: "Refractory and insulation works at one of the world's largest aluminium refineries." },
      { title: "Sharjah Cement Factory", sector: "Cement", location: "Sharjah", image: "/regions/project-plant.jpg", blurb: "Acid-proof chimney lining and refractory installation for cement production." },
      { title: "Ittihad Paper Mill", sector: "Paper", location: "Muffasah", image: "/regions/project-engineering.jpg", blurb: "Thermal insulation and lining works for a major regional paper mill." },
    ],
    clients: ["Emirates Global Aluminium", "Sharjah Cement Factory", "Ittihad Paper Mill", "Dubai Municipal Corporation"],
    leadership: [],
    contact: {
      email: "uae@onenccc.com",
      phone: "+971 0 000 0000",
      address: "Dubai, United Arab Emirates",
      hours: "Sun–Thu · 8:00 AM – 6:00 PM GST",
    },
  },

  /* ── INDIA ──────────────────────────────────────────────────────────────── */
  india: {
    id: "india",
    label: "India",
    entity: "Nu Calcutta Construction Company",
    country: "India",
    flag: "🇮🇳",
    heroImage: "/regions/india-hero.jpg",
    accent: "#B8860B",
    accentSoft: "#E8C36A",
    tileTagline: "The original NCCC — industrial lining since 1993.",
    tileStats: [
      { value: "Since 1993", label: "Founded" },
      { value: "6+", label: "Countries served" },
    ],
    headline: "Three decades of",
    headlineAccent: "industrial lining mastery",
    sub: "The founding house of NCCC. Refractory, thermal insulation, gunniting, fireproofing and acid-proof lining for India's power, steel, cement and petrochemical industries.",
    about:
      "Nu Calcutta Construction Company is where NCCC began. Founded in Kolkata in 1993, it is a market leader in industrial lining — refractory, insulation, chimney and borosilicate lining, fireproofing and acid-resistant works — for India's largest public and private enterprises, with projects reaching the UAE, Turkey, Algeria, Kenya and Zambia.",
    established: "Founded in Kolkata, 1993",
    services: [
      { name: "Refractory", description: "Refractory lining and gunniting for furnaces, kilns and high-temperature vessels across heavy industry.", icon: "Flame" },
      { name: "Thermal Insulation", description: "Industrial thermal insulation for power plants, refineries and process plants.", icon: "Layers" },
      { name: "Fireproofing", description: "Passive fire protection for structural steel and process equipment.", icon: "ShieldCheck" },
      { name: "Acid-Proof Lining", description: "Acid and corrosion-resistant lining for chemical and process environments.", icon: "Shield" },
      { name: "Gunniting", description: "Spray-applied refractory and concrete repair for industrial structures.", icon: "Factory" },
      { name: "Wrapping & Coating", description: "Protective wrapping and coating works for pipelines and industrial assets.", icon: "Cylinder" },
    ],
    projects: [
      { title: "National Power Plant", sector: "Power Generation", location: "India", image: "/regions/project-energy.jpg", blurb: "Refractory and thermal insulation works for thermal power generation." },
      { title: "Automotive Manufacturing", sector: "Automotive", location: "India", image: "/regions/india-hero.jpg", blurb: "Industrial lining and fireproofing for a car manufacturing facility." },
      { title: "Petrochemical Complex", sector: "Petrochemical", location: "India", image: "/regions/project-plant.jpg", blurb: "Acid-proof lining and refractory installation for a petrochemical plant." },
    ],
    clients: ["Power Plants", "Steel Plants", "Cement Plants", "Petrochemical & Pharma", "Glass & Paper Industries"],
    leadership: [
      { name: "Anwarul Islam", role: "Founder & Chairman", bio: "Over 50 years in the industrial field, having begun his career at Lloyds. Founder of the NCCC group." },
      { name: "Areful Islam", role: "Director", bio: "IIT graduate with an EPGM from MIT, Boston, and 25 years of experience across the group's operations." },
    ],
    contact: {
      email: "india@onenccc.com",
      phone: "+91 00 0000 0000",
      address: "Kolkata, West Bengal, India",
      hours: "Mon–Sat · 9:30 AM – 6:30 PM IST",
    },
  },
};

/** Ordered list for the selector + iteration. */
export const REGION_ORDER: RegionId[] = ["us", "uae", "india"];

export const REGION_LIST: Region[] = REGION_ORDER.map((id) => REGIONS[id]);

export function getRegion(id: string): Region | null {
  return (REGIONS as Record<string, Region>)[id] ?? null;
}

/** Group-level brand constants shared by every region. */
export const GROUP = {
  name: "NCCC",
  fullName: "NCCC Group",
  domain: "onenccc.com",
  tagline: "Specialty industrial services — fireproofing, insulation, coatings & linings.",
  descriptor: "A global specialty industrial services group operating across the United States, the United Arab Emirates and India.",
};
