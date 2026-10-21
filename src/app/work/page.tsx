import type { Metadata } from "next";
import { WorkPage } from "@/components/work/WorkPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Work",
  description: "Products I founded, platforms I led and systems I shipped for clients since 2021.",
  alternates: { canonical: "/work" },
};

export default async function Page() {
  const { t } = await getT();
  return <WorkPage t={t} />;
}
