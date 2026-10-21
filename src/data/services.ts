export type Service = {
  key: string;
  title: string;
  description: string;
  includes: string[];
  goodFor: string;
  /** Project slugs shown as examples. */
  relatedProjects: string[];
  /** Services pre-selected in the estimate builder. */
  estimateServices: string[];
  /** Optional link that replaces the estimate builder button. */
  link?: string;
};

export const services: Service[] = [
  {
    key: "build",
    title: "Product and MVP development",
    description: "From an idea on a napkin to a first version real people can use.",
    includes: [
      "Discovery and scope in plain language",
      "User flows and interface direction",
      "Full-stack build with Laravel, Java or Next.js",
      "Launch, analytics and a clear next step",
    ],
    goodFor: "Founders and teams validating a new product",
    relatedProjects: ["bidbary", "neosphere", "allrent"],
    estimateServices: ["webapp"],
  },
  {
    key: "ent",
    title: "Enterprise and e-commerce platforms",
    description: "Procurement, learning, office and commerce systems that hold up under real business rules.",
    includes: [
      "Role-based workflows and approvals",
      "Integrations with ERP, payment and third-party systems",
      "Admin panels teams actually enjoy",
      "Performance and data integrity from day one",
    ],
    goodFor: "Companies replacing spreadsheets or outdated software",
    relatedProjects: ["scmai", "edutoria", "ofisait10"],
    estimateServices: ["platform"],
  },
  {
    key: "api",
    title: "Backend architecture and APIs",
    description: "Clean, fast and documented backends that other teams can build on.",
    includes: [
      "API-first design with REST, OAuth and webhooks",
      "Java (Javalin) microservices next to Laravel",
      "Query tuning, caching and scaling plans",
      "CI/CD with GitHub Actions and Docker",
    ],
    goodFor: "Products that are slowing down as they grow",
    relatedProjects: ["fluxa", "jvd-cli", "gps-ai"],
    estimateServices: ["api"],
  },
  {
    key: "lead",
    title: "Technical leadership",
    description: "A tech lead who can join your team, set direction and ship with people.",
    includes: [
      "Architecture decisions and code review",
      "Hiring support, onboarding and team rituals",
      "Delivery planning your stakeholders can trust",
      "Mentoring engineers into leads",
    ],
    goodFor: "Teams without a senior technical owner",
    relatedProjects: ["allrent", "shiplounge"],
    estimateServices: ["lead"],
  },
  {
    key: "sec",
    title: "Security review",
    description: "A practical look at how exposed your product really is.",
    includes: [
      "Authentication and authorization review",
      "Common vulnerability checks on web apps and APIs",
      "Server and deployment hardening",
      "A prioritized, readable fix list",
    ],
    goodFor: "Products handling payments or personal data",
    relatedProjects: ["passmate"],
    estimateServices: ["security"],
  },
  {
    key: "mentor",
    title: "Mentoring for developers and founders",
    description: "Seven years of listening, applied to engineering careers and teams.",
    includes: [
      "Burnout, pressure and remote-work habits",
      "Leading people for the first time",
      "Difficult conversations and team conflict",
      "Founder decision-making under uncertainty",
    ],
    goodFor: "Engineers, new leads and early-stage founders. Mentoring, not clinical therapy.",
    relatedProjects: [],
    estimateServices: ["mentor"],
  },
  {
    key: "talks",
    title: "Talks and workshops",
    description: "Technology, psychology and leadership for stages, teams and classrooms.",
    includes: [
      "Keynotes and panel appearances",
      "Workshops for engineering teams",
      "Guest lectures and podcasts",
    ],
    goodFor: "Conferences, companies and universities",
    relatedProjects: [],
    estimateServices: [],
    link: "/press",
  },
];

export const engagementModels = [
  {
    letter: "A",
    title: "Fixed-scope project",
    text: "A defined outcome, timeline and price. Best for MVPs, platforms and audits.",
  },
  {
    letter: "B",
    title: "Monthly retainer",
    text: "Ongoing development or technical leadership, a set number of days each month.",
  },
  {
    letter: "C",
    title: "Advisory hours",
    text: "Architecture reviews, mentoring and second opinions, booked when you need them.",
  },
];

export const processSteps = [
  { title: "Pre-production", text: "A call to understand the problem, the people and the constraints." },
  { title: "Script", text: "A written proposal: scope, milestones, timeline and cost." },
  { title: "Production", text: "Weekly cuts you can see and click, with honest progress updates." },
  { title: "Premiere", text: "Launch, handover and support while the product finds its audience." },
];

export const faq: { question: string; answer: string }[] = [
  {
    question: "Do you work remotely?",
    answer: "Yes. I am based in Baku and work with teams onsite and remotely across time zones.",
  },
  {
    question: "Can you join an existing team?",
    answer: "Yes, as a senior engineer, a tech lead or an advisor alongside your current people.",
  },
  {
    question: "Is the mentoring therapy?",
    answer:
      "No. It draws on my therapy experience, but it is professional mentoring, not clinical treatment.",
  },
  {
    question: "How fast can we start?",
    answer: "Usually within two weeks of an agreed proposal, depending on current commitments.",
  },
];
