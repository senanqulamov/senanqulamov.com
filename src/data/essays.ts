export type Essay = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  minutes: number;
  tags: string[];
};

// Newest first. The text of each essay lives in src/content/essays/<slug>.md
export const essays: Essay[] = [
  {
    slug: "ai-controls-us-or-we-control-ai",
    title: "AI Controls Us or Do We Control AI?",
    excerpt:
      "Artificial Intelligence is no longer a distant concept – it’s shaping our daily lives. But the real question remains: are we using AI, or is AI using us?",
    date: "2025-09-30",
    minutes: 7,
    tags: ["Blog"],
  },
  {
    slug: "mental-health-remote-developers",
    title: "The Mental Health of Remote Developers",
    excerpt:
      "A comprehensive guide combining therapist insights with developer experience to address the unique mental health challenges of remote development work.",
    date: "2025-09-20",
    minutes: 15,
    tags: ["Blog"],
  },
  {
    slug: "neosphere-workers-union-marketplace",
    title: "NeoSphere: Revolutionizing the Gig Economy",
    excerpt:
      "How we built NeoSphere from concept to production, creating a platform that empowers freelancers, connects communities, and transforms the fragmented gig economy landscape.",
    date: "2025-09-17",
    minutes: 9,
    tags: ["Startup", "Social"],
  },
  {
    slug: "bidbary-auction-platform-innovation",
    title: "BidBary: The Future of Digital Auctions",
    excerpt:
      "From concept to execution: How we built BidBary to solve trust and transparency issues in digital auction platforms.",
    date: "2024-12-10",
    minutes: 12,
    tags: ["Startup"],
  },
  {
    slug: "admin-panels-scalable-architecture",
    title: "Building Scalable Admin Panels",
    excerpt:
      "Deep dive into creating admin panels that scale with your business, featuring real examples from our client projects.",
    date: "2024-12-05",
    minutes: 10,
    tags: ["Blog"],
  },
];
