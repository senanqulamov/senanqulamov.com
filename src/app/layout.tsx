import type { Metadata, Viewport } from "next";
import { Geist, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/data/profile";
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
  "Senan Qulamov is an engineer from Baku: Tech Lead at PMIS (BP), founder of BidBary, and for seven years a therapist.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: { default: "Senan Qulamov · Engineer, founder, listener", template: "%s · Senan Qulamov" },
  description,
  openGraph: { type: "website", siteName: profile.name, title: profile.name, description, url: "/" },
  twitter: { card: "summary_large_image", title: profile.name, description },
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

// Applies the saved theme before the first paint so the page never flashes.
const themeScript = `try{var t=localStorage.getItem("sq-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}catch(e){document.documentElement.dataset.theme="dark"}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getT();
  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
      </body>
    </html>
  );
}
