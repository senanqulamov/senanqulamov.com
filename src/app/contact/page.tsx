import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Investors, partners, organizers and stages. Pick your door, or just write.",
  alternates: { canonical: "/contact" },
};

export default async function Page() {
  const { t } = await getT();
  return <ContactPage t={t} />;
}
