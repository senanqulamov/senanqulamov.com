import type { Metadata } from "next";
import { AskPage } from "@/components/pages/AskPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Ask about Senan’s work",
  description: "Ask a guided assistant about Senan Qulamov’s work, services, and approach.",
  path: "/ask",
});

export default async function Page() {
  const { t } = await getT();
  return <AskPage t={t} />;
}
