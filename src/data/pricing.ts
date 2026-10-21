// All prices are in AZN, excluding VAT.

export type PriceUnit = "month" | "session";

export type ServicePrice = {
  name: string;
  description: string;
  from: number;
  weeks?: [number, number];
  unit?: PriceUnit;
};

export const pricing = {
  currency: "AZN",
  services: {
    site: {
      name: "Website",
      description: "Company, product or portfolio site",
      from: 1500,
      weeks: [3, 5],
    },
    webapp: {
      name: "Web app or SaaS",
      description: "Accounts, dashboards, business logic",
      from: 4500,
      weeks: [8, 12],
    },
    shop: {
      name: "E-commerce",
      description: "Catalog, cart, payments, orders",
      from: 3500,
      weeks: [6, 9],
    },
    platform: {
      name: "Marketplace or platform",
      description: "Two-sided products like BidBary",
      from: 7000,
      weeks: [12, 20],
    },
    admin: {
      name: "Admin panel or internal tool",
      description: "Back-office, approvals, reporting",
      from: 2500,
      weeks: [4, 8],
    },
    api: {
      name: "Backend and APIs",
      description: "Integrations, microservices, performance",
      from: 3000,
      weeks: [4, 8],
    },
    security: {
      name: "Security review",
      description: "Audit with a prioritized fix list",
      from: 900,
      weeks: [1, 2],
    },
    lead: {
      name: "Technical leadership",
      description: "Fractional tech lead, per month",
      from: 2000,
      unit: "month",
    },
    mentor: {
      name: "Mentoring session",
      description: "For developers and founders",
      from: 60,
      unit: "session",
    },
  },
  packages: {
    short: {
      label: "Starter",
      name: "Short film",
      description: "Core features only. One round of revisions. Launch-ready, no extras.",
      multiplier: 0.75,
      timeFactor: 0.75,
    },
    feature: {
      label: "Standard",
      name: "Feature film",
      description: "Full scope with polish. Two rounds of revisions. Handover and documentation.",
      multiplier: 1,
      timeFactor: 1,
    },
    blockbuster: {
      label: "Premium",
      name: "Blockbuster",
      description: "Complex scope and integrations. Priority schedule. Extended support after launch.",
      multiplier: 1.6,
      timeFactor: 1.35,
    },
  },
  addons: {
    design: {
      name: "Custom interface design",
      description: "Visual direction and UI screens",
      price: 800,
    },
    lang: {
      name: "Multilingual",
      description: "English, Azerbaijani, Russian",
      price: 400,
    },
    pay: {
      name: "Online payments",
      description: "Card payments and invoices",
      price: 600,
    },
    analytics: {
      name: "Analytics and tracking",
      description: "Dashboards for your key numbers",
      price: 300,
    },
    seo: {
      name: "SEO setup",
      description: "Metadata, sitemap, performance",
      price: 300,
    },
    support: {
      name: "Care plan",
      description: "Monthly updates and fixes",
      price: 250,
      unit: "month",
    },
  },
  timeline: {
    flex: {
      name: "Flexible",
      description: "Slower pace, lower price",
      multiplier: 0.9,
      timeFactor: 1.3,
    },
    standard: {
      name: "Standard",
      description: "The usual schedule",
      multiplier: 1,
      timeFactor: 1,
    },
    rush: {
      name: "Fast track",
      description: "Priority, faster delivery",
      multiplier: 1.3,
      timeFactor: 0.7,
    },
  },
  budgets: [
    "Under AZN 3,000",
    "AZN 3,000 to 8,000",
    "AZN 8,000 to 20,000",
    "Over AZN 20,000",
    "Not sure yet",
  ],
} as {
  currency: string;
  services: Record<string, ServicePrice>;
  packages: Record<
    string,
    { label: string; name: string; description: string; multiplier: number; timeFactor: number }
  >;
  addons: Record<string, { name: string; description: string; price: number; unit?: PriceUnit }>;
  timeline: Record<string, { name: string; description: string; multiplier: number; timeFactor: number }>;
  budgets: string[];
};

export const booking = {
  /** Intro call slots, Baku time. */
  slots: ["10:00", "11:30", "14:00", "15:30", "17:00"],
  /** How many working days ahead can be booked. */
  days: 12,
};
