import { profile } from "./profile";

export const bios: { length: string; text: string }[] = [
  {
    length: "Short",
    text: "Senan Qulamov is a Baku-based engineer, tech lead and the founder of BidBary.",
  },
  {
    length: "Medium",
    text: "Senan Qulamov is a software engineer, tech lead and founder based in Baku, Azerbaijan. He leads engineering at PMIS (BP) and is building BidBary, a platform for auctions, concerts, private dinners, tours and workshops. Alongside engineering, he spent seven years as a therapist, which shapes how he leads teams and designs products.",
  },
  {
    length: "Long",
    text: "Senan Qulamov is a software engineer, tech lead and founder based in Baku, Azerbaijan. He studied Computer Science at Khazar University and earned a master's degree at Baku State University with SABAH Groups, specializing in cyber security and data science. Since 2019 he has built production systems for companies including Ferrum Capital, Deirvlon, Allrent and Inci Group, and today he leads engineering at PMIS (BP). He is the founder of BidBary and NeoSphere. For seven years, in parallel with engineering, he worked as a therapist. He speaks and writes about technology, psychology and leadership.",
  },
];

export const talks: { title: string; text: string; format: string }[] = [
  {
    title: "Leading engineers like a therapist",
    text: "How listening skills from seven years of therapy change code reviews, one-to-ones and conflict.",
    format: "Keynote, 30 min",
  },
  {
    title: "Platforms people gather on",
    text: "What building BidBary taught me about trust, pricing and the moments people remember.",
    format: "Talk, 25 min",
  },
  {
    title: "Burnout-proof remote teams",
    text: "Practical habits for developers and leads working across screens and time zones.",
    format: "Workshop, 2 hours",
  },
  {
    title: "Building from Baku for the world",
    text: "Making products in a growing tech scene, and why local problems are global.",
    format: "Panel or fireside chat",
  },
];

export const pressFacts: [label: string, value: string][] = [
  ["Name", profile.name],
  ["Also written", profile.alsoWritten],
  ["Based in", profile.city],
  ["Roles", "Founder of BidBary, Tech Lead at PMIS (BP)"],
  ["Topics", "Technology, psychology, leadership, building products"],
];

export const talkFormats = ["Keynote", "Talk", "Workshop", "Panel", "Podcast"];
