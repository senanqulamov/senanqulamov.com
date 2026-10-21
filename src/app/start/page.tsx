import type { Metadata } from "next";
import { StartPage } from "@/components/pages/StartPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Build a brief and see an honest estimate as you go.",
  alternates: { canonical: "/start" },
};

export default async function Page() {
  const { t, lang } = await getT();
  return <StartPage t={t} lang={lang} />;
}
