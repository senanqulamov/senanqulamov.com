import type { Metadata } from "next";
import { PressPage } from "@/components/pages/PressPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Press kit",
  description: "Bios, talk topics, photos and facts for organizers and journalists.",
  alternates: { canonical: "/press" },
};

export default async function Page() {
  const { t } = await getT();
  return <PressPage t={t} />;
}
