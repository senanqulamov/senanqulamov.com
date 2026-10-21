import type { Metadata } from "next";
import { LibraryPage } from "@/components/pages/LibraryPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Library",
  description: "The books I keep coming back to.",
  alternates: { canonical: "/library" },
};

export default async function Page() {
  const { t } = await getT();
  return <LibraryPage t={t} />;
}
