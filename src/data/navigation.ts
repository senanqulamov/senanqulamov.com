export type PageKey =
  | "home"
  | "work"
  | "journal"
  | "services"
  | "start"
  | "credits"
  | "ask"
  | "library"
  | "gallery"
  | "lab"
  | "press"
  | "contact";

export type NavPage = { key: PageKey; href: string; title: string; description: string };

/** Every page in the order it appears in the menu. */
export const pages: NavPage[] = [
  {
    key: "home",
    href: "/",
    title: "Home",
    description: "Who I am, in one scroll",
  },
  {
    key: "work",
    href: "/work",
    title: "Work",
    description: "22 products and platforms",
  },
  {
    key: "journal",
    href: "/journal",
    title: "Journal",
    description: "Essays from both sides of my work",
  },
  {
    key: "services",
    href: "/services",
    title: "Services",
    description: "How I can help, and how we'd work",
  },
  {
    key: "start",
    href: "/start",
    title: "Start a project",
    description: "Build a brief, see an honest estimate",
  },
  {
    key: "credits",
    href: "/credits",
    title: "Credits",
    description: "The full CV",
  },
  {
    key: "ask",
    href: "/ask",
    title: "Ask the Director",
    description: "An assistant that knows this site",
  },
  {
    key: "gallery",
    href: "/gallery",
    title: "Gallery",
    description: "Life, work, Baku and the rooms between",
  },
  {
    key: "library",
    href: "/library",
    title: "Library",
    description: "Books I keep coming back to",
  },
  {
    key: "lab",
    href: "/lab",
    title: "Lab",
    description: "Small experiments that run live",
  },
  {
    key: "press",
    href: "/press",
    title: "Press kit",
    description: "Bios, talks, photos and facts",
  },
  {
    key: "contact",
    href: "/contact",
    title: "Contact",
    description: "Pick your door, or just write",
  },
];

/** The short list shown in the header pill. */
export const headerLinks: PageKey[] = ["work", "journal", "gallery", "services", "credits"];
