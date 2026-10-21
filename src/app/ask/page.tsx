import type { Metadata } from "next";
import { AskPage } from "@/components/pages/AskPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Ask the Director",
  description: "An assistant that knows my work, services and prices.",
  alternates: { canonical: "/ask" },
};

export default async function Page() {
  const { t } = await getT();
  return <AskPage t={t} />;
}
