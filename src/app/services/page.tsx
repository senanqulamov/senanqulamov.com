import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/ServicesPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description: "How Senan Qulamov helps teams build products, platforms, and technical systems.",
  path: "/services",
});

export default async function Page() {
  const { t } = await getT();
  return <ServicesPage t={t} />;
}
