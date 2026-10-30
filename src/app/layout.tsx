import type { Metadata, Viewport } from "next";
import { Geist, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { profile } from "@/data/profile";
import { absoluteUrl, jsonLd, siteUrl } from "@/lib/site";
import { LangProvider } from "@/i18n/LangProvider";
import { getT } from "@/i18n/server";
import { Experience } from "@/components/shell/Experience";
import { Header } from "@/components/shell/Header";
import { Menu } from "@/components/shell/Menu";
import {
  CursorLayer,
  Director,
  Hud,
  Lightbox,
  Loader,
  Palette,
  ProjectOpening,
  SketchStage,
  TransitionLabel,
} from "@/components/shell/Overlays";
import "@/styles/index.css";

const display = Unbounded({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});
const text = Geist({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-text", display: "swap" });
const useAnalytics = process.env.NODE_ENV === "production" && process.env.VERCEL === "1";
const description =
  "Senan Qulamov is a Baku-based engineer, Tech Lead at PMIS (BP), BidBary founder, and former therapist. Explore his work, writing, and ways to collaborate.";
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: profile.name,
  alternateName: "Sanan Gulamov",
  url: siteUrl,
  image: profile.portraitUrl,
  sameAs: [profile.linkedin, profile.github],
  jobTitle: "Tech Lead",
  worksFor: { "@type": "Organization", name: "PMIS (BP)" },
  homeLocation: { "@type": "Place", name: profile.city },
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: profile.name,
  description,
  publisher: { "@id": `${siteUrl}/#person` },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Senan Qulamov | Engineer, founder, listener", template: "%s | Senan Qulamov" },
  description,
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: "Senan Qulamov | Engineer, founder, listener",
    description,
    url: siteUrl,
    images: [
      { url: absoluteUrl("/opengraph-image"), alt: "Senan Qulamov — engineer, founder, and listener" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senan Qulamov | Engineer, founder, listener",
    description,
    images: [absoluteUrl("/opengraph-image")],
  },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080D" },
    { media: "(prefers-color-scheme: light)", color: "#EEEDF2" },
  ],
};
const themeScript = `try{var t=localStorage.getItem("sq-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}catch(e){document.documentElement.dataset.theme="dark"}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getT();
  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }} />
      </head>
      <body className="loading" suppressHydrationWarning>
        <LangProvider lang={lang}>
          <a className="skip" href="#view">
            {t("Skip to content")}
          </a>
          <div id="announce" className="sr" aria-live="polite" aria-atomic="true" />
          <canvas id="gl" aria-hidden="true" />
          <CursorLayer />
          <Loader t={t} />
          <Header t={t} lang={lang} />
          <Menu t={t} lang={lang} />
          <Palette t={t} />
          <SketchStage t={t} />
          <main id="view">{children}</main>
          <Director t={t} />
          <Lightbox t={t} />
          <Hud />
          <ProjectOpening t={t} />
          <TransitionLabel />
          <div id="toast" role="status" aria-live="polite" />
          <Experience lang={lang} />
        </LangProvider>
        {useAnalytics && <Analytics />}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
