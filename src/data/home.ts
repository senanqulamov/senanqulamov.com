export const hero = {
  status: "Open to new projects from November",
  edition: "Portfolio, 2026 edition",
  intro:
    "Engineer from Baku. <b>Tech Lead at PMIS</b>, founder of <b>BidBary</b>, and for seven years, a therapist. I build software for the people who will use it.",
  portraitCaption: "Baku, 2025",
  portraitHint: "Move through the photo",
  badge: "ENGINEER · FOUNDER · LISTENER · SINCE 2019 · ",
};

export const marquee = [
  "Engineer",
  "Founder",
  "Listener",
  "Tech lead",
  "Seven years a therapist",
  "Built in Baku",
];

export const belief = {
  text: "People don't remember platforms. They remember the night they were there. I build the systems behind those moments.",
  note: "The one idea behind everything below.",
};

export const numbers: { value: number; plus: boolean; label: string }[] = [
  { value: 7, plus: true, label: "Years writing production code" },
  { value: 7, plus: true, label: "Years as a therapist, in parallel" },
  { value: 22, plus: false, label: "Products and platforms shipped" },
  { value: 200, plus: true, label: "Books read, and counting" },
];

export const story = {
  title: "From writing code to writing the plan.",
  intro: "An engineer who learned to listen, then learned to lead, then decided to build his own stage.",
  scenes: [
    {
      year: "2017",
      title: "It started with machines",
      text: "Computer Science at Khazar University. Second place at the World Robot Olympiad Azerbaijan in 2018.",
    },
    {
      year: "2019",
      title: "Learning to ship",
      text: "From an internship at ATL Tech to real products for Ferrum Capital, Deirvlon and others.",
    },
    {
      year: "7 yrs",
      title: "Learning to listen",
      text: "In parallel, seven years as a therapist. Understanding what people need before they can say it.",
    },
    {
      year: "2022",
      title: "First time leading",
      text: "Team lead at Deirvlon, then technical lead building the Allrent marketplace from zero.",
    },
    {
      year: "2024",
      title: "A year of discipline",
      text: "Military service. Resilience, teamwork and command, learned the hard way.",
    },
    {
      year: "2025",
      title: "Leading at scale",
      text: "Tech Lead at PMIS, after building enterprise backends for Inci Group with Laravel and Java.",
    },
    {
      year: "Now",
      title: "The big idea",
      text: "Founder and CEO of BidBary, a modern event discovery and ticketing platform.",
    },
  ],
};

export const bidbary = {
  tag: "Discover live experiences on bidbary.me",
  text: "A modern event platform for discovering, booking, hosting, and managing live experiences. Find events, choose seats, pay securely, and keep every ticket in one place.",
  formats: [
    { name: "Concerts", rule: "Choose ticket tiers and reserve your place" },
    { name: "Auctions", rule: "Join live bids with verified access and clear rules" },
    { name: "Parties", rule: "Manage invitations, tickets, and attendee lists" },
    { name: "Tours", rule: "Book by capacity with digital tickets and check-in" },
    { name: "Workshops", rule: "Reserve seats, manage applications, and validate entry" },
  ],
};

/** The interactive auction demo on the home page. */
export const liveLot = {
  number: "048",
  format: "Private dinner",
  title: "Chef's table for eight",
  rules: "Bid against the room. A bid in the last five seconds adds extra time.",
  startBid: 1200,
  reserve: 2000,
  seconds: 20,
  steps: [50, 100, 250],
  rivals: ["Aysel M.", "Rauf H.", "Leyla G.", "Orxan I.", "Nigar A.", "Tural K."],
};

export const studio = [
  {
    href: "/services",
    kicker: "Work with me",
    title: "Services",
    text: "Engineering, leadership and a trained ear.",
  },
  {
    href: "/journal",
    kicker: "Five essays",
    title: "Journal",
    text: "Notes from building products and listening to people.",
  },
  {
    href: "/ask",
    kicker: "Assistant",
    title: "Ask the Director",
    text: "Questions about my work, prices or availability.",
  },
  { href: "/library", kicker: "16 on the shelf", title: "Library", text: "The books I keep coming back to." },
  {
    href: "/lab",
    kicker: "6 working systems",
    title: "Lab",
    text: "A database, concurrency, traffic and caching, live in your browser.",
  },
  { href: "/credits", kicker: "Full CV", title: "Credits", text: "Everything behind the seven scenes." },
];

export const contactDoors = [
  { title: "Invest", text: "Talk about backing BidBary at an early stage.", subject: "Investing in BidBary" },
  {
    title: "Partner",
    text: "Bring your events, tickets, attendees, and check-in workflows to BidBary.",
    subject: "Partnering with BidBary",
  },
  {
    title: "Build",
    text: "Use the brief builder and get a written proposal within a few days.",
    href: "/start",
  },
  {
    title: "Speak",
    text: "Technology, psychology and leadership, for stages and podcasts.",
    subject: "Speaking invitation",
  },
];
