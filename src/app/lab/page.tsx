import type { Metadata } from "next";
import { LabPage } from "@/components/pages/LabPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Lab",
  description: "Working systems you can poke: a database, concurrency, traffic, hashing and caching.",
  alternates: { canonical: "/lab" },
};

export default async function Page() {
  const { t } = await getT();
  return <LabPage t={t} />;
}
