import { absoluteUrl, siteUrl } from "@/lib/site";

export const profile = {
  name: "Senan Qulamov",
  alsoWritten: "Sanan Gulamov",
  site: siteUrl,
  email: "qulamovsenan@gmail.com",
  phone: "+994 51 583 80 95",
  phoneHref: "tel:+994515838095",
  linkedin: "https://www.linkedin.com/in/senanqulamov",
  github: "https://github.com/senanqulamov",
  githubUser: "senanqulamov",
  bidbary: "https://bidbary.me",
  city: "Baku, Azerbaijan",
  coordinates: "40.41° N, 49.87° E",
  timezone: "Asia/Baku",
  availability: "Available",
  portrait: "/images/portrait.webp",
  portraitUrl: absoluteUrl("/images/portrait.webp"),
  portraitAlt: "Senan Qulamov leaning against a wooden wall at night in Baku",
  roles: [
    { title: "Founder & CEO", place: "BidBary" },
    { title: "Tech Lead", place: "PMIS" },
    { title: "Shipping code", place: "since 2016" },
  ],
};

/** The "Now" block shown in the menu and the footer. */
export const now: [label: string, value: string][] = [
  ["Building", "BidBary, the next release"],
  ["Leading", "Engineering at PMIS"],
  ["Open to", "New projects"],
  ["Based in", "Baku, GMT+4"],
];
