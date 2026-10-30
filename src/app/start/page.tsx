import type { Metadata } from "next";
import { StartPage } from "@/components/pages/StartPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Start a project",
  description: "Build a project brief with Senan Qulamov and get a clear starting estimate.",
  path: "/start",
});

export default async function Page() {
  const { t, lang } = await getT();
  return <StartPage t={t} lang={lang} />;
}
