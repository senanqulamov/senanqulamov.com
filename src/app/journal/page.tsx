import type { Metadata } from "next";
import { JournalPage } from "@/components/pages/JournalPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Journal",
  description: "Essays by Senan Qulamov on product building, engineering, and listening to people.",
  path: "/journal",
});

export default async function Page() {
  const { t, lang } = await getT();
  return <JournalPage t={t} lang={lang} />;
}
