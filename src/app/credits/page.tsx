import type { Metadata } from "next";
import { CreditsPage } from "@/components/pages/CreditsPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Experience and background",
  description: "Senan Qulamov’s experience, ventures, education, and technical practice.",
  path: "/credits",
});

export default async function Page() {
  const { t, lang } = await getT();
  return <CreditsPage t={t} lang={lang} />;
}
