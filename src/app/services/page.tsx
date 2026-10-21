import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/ServicesPage";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Services",
  description: "How I can help, and how we would work together.",
  alternates: { canonical: "/services" },
};

export default async function Page() {
  const { t } = await getT();
  return <ServicesPage t={t} />;
}
