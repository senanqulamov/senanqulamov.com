import type { Metadata } from "next";
import { PressPage } from "@/components/pages/PressPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Press kit",
  description: "Bios, speaking topics, photos, and facts about Senan Qulamov for organizers and journalists.",
  path: "/press",
});

export default async function Page() {
  const { t } = await getT();
  return <PressPage t={t} />;
}
