import type { Metadata } from "next";
import { CreditsPage } from "@/components/pages/CreditsPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Credits",
  description: "The full CV: ventures, experience, practice, education and skills.",
  alternates: { canonical: "/credits" },
};

export default async function Page() {
  const { t, lang } = await getT();
  return <CreditsPage t={t} lang={lang} />;
}
