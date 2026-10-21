import type { Metadata } from "next";
import { JournalPage } from "@/components/pages/JournalPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Journal",
  description: "Essays from both sides of my work: building products and listening to people.",
  alternates: { canonical: "/journal" },
};

export default async function Page() {
  const { t, lang } = await getT();
  return <JournalPage t={t} lang={lang} />;
}
