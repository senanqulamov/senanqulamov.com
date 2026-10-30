import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Contact Senan Qulamov about projects, partnerships, speaking, or collaboration.",
  path: "/contact",
});

export default async function Page() {
  const { t } = await getT();
  return <ContactPage t={t} />;
}
